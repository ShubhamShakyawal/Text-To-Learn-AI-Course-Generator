package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.dto.LessonDTO;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface LessonService {
    LessonDTO saveLesson(AddLessonRequestDTO addLessonRequestDTO);

    List<LessonDTO> getAllLessons();

    LessonDTO getLessonById(Long id);

    LessonDTO updateLesson(Long id, AddLessonRequestDTO addLessonRequestDTO);

    void deleteLessonById(Long id);
}
