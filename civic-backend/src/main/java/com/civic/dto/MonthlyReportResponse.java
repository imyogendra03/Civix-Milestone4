package com.civic.dto; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class MonthlyReportResponse { int year,month; String monthName; long totalPetitions,totalSignatures,totalPolls,totalVotes,activeEngagement,activePetitions,underReviewPetitions,approvedPetitions,rejectedPetitions,closedPetitions,activePolls,closedPolls; }
