package com.civic.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionResult {

    private String option;

    private long votes;

    private double percentage;
}