package com.civic.dto;

import com.civic.enums.PetitionStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PetitionStatusRequest {

    private PetitionStatus status;

}