package com.jobportal.service;

import com.jobportal.dto.UpdateProfileRequest;
import com.jobportal.dto.UserResponse;
import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getMyProfile() {
        User user = currentUser();
        return toResponse(user);
    }

    public UserResponse updateMyProfile(UpdateProfileRequest request) {
        User user = currentUser();
        user.setName(request.getName());
        userRepository.save(user);
        return toResponse(user);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}