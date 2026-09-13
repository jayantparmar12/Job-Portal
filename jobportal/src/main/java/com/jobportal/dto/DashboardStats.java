package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalJobsPosted;
    private long totalApplicantsReceived;
    private Map<String, Long> applicationsByStatus;   // APPLIED, SHORTLISTED, REJECTED counts
    private List<JobApplicantCount> applicantsPerJob;
}