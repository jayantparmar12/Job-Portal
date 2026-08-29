package com.jobportal.dto;

import com.jobportal.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String candidateEmail;
    private ApplicationStatus status;
    private String resumeUrl;
}