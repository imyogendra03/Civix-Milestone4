package com.civic.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetitionRequest {

    private String title;

    private String description;

    private String category;

    private String location;

    private String department;

    private Integer goal;

    private Integer targetSignatures;
}