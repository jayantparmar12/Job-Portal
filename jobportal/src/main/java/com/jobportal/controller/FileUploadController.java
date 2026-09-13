package com.jobportal.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class FileUploadController {

    private final Cloudinary cloudinary;

    @PostMapping("/resume")
    public ResponseEntity<Map<String, String>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            String originalName = file.getOriginalFilename();
            if (originalName == null || !originalName.toLowerCase().endsWith(".pdf")) {
                throw new RuntimeException("Only PDF files are allowed");
            }

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "resource_type", "raw",       // "raw" for non-image files like PDFs
                    "folder", "job-portal/resumes"
            ));

            String fileUrl = (String) uploadResult.get("secure_url");

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }
}