package com.civic.service.impl;

import com.civic.entity.Petition;
import com.civic.entity.Signature;
import com.civic.entity.User;
import com.civic.repository.PetitionRepository;
import com.civic.repository.SignatureRepository;
import com.civic.repository.UserRepository;
import com.civic.service.SignatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SignatureServiceImpl implements SignatureService {

    private final SignatureRepository signatureRepository;
    private final PetitionRepository petitionRepository;
    private final UserRepository userRepository;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    @Override
    public void signPetition(Long petitionId) {

        User user = getLoggedInUser();

        Petition petition = petitionRepository.findById(petitionId)
                .orElseThrow(() ->
                        new RuntimeException("Petition not found"));

        if (petition.getStatus() == com.civic.enums.PetitionStatus.CLOSED) {
            throw new RuntimeException("Closed petition is no longer accepting signatures.");
        }

        if (signatureRepository.existsByPetitionAndUser(petition, user)) {

            throw new RuntimeException(
                    "You have already signed this petition."
            );

        }

        Signature signature = Signature.builder()
                .petition(petition)
                .user(user)
                .build();

        signatureRepository.save(signature);

        petition.setCurrentSignatures(
                petition.getCurrentSignatures() + 1
        );

        petitionRepository.save(petition);
    }

}