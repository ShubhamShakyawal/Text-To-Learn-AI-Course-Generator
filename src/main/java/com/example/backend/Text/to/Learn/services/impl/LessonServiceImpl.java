package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.LessonDTO;
import com.example.backend.Text.to.Learn.repositories.LessonRepository;
import com.example.backend.Text.to.Learn.services.LessonService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class LessonServiceImpl implements LessonService  {

    private final LessonRepository lessonRepository;
    private final ModelMapper modelMapper;

    @Override
    public LessonDTO saveLesson(AddLessonRequestDTO addLessonRequestDTO) {
        return null;
    }

    public List<LessonDTO> getAllLessons() {
        return lessonRepository.findAll().stream()
                .map(lessonEntity -> modelMapper.map(lessonEntity, LessonDTO.class))
                .toList();
    }

    @Override
    public LessonDTO getLessonById(Long id) {
        return null;
    }

    @Override
    public LessonDTO updateLesson(Long id, AddLessonRequestDTO addLessonRequestDTO) {
        return null;
    }

    @Override
    public void deleteLessonById(Long id) {

    }

}
