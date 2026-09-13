package com.jobportal.service;

import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.entity.Role;
import com.jobportal.entity.User;
import com.jobportal.exception.DuplicateResourceException;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldCreateUser_WhenEmailNotTaken() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Jayant");
        request.setEmail("jayant@test.com");
        request.setPassword("password123");
        request.setRole(Role.CANDIDATE);

        when(userRepository.existsByEmail("jayant@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(jwtUtil.generateToken(anyString(), anyString())).thenReturn("fake-jwt-token");

        User savedUser = User.builder()
                .id(1L).name("Jayant").email("jayant@test.com")
                .password("encodedPassword").role(Role.CANDIDATE)
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        com.jobportal.entity.RefreshToken fakeRefreshToken = com.jobportal.entity.RefreshToken.builder()
                .token("fake-refresh-token").build();
        when(refreshTokenService.createRefreshToken(anyString())).thenReturn(fakeRefreshToken);

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("CANDIDATE", response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists() {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@test.com");
        request.setPassword("password123");
        request.setName("Test");
        request.setRole(Role.CANDIDATE);

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        // Act & Assert
        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }
}