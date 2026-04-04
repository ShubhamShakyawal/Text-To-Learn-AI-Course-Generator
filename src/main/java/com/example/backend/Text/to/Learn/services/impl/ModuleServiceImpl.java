package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddModuleRequestDTO;
import com.example.backend.Text.to.Learn.dto.ModuleDTO;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.repositories.ModuleRepository;
import com.example.backend.Text.to.Learn.services.ModuleService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//@AllArgsConstructor
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModelMapper modelMapper;

    public ModuleServiceImpl(ModuleRepository moduleRepository, ModelMapper modelMapper) {
        this.moduleRepository = moduleRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ModuleDTO saveModule(AddModuleRequestDTO addModuleRequestDTO) {
        ModuleEntity savedModule = moduleRepository.save(modelMapper.map(addModuleRequestDTO, ModuleEntity.class));
        return modelMapper.map(savedModule, ModuleDTO.class);
    }

    public List<ModuleDTO> getAllModules() {
        return moduleRepository.findAll().stream()
                .map(moduleEntity -> modelMapper.map(moduleEntity, ModuleDTO.class))
                .toList();
    }

    @Override
    public ModuleDTO getModuleById(Long id) {
        return null;
    }

    @Override
    public ModuleDTO updateModule(Long id, AddModuleRequestDTO addModuleRequestDTO) {
        return null;
    }

    @Override
    public void deleteModuleById(Long id) {

    }

}
