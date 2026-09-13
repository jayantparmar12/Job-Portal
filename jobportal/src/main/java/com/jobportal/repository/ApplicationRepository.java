package com.jobportal.repository;

import com.jobportal.entity.Application;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(User candidate);
    List<Application> findByJobId(Long jobId);

    @Query("SELECT a FROM Application a WHERE a.job.postedBy = :recruiter")
    List<Application> findByJobPostedBy(@Param("recruiter") User recruiter);
}