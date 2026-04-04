package com.example.backend.Text.to.Learn.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.Text.to.Learn.entities.CourseEntity;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {
}