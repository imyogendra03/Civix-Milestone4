package com.civic.service;

import com.civic.dto.VoteRequest;
import com.civic.dto.VoteResponse;

public interface VoteService {

    VoteResponse castVote(Long pollId, VoteRequest request);

}