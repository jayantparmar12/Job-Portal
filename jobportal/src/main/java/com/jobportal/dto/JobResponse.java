package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String company;
    private String location;
    private Double salary;
    private String postedByEmail;
}