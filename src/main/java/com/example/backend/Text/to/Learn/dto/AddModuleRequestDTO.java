package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object (DTO) used as the request body when creating a new {@code Module}.
 *
 * <p>A module is a logical grouping of related lessons within a course.
 * This DTO is nested inside {@link AddCourseRequestDTO} to represent the module
 * structure when an entire course is created in one request.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code title}   — the display name of the module</li>
 *   <li>{@code lessons} — the ordered list of lessons belonging to this module</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@AllArgsConstructor
@NoArgsConstructor
public class AddModuleRequestDTO {

    /** Display name of the module (e.g., "Getting Started with Java"). */
    private String title;

    /**
     * Ordered list of lessons that belong to this module.
     * Lessons contain the actual educational content.
     */
    private List<AddLessonRequestDTO> lessons;
}