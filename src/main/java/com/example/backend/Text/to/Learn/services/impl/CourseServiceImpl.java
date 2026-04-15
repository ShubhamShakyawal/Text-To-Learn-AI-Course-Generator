package com.example.backend.Text.to.Learn.services.impl;

import com.example.backend.Text.to.Learn.dto.AddCourseRequestDTO;
import com.example.backend.Text.to.Learn.dto.CourseDTO;
import com.example.backend.Text.to.Learn.entities.CourseEntity;
import com.example.backend.Text.to.Learn.entities.LessonEntity;
import com.example.backend.Text.to.Learn.entities.ModuleEntity;
import com.example.backend.Text.to.Learn.repositories.CourseRepository;
import com.example.backend.Text.to.Learn.services.AiService;
import com.example.backend.Text.to.Learn.services.CourseService;
import com.example.backend.Text.to.Learn.services.YoutubeService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.modelmapper.ModelMapper;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final AiService aiService;
    private final YoutubeService youtubeService;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;
    private static final Logger log = LoggerFactory.getLogger(CourseServiceImpl.class);

    @Override
    @Transactional
    public CourseDTO saveCourse(AddCourseRequestDTO dto) {

        CourseEntity course = modelMapper.map(dto, CourseEntity.class);

//        log.info("Saving Course : {}", course.toString());

        // Step 1: Fix relationships
        if (course.getModules() != null) {
            for (ModuleEntity module : course.getModules()) {

                module.setCourseEntity(course);

                if (module.getLessons() != null) {
                    for (LessonEntity lesson : module.getLessons()) {
                        lesson.setModuleEntity(module);
                    }
                }
            }
        }

        // Step 2: Save course FIRST
        CourseEntity savedCourse = courseRepository.save(course);
//        log.info("Saved Course : {}", savedCourse.toString());

        return modelMapper.map(savedCourse, CourseDTO.class);
    }

    public List<CourseDTO> getAllCourses() {
        List<CourseEntity> courseEntities = courseRepository.findAll();
//        log.info("Get all Courses : {}", courseEntities.toString());

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
//        log.info("Get Course with id: {}", courseEntity.toString());

        return modelMapper.map(courseEntity, CourseDTO.class);
    }

    public CourseDTO updateCourse(Long id, AddCourseRequestDTO addCourseRequestDTO) {
        CourseEntity courseEntity = courseRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id));
