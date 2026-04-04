package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.LessonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<LessonEntity, Long> {
}
