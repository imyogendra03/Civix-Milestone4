package com.civic.service; import com.civic.dto.*; import com.civic.enums.PollStatus; import java.util.*;
public interface PollService {PollResponse createPoll(PollRequest r);PollResponse updatePoll(Long id,PollRequest r);
    void deletePoll(Long id);PollResponse getPollById(Long id);List<PollResponse> getAllPolls();List<PollResponse> getMyPolls();List<PollResponse> getPollsByStatus(PollStatus s);PollResultResponse getPollResults(Long id);PollDashboardStatsResponse getDashboardStats();}
