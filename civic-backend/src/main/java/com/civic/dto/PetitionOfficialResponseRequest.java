package com.civic.dto; import com.civic.enums.PetitionStatus; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class PetitionOfficialResponseRequest { private String comment; private PetitionStatus status; }
