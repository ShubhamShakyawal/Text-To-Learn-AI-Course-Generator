package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;

import java.util.List;

/**
 * Service interface defining the business-logic contract for {@code Course} operations.
 *
 * <p>This interface is implemented by
 * {@link com.example.backend.Text.to.Learn.services.impl.CourseServiceImpl}.
 * Controllers depend on this interface (not the implementation) to keep
 * the architecture loosely coupled and easily testable.
 *
 * <p>Operations:
 * <ul>
 *   <li>Create/persist a new course from a DTO</li>
 *   <li>Retrieve all courses or a specific course by ID</li>
 *   <li>Update an existing course</li>
 *   <li>Delete a course by ID</li>
 *   <li>Generate a full course (with modules and lessons) from an AI prompt</li>
 * </ul>
 */
public interface CourseService {

    /**
     * Persists a new course (with its nested modules and lessons) in the database.
     *
     * @param addCourseRequestDTO the course data to save
     * @return the saved course as a {@link CourseDTO} (including the generated {@code id})
     */
    CourseDTO saveCourse(AddCourseRequestDTO addCourseRequestDTO);

    /**
     * Retrieves all courses stored in the database.
     *
     * @return a list of {@link CourseDTO} objects; empty list if no courses exist
     */
    List<CourseDTO> getAllCourses();

    /**
     * Retrieves a single course by its unique identifier.
     *
     * @param id the primary key of the course to retrieve
     * @return the matching {@link CourseDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    CourseDTO getCourseById(Long id);

    /**
     * Updates the title and description of an existing course.
     *
     * @param id           the primary key of the course to update
     * @param addCourseDTO the new course data to apply
     * @return the updated course as a {@link CourseDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    CourseDTO updateCourse(Long id, AddCourseRequestDTO addCourseDTO);

    /**
     * Deletes a course (and its child modules/lessons via cascade) by its unique identifier.
     *
     * @param id the primary key of the course to delete
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    void deleteCourseById(Long id);

    /**
     * Generates a structured course from an AI model based on the given topic,
     * enriches each lesson with a YouTube video URL, and persists the result.
     *
     * @param topic the subject or keyword to generate a course for
     * @return the generated and saved course as a {@link CourseDTO}
     * @throws RuntimeException if the AI response cannot be parsed or saved
     */
    CourseDTO generateCourseFromAI(String topic);
}
