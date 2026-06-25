package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddModuleRequestDTO;
import com.example.backend.Text.to.Learn.dto.ModuleDTO;

import java.util.List;

/**
 * Service interface defining the business-logic contract for {@code Module} operations.
 *
 * <p>This interface is implemented by
 * {@link com.example.backend.Text.to.Learn.services.impl.ModuleServiceImpl}.
 * Controllers depend on this interface (not the implementation) to keep
 * the architecture loosely coupled and easily testable.
 *
 * <p>Operations:
 * <ul>
 *   <li>Create/persist a new module from a DTO</li>
 *   <li>Retrieve all modules or a specific module by ID</li>
 *   <li>Update an existing module</li>
 *   <li>Delete a module by ID</li>
 * </ul>
 */
public interface ModuleService {

    /**
     * Persists a new module in the database.
     *
     * @param addModuleRequestDTO the module data to save
     * @return the saved module as a {@link ModuleDTO} (including the generated {@code id})
     */
    ModuleDTO saveModule(AddModuleRequestDTO addModuleRequestDTO);

    /**
     * Retrieves all modules stored in the database.
     *
     * @return a list of {@link ModuleDTO} objects; empty list if no modules exist
     */
    List<ModuleDTO> getAllModules();

    /**
     * Retrieves a single module by its unique identifier.
     *
     * @param id the primary key of the module to retrieve
     * @return the matching {@link ModuleDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    ModuleDTO getModuleById(Long id);

    /**
     * Updates the title of an existing module.
     *
     * @param id                  the primary key of the module to update
     * @param addModuleRequestDTO the new module data to apply
     * @return the updated module as a {@link ModuleDTO}
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    ModuleDTO updateModule(Long id, AddModuleRequestDTO addModuleRequestDTO);

    /**
     * Deletes a module (and its child lessons via cascade) by its unique identifier.
     *
     * @param id the primary key of the module to delete
     * @throws org.springframework.web.server.ResponseStatusException (404) if not found
     */
    void deleteModuleById(Long id);
}
