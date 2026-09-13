package com.jobportal.service;

import com.jobportal.dto.SavedJobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.SavedJob;
import com.jobportal.entity.User;
import com.jobportal.exception.DuplicateResourceException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public SavedJobResponse saveJob(Long jobId) {
        User candidate = currentUser();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if (savedJobRepository.existsByCandidateAndJobId(candidate, jobId)) {
            throw new DuplicateResourceException("Job already saved");
        }

        SavedJob savedJob = SavedJob.builder()
                .candidate(candidate)
                .job(job)
                .build();

        savedJobRepository.save(savedJob);
        return toResponse(savedJob);
    }

    public void unsaveJob(Long jobId) {
        User candidate = currentUser();
        SavedJob savedJob = savedJobRepository.findByCandidateAndJobId(candidate, jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved job not found"));
        savedJobRepository.delete(savedJob);
    }

    public List<SavedJobResponse> getMySavedJobs() {
        User candidate = currentUser();
        return savedJobRepository.findByCandidate(candidate).stream()
                .map(this::toResponse)
                .toList();
    }

    private SavedJobResponse toResponse(SavedJob savedJob) {
        Job job = savedJob.getJob();
        return new SavedJobResponse(
                savedJob.getId(), job.getId(), job.getTitle(),
                job.getCompany(), job.getLocation(), job.getSalary()
        );
    }
}