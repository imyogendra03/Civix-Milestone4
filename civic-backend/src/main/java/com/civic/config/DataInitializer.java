package com.civic.config;
import com.civic.entity.*; import com.civic.repository.*; import org.springframework.boot.CommandLineRunner; import org.springframework.context.annotation.Bean; import org.springframework.context.annotation.Configuration; import org.springframework.security.crypto.password.PasswordEncoder; import java.util.List;
@Configuration public class DataInitializer {
 @Bean CommandLineRunner init(UserRepository users,DepartmentRepository deps,PasswordEncoder encoder){return args->{
  if(!deps.existsByNameIgnoreCase("Infrastructure")) deps.saveAll(List.of(Department.builder().name("Infrastructure").build(),Department.builder().name("Education").build(),Department.builder().name("Healthcare").build(),Department.builder().name("Public Safety").build(),Department.builder().name("Environment").build(),Department.builder().name("Transportation").build(),Department.builder().name("Housing").build()));
  if(!users.existsByEmail("superadmin@civix.com")){users.save(User.builder().name("CIVIX Super Admin").email("superadmin@civix.com").password(encoder.encode("Civix@Admin123")).role(Role.SUPER_ADMIN).location("System").designation("Super Administrator").verified(true).active(true).build());}
 };}
}
