package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.LessonDTO;
import com.example.backend.Text.to.Learn.services.LessonService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller that exposes endpoints for {@code Lesson} resources.
 *
 * <p>Base URL: {@code /api/lessons}
 *
 * <p>Lessons are the leaf-level content nodes within the course hierarchy
 * (Course → Module → Lesson). Business logic is delegated to {@link LessonService}.
 */
@RestController
@RequestMapping("/api/lessons")
@AllArgsConstructor
public class LessonController {

    /** SLF4J logger for request tracing and diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(LessonController.class);

    /** Service layer handling all lesson business logic. */
    private final LessonService lessonService;

    /**
     * Retrieves all lessons stored in the database.
     *
     * <p>HTTP: {@code GET /api/lessons}
     *
     * @return {@code 200 OK} with a list of all {@link LessonDTO} objects
     */
    @GetMapping
    public ResponseEntity<List<LessonDTO>> getLessons() {
        log.info("GET /api/lessons - Fetching all lessons");
        List<LessonDTO> lessons = lessonService.getAllLessons();
        log.info("Returning {} lesson(s)", lessons.size());
        return ResponseEntity.ok(lessons);
    }

    /**
     * Retrieves a single lesson by its unique identifier.
     *
     * <p>HTTP: {@code GET /api/lessons/{id}}
     *
     * @param id the database ID of the lesson to retrieve
     * @return {@code 200 OK} with the matching {@link LessonDTO},
     *         or {@code 404 Not Found} if no lesson exists with the given id
     */
    @GetMapping("/{id}")
    public ResponseEntity<LessonDTO> getLessonById(@PathVariable Long id) {
        log.info("GET /api/lessons/{} - Fetching lesson by id", id);
        LessonDTO lesson = lessonService.getLessonById(id);
        log.info("Lesson found: '{}'", lesson.getTitle());
        return ResponseEntity.ok(lesson);
    }

    /**
     * Creates a new lesson from the provided request body.
     *
     * <p>HTTP: {@code POST /api/lessons}
     *
     * @param addLessonRequestDTO the lesson data (title, content, youtubeUrl, etc.) to persist
     * @return {@code 200 OK} with the saved {@link LessonDTO}
     */
    @PostMapping
    public ResponseEntity<LessonDTO> createLesson(@RequestBody AddLessonRequestDTO addLessonRequestDTO) {
        log.info("POST /api/lessons - Creating lesson with title: '{}'", addLessonRequestDTO.getTitle());
        LessonDTO savedLesson = lessonService.saveLesson(addLessonRequestDTO);
        log.info("Lesson created successfully with id: {}", savedLesson.getId());
        return ResponseEntity.ok(savedLesson);
    }
}
