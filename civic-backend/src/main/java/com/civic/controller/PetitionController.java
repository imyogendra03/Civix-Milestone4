package com.civic.controller;

import com.civic.dto.*;
import com.civic.enums.PetitionStatus;
import com.civic.service.PetitionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/petitions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PetitionController {

    private final PetitionService s;


    // ============================================================
    // CREATE PETITION
    // ============================================================

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public PetitionResponse create(
            @Valid @RequestBody PetitionRequest r) {

        return s.createPetition(r);
    }


    // ============================================================
    // GET ALL PETITIONS
    // ============================================================

    @GetMapping
    public Page<PetitionResponse> all(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) PetitionStatus status) {

        return s.getAllPetitions(
                page,
                size,
                category,
                status
        );
    }


    // ============================================================
    // OFFICIAL LOCAL PETITIONS
    // ============================================================

    @GetMapping("/official/local")
    @PreAuthorize("hasRole('OFFICIAL')")
    public Page<PetitionResponse> local(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) PetitionStatus status) {

        return s.getAllPetitions(
                page,
                size,
                null,
                status
        );
    }


    // ============================================================
    // MY PETITIONS
    // ============================================================

    @GetMapping("/my")
    @PreAuthorize("hasRole('CITIZEN')")
    public Page<PetitionResponse> my(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return s.getMyPetitions(page, size);
    }


    // ============================================================
    // GET PETITION BY ID
    // ============================================================

    @GetMapping("/{id}")
    public PetitionResponse one(
            @PathVariable Long id) {

        return s.getPetitionById(id);
    }


    // ============================================================
    // ⭐ PETITION TIMELINE
    // ============================================================

    // @GetMapping("/{id}/timeline")
    // public List<ActivityResponse> timeline(
    //         @PathVariable Long id) {

    //     return s.getTimeline(id);
    // }


    // ============================================================
    // UPDATE PETITION
    // ============================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN')")
    public PetitionResponse update(
            @PathVariable Long id,
            @Valid @RequestBody PetitionRequest r) {

        return s.updatePetition(id, r);
    }


    // ============================================================
    // DELETE PETITION
    // ============================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN')")
    public void delete(
            @PathVariable Long id) {

        s.deletePetition(id);
    }


    // ============================================================
    // UPDATE STATUS
    // ============================================================

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OFFICIAL')")
    public PetitionResponse status(
            @PathVariable Long id,
            @RequestBody PetitionStatusRequest r) {

        return s.updateDecision(
                id,
                OfficialDecisionRequest
                        .builder()
                        .status(r.getStatus())
                        .comment("Status updated")
                        .build()
        );
    }


    // ============================================================
    // OFFICIAL DECISION
    // ============================================================

    @PutMapping("/{id}/decision")
    @PreAuthorize("hasRole('OFFICIAL')")
    public PetitionResponse decision(
            @PathVariable Long id,
            @Valid @RequestBody OfficialDecisionRequest r) {

        return s.updateDecision(id, r);
    }


    // ============================================================
    // UPDATE PROGRESS
    // ============================================================

    @PutMapping("/{id}/progress")
    @PreAuthorize("hasRole('OFFICIAL')")
    public PetitionResponse progress(
            @PathVariable Long id,
            @RequestBody ProgressUpdateRequest r) {

        return s.updateProgress(id, r);
    }


    // ============================================================
    // COMPLETE WORK
    // ============================================================

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('OFFICIAL')")
    public PetitionResponse complete(
            @PathVariable Long id) {

        return s.complete(id);
    }


    // ============================================================
    // CLOSE PETITION
    // ============================================================

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('OFFICIAL')")
    public PetitionResponse close(
            @PathVariable Long id) {

        return s.close(id);
    }
}