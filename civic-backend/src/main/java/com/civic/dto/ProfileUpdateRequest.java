package com.civic.dto; import jakarta.validation.constraints.*; public record ProfileUpdateRequest(@NotBlank String name,@NotBlank @Email String email,@NotBlank String location) {}
