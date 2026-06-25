package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.LessonDTO;
import com.example.backend.Text.to.Learn.repositories.LessonRepository;
import com.example.backend.Text.to.Learn.services.LessonService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Concrete implementation of {@link LessonService} providing CRUD operations
 * for {@code Lesson} resources.
 *
 * <p>Most write operations (save, update, delete) are currently stubbed out
 * (returning {@code null} or doing nothing) as lessons are typically managed
 * indirectly through course/module creation. These stubs can be implemented
 * when standalone lesson management endpoints are needed.
 */
@Service
@AllArgsConstructor
public class LessonServiceImpl implements LessonService {

    /** SLF4J logger for service-level diagnostics and tracing. */
    private static final Logger log = LoggerFactory.getLogger(LessonServiceImpl.class);

    /** Repository for all lesson database operations. */
    private final LessonRepository lessonRepository;

    /** ModelMapper instance used to convert between entity and DTO types. */
    private final ModelMapper modelMapper;

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently not implemented and returns {@code null}.
     * Lessons are normally created as part of a course/module via
     * {@link com.example.backend.Text.to.Learn.services.CourseService#saveCourse}.
     */
    @Override
    public LessonDTO saveLesson(AddLessonRequestDTO addLessonRequestDTO) {
        // TODO: Implement standalone lesson creation if needed
        log.warn("saveLesson() called but is not yet implemented. Returning null.");
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<LessonDTO> getAllLessons() {
        log.info("Fetching all lessons from the database");
        List<LessonDTO> lessons = lessonRepository.findAll().stream()
                .map(lessonEntity -> modelMapper.map(lessonEntity, LessonDTO.class))
                .toList();
        log.info("Retrieved {} lesson(s)", lessons.size());
        return lessons;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently not implemented and returns {@code null}.
     */
    @Override
    public LessonDTO getLessonById(Long id) {
        // TODO: Implement lesson lookup by ID with proper 404 handling
        log.warn("getLessonById({}) called but is not yet implemented. Returning null.", id);
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently not implemented and returns {@code null}.
     */
    @Override
    public LessonDTO updateLesson(Long id, AddLessonRequestDTO addLessonRequestDTO) {
        // TODO: Implement lesson update by ID
        log.warn("updateLesson({}) called but is not yet implemented. Returning null.", id);
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently a no-op (does nothing).
     */
    @Override
    public void deleteLessonById(Long id) {
        // TODO: Implement lesson deletion by ID with existence check
        log.warn("deleteLessonById({}) called but is not yet implemented. No action taken.", id);
    }
}
