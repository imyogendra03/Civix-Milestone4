package com.civic.dto; import com.civic.enums.PetitionStatus; import lombok.*; import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class PetitionOfficialResponse {Long id,petitionId,officialId;String officialName,officialEmail,comment;PetitionStatus status;LocalDateTime createdAt;}
