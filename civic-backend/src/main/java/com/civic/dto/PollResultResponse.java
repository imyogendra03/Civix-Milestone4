package com.civic.dto;

import com.civic.enums.PollStatus;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollResultResponse {

    private Long pollId;

    private String title;

    private PollStatus status;

    private long totalVotes;

    private List<OptionResult> results;
}