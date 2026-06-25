package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for {@link LessonEntity}.
 *
 * <p>Extends {@link JpaRepository} to inherit standard CRUD operations:
 * <ul>
 *   <li>{@code save(entity)}       — insert or update a lesson</li>
 *   <li>{@code findById(id)}       — find a lesson by its primary key</li>
 *   <li>{@code findAll()}          — retrieve all lessons</li>
 *   <li>{@code deleteById(id)}     — delete a lesson by its primary key</li>
 *   <li>{@code existsById(id)}     — check whether a lesson exists</li>
 * </ul>
 *
 * <p>Custom query methods can be added here using Spring Data's method-name
 * convention (e.g., {@code findByModuleEntityId(Long moduleId)}) or with
 * explicit {@code @Query} annotations for more complex queries.
 */
public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
    // No custom queries currently needed — JpaRepository provides all required operations.
}
