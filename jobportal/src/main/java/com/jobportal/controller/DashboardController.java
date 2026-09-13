package com.jobportal.controller;

import com.jobportal.dto.DashboardStats;
import com.jobportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/recruiter")
    public ResponseEntity<DashboardStats> getRecruiterStats() {
        return ResponseEntity.ok(dashboardService.getRecruiterStats());
    }
}