package com.example.backend.Text.to.Learn;

import com.example.backend.Text.to.Learn.dto.CourseDTO;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@AllArgsConstructor
public class TextToLearnApplication
//		implements CommandLineRunner
		{

	public static void main(String[] args) {
		SpringApplication.run(TextToLearnApplication.class, args);
	}

//	private final CourseDTO courseDTO;
//
//	@Override
//	public void run(String... args) throws Exception {
//		courseDTO.setId(1L);
//		courseDTO.setTitle("Java Basics");
//		courseDTO.setDescription("Learn the fundamentals of Java programming.");
//
//		System.out.println(courseDTO.toString());
//	}
}
