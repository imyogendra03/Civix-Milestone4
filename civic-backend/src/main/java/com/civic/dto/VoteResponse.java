package com.civic.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoteResponse {

    private String message;

    private String selectedOption;

    private LocalDateTime votedAt;

    private LocalDateTime closeDate;
}