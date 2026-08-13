package com.civic.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollDashboardStatsResponse {

    private long totalPolls;

    private long totalVotes;

    private long activePolls;

    private long closedPolls;
}
