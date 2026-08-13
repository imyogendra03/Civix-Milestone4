package com.civic.repository; import com.civic.entity.Department; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface DepartmentRepository extends JpaRepository<Department,Long>{Optional<Department> findByNameIgnoreCase(String name); boolean existsByNameIgnoreCase(String name); List<Department> findByActiveTrueOrderByNameAsc();}
