package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SavedJobResponse {
    private Long savedJobId;
    private Long jobId;
    private String title;
    private String company;
    private String location;
    private Double salary;
}