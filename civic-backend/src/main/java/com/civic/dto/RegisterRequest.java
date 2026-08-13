package com.civic.dto; import com.civic.entity.Role; import jakarta.validation.constraints.*;
public record RegisterRequest(@NotBlank String name,@NotBlank @Email String email,@NotBlank @Size(min=8) String password,@NotNull Role role,@NotBlank String location,String department,String designation) {}
