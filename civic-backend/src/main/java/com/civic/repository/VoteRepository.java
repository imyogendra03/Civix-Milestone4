package com.civic.repository;

import com.civic.entity.Poll;
import com.civic.entity.User;
import com.civic.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {

    boolean existsByPollAndUser(Poll poll, User user);

    List<Vote> findByPoll(Poll poll);

    long countByPoll(Poll poll);

    long countByPollAndSelectedOption(
            Poll poll,
            String selectedOption
    );
}