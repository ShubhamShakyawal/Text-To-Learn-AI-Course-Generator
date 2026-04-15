package com.example.backend.Text.to.Learn.controllers;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.services.CourseService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses") // base URL for all course-related endpoints
@AllArgsConstructor
public class CourseController {

    private final CourseService courseService;

    public void debug() {
        System.out.println("Class: " + this.getClass().getSimpleName() + " - Method: debug() called");
    }

    @PostMapping
    public ResponseEntity<CourseDTO> createCourse(@RequestBody AddCourseRequestDTO addCourseRequestDTO) {
        return ResponseEntity.ok(courseService.saveCourse(addCourseRequestDTO));
    }

    @PostMapping("/generate")
    public ResponseEntity<CourseDTO> generateCourse(@RequestParam String topic) {
        return ResponseEntity.ok(courseService.generateCourseFromAI(topic));
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourseById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDTO> updateCourse(@PathVariable Long id, @RequestBody AddCourseRequestDTO addCourseRequestDTO) {
        return ResponseEntity.ok(courseService.updateCourse(id, addCourseRequestDTO));
    }
}