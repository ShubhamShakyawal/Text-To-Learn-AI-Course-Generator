package com.example.backend.Text.to.Learn.configuration;

import com.example.backend.Text.to.Learn.dto.UserDTO;
import com.example.backend.Text.to.Learn.entities.GuestSessionEntity;
import com.example.backend.Text.to.Learn.repositories.GuestSessionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Servlet filter that automatically issues a {@code GUEST_SESSION_ID} HttpOnly cookie
 * to unauthenticated visitors who interact with course endpoints.
 *
 * <p>Flow:
 * <ol>
 *   <li>Request arrives for {@code /api/courses/**}</li>
 *   <li>If user has an active auth session → skip (they're logged in)</li>
 *   <li>If no valid {@code GUEST_SESSION_ID} cookie → generate UUID, persist
 *       {@link GuestSessionEntity}, set HttpOnly cookie</li>
 * </ol>
 *
 * <p>Guest sessions expire after 7 days and are cleaned up nightly by
 * {@link com.example.backend.Text.to.Learn.services.GuestCleanupService}.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class GuestSessionFilter extends OncePerRequestFilter {

    public static final String GUEST_COOKIE_NAME = "GUEST_SESSION_ID";
    private static final int GUEST_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days

    private static final Logger log = LoggerFactory.getLogger(GuestSessionFilter.class);

    private final GuestSessionRepository guestSessionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Only intercept course-related requests
        if (uri.startsWith("/api/courses")) {
            HttpSession session = request.getSession(false);
            boolean isAuthenticated = session != null && session.getAttribute("user") instanceof UserDTO;

            if (!isAuthenticated) {
                String guestId = extractCookie(request, GUEST_COOKIE_NAME);

                // Create a new guest session if none exists or the DB record was deleted
                if (guestId == null || !guestSessionRepository.existsById(guestId)) {
                    String newGuestId = UUID.randomUUID().toString();

                    guestSessionRepository.save(
                            GuestSessionEntity.builder()
                                    .id(newGuestId)
                                    .build()
                    );

                    Cookie cookie = new Cookie(GUEST_COOKIE_NAME, newGuestId);
                    cookie.setHttpOnly(true);
                    cookie.setMaxAge(GUEST_EXPIRY_SECONDS);
                    cookie.setPath("/");
                    // SameSite=Lax is enforced globally via application.properties
                    // cookie.setSecure(true); // enable when serving over HTTPS
                    response.addCookie(cookie);
                    request.setAttribute(GUEST_COOKIE_NAME, newGuestId);

                    log.debug("Created guest session: {}", newGuestId);
                }
            }
        }

        chain.doFilter(request, response);
    }

    /** Extracts a cookie value by name, returns null if not found. */
    public static String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie c : cookies) {
            if (name.equals(c.getName())) return c.getValue();
        }
        return null;
    }
}
