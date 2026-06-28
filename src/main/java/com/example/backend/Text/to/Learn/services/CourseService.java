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
}
