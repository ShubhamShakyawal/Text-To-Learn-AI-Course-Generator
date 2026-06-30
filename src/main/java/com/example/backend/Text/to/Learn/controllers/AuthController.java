package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.configuration.GuestSessionFilter;
import com.example.backend.Text.to.Learn.dto.GoogleAuthRequestDTO;
import com.example.backend.Text.to.Learn.dto.LoginRequestDTO;
import com.example.backend.Text.to.Learn.dto.RegisterRequestDTO;
import com.example.backend.Text.to.Learn.dto.UserDTO;
import com.example.backend.Text.to.Learn.services.AuthService;
import com.example.backend.Text.to.Learn.services.CourseService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller for authentication endpoints.
 *
 * <p>Base URL: {@code /api/auth}
 *
 * <p>Session handling: on successful login or register, the authenticated
 * {@link UserDTO} is stored in the {@link HttpSession} under the key
 * {@code "user"}. The browser automatically receives and sends the
 * {@code JSESSIONID} cookie on subsequent requests.
 *
 * <p>Endpoints:
 * <ul>
 *   <li>{@code POST /api/auth/register}  — create account + auto-login</li>
 *   <li>{@code POST /api/auth/login}     — email/password login</li>
 *   <li>{@code POST /api/auth/logout}    — invalidate session</li>
 *   <li>{@code GET  /api/auth/me}        — return current session user</li>
 *   <li>{@code POST /api/auth/google}    — authenticate via Google ID token</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    /** Session attribute key under which the authenticated {@link UserDTO} is stored. */
    public static final String SESSION_USER_KEY = "user";

    private final AuthService authService;
    private final CourseService courseService;

    /**
     * Registers a new user, automatically creates a session, and returns the new {@link UserDTO}.
     *
     * <p>HTTP: {@code POST /api/auth/register}
     *
     * @param dto     the registration payload (name, email, password)
     * @param request the HTTP request — used to obtain / create the session
     * @return {@code 201 Created} with the new {@link UserDTO}
     */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(
            @Valid @RequestBody RegisterRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("POST /api/auth/register — email: {}", dto.getEmail());
        UserDTO user = authService.register(dto.getName(), dto.getEmail(), dto.getPassword(), dto.getPicture());
        createSession(request, user);
        transferGuestCourses(request, response, user.getId());
        log.info("Registration successful for user id: {}", user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    /**
     * Authenticates a user with email and password, creates a session, and returns the {@link UserDTO}.
     *
     * <p>HTTP: {@code POST /api/auth/login}
     *
     * @param dto     the login payload (email, password)
     * @param request the HTTP request — used to obtain / create the session
     * @return {@code 200 OK} with the authenticated {@link UserDTO}
     */
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(
            @Valid @RequestBody LoginRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("POST /api/auth/login — email: {}", dto.getEmail());
        UserDTO user = authService.login(dto.getEmail(), dto.getPassword());
        createSession(request, user);
        transferGuestCourses(request, response, user.getId());
        log.info("Login successful for user id: {}", user.getId());
        return ResponseEntity.ok(user);
    }

    /**
     * Authenticates (or registers) a user via a Google ID token.
     * Creates a session and returns the {@link UserDTO}.
     *
     * <p>HTTP: {@code POST /api/auth/google}
     *
     * @param dto     the Google auth payload containing the raw ID token credential
     * @param request the HTTP request — used to obtain / create the session
     * @return {@code 200 OK} with the authenticated {@link UserDTO}
     */
    @PostMapping("/google")
    public ResponseEntity<UserDTO> googleAuth(
            @Valid @RequestBody GoogleAuthRequestDTO dto,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        log.info("POST /api/auth/google — processing Google ID token");
        UserDTO user = authService.loginWithGoogle(dto.getCredential());
        createSession(request, user);
        transferGuestCourses(request, response, user.getId());
        log.info("Google auth successful for user id: {}", user.getId());
        return ResponseEntity.ok(user);
    }

    /**
     * Invalidates the current session, effectively logging the user out.
     *
     * <p>HTTP: {@code POST /api/auth/logout}
     *
     * @param request the HTTP request whose session will be invalidated
     * @return {@code 200 OK} with a confirmation message
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object userAttr = session.getAttribute(SESSION_USER_KEY);
            if (userAttr instanceof UserDTO u) {
                log.info("POST /api/auth/logout — logging out user id: {}", u.getId());
            }
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    /**
     * Returns the currently authenticated user from the active session.
     *
     * <p>HTTP: {@code GET /api/auth/me}
     *
     * @param request the HTTP request — session is read but not created
     * @return {@code 200 OK} with the session {@link UserDTO},
     *         or {@code 401 Unauthorized} if no active session exists
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            log.debug("GET /api/auth/me — no active session");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        Object attr = session.getAttribute(SESSION_USER_KEY);
        if (!(attr instanceof UserDTO user)) {
            log.debug("GET /api/auth/me — session exists but has no user attribute");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        log.debug("GET /api/auth/me — returning user id: {}", user.getId());
        return ResponseEntity.ok(user);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Creates (or refreshes) an {@link HttpSession} and stores the authenticated
     * {@link UserDTO} in it under {@link #SESSION_USER_KEY}.
     *
     * @param request the current HTTP request
     * @param user    the authenticated user to store in the session
     */
    private void createSession(HttpServletRequest request, UserDTO user) {
        HttpSession existing = request.getSession(false);
        if (existing != null) existing.invalidate();
        HttpSession session = request.getSession(true);
        session.setAttribute(SESSION_USER_KEY, user);
        log.debug("Session created for user id: {}", user.getId());
    }

    /**
     * If the request carries a {@code GUEST_SESSION_ID} cookie, transfers all
     * unclaimed guest courses to the newly authenticated user, then clears the
     * guest cookie so it is not reused.
     */
    private void transferGuestCourses(HttpServletRequest request,
                                      HttpServletResponse response,
                                      Long userId) {
        String guestId = GuestSessionFilter.extractCookie(request, GuestSessionFilter.GUEST_COOKIE_NAME);
        if (guestId == null) return;
        try {
            int count = courseService.transferGuestCourses(guestId, userId);
            log.info("Transferred {} guest course(s) from {} to user {}", count, guestId, userId);
        } catch (Exception e) {
            log.warn("Guest course transfer failed: {}", e.getMessage());
        }
        // Clear the guest cookie in the browser using ResponseCookie for secure cross-origin compliance
        boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        org.springframework.http.ResponseCookie responseCookie = org.springframework.http.ResponseCookie.from(GuestSessionFilter.GUEST_COOKIE_NAME, "")
                .httpOnly(true)
                .maxAge(0)
                .path("/")
                .sameSite(isSecure ? "None" : "Lax")
                .secure(isSecure)
                .build();
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, responseCookie.toString());
    }
}