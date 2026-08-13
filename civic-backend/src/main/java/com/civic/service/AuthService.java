package com.civic.service;
import com.civic.dto.*; import com.civic.entity.*; import com.civic.repository.UserRepository; import com.civic.security.JwtService; import org.springframework.security.crypto.password.PasswordEncoder; import org.springframework.stereotype.Service;
@Service public class AuthService {
 private final UserRepository repo; private final PasswordEncoder encoder; private final JwtService jwt;
 public AuthService(UserRepository repo,PasswordEncoder encoder,JwtService jwt){this.repo=repo;this.encoder=encoder;this.jwt=jwt;}
 public UserResponse register(RegisterRequest r){
  String email=r.email().toLowerCase().trim(); if(repo.existsByEmail(email)) throw new RuntimeException("Email already registered");
  if(r.role()==Role.SUPER_ADMIN) throw new RuntimeException("Super Admin accounts cannot be registered publicly");
  User u=User.builder().name(r.name().trim()).email(email).password(encoder.encode(r.password())).role(r.role()).location(r.location().trim()).department(r.role()==Role.OFFICIAL?null:r.department()).designation(r.designation()).verified(r.role()==Role.CITIZEN).active(true).build();
  return map(repo.save(u));
 }
 public AuthResponse login(LoginRequest r){User u=repo.findByEmail(r.email().toLowerCase().trim()).orElseThrow(()->new RuntimeException("Invalid email or password")); if(!encoder.matches(r.password(),u.getPassword())) throw new RuntimeException("Invalid email or password"); if(!u.isActive()) throw new RuntimeException("Account is inactive"); if(u.getRole()==Role.OFFICIAL&&!u.isVerified()) throw new RuntimeException("Official account is pending Super Admin verification"); return new AuthResponse(jwt.generateToken(u),map(u));}
 public UserResponse getCurrentUserByEmail(String email){return map(repo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found")));}
 public User getEntity(String email){return repo.findByEmail(email).orElseThrow(()->new RuntimeException("User not found"));}
 public void changePassword(String email,ChangePasswordRequest r){if(!r.newPassword().equals(r.confirmPassword())) throw new RuntimeException("New password confirmation does not match"); User u=getEntity(email); if(!encoder.matches(r.currentPassword(),u.getPassword())) throw new RuntimeException("Current password is incorrect"); u.setPassword(encoder.encode(r.newPassword())); repo.save(u);}
 public UserResponse updateProfile(String email,ProfileUpdateRequest r){User u=getEntity(email); String newEmail=r.email().toLowerCase().trim(); if(!newEmail.equals(u.getEmail())&&repo.existsByEmail(newEmail)) throw new RuntimeException("Email already registered"); u.setName(r.name().trim());u.setEmail(newEmail);u.setLocation(r.location().trim());return map(repo.save(u));}
 private UserResponse map(User u){return new UserResponse(u.getId(),u.getName(),u.getEmail(),u.getRole(),u.getLocation(),u.getDepartment(),u.getDesignation(),u.isVerified(),u.isActive());}
}
