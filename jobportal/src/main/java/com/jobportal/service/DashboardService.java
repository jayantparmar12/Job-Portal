package com.jobportal.service;

import com.jobportal.dto.DashboardStats;
import com.jobportal.dto.JobApplicantCount;
import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DashboardStats getRecruiterStats() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        List<Job> myJobs = jobRepository.findAll().stream()
                .filter(j -> j.getPostedBy().getId().equals(recruiter.getId()))
                .toList();

        List<Application> allApplications = applicationRepository.findByJobPostedBy(recruiter);

        // Group by status
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        statusCounts.put("APPLIED", 0L);
        statusCounts.put("SHORTLISTED", 0L);
        statusCounts.put("REJECTED", 0L);
        for (Application app : allApplications) {
            statusCounts.merge(app.getStatus().name(), 1L, Long::sum);
        }

        // Applicants per job
        List<JobApplicantCount> applicantsPerJob = myJobs.stream()
                .map(job -> new JobApplicantCount(
                        job.getTitle(),
                        allApplications.stream().filter(a -> a.getJob().getId().equals(job.getId())).count()
                ))
                .collect(Collectors.toList());

        return new DashboardStats(
                myJobs.size(),
                allApplications.size(),
                statusCounts,
                applicantsPerJob
        );
    }
}