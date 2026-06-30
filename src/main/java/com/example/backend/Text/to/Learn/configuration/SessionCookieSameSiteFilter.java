package com.example.backend.Text.to.Learn.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
2.  * Filter that dynamically configures the JSESSIONID (session) cookie to use
3.  * SameSite=None and Secure=true if the request comes in over a secure connection (HTTPS),
4.  * falling back to SameSite=Lax (no Secure) for local HTTP development.
5.  *
6.  * <p>This ensures session cookies are accepted and preserved across cross-site reloads
7.  * in production (e.g. Render React frontend to Railway backend) without breaking
8.  * local development on HTTP localhost.
9.  */
@Component
@Order(-100) // Run at the very start of the filter chain
public class SessionCookieSameSiteFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        HttpServletResponse wrappedResponse = new HttpServletResponseWrapper(response) {
            @Override
            public void addHeader(String name, String value) {
                if ("Set-Cookie".equalsIgnoreCase(name)) {
                    super.addHeader(name, rewriteCookie(value, request));
                } else {
                    super.addHeader(name, value);
                }
            }

            @Override
            public void setHeader(String name, String value) {
                if ("Set-Cookie".equalsIgnoreCase(name)) {
                    super.setHeader(name, rewriteCookie(value, request));
                } else {
                    super.setHeader(name, value);
                }
            }
        };

        filterChain.doFilter(request, wrappedResponse);
    }

    private String rewriteCookie(String cookieValue, HttpServletRequest request) {
        if (cookieValue == null) {
            return null;
        }

        // Target JSESSIONID cookie
        if (cookieValue.contains("JSESSIONID=")) {
            boolean isSecure = request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"));

            // Remove any existing SameSite and Secure parameters
            String clean = cookieValue.replaceAll("(?i);\\s*SameSite=[a-zA-Z]+", "");
            clean = clean.replaceAll("(?i);\\s*Secure", "");

            if (isSecure) {
                return clean + "; SameSite=None; Secure";
            } else {
                return clean + "; SameSite=Lax";
            }
        }

        return cookieValue;
    }
}
