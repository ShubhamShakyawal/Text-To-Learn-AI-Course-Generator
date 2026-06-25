package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object (DTO) used as the request body when creating a new {@code Lesson}.
 *
 * <p>A lesson is the leaf-level content node within the course hierarchy
 * (Course → Module → Lesson). This DTO is nested inside {@link AddModuleRequestDTO}.
 *
 * <p>Fields:
 * <ul>
 *   <li>{@code title}        — the display name of the lesson</li>
 *   <li>{@code content}      — the main educational text/HTML content of the lesson</li>
 *   <li>{@code YoutubeUrl}   — a pre-resolved YouTube video URL (may be null if not yet fetched)</li>
 *   <li>{@code youtubeQuery} — the search query used to find a relevant YouTube video;
 *                              auto-generated from course/module/lesson titles if not provided</li>
 * </ul>
 */
@Data           // generates getters, setters, equals, hashCode, and toString
@AllArgsConstructor
@NoArgsConstructor
public class AddLessonRequestDTO {

    /** Display name of the lesson (e.g., "Variables and Data Types"). */
    private String title;

    /** Main educational content of the lesson (may contain markdown or HTML). */
    private String content;

    /**
     * Pre-resolved YouTube video URL for this lesson.
     * Populated after calling {@link com.example.backend.Text.to.Learn.services.YoutubeService#getVideoLink}.
     */
    private String YoutubeUrl;

    /**
     * Search query used to find a relevant YouTube video via the YouTube Data API.
     * If null or blank, the query is auto-generated from the course title, module title,
     * and lesson title by {@link #getYoutubeQuery(String, String)}.
     */
    private String youtubeQuery;

    /**
     * Returns the YouTube search query for this lesson, auto-generating one if not already set.
     *
     * <p>If {@code youtubeQuery} is non-null and non-blank, it is returned as-is.
     * Otherwise a query is constructed in the format:
     * <pre>{@code "<courseTitle> <moduleTitle> <lessonTitle> tutorial"}</pre>
     * and cached in {@code youtubeQuery} for subsequent calls.
     *
     * @param moduleTitle the title of the parent module — used in the fallback query
     * @param courseTitle the title of the parent course  — used in the fallback query
     * @return a non-null YouTube search query string
     */
    public String getYoutubeQuery(String moduleTitle, String courseTitle) {

        // Return existing query if already defined
        if (youtubeQuery != null && !youtubeQuery.isBlank()) {
            return youtubeQuery;
        }

        // Auto-generate a descriptive query from the course/module/lesson context
        youtubeQuery = courseTitle + " " + moduleTitle + " " + title + " tutorial";
        return youtubeQuery;
    }
}