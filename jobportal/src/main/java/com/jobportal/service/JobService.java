package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobResponse postJob(JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .company(request.getCompany())
                .location(request.getLocation())
                .salary(request.getSalary())
                .postedBy(recruiter)
                .build();

        jobRepository.save(job);
        return toResponse(job);
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return toResponse(job);
    }

    public void deleteJob(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete jobs you posted");
        }
        jobRepository.delete(job);
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("You can only edit jobs you posted");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());

        jobRepository.save(job);
        return toResponse(job);
    }

    private JobResponse toResponse(Job job) {
        return new JobResponse(
                job.getId(), job.getTitle(), job.getDescription(),
                job.getCompany(), job.getLocation(), job.getSalary(),
                job.getPostedBy().getEmail()
        );
    }
}