package com.example.backend.Text.to.Learn.services;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface CourseService {

    CourseDTO saveCourse(AddCourseRequestDTO addCourseRequestDTO);

    List<CourseDTO> getAllCourses();

    CourseDTO getCourseById(Long id);

    CourseDTO updateCourse(Long id, AddCourseRequestDTO addCourseDTO);

    void deleteCourseById(Long id);

    CourseDTO generateCourseFromAI(String topic);
}
