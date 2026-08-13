package com.civic.service.impl;

import com.civic.dto.*;
import com.civic.entity.*;
import com.civic.enums.PollStatus;
import com.civic.repository.*;
import com.civic.service.PollService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PollServiceImpl implements PollService {
    private final PollRepository polls;
    private final UserRepository users;
    private final VoteRepository votes;

    private User me() {
        return users.findByEmail(org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void access(Poll p, User u) {
        if (u.getRole() == Role.SUPER_ADMIN)
            return;
        if (u.getRole() == Role.OFFICIAL) {
            if (!u.isVerified() || !u.isActive())
                throw new RuntimeException("Official account is not verified");
            if (u.getDepartment() == null || p.getDepartment() == null
                    || !u.getDepartment().equalsIgnoreCase(p.getDepartment()))
                throw new RuntimeException("You are not authorized for this department");
        }
    }

    private void expire(Poll p) {
        if (p.getStatus() == PollStatus.ACTIVE && LocalDateTime.now().isAfter(p.getCloseDate())) {
            p.setStatus(PollStatus.CLOSED);
            polls.save(p);
        }
    }

    private PollResponse map(Poll p) {
        expire(p);
        return PollResponse.builder().id(p.getId()).title(p.getTitle()).description(p.getDescription())
                .options(p.getOptions()).status(p.getStatus()).targetLocation(p.getTargetLocation())
                .department(p.getDepartment()).createdById(p.getCreatedBy().getId())
                .createdByName(p.getCreatedBy().getName()).closeDate(p.getCloseDate()).totalVotes(votes.countByPoll(p))
                .votedByCurrentUser(votes.existsByPollAndUser(p, me()))
                .createdByCurrentUser(p.getCreatedBy().getId().equals(me().getId())).createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt()).build();
    }

    public PollResponse createPoll(PollRequest r) {
        User u = me();
        if (u.getRole() != Role.CITIZEN)
            throw new RuntimeException("Only citizens can create polls");
        if (r.getOptions().size() < 2)
            throw new RuntimeException("Minimum 2 options required");
        return map(polls.save(Poll.builder().title(r.getTitle()).description(r.getDescription()).options(r.getOptions())
                .targetLocation(r.getTargetLocation()).department(r.getDepartment()).closeDate(r.getCloseDate())
                .createdBy(u).build()));
    }

    public PollResponse updatePoll(Long id, PollRequest r) {
        User u = me();
        Poll p = polls.findById(id).orElseThrow(() -> new RuntimeException("Poll not found"));
        if (!p.getCreatedBy().getId().equals(u.getId()))
            throw new RuntimeException("You can only update your own poll");
        if (p.getStatus() == PollStatus.CLOSED)
            throw new RuntimeException("Closed poll cannot be updated");
        p.setTitle(r.getTitle());
        p.setDescription(r.getDescription());
        p.setOptions(r.getOptions());
        p.setTargetLocation(r.getTargetLocation());
        p.setDepartment(r.getDepartment());
        p.setCloseDate(r.getCloseDate());
        return map(polls.save(p));
    }

    public void deletePoll(Long id) {
        User u = me();
        Poll p = polls.findById(id).orElseThrow(() -> new RuntimeException("Poll not found"));
        if (!p.getCreatedBy().getId().equals(u.getId()))
            throw new RuntimeException("You can only delete your own poll");
        polls.delete(p);
    }

    public PollResponse getPollById(Long id) {
        Poll p = polls.findById(id).orElseThrow(() -> new RuntimeException("Poll not found"));
        access(p, me());
        return map(p);
    }

    public List<PollResponse> getAllPolls() {
        User u = me();
        return polls
                .findAll().stream().filter(p -> u.getRole() != Role.OFFICIAL || (p.getDepartment() != null
                        && u.getDepartment() != null && p.getDepartment().equalsIgnoreCase(u.getDepartment())))
                .map(this::map).toList();
    }

    public List<PollResponse> getMyPolls() {
        User u = me();
        return polls.findByCreatedBy(u).stream().map(this::map).toList();
    }

    public List<PollResponse> getPollsByStatus(PollStatus s) {
        return getAllPolls().stream().filter(p -> p.getStatus() == s).toList();
    }

    public PollResultResponse getPollResults(Long id) {
        Poll p = polls.findById(id).orElseThrow(() -> new RuntimeException("Poll not found"));
        access(p, me());
        long total = votes.countByPoll(p);
        List<OptionResult> rs = p.getOptions().stream().map(o -> {
            long n = votes.countByPollAndSelectedOption(p, o);
            return OptionResult.builder().option(o).votes(n)
                    .percentage(total == 0 ? 0 : Math.round(n * 10000.0 / total) / 100.0).build();
        }).toList();
        return PollResultResponse.builder().pollId(id).title(p.getTitle()).status(p.getStatus()).totalVotes(total)
                .results(rs).build();
    }

    public PollDashboardStatsResponse getDashboardStats() {
        List<PollResponse> ps = getAllPolls();
        return PollDashboardStatsResponse.builder().totalPolls(ps.size())
                .totalVotes(ps.stream().mapToLong(PollResponse::getTotalVotes).sum())
                .activePolls(ps.stream().filter(p -> p.getStatus() == PollStatus.ACTIVE).count())
                .closedPolls(ps.stream().filter(p -> p.getStatus() == PollStatus.CLOSED).count()).build();
    }

}
