package com.civic.service;

import com.civic.dto.*;
import com.civic.enums.PetitionStatus;
import org.springframework.data.domain.Page;
import java.util.List;

public interface PetitionService {
    PetitionResponse createPetition(PetitionRequest r);

    PetitionResponse getPetitionById(Long id);

    Page<PetitionResponse> getAllPetitions(int page, int size, String category, PetitionStatus status);

    Page<PetitionResponse> getMyPetitions(int page, int size);

    PetitionResponse updatePetition(Long id, PetitionRequest r);

    void deletePetition(Long id);

    PetitionResponse updateDecision(Long id, OfficialDecisionRequest r);

    PetitionResponse updateProgress(Long id, ProgressUpdateRequest r);

    PetitionResponse complete(Long id);

    PetitionResponse close(Long id);
    List<ActivityResponse> getTimeline(Long id);
}
