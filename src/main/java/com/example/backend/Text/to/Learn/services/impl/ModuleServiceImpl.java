package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddModuleRequestDTO;
import com.example.backend.Text.to.Learn.dto.ModuleDTO;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.repositories.ModuleRepository;
import com.example.backend.Text.to.Learn.services.ModuleService;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Concrete implementation of {@link ModuleService} providing CRUD operations
 * for {@code Module} resources.
 *
 * <p>Only {@code saveModule} and {@code getAllModules} are fully implemented.
 * The remaining operations (get by ID, update, delete) are stubbed out as
 * modules are typically managed through course-level operations.
 *
 * <p>Note: {@code @AllArgsConstructor} is intentionally commented out and replaced
 * with an explicit constructor to allow for custom initialization logic if needed.
 */
@Service
// @AllArgsConstructor — replaced with an explicit constructor below
public class ModuleServiceImpl implements ModuleService {

    /** SLF4J logger for service-level diagnostics and tracing. */
    private static final Logger log = LoggerFactory.getLogger(ModuleServiceImpl.class);

    /** Repository for all module database operations. */
    private final ModuleRepository moduleRepository;

    /** ModelMapper instance used to convert between entity and DTO types. */
    private final ModelMapper modelMapper;

    /**
     * Explicit constructor injecting the required dependencies.
     * Replaces the Lombok {@code @AllArgsConstructor} to allow future customization.
     *
     * @param moduleRepository the JPA repository for module persistence
     * @param modelMapper      the ModelMapper bean for entity↔DTO conversions
     */
    public ModuleServiceImpl(ModuleRepository moduleRepository, ModelMapper modelMapper) {
        this.moduleRepository = moduleRepository;
        this.modelMapper = modelMapper;
    }

    /**
     * {@inheritDoc}
     *
     * <p>Maps the incoming DTO to a {@link ModuleEntity}, saves it to the database,
     * then maps the persisted entity back to a {@link ModuleDTO} and returns it.
     */
    @Override
    public ModuleDTO saveModule(AddModuleRequestDTO addModuleRequestDTO) {
        log.info("Saving module with title: '{}'", addModuleRequestDTO.getTitle());

        // Map DTO → entity, persist, then map entity → DTO
        ModuleEntity savedModule = moduleRepository.save(
                modelMapper.map(addModuleRequestDTO, ModuleEntity.class)
        );

        log.info("Module '{}' saved with id: {}", savedModule.getTitle(), savedModule.getId());
        return modelMapper.map(savedModule, ModuleDTO.class);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<ModuleDTO> getAllModules() {
        log.info("Fetching all modules from the database");
        List<ModuleDTO> modules = moduleRepository.findAll().stream()
                .map(moduleEntity -> modelMapper.map(moduleEntity, ModuleDTO.class))
                .toList();
        log.info("Retrieved {} module(s)", modules.size());
        return modules;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently not implemented and returns {@code null}.
     */
    @Override
    public ModuleDTO getModuleById(Long id) {
        // TODO: Implement module lookup by ID with proper 404 handling
        log.warn("getModuleById({}) called but is not yet implemented. Returning null.", id);
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently not implemented and returns {@code null}.
     */
    @Override
    public ModuleDTO updateModule(Long id, AddModuleRequestDTO addModuleRequestDTO) {
        // TODO: Implement module update by ID
        log.warn("updateModule({}) called but is not yet implemented. Returning null.", id);
        return null;
    }

    /**
     * {@inheritDoc}
     *
     * <p><strong>Note:</strong> This method is currently a no-op (does nothing).
     */
    @Override
    public void deleteModuleById(Long id) {
        // TODO: Implement module deletion by ID with existence check
        log.warn("deleteModuleById({}) called but is not yet implemented. No action taken.", id);
    }
}
