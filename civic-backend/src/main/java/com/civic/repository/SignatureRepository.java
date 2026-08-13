package com.civic.repository;

import com.civic.entity.Petition;
import com.civic.entity.Signature;
import com.civic.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignatureRepository
        extends JpaRepository<Signature, Long> {

    boolean existsByPetitionAndUser(
            Petition petition,
            User user
    );

    long countByPetition(
            Petition petition
    );

    void deleteByPetition(
            Petition petition
    );

}
