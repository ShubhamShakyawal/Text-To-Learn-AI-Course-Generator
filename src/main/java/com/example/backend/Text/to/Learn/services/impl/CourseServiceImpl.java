package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.entities.CourseEntity;
import com.example.backend.Text.to.Learn.entities.LessonEntity;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.entities.UserEntity;
import com.example.backend.Text.to.Learn.repositories.CourseRepository;
import com.example.backend.Text.to.Learn.repositories.LessonRepository;
import com.example.backend.Text.to.Learn.repositories.UserRepository;
import com.example.backend.Text.to.Learn.services.AiService;
import com.example.backend.Text.to.Learn.services.CourseService;
import com.example.backend.Text.to.Learn.services.YoutubeService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private static final Logger log = LoggerFactory.getLogger(CourseServiceImpl.class);

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final AiService aiService;
    private final YoutubeService youtubeService;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    // ── Authenticated user operations ─────────────────────────────────────

    @Override @Transactional
    public CourseDTO saveCourse(AddCourseRequestDTO dto, Long userId) {
        UserEntity user = loadUser(userId);
        CourseEntity course = buildCourse(dto);
        course.setUser(user);
        CourseEntity saved = courseRepository.save(course);
        log.info("Course '{}' saved for user id: {}", saved.getTitle(), userId);
        return toCourseDTO(saved);
    }

    @Override
    public List<CourseDTO> getAllCoursesByUser(Long userId) {
        return courseRepository.findByUserId(userId).stream()
                .map(this::toCourseDTO).toList();
    }

    @Override
    public CourseDTO getCourseById(Long id, Long userId) {
        return toCourseDTO(loadAndVerifyUser(id, userId));
    }

    @Override
    public CourseDTO updateCourse(Long id, AddCourseRequestDTO dto, Long userId) {
        CourseEntity course = loadAndVerifyUser(id, userId);
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        return toCourseDTO(courseRepository.save(course));
    }

    @Override
    public void deleteCourseById(Long id, Long userId) {
        loadAndVerifyUser(id, userId);
        courseRepository.deleteById(id);
        log.info("Course id: {} deleted by user id: {}", id, userId);
    }

    @Override
    public CourseDTO generateCourseFromAI(String topic, Long userId) {
        log.info("AI generation for topic='{}', user id={}", topic, userId);
        AddCourseRequestDTO dto = runAIPipeline(topic);
        return saveCourse(dto, userId);
    }

    // ── Guest session operations ───────────────────────────────────────────

    @Override @Transactional
    public CourseDTO saveCourseForGuest(AddCourseRequestDTO dto, String guestId) {
        CourseEntity course = buildCourse(dto);
        course.setGuestId(guestId);
        CourseEntity saved = courseRepository.save(course);
        log.info("Course '{}' saved for guest id: {}", saved.getTitle(), guestId);
        return toCourseDTO(saved);
    }

    @Override
    public List<CourseDTO> getAllCoursesByGuest(String guestId) {
        return courseRepository.findByGuestIdAndUserIsNull(guestId).stream()
                .map(this::toCourseDTO).toList();
    }

    @Override
    public CourseDTO getCourseByIdForGuest(Long id, String guestId) {
        return toCourseDTO(loadAndVerifyGuest(id, guestId));
    }

    @Override
    public CourseDTO updateCourseForGuest(Long id, AddCourseRequestDTO dto, String guestId) {
        CourseEntity course = loadAndVerifyGuest(id, guestId);
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        return toCourseDTO(courseRepository.save(course));
    }

    @Override
    public void deleteCourseByIdForGuest(Long id, String guestId) {
        loadAndVerifyGuest(id, guestId);
        courseRepository.deleteById(id);
        log.info("Course id: {} deleted by guest id: {}", id, guestId);
    }

    @Override
    public CourseDTO generateCourseFromAIForGuest(String topic, String guestId) {
        log.info("AI generation for topic='{}', guest id={}", topic, guestId);
        AddCourseRequestDTO dto = runAIPipeline(topic);
        return saveCourseForGuest(dto, guestId);
    }

    // ── Transfer ownership ─────────────────────────────────────────────────

    @Override @Transactional
    public int transferGuestCourses(String guestId, Long userId) {
        List<CourseEntity> guestCourses = courseRepository.findByGuestIdAndUserIsNull(guestId);
        if (guestCourses.isEmpty()) return 0;

        UserEntity user = loadUser(userId);
        for (CourseEntity c : guestCourses) {
            c.setUser(user);
            c.setGuestId(null); // clear guest ownership
        }
        courseRepository.saveAll(guestCourses);
        log.info("Transferred {} course(s) from guest {} to user {}", guestCourses.size(), guestId, userId);
        return guestCourses.size();
    }

    // ── Lesson progress ────────────────────────────────────────────────────

    @Override @Transactional
    public CourseDTO updateLessonProgress(Long courseId, Long lessonId, boolean completed, Long userId) {
        CourseEntity course = loadAndVerifyUser(courseId, userId);
        return applyProgress(course, lessonId, completed);
    }

    @Override @Transactional
    public CourseDTO updateLessonProgress(Long courseId, Long lessonId, boolean completed, String guestId) {
        CourseEntity course = loadAndVerifyGuest(courseId, guestId);
        return applyProgress(course, lessonId, completed);
    }

    /**
     * Finds the lesson within the course, flips its {@code completed} flag,
     * saves it, and returns the updated {@link CourseDTO}.
     */
    private CourseDTO applyProgress(CourseEntity course, Long lessonId, boolean completed) {
        LessonEntity lesson = course.getModules().stream()
                .flatMap(m -> m.getLessons().stream())
                .filter(l -> l.getId().equals(lessonId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Lesson not found in course: " + lessonId));
        lesson.setCompleted(completed);
        lessonRepository.save(lesson);
        log.info("Lesson {} marked completed={} in course {}", lessonId, completed, course.getId());
        // Reload to reflect the saved state before computing percentage
        CourseEntity refreshed = courseRepository.findById(course.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        return toCourseDTO(refreshed);
    }

    // ── Shared helpers ─────────────────────────────────────────────────────

    /** Runs the AI + YouTube enrichment pipeline and returns a DTO (not yet saved). */
    private AddCourseRequestDTO runAIPipeline(String topic) {
        try {
            String json = aiService.generateCourse(topic);
            AddCourseRequestDTO dto = objectMapper.readValue(json, AddCourseRequestDTO.class);
            dto.getModules().forEach(module -> {
                if (module.getLessons() == null) return;
                module.getLessons().forEach(lesson -> {
                    String query = lesson.getYoutubeQuery(module.getTitle(), dto.getTitle());
                    lesson.setYoutubeUrl(youtubeService.getVideoLink(query));
                });
            });
            return dto;
        } catch (Exception e) {
            throw new RuntimeException("Course generation failed for topic: " + topic, e);
        }
    }

    /** Maps a DTO to a CourseEntity, wiring bidirectional parent references. */
    private CourseEntity buildCourse(AddCourseRequestDTO dto) {
        CourseEntity course = modelMapper.map(dto, CourseEntity.class);
        if (course.getModules() != null) {
            for (ModuleEntity module : course.getModules()) {
                module.setCourseEntity(course);
                if (module.getLessons() != null) {
                    for (LessonEntity lesson : module.getLessons()) {
                        lesson.setModuleEntity(module);
                    }
                }
            }
        }
        return course;
    }

    /**
     * Maps a {@link CourseEntity} to {@link CourseDTO} and computes the
     * {@code completionPercentage} from the {@code lesson.completed} flags.
     */
    private CourseDTO toCourseDTO(CourseEntity entity) {
        CourseDTO dto = modelMapper.map(entity, CourseDTO.class);
        if (entity.getModules() != null) {
            long total = entity.getModules().stream()
                    .flatMap(m -> m.getLessons().stream()).count();
            long done  = entity.getModules().stream()
                    .flatMap(m -> m.getLessons().stream())
                    .filter(LessonEntity::isCompleted).count();
            dto.setCompletionPercentage(total == 0 ? 0 : (int) Math.round(done * 100.0 / total));
        }
        return dto;
    }

    private UserEntity loadUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found: " + userId));
    }

    private CourseEntity loadAndVerifyUser(Long courseId, Long userId) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Course not found: " + courseId));
        if (course.getUser() == null || !course.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not have access to this course");
        }
        return course;
    }

    private CourseEntity loadAndVerifyGuest(Long courseId, String guestId) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Course not found: " + courseId));
        if (!guestId.equals(course.getGuestId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not have access to this course");
        }
        return course;
    }
}