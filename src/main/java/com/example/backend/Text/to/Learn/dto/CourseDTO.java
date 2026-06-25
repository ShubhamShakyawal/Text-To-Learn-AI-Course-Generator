package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing a {@code Course} in API responses.
 *
 * <p>This DTO is the outbound representation returned to the client after
 * create, read, or update operations. It mirrors the structure of
 * {@code CourseEntity} but decouples the API contract from the database schema.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code id}          — the database-generated primary key of the course</li>
 *   <li>{@code title}       — the display name of the course</li>
 *   <li>{@code description} — a short summary describing the course contents</li>
 *   <li>{@code modules}     — the ordered list of modules that belong to this course</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {

    /** Database-generated unique identifier for the course. */
    private Long id;

    /** Display name of the course (e.g., "Introduction to Java"). */
    private String title;

    /** Short summary describing what the course covers. */
    private String description;

    /**
     * Ordered list of modules that make up this course.
     * Each module contains its own list of lessons.
     */
    private List<ModuleDTO> modules;
}