package com.jobportal.controller;

import com.jobportal.dto.SavedJobResponse;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJobResponse> saveJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(savedJobService.saveJob(jobId));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsaveJob(@PathVariable Long jobId) {
        savedJobService.unsaveJob(jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedJobResponse>> getMySavedJobs() {
        return ResponseEntity.ok(savedJobService.getMySavedJobs());
    }
}