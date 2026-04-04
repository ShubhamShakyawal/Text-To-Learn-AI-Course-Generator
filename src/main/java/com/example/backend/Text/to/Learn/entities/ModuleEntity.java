package com.example.backend.Text.to.Learn.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity // marks as table, creates table with the class name
@Data
@Builder // provides builder pattern for object creation
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "module")
public class ModuleEntity {

    @Id // marks as primary key of the table
    @GeneratedValue(strategy = GenerationType.IDENTITY) // incrementally generates id
    private Long id;

    private String title;

    @ManyToOne(fetch = FetchType.LAZY) // defines many-to-one relationship between entities. many modules -> one course
    @JoinColumn(name = "course_id", nullable = false) // foreign key column relationship
    @JsonBackReference
    private CourseEntity course;

    @OneToMany(mappedBy = "moduleEntity", cascade = CascadeType.ALL, orphanRemoval = true) // one-to-many relationship. one module -> many lessons
    @JsonManagedReference
    @Builder.Default
    private List<LessonEntity> lessons = new ArrayList<>();

    public void addLesson(LessonEntity lesson) {
        if(lessons == null) {
            lessons = new ArrayList<>();
        }
        lessons.add(lesson);
        lesson.setModuleEntity(this);
    }
}