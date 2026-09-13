package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobApplicantCount {
    private String jobTitle;
    private long applicantCount;
}