package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.dto.JobResponse;
import com.jobportal.entity.Job;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobService jobService;

    private void mockLoggedInUser(String email) {
        Authentication auth = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(auth);
        when(auth.getName()).thenReturn(email);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getJobById_ShouldReturnJob_WhenJobExists() {
        User recruiter = User.builder().id(1L).email("recruiter@test.com").role(Role.RECRUITER).build();
        Job job = Job.builder()
                .id(1L).title("Backend Developer").company("TechCorp")
                .postedBy(recruiter).build();

        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        JobResponse response = jobService.getJobById(1L);

        assertEquals("Backend Developer", response.getTitle());
        assertEquals("TechCorp", response.getCompany());
    }

    @Test
    void getJobById_ShouldThrowException_WhenJobNotFound() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobService.getJobById(99L));
    }

    @Test
    void deleteJob_ShouldThrowUnauthorized_WhenNotJobOwner() {
        mockLoggedInUser("otherrecruiter@test.com");

        User actualOwner = User.builder().id(1L).email("owner@test.com").role(Role.RECRUITER).build();
        Job job = Job.builder().id(1L).title("Backend Developer").postedBy(actualOwner).build();

        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        assertThrows(UnauthorizedException.class, () -> jobService.deleteJob(1L));
        verify(jobRepository, never()).delete(any(Job.class));
    }

    @Test
    void deleteJob_ShouldSucceed_WhenUserIsOwner() {
        mockLoggedInUser("owner@test.com");

        User owner = User.builder().id(1L).email("owner@test.com").role(Role.RECRUITER).build();
        Job job = Job.builder().id(1L).title("Backend Developer").postedBy(owner).build();

        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        jobService.deleteJob(1L);

        verify(jobRepository, times(1)).delete(job);
    }
}