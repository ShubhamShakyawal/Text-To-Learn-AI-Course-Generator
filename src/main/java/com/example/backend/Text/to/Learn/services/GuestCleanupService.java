package com.example.backend.Text.to.Learn.services;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Text.to.Learn.repositories.CourseRepository;
import com.example.backend.Text.to.Learn.repositories.GuestSessionRepository;
import com.example.backend.Text.to.Learn.entities.GuestSessionEntity;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled service that removes expired guest sessions and their associated courses.
 *
 * <p>Runs every day at 02:00 to clean up guest data older than 7 days.
 * This prevents the database from accumulating orphaned guest courses
 * from visitors who never signed up.
 */
@Service
@RequiredArgsConstructor
public class GuestCleanupService {

    private static final Logger log = LoggerFactory.getLogger(GuestCleanupService.class);

    private final GuestSessionRepository guestSessionRepository;
    private final CourseRepository courseRepository;

    /**
     * Deletes all guest sessions that have passed their {@code expiresAt} timestamp,
     * along with all courses owned by those sessions.
     *
     * <p>Cron: {@code 0 0 2 * * *} — runs at 02:00 every day.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupExpiredGuestSessions() {
        LocalDateTime now = LocalDateTime.now();
        List<GuestSessionEntity> expired = guestSessionRepository.findByExpiresAtBefore(now);

        if (expired.isEmpty()) {
            log.info("Guest cleanup: no expired sessions found");
            return;
        }

        log.info("Guest cleanup: removing {} expired session(s)", expired.size());

        for (GuestSessionEntity gs : expired) {
            int deletedCourses = courseRepository.deleteByGuestId(gs.getId());
            guestSessionRepository.delete(gs);
            log.info("Deleted guest session {} and {} associated course(s)", gs.getId(), deletedCourses);
        }
    }
}
