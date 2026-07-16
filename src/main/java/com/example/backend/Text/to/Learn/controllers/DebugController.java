package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.configuration.GuestSessionFilter;
import com.example.backend.Text.to.Learn.dto.UserDTO;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * TEMPORARY — Remove after debugging production auth issues.
 *
 * Exposes /api/debug/session which returns everything the server sees:
 * cookies, session state, request headers, and X-Forwarded-* values.
 *
 * Usage: open https://<backend>/api/debug/session in a browser tab
 *        (or call it from the frontend) and inspect the JSON.
 */
@RestController
@RequestMapping("/api/debug")
public class DebugController {

    /**
     * Returns a full diagnostic snapshot of the current request context.
     * Accessible without authentication so it works for both guests and logged-in users.
     *
     * GET /api/debug/session
     */
    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> debugSession(HttpServletRequest request) {
        Map<String, Object> info = new LinkedHashMap<>();

        // ── 1. Request metadata ──────────────────────────────────────────────
        info.put("remoteAddr",          request.getRemoteAddr());
        info.put("isSecure",            request.isSecure());
        info.put("scheme",              request.getScheme());
        info.put("serverName",          request.getServerName());
        info.put("xForwardedProto",     request.getHeader("X-Forwarded-Proto"));
        info.put("xForwardedFor",       request.getHeader("X-Forwarded-For"));
        info.put("origin",              request.getHeader("Origin"));
        info.put("host",                request.getHeader("Host"));

        // ── 2. All request headers ────────────────────────────────────────────
        Map<String, String> headers = new LinkedHashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames != null && headerNames.hasMoreElements()) {
            String h = headerNames.nextElement();
            // Skip cookie header (listed separately below)
            if (!"cookie".equalsIgnoreCase(h)) {
                headers.put(h, request.getHeader(h));
            }
        }
        info.put("headers", headers);

        // ── 3. Cookies received by the server ────────────────────────────────
        Map<String, String> cookies = new LinkedHashMap<>();
        Cookie[] rawCookies = request.getCookies();
        if (rawCookies != null) {
            for (Cookie c : rawCookies) {
                cookies.put(c.getName(), c.getValue());
            }
        }
        info.put("cookiesReceived", cookies);
        info.put("jsessionidPresent",       cookies.containsKey("JSESSIONID"));
        info.put("guestSessionIdPresent",   cookies.containsKey(GuestSessionFilter.GUEST_COOKIE_NAME));

        // ── 4. Session state ─────────────────────────────────────────────────
        HttpSession session = request.getSession(false);
        if (session == null) {
            info.put("session", "NO SESSION");
        } else {
            Map<String, Object> sessionInfo = new LinkedHashMap<>();
            sessionInfo.put("id",               session.getId());
            sessionInfo.put("isNew",            session.isNew());
            sessionInfo.put("maxInactiveInterval", session.getMaxInactiveInterval());
            Object userAttr = session.getAttribute("user");
            if (userAttr instanceof UserDTO u) {
                Map<String, Object> userMap = new LinkedHashMap<>();
                userMap.put("id",    u.getId());
                userMap.put("email", u.getEmail());
                userMap.put("name",  u.getName());
                sessionInfo.put("user", userMap);
            } else {
                sessionInfo.put("user", "NOT SET (not authenticated)");
            }
            info.put("session", sessionInfo);
        }

        // ── 5. Effective "is HTTPS" decision (mirrors filter logic) ──────────
        boolean effectivelySecure = request.isSecure()
                || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));
        info.put("effectivelySecure",   effectivelySecure);
        info.put("expectedSameSite",    effectivelySecure ? "None" : "Lax");
        info.put("expectedSecureFlag",  effectivelySecure);

        return ResponseEntity.ok(info);
    }
}
