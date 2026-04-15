package com.example.backend.Text.to.Learn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddLessonRequestDTO {
    private String title;
    private String content;
    private String YoutubeUrl;
    private String youtubeQuery;

    public String getYoutubeQuery(String moduleTitle, String courseTitle) {

        if (youtubeQuery != null && !youtubeQuery.isBlank()) {
            return youtubeQuery;
        }

        youtubeQuery = courseTitle + " " + moduleTitle + " " + title + " tutorial";
        return youtubeQuery;
    }
}