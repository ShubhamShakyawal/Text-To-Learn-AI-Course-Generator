package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.LessonDTO;

import java.util.List;

/**
 * Service interface defining the business-logic contract for {@code Lesson} operations.
 *
 * <p>This interface is implemented by
 * {@link com.example.backend.Text.to.Learn.services.impl.LessonServiceImpl}.
 * Controllers depend on this interface (not the implementation) to keep
 * the architecture loosely coupled and easily testable.
 *
 * <p>Operations:
 * <ul>
 *   <li>Create/persist a new lesson from a DTO</li>
 *   <li>Retrieve all lessons or a specific lesson by ID</li>
 *   <li>Update an existing lesson</li>
 *   <li>Delete a lesson by ID</li>
 * </ul>
 */
public interface LessonService {

    /**
     * Persists a new lesson in the database.
     *
     * @param addLessonRequestDTO the lesson data to save
     * @return the saved lesson as a {@link LessonDTO} (including the generated {@code id})
     */
    LessonDTO saveLesson(AddLessonRequestDTO addLessonRequestDTO);

    /**
     * Retrieves all lessons stored in the database.
     *
     * @return a list of {@link LessonDTO} objects; empty list if no lessons exist
     */
    List<LessonDTO> getAllLessons();

    /**
     * Retrieves a single lesson by its unique identifier.
     *
     * @param id the primary key of the lesson to retrieve
     * @return the matching {@link LessonDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    LessonDTO getLessonById(Long id);

    /**
     * Updates the content of an existing lesson.
     *
     * @param id                  the primary key of the lesson to update
     * @param addLessonRequestDTO the new lesson data to apply
     * @return the updated lesson as a {@link LessonDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    LessonDTO updateLesson(Long id, AddLessonRequestDTO addLessonRequestDTO);

    /**
     * Deletes a lesson by its unique identifier.
     *
     * @param id the primary key of the lesson to delete
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    void deleteLessonById(Long id);
}
