package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for {@link ModuleEntity}.
 *
 * <p>Extends {@link JpaRepository} to inherit standard CRUD operations:
 * <ul>
 *   <li>{@code save(entity)}       — insert or update a module</li>
 *   <li>{@code findById(id)}       — find a module by its primary key</li>
 *   <li>{@code findAll()}          — retrieve all modules</li>
 *   <li>{@code deleteById(id)}     — delete a module by its primary key</li>
 *   <li>{@code existsById(id)}     — check whether a module exists</li>
 * </ul>
 *
 * <p>Custom query methods can be added here using Spring Data's method-name
 * convention (e.g., {@code findByCourseEntityId(Long courseId)}) or with
 * explicit {@code @Query} annotations for more complex queries.
 */
public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {
    // No custom queries currently needed — JpaRepository provides all required operations.
}
