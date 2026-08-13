package com.civic.dto; import com.civic.entity.Role;
public record UserResponse(Long id,String name,String email,Role role,String location,String department,String designation,boolean verified,boolean active) {}
