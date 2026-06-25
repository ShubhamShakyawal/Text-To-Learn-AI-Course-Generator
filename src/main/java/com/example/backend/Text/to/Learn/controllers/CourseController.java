package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.services.CourseService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller that exposes CRUD and AI-generation endpoints for {@code Course} resources.
 *
 * <p>Base URL: {@code /api/courses}
 *
 * <p>All request/response bodies use {@link CourseDTO} as the external representation.
 * Input for creation/updates is accepted as {@link AddCourseRequestDTO}.
 * Business logic is delegated entirely to {@link CourseService}.
 */
@RestController
@RequestMapping("/api/courses") // base URL for all course-related endpoints
@AllArgsConstructor
public class CourseController {

    /** SLF4J logger for request tracing and error diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(CourseController.class);

    /** Service layer handling all course business logic. */
    private final CourseService courseService;

    /**
     * Creates a new course from the provided request body.
     *
     * <p>HTTP: {@code POST /api/courses}
     *
     * @param addCourseRequestDTO the course data (title, description, modules) to persist
     * @return {@code 200 OK} with the saved {@link CourseDTO}
     */
    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody AddCourseRequestDTO addCourseRequestDTO) {
        log.info("POST /api/courses - Creating course with title: '{}'", addCourseRequestDTO.getTitle());
        CourseDTO savedCourse = courseService.saveCourse(addCourseRequestDTO);
        log.info("Course created successfully with id: {}", savedCourse.getId());
        return ResponseEntity.ok(savedCourse);
    }

    /**
     * Generates a full AI-powered course from a topic string and persists it.
     *
     * <p>HTTP: {@code POST /api/courses/generate?topic={topic}}
     *
     * @param topic the subject or keyword the AI uses to build the course
     * @return {@code 200 OK} with the generated and saved {@link CourseDTO}
     */
    @PostMapping("/generate")
    public ResponseEntity<CourseDTO> generateCourse(@RequestParam String topic) {
        log.info("POST /api/courses/generate - Generating AI course for topic: '{}'", topic);
        CourseDTO generatedCourse = courseService.generateCourseFromAI(topic);
        log.info("AI course generated and saved with id: {}", generatedCourse.getId());
        return ResponseEntity.ok(generatedCourse);
    }

    /**
     * Retrieves all courses stored in the database.
     *
     * <p>HTTP: {@code GET /api/courses}
     *
     * @return {@code 200 OK} with a list of all {@link CourseDTO} objects
     */
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getCourses() {
        log.info("GET /api/courses - Fetching all courses");
        List<CourseDTO> courses = courseService.getAllCourses();
        log.info("Returning {} course(s)", courses.size());
        return ResponseEntity.ok(courses);
    }

    /**
     * Retrieves a single course by its unique identifier.
     *
     * <p>HTTP: {@code GET /api/courses/{id}}
     *
     * @param id the database ID of the course to retrieve
     * @return {@code 200 OK} with the matching {@link CourseDTO},
     *         or {@code 404 Not Found} if no course exists with the given id
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id) {
        log.info("GET /api/courses/{} - Fetching course by id", id);
        CourseDTO course = courseService.getCourseById(id);
        log.info("Course found: '{}'", course.getTitle());
        return ResponseEntity.ok(course);
    }

    /**
     * Deletes a course by its unique identifier.
     *
     * <p>HTTP: {@code DELETE /api/courses/{id}}
     *
     * @param id the database ID of the course to delete
     * @return {@code 204 No Content} on successful deletion,
     *         or {@code 404 Not Found} if no course exists with the given id
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        log.info("DELETE /api/courses/{} - Deleting course", id);
        courseService.deleteCourseById(id);
        log.info("Course with id: {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Updates an existing course's title and description.
     *
     * <p>HTTP: {@code PUT /api/courses/{id}}
     *
     * @param id                  the database ID of the course to update
     * @param addCourseRequestDTO the new course data to apply
     * @return {@code 200 OK} with the updated {@link CourseDTO},
     *         or {@code 404 Not Found} if no course exists with the given id
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @RequestBody AddCourseRequestDTO addCourseRequestDTO) {
        log.info("PUT /api/courses/{} - Updating course with new title: '{}'", id, addCourseRequestDTO.getTitle());
        CourseDTO updatedCourse = courseService.updateCourse(id, addCourseRequestDTO);
        log.info("Course with id: {} updated successfully", id);
        return ResponseEntity.ok(updatedCourse);
    }
}