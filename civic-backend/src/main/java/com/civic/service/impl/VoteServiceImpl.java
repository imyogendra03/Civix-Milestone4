package com.civic.service.impl;

import com.civic.dto.VoteRequest;
import com.civic.dto.VoteResponse;
import com.civic.entity.Poll;
import com.civic.entity.User;
import com.civic.entity.Vote;
import com.civic.enums.PollStatus;
import com.civic.repository.PollRepository;
import com.civic.repository.UserRepository;
import com.civic.repository.VoteRepository;
import com.civic.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class VoteServiceImpl implements VoteService {

    private final VoteRepository voteRepository;
    private final PollRepository pollRepository;
    private final UserRepository userRepository;

    @Override
    public VoteResponse castVote(Long pollId, VoteRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        // Poll should be active
        if (LocalDateTime.now().isAfter(poll.getCloseDate())) {

    if (poll.getStatus() != PollStatus.CLOSED) {
        poll.setStatus(PollStatus.CLOSED);
        pollRepository.save(poll);
    }

    throw new RuntimeException("Poll has expired.");
}

        // Cannot vote on own poll
        if (poll.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot vote on your own poll.");
        }

        // Already voted
        if (voteRepository.existsByPollAndUser(poll, currentUser)) {
            throw new RuntimeException("You have already voted.");
        }

        // Validate option
        if (!poll.getOptions().contains(request.getSelectedOption())) {
            throw new RuntimeException("Invalid poll option.");
        }

        Vote vote = Vote.builder()
                .poll(poll)
                .user(currentUser)
                .selectedOption(request.getSelectedOption())
                .build();

        Vote savedVote = voteRepository.save(vote);

        return VoteResponse.builder()
                .message("Vote submitted successfully.")
                .selectedOption(savedVote.getSelectedOption())
                .votedAt(savedVote.getVotedAt())
                .build();
    }
    
}