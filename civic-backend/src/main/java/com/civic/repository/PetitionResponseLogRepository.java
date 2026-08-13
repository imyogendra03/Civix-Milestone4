package com.civic.repository; import com.civic.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PetitionResponseLogRepository extends JpaRepository<PetitionResponseLog,Long>{List<PetitionResponseLog> findByPetitionOrderByCreatedAtAsc(Petition petition);}
