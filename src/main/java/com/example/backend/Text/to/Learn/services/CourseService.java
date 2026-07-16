package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;

import java.util.List;

/**
 * Service interface for {@code Course} operations.
 * Supports both authenticated users and anonymous guest sessions.
 */
public interface CourseService {

    // ── Authenticated user operations ─────────────────────────────────────

    CourseDTO saveCourse(AddCourseRequestDTO dto, Long userId);
    List<CourseDTO> getAllCoursesByUser(Long userId);
    CourseDTO getCourseById(Long id, Long userId);
    CourseDTO updateCourse(Long id, AddCourseRequestDTO dto, Long userId);
    void deleteCourseById(Long id, Long userId);
    CourseDTO generateCourseFromAI(String topic, Long userId);

    // ── Guest session operations ───────────────────────────────────────────

    CourseDTO saveCourseForGuest(AddCourseRequestDTO dto, String guestId);
    List<CourseDTO> getAllCoursesByGuest(String guestId);
    CourseDTO getCourseByIdForGuest(Long id, String guestId);
    CourseDTO updateCourseForGuest(Long id, AddCourseRequestDTO dto, String guestId);
    void deleteCourseByIdForGuest(Long id, String guestId);
    CourseDTO generateCourseFromAIForGuest(String topic, String guestId);

    /**
     * Transfers all unclaimed guest courses to the given authenticated user.
     * Called immediately after login or registration.
     *
     * @param guestId the {@code GUEST_SESSION_ID} cookie value
     * @param userId  the authenticated user to transfer courses to
     * @return number of courses transferred
     */
    int transferGuestCourses(String guestId, Long userId);

    // ── Lesson progress ────────────────────────────────────────────────────

    /**
     * Marks a lesson within a course as completed or not for an authenticated user.
     *
     * @param courseId  the course the lesson belongs to
     * @param lessonId  the lesson to update
     * @param completed {@code true} to mark complete, {@code false} to unmark
     * @param userId    the owning user (used for access control)
     * @return updated {@link CourseDTO} with recalculated {@code completionPercentage}
     */
    CourseDTO updateLessonProgress(Long courseId, Long lessonId, boolean completed, Long userId);

    /**
     * Marks a lesson within a course as completed or not for a guest session.
     *
     * @param courseId  the course the lesson belongs to
     * @param lessonId  the lesson to update
     * @param completed {@code true} to mark complete, {@code false} to unmark
     * @param guestId   the owning guest session ID (used for access control)
     * @return updated {@link CourseDTO} with recalculated {@code completionPercentage}
     */
    CourseDTO updateLessonProgress(Long courseId, Long lessonId, boolean completed, String guestId);
}
