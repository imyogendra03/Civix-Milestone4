package com.civic.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}