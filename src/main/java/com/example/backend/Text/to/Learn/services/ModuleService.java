package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.AddModuleRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.dto.ModuleDTO;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface ModuleService {

    ModuleDTO saveModule(AddModuleRequestDTO addModuleRequestDTO);

    List<ModuleDTO> getAllModules();

    ModuleDTO getModuleById(Long id);

    ModuleDTO updateModule(Long id, AddModuleRequestDTO addModuleRequestDTO);

    void deleteModuleById(Long id);
}