//        log.info("Update Course: {}", courseEntity.toString());

        // update
        courseEntity.setTitle(addCourseRequestDTO.getTitle());
        courseEntity.setDescription(addCourseRequestDTO.getDescription());

        return modelMapper.map(courseRepository.save(courseEntity), CourseDTO.class);
    }

    public void deleteCourseById(Long id) {
        if(!courseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
        log.info("Delete Course with id: {}", id);
    }

    public CourseDTO generateCourseFromAI(String topic) {
        try {

            String json = aiService.generateCourse(topic);
//            String json = "{ \"title\": \"Java Fundamentals\", \"description\": \"Comprehensive beginner-level course covering core concepts of Java programming, from syntax and data types to object-oriented principles and essential APIs.\", \"modules\": [ { \"title\": \"Getting Started with Java\", \"lessons\": [ { \"title\": \"What is Java? History and Ecosystem\", \"content\": \"Overview of Java's history, platform independence, JVM, and common use cases. Introduction to JDK, JRE, and IDEs.\", \"youtubeQuery\": \"Java introduction history overview\" }, { \"title\": \"Setting Up Development Environment\", \"content\": \"Step‑by‑step guide to installing JDK, configuring PATH, and choosing an IDE (IntelliJ IDEA, Eclipse, VS Code). Write and run your first program.\", \"youtubeQuery\": \"install Java JDK and IntelliJ tutorial\" } ] }, { \"title\": \"Basic Syntax and Data Types\", \"lessons\": [ { \"title\": \"Java Syntax Basics\", \"content\": \"Structure of a Java program, packages, classes, main method, comments, and code formatting conventions.\", \"youtubeQuery\": \"Java program structure main method tutorial\" }, { \"title\": \"Variables, Primitive Types, and Operators\", \"content\": \"Declaration, initialization, scope, primitive data types (int, double, boolean, char), and arithmetic, relational, logical operators.\", \"youtubeQuery\": \"Java variables primitive types operators\" }, { \"title\": \"String Handling\", \"content\": \"Immutable nature of String, concatenation, common methods (length, substring, indexOf, replace), and StringBuilder usage.\", \"youtubeQuery\": \"Java string manipulation tutorial\" } ] }, { \"title\": \"Control Flow\", \"lessons\": [ { \"title\": \"Conditional Statements\", \"content\": \"If, else‑if, nested if, switch statement with fall‑through and enhanced switch (Java 14+).\", \"youtubeQuery\": \"Java if else switch tutorial\" }, { \"title\": \"Loops\", \"content\": \"While, do‑while, for, enhanced for‑loop for arrays and collections, and loop control statements (break, continue, return).\", \"youtubeQuery\": \"Java loops tutorial while for enhanced for\" } ] }, { \"title\": \"Methods and Scope\", \"lessons\": [ { \"title\": \"Defining and Invoking Methods\", \"content\": \"Method signatures, return types, parameters, overloading, varargs, and calling conventions.\", \"youtubeQuery\": \"Java methods definition and overloading\" }, { \"title\": \"Parameter Passing and Scope\", \"content\": \"Pass‑by‑value semantics, local vs. instance vs. static variables, and variable shadowing.\", \"youtubeQuery\": \"Java parameter passing scope variables\" } ] }, { \"title\": \"Object‑Oriented Programming\", \"lessons\": [ { \"title\": \"Classes and Objects\", \"content\": \"Defining classes, fields, constructors, the this keyword, and creating objects with new.\", \"youtubeQuery\": \"Java classes and objects tutorial\" }, { \"title\": \"Encapsulation, Getters, and Setters\", \"content\": \"Access modifiers, data hiding, public getters and setters, and immutable objects.\", \"youtubeQuery\": \"Java encapsulation getters setters\" }, { \"title\": \"Inheritance and Polymorphism\", \"content\": \"extends keyword, super, method overriding, dynamic dispatch, abstract classes, and the final keyword.\", \"youtubeQuery\": \"Java inheritance polymorphism tutorial\" }, { \"title\": \"Interfaces and Functional Interfaces\", \"content\": \"Defining interfaces, default & static methods, implementing multiple interfaces, lambda expressions, and @FunctionalInterface.\", \"youtubeQuery\": \"Java interfaces functional interfaces lambda\" } ] }, { \"title\": \"Exception Handling\", \"lessons\": [ { \"title\": \"Try‑Catch‑Finally Mechanics\", \"content\": \"Checked vs. unchecked exceptions, try‑with‑resources, creating custom exception classes.\", \"youtubeQuery\": \"Java exception handling try catch finally tutorial\" } ] }, { \"title\": \"Core APIs\", \"lessons\": [ { \"title\": \"Arrays and the java.util.Arrays Utility\", \"content\": \"Declaring arrays, multidimensional arrays, copying, sorting, and searching with Arrays class.\", \"youtubeQuery\": \"Java arrays and Arrays class tutorial\" }, { \"title\": \"Collections Framework Overview\", \"content\": \"List, Set, Map interfaces; ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap basics; iterating with for‑each and Iterator.\", \"youtubeQuery\": \"Java collections framework tutorial\" } ] }, { \"title\": \"Input/Output and File Handling\", \"lessons\": [ { \"title\": \"Console I/O with Scanner and System.out\", \"content\": \"Reading user input, formatting output with printf, and basic validation.\", \"youtubeQuery\": \"Java scanner console input tutorial\" }, { \"title\": \"File I/O with java.nio\", \"content\": \"Reading and writing text files using Files, Paths, BufferedReader, BufferedWriter, and handling character encoding.\", \"youtubeQuery\": \"Java NIO file read write tutorial\" } ] }, { \"title\": \"Putting It All Together\", \"lessons\": [ { \"title\": \"Mini Project: Command‑Line Todo App\", \"content\": \"Apply concepts to build a simple todo list application using OOP, collections, file persistence, and exception handling.\", \"youtubeQuery\": \"Java command line todo app tutorial\" } ] } ] }";

            // convert JSON → DTO
            AddCourseRequestDTO dto = objectMapper.readValue(json, AddCourseRequestDTO.class);

            // enrich with YouTube links
            dto.getModules().forEach(module -> {
                if (module.getLessons() == null) return;

                module.getLessons().forEach(lesson -> {
                    String query = lesson.getYoutubeQuery(
                            module.getTitle(),
                            dto.getTitle()
                    );

                    String link = youtubeService.getVideoLink(query);
                    lesson.setYoutubeUrl(link);
                });
            });

            return saveCourse(dto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}