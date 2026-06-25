package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.entities.CourseEntity;
import com.example.backend.Text.to.Learn.entities.LessonEntity;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.repositories.CourseRepository;
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

/**
 * Concrete implementation of {@link CourseService} providing CRUD operations
 * and AI-powered course generation for the Text-to-Learn application.
 *
 * <p>Responsibilities:
 * <ul>
 *   <li>Map DTOs ↔ entities using {@link ModelMapper}</li>
 *   <li>Persist and retrieve {@link CourseEntity} objects via {@link CourseRepository}</li>
 *   <li>Orchestrate the AI course generation pipeline:
 *       AI prompt → JSON → DTO → YouTube enrichment → persist</li>
 * </ul>
 *
 * <p>All database-mutating operations that span multiple steps are annotated
 * with {@code @Transactional} to ensure atomicity.
 */
@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    /** SLF4J logger for service-level diagnostics and tracing. */
    private static final Logger log = LoggerFactory.getLogger(CourseServiceImpl.class);

    /** Repository for all course database operations. */
    private final CourseRepository courseRepository;

    /** Service for generating course content via the OpenRouter AI API. */
    private final AiService aiService;

    /** Service for fetching YouTube video links for individual lessons. */
    private final YoutubeService youtubeService;

    /** Jackson ObjectMapper used to deserialize the AI-generated JSON into a DTO. */
    private final ObjectMapper objectMapper;

    /** ModelMapper instance used to convert between entity and DTO types. */
    private final ModelMapper modelMapper;

    /**
     * {@inheritDoc}
     *
     * <p>Implementation details:
     * <ol>
     *   <li>Maps the incoming DTO to a {@link CourseEntity} graph</li>
     *   <li>Fixes bidirectional parent references (module → course, lesson → module)
     *       so JPA cascades correctly</li>
     *   <li>Saves the full entity graph in a single {@code courseRepository.save()} call</li>
     *   <li>Returns the saved entity mapped back to a {@link CourseDTO}</li>
     * </ol>
     */
    @Override
    @Transactional
    public CourseDTO saveCourse(AddCourseRequestDTO dto) {
        log.info("Saving course with title: '{}'", dto.getTitle());

        // Map the incoming DTO to a JPA entity graph
        CourseEntity course = modelMapper.map(dto, CourseEntity.class);

        // Step 1: Fix bidirectional relationships before saving
        // JPA requires the "owning" side of each relationship to hold the FK reference.
        // ModelMapper does not set these back-references automatically.
        if (course.getModules() != null) {
            for (ModuleEntity module : course.getModules()) {

                module.setCourseEntity(course); // set module → course (FK: module.course_id)

                if (module.getLessons() != null) {
                    for (LessonEntity lesson : module.getLessons()) {
                        lesson.setModuleEntity(module); // set lesson → module (FK: lesson.module_id)
                    }
                }
            }
        }

        // Step 2: Persist the course and its entire entity graph via cascade
        CourseEntity savedCourse = courseRepository.save(course);
        log.info("Course '{}' saved successfully with id: {}", savedCourse.getTitle(), savedCourse.getId());

        // Map the persisted entity back to a DTO and return it to the caller
        return modelMapper.map(savedCourse, CourseDTO.class);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<CourseDTO> getAllCourses() {
        List<CourseEntity> courseEntities = courseRepository.findAll();
        log.info("Retrieved {} course(s) from the database", courseEntities.size());

        // Stream over entities, map each to a DTO, and collect into a list
        return courseEntities.stream()
                .map(courseEntity -> modelMapper.map(courseEntity, CourseDTO.class))
                .toList();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public CourseDTO getCourseById(Long id) {
        log.info("Fetching course with id: {}", id);

        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Course not found with id: {}", id);
                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Course not found with id: " + id
                    );
                });

        log.info("Course '{}' found for id: {}", courseEntity.getTitle(), id);
        return modelMapper.map(courseEntity, CourseDTO.class);
    }

    /**
     * {@inheritDoc}
     *
     * <p>Only the {@code title} and {@code description} fields are updated.
     * Nested modules and lessons are not modified by this operation.
     */
    @Override
    public CourseDTO updateCourse(Long id, AddCourseRequestDTO addCourseRequestDTO) {
        log.info("Updating course with id: {}", id);

        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Course not found with id: {} during update", id);
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id);
                });

        // Apply the field updates (modules are left unchanged in this operation)
        courseEntity.setTitle(addCourseRequestDTO.getTitle());
        courseEntity.setDescription(addCourseRequestDTO.getDescription());

        CourseEntity updatedCourse = courseRepository.save(courseEntity);
        log.info("Course id: {} updated successfully. New title: '{}'", id, updatedCourse.getTitle());

        return modelMapper.map(updatedCourse, CourseDTO.class);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void deleteCourseById(Long id) {
        log.info("Attempting to delete course with id: {}", id);

        // Verify the course exists before attempting deletion
        if (!courseRepository.existsById(id)) {
            log.warn("Cannot delete — course not found with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id);
        }

        courseRepository.deleteById(id);
        log.info("Course with id: {} deleted successfully", id);
    }

    /**
     * {@inheritDoc}
     *
     * <p>Pipeline:
     * <ol>
     *   <li>Send topic to {@link AiService} — receive raw JSON string</li>
     *   <li>Deserialize JSON → {@link AddCourseRequestDTO} using Jackson {@link ObjectMapper}</li>
     *   <li>For each lesson, resolve a YouTube video URL via {@link YoutubeService}</li>
     *   <li>Delegate to {@link #saveCourse(AddCourseRequestDTO)} to persist the enriched course</li>
     * </ol>
     *
     * @throws RuntimeException wrapping any parsing or persistence errors
     */
    @Override
    public CourseDTO generateCourseFromAI(String topic) {
        log.info("Starting AI course generation pipeline for topic: '{}'", topic);
        try {
            // Step 1: Call AI service to get raw JSON course content
            String json = aiService.generateCourse(topic);
            log.info("AI service returned JSON response for topic: '{}'. Length: {} chars",
                    topic, json != null ? json.length() : 0);

            // Step 2: Deserialize the raw JSON string → AddCourseRequestDTO
            AddCourseRequestDTO dto = objectMapper.readValue(json, AddCourseRequestDTO.class);
            log.info("Deserialized AI response into DTO: title='{}', modules={}",
                    dto.getTitle(), dto.getModules() != null ? dto.getModules().size() : 0);

            // Step 3: Enrich each lesson with a YouTube video URL
            dto.getModules().forEach(module -> {
                if (module.getLessons() == null) return; // skip modules with no lessons

                module.getLessons().forEach(lesson -> {
                    // Build or use existing YouTube search query for this lesson
                    String query = lesson.getYoutubeQuery(
                            module.getTitle(),
                            dto.getTitle()
                    );
                    log.debug("Fetching YouTube link for lesson '{}' using query: '{}'",
                            lesson.getTitle(), query);

                    // Fetch the top YouTube video URL for the query
                    String link = youtubeService.getVideoLink(query);
                    lesson.setYoutubeUrl(link); // attach the resolved URL to the lesson
                    log.debug("YouTube URL for lesson '{}': {}", lesson.getTitle(), link);
                });
            });

            log.info("YouTube enrichment complete. Persisting generated course...");

            // Step 4: Save the fully enriched course to the database
            return saveCourse(dto);

        } catch (Exception e) {
            log.error("Failed to generate course from AI for topic: '{}'. Error: {}", topic, e.getMessage(), e);
            throw new RuntimeException("Course generation failed for topic: " + topic, e);
        }
    }
}