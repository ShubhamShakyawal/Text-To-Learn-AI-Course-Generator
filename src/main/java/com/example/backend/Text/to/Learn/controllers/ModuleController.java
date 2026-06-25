package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.dto.ModuleDTO;
import com.example.backend.Text.to.Learn.services.ModuleService;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller that exposes endpoints for {@code Module} resources.
 *
 * <p>Base URL: {@code /api/modules}
 *
 * <p>Modules are the mid-level grouping nodes in the course hierarchy
 * (Course → Module → Lesson). Business logic is delegated to {@link ModuleService}.
 */
@RestController
@RequestMapping("/api/modules")
@AllArgsConstructor
public class ModuleController {

    /** SLF4J logger for request tracing and diagnostics. */
    private static final Logger log = LoggerFactory.getLogger(ModuleController.class);

    /** Service layer handling all module business logic. */
    private final ModuleService moduleService;

    /**
     * Retrieves all modules stored in the database.
     *
     * <p>HTTP: {@code GET /api/modules}
     *
     * @return {@code 200 OK} with a list of all {@link ModuleDTO} objects
     */
    @GetMapping
    public ResponseEntity<List<ModuleDTO>> getAllModules() {
        log.info("GET /api/modules - Fetching all modules");
        List<ModuleDTO> modules = moduleService.getAllModules();
        log.info("Returning {} module(s)", modules.size());
        return ResponseEntity.ok(modules);
    }
}
