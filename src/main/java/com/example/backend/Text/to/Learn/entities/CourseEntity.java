package com.example.backend.Text.to.Learn.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    @OneToMany(mappedBy = "courseEntity", cascade = CascadeType.ALL, orphanRemoval = true) // one-to-many relationship. one course -> many modules
    @JsonManagedReference
    @Builder.Default
    private List<ModuleEntity> modules = new ArrayList<>();
}