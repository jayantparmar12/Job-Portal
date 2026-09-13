package com.jobportal.repository;

import com.jobportal.entity.SavedJob;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByCandidate(User candidate);
    Optional<SavedJob> findByCandidateAndJobId(User candidate, Long jobId);
    boolean existsByCandidateAndJobId(User candidate, Long jobId);
}