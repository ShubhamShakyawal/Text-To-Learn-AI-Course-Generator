package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.configuration.GuestSessionFilter;
import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.dto.UserDTO;
import com.example.backend.Text.to.Learn.services.CourseService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for Course resources.
 *
 * <p>Every request is routed through one of two paths:
 * <ul>
 *   <li><b>Authenticated</b> — user has a valid {@code JSESSIONID} session → user-scoped ops</li>
 *   <li><b>Guest</b>         — user has a {@code GUEST_SESSION_ID} cookie → guest-scoped ops</li>
 * </ul>
 * If neither cookie is present the endpoint returns {@code 401}.
 */
@RestController
@RequestMapping("/api/courses")
@AllArgsConstructor
public class CourseController {

    private static final Logger log = LoggerFactory.getLogger(CourseController.class);

    private final CourseService courseService;

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody AddCourseRequestDTO dto,
                                                  HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) {
            return ResponseEntity.ok(courseService.saveCourse(dto, user.getId()));
        }
        String guestId = requireGuest(request);
        return ResponseEntity.ok(courseService.saveCourseForGuest(dto, guestId));
    }

    @PostMapping("/generate")
    public ResponseEntity<CourseDTO> generateCourse(@RequestParam String topic,
                                                    HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) {
            log.info("POST /api/courses/generate — user:{}, topic:'{}'", user.getId(), topic);
            return ResponseEntity.ok(courseService.generateCourseFromAI(topic, user.getId()));
        }
        String guestId = requireGuest(request);
        log.info("POST /api/courses/generate — guest:{}, topic:'{}'", guestId, topic);
        return ResponseEntity.ok(courseService.generateCourseFromAIForGuest(topic, guestId));
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getCourses(HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) {
            return ResponseEntity.ok(courseService.getAllCoursesByUser(user.getId()));
        }
        String guestId = guestCookieValue(request);
        if (guestId == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(courseService.getAllCoursesByGuest(guestId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id,
                                               HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) return ResponseEntity.ok(courseService.getCourseById(id, user.getId()));
        String guestId = requireGuest(request);
        return ResponseEntity.ok(courseService.getCourseByIdForGuest(id, guestId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id,
                                             HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) { courseService.deleteCourseById(id, user.getId()); return ResponseEntity.noContent().build(); }
        String guestId = requireGuest(request);
        courseService.deleteCourseByIdForGuest(id, guestId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id,
                                                  @RequestBody AddCourseRequestDTO dto,
                                                  HttpServletRequest request) {
        UserDTO user = sessionUser(request);
        if (user != null) return ResponseEntity.ok(courseService.updateCourse(id, dto, user.getId()));
        String guestId = requireGuest(request);
        return ResponseEntity.ok(courseService.updateCourseForGuest(id, dto, guestId));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Returns the authenticated UserDTO from the session, or null if not logged in. */
    private UserDTO sessionUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) return null;
        Object attr = session.getAttribute(AuthController.SESSION_USER_KEY);
        return (attr instanceof UserDTO u) ? u : null;
    }

    /** Returns the GUEST_SESSION_ID cookie value, or null if absent. */
    private String guestCookieValue(HttpServletRequest request) {
        Object attr = request.getAttribute(GuestSessionFilter.GUEST_COOKIE_NAME);
        if (attr instanceof String s) {
            return s;
        }
        return GuestSessionFilter.extractCookie(request, GuestSessionFilter.GUEST_COOKIE_NAME);
    }

    /** Returns the guest ID or throws 401 if neither auth session nor guest cookie exists. */
    private String requireGuest(HttpServletRequest request) {
        String guestId = guestCookieValue(request);
        if (guestId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                    "Authentication or guest session required");
        }
        return guestId;
    }
}