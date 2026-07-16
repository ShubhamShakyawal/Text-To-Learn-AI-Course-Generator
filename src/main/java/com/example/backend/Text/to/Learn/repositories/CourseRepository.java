package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Data JPA repository for {@link CourseEntity}.
 * Supports both user-scoped and guest-scoped course queries.
 */
@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

    /** Returns all courses belonging to the given authenticated user. */
    List<CourseEntity> findByUserId(Long userId);

    /** Returns all unclaimed guest courses for the given guest session ID. */
    List<CourseEntity> findByGuestIdAndUserIsNull(String guestId);

    /**
     * Returns all courses owned by a guest session (regardless of transfer state).
     * Used by the cleanup service to load entities before entity-level deletion
     * so JPA cascades (modules → lessons) fire correctly.
     */
    List<CourseEntity> findByGuestId(String guestId);

    /**
     * @deprecated Use entity-level {@code deleteAll(findByGuestId(guestId))} instead
     *             so that JPA cascade rules delete child modules and lessons first.
     *             This JPQL bulk delete bypasses cascades and causes FK violations.
     */
    @Deprecated
    @Modifying
    @Transactional
    @Query("DELETE FROM CourseEntity c WHERE c.guestId = :guestId")
    int deleteByGuestId(String guestId);
}