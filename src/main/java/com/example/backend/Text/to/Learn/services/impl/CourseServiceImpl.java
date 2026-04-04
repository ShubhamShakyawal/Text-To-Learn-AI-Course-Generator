package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.AddLessonRequestDTO;
import com.example.backend.Text.to.Learn.dto.AddModuleRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.entities.CourseEntity;
import com.example.backend.Text.to.Learn.entities.LessonEntity;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.repositories.CourseRepository;
import com.example.backend.Text.to.Learn.repositories.ModuleRepository;
import com.example.backend.Text.to.Learn.services.CourseService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public CourseDTO saveCourse(AddCourseRequestDTO dto) {

        CourseEntity course = modelMapper.map(dto, CourseEntity.class);

        // Step 1: Fix relationships
        if (course.getModules() != null) {
            for (ModuleEntity module : course.getModules()) {

                module.setCourse(course);

                if (module.getLessons() != null) {
                    for (LessonEntity lesson : module.getLessons()) {
                        lesson.setModuleEntity(module);
                    }
                }
            }
        }

        // Step 2: Save course FIRST
        CourseEntity savedCourse = courseRepository.save(course);

        return modelMapper.map(savedCourse, CourseDTO.class);
    }

    public List<CourseDTO> getAllCourses() {
        List<CourseEntity> courseEntities = courseRepository.findAll();
        return courseEntities.stream()
                .map(courseEntity -> modelMapper.map(courseEntity, CourseDTO.class))
                .toList();
    }

    public CourseDTO getCourseById(Long id) {
        CourseEntity courseEntity = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found with id: " + id
                ));

        return modelMapper.map(courseEntity, CourseDTO.class);
    }

    public CourseDTO updateCourse(Long id, AddCourseRequestDTO addCourseRequestDTO) {
        CourseEntity courseEntity = courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id));
        courseEntity.setTitle(addCourseRequestDTO.getTitle());
        courseEntity.setDescription(addCourseRequestDTO.getDescription());
        return modelMapper.map(courseRepository.save(courseEntity), CourseDTO.class);
    }

    public void deleteCourseById(Long id) {
        if(!courseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
}