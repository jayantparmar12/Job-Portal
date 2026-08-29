package com.jobportal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobRequest {
    @NotBlank
    private String title;

    private String description;
    private String company;
    private String location;
    private Double salary;
}