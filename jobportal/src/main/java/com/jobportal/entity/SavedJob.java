package com.jobportal.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_jobs", uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "job_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private User candidate;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
}