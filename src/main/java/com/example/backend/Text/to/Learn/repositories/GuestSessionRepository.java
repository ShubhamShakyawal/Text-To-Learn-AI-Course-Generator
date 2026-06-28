package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.GuestSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for {@link GuestSessionEntity}.
 */
@Repository
public interface GuestSessionRepository extends JpaRepository<GuestSessionEntity, String> {

    /** Returns all guest sessions that have passed their expiry time. */
    List<GuestSessionEntity> findByExpiresAtBefore(LocalDateTime threshold);
}
