package com.civic.repository;

import com.civic.entity.Poll;
import com.civic.entity.User;
import com.civic.enums.PollStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

    List<Poll> findByStatus(PollStatus status);

    List<Poll> findByCreatedBy(User user);

    List<Poll> findByTargetLocation(String targetLocation);

    List<Poll> findByStatusAndTargetLocation(
            PollStatus status,
            String targetLocation
    );
}