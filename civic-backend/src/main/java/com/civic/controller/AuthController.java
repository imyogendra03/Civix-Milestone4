package com.civic.controller;
import com.civic.dto.*; import com.civic.service.AuthService; import jakarta.validation.Valid; import lombok.RequiredArgsConstructor; import org.springframework.http.*; import org.springframework.security.core.Authentication; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor public class AuthController { private final AuthService auth;
 @PostMapping("/register") public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(auth.register(r));}
 @PostMapping("/login") public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest r){return ResponseEntity.ok(auth.login(r));}
 @GetMapping("/me") public UserResponse me(Authentication a){return auth.getCurrentUserByEmail(a.getName());}
 @PutMapping("/profile") public UserResponse profile(Authentication a,@Valid @RequestBody ProfileUpdateRequest r){return auth.updateProfile(a.getName(),r);}
 @PutMapping("/password") public ResponseEntity<Void> password(Authentication a,@Valid @RequestBody ChangePasswordRequest r){auth.changePassword(a.getName(),r);return ResponseEntity.noContent().build();}
}
