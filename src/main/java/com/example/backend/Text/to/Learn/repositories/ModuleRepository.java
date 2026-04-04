package com.example.backend.Text.to.Learn.repositories;

import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<ModuleEntity, Long> {
}
