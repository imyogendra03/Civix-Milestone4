package com.civic.controller;

import com.civic.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SignatureController {

    private final SignatureService signatureService;

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{petitionId}")
    public String signPetition(
            @PathVariable Long petitionId
    ) {

        signatureService.signPetition(petitionId);

        return "Petition signed successfully.";

    }

}
