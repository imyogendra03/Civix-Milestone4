package com.civic.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    Long id;
    String action;
    String description;
    String officialName;
    String designation;
    String department;
    LocalDateTime createdAt;
}
