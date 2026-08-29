package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.dto.ApplicationResponse;
import com.jobportal.entity.*;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ApplicationResponse applyToJob(ApplicationRequest request) {
        User candidate = currentUser();
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));

        boolean alreadyApplied = applicationRepository.findByCandidate(candidate).stream()
                .anyMatch(app -> app.getJob().getId().equals(job.getId()));
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .status(ApplicationStatus.APPLIED)
                .resumeUrl(request.getResumeUrl())
                .build();

        applicationRepository.save(application);
        return toResponse(application);
    }

    public List<ApplicationResponse> getMyApplications() {
        User candidate = currentUser();
        return applicationRepository.findByCandidate(candidate).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationResponse> getApplicantsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        // Only the recruiter who posted the job can view applicants
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!job.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("You can only view applicants for jobs you posted");
        }

        return applicationRepository.findByJobId(jobId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!application.getJob().getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("You can only update applications for your own jobs");
        }

        application.setStatus(status);
        applicationRepository.save(application);
        return toResponse(application);
    }

    private ApplicationResponse toResponse(Application app) {
        return new ApplicationResponse(
                app.getId(),
                app.getJob().getId(),
                app.getJob().getTitle(),
                app.getCandidate().getEmail(),
                app.getStatus(),
                app.getResumeUrl()
        );
    }
}