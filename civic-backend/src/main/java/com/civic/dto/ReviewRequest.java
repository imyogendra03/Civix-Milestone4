package com.civic.dto; import jakarta.validation.constraints.*; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class ReviewRequest { @Min(1) @Max(5) private Integer rating; @NotBlank private String description; }
