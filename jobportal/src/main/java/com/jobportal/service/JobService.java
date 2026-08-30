package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

//    public List<JobResponse> getAllJobs() {
//        return jobRepository.findAll().stream()
//                .map(this::toResponse)
//                .toList();
//    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return toResponse(job);
    }

    public void deleteJob(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new UnauthorizedException("You can only delete jobs you posted");
        }
        jobRepository.delete(job);
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new UnauthorizedException("You can only edit jobs you posted");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());

        jobRepository.save(job);
        return toResponse(job);
    }

    public Page<JobResponse> getAllJobs(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Job> jobsPage = jobRepository.findAll(pageable);

        return jobsPage.map(this::toResponse);
    }

    public Page<JobResponse> searchJobs(String keyword, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Job> jobsPage;
        if (keyword == null || keyword.trim().isEmpty()) {
            jobsPage = jobRepository.findAll(pageable);
        } else {
            jobsPage = jobRepository.searchJobs(keyword.trim(), pageable);
        }

        return jobsPage.map(this::toResponse);
    }

    public Page<JobResponse> getMyPostedJobs(int page, int size, String sortBy, String sortDir) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Job> jobsPage = jobRepository.findByPostedBy(recruiter, pageable);

        return jobsPage.map(this::toResponse);
    }

    private JobResponse toResponse(Job job) {
        return new JobResponse(
                job.getId(), job.getTitle(), job.getDescription(),
                job.getCompany(), job.getLocation(), job.getSalary(),
                job.getPostedBy().getEmail()
        );
    }
}