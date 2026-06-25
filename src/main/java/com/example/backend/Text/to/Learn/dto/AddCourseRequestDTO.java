package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object (DTO) used as the request body when creating a new {@code Course}.
 *
 * <p>This DTO carries the incoming JSON payload from the client (or from the AI service)
 * to the service layer, where it is mapped to a {@code CourseEntity} for persistence.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code title}       — the display name of the course</li>
 *   <li>{@code description} — a short summary describing the course contents</li>
 *   <li>{@code modules}     — ordered list of modules that belong to this course,
 *                             each carrying its own lessons</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@AllArgsConstructor
@NoArgsConstructor
public class AddCourseRequestDTO {

    /** Display name of the course (e.g., "Introduction to Java"). */
    private String title;

    /** Short summary describing what the course covers. */
    private String description;

    /**
     * Ordered list of modules that make up this course.
     * Each module may contain multiple lessons.
     */
    private List<AddModuleRequestDTO> modules;
}
