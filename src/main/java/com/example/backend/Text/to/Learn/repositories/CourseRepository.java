package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for {@link CourseEntity}.
 *
 * <p>Extends {@link JpaRepository} to inherit standard CRUD operations:
 * <ul>
 *   <li>{@code save(entity)}       — insert or update a course</li>
 *   <li>{@code findById(id)}       — find a course by its primary key</li>
 *   <li>{@code findAll()}          — retrieve all courses</li>
 *   <li>{@code deleteById(id)}     — delete a course by its primary key</li>
 *   <li>{@code existsById(id)}     — check whether a course exists</li>
 * </ul>
 *
 * <p>Custom query methods can be added here using Spring Data's method-name
 * convention (e.g., {@code findByTitle(String title)}) or with explicit
 * {@code @Query} annotations when more complex queries are needed.
 */
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
    // No custom queries currently needed — JpaRepository provides all required operations.
}