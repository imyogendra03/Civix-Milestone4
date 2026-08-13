package com.civic.dto; import lombok.*; import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class ReviewResponse { Long id; Long petitionId; String citizenName; Integer rating; String description; LocalDateTime createdAt; }
