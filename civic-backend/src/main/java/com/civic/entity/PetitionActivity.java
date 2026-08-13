package com.civic.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Table(name="petition_activities") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PetitionActivity { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="petition_id",nullable=false) private Petition petition; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="official_id") private User official; @Column(nullable=false,length=80) private String action; @Column(columnDefinition="TEXT") private String description; @Column(nullable=false) private LocalDateTime createdAt; @PrePersist public void onCreate(){createdAt=LocalDateTime.now();} }
