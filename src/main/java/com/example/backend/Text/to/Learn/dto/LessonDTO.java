package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) representing a {@code Lesson} in API responses.
 *
 * <p>This DTO is the outbound representation of a lesson returned to the client.
 * Lessons are the leaf-level content nodes in the course hierarchy
 * (Course → Module → Lesson) and carry the actual educational material.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code id}           — the database-generated primary key of the lesson</li>
 *   <li>{@code title}        — the display name of the lesson</li>
 *   <li>{@code content}      — the main educational text/markdown content</li>
 *   <li>{@code youtubeUrl}   — the resolved YouTube video URL for supplementary viewing</li>
 *   <li>{@code youtubeQuery} — the search query that was used to find the YouTube video</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@AllArgsConstructor
@NoArgsConstructor
public class LessonDTO {

    /** Database-generated unique identifier for the lesson. */
    private Long id;

    /** Display name of the lesson (e.g., "Variables and Data Types"). */
    private String title;

    /** Main educational content of the lesson (may be markdown or plain text). */
    private String content;

    /** Resolved YouTube video URL used to supplement the lesson content. May be null. */
    private String youtubeUrl;

    /**
     * The YouTube search query that was used to find the associated video.
     * Stored for auditing/re-fetch purposes.
     */
    private String youtubeQuery;

    /**
     * Whether the learner has completed this lesson.
     * Sourced from the {@code lesson.completed} column in the database.
     */
    private boolean completed;
}