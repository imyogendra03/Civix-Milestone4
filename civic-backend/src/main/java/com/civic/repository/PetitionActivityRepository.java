package com.civic.repository; import com.civic.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PetitionActivityRepository extends JpaRepository<PetitionActivity,Long>{List<PetitionActivity> findByPetitionOrderByCreatedAtAsc(Petition petition);}
