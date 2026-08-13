package com.civic.repository; import com.civic.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface UserRepository extends JpaRepository<User,Long>{Optional<User> findByEmail(String email); boolean existsByEmail(String email); List<User> findByRoleOrderByIdDesc(Role role); List<User> findByRoleAndVerifiedFalseOrderByIdDesc(Role role);}
