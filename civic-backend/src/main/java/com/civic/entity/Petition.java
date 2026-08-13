package com.civic.entity;

import com.civic.enums.PetitionStatus;

import jakarta.persistence.*;

import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "petitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Petition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false, length = 200)
    private String title;


    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;


    @Column(nullable = false, length = 100)
    private String category;


    @Column(nullable = false, length = 150)
    private String location;


    @Column(length = 120)
    private String department;


    /*
     * Java property = goal
     * Database column = target_signatures
     */
    @Column(
        name = "target_signatures",
        nullable = false
    )
    private Integer goal;


    @Column(nullable = false)
    @Builder.Default
    private Integer currentSignatures = 0;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PetitionStatus status =
            PetitionStatus.ACTIVE;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "creator_id",
        nullable = false
    )
    private User creator;


    @Column(columnDefinition = "TEXT")
    private String rejectionReason;


    @Column(columnDefinition = "TEXT")
    private String proposedSolution;


    @Column(columnDefinition = "TEXT")
    private String actionPlan;


    @Column(length = 120)
    private String responsiblePerson;


    @Column(length = 120)
    private String responsibleDesignation;


    @Column(length = 120)
    private String responsibleDepartment;


    private LocalDateTime workStartAt;

    private LocalDateTime expectedCompletionAt;

    private LocalDateTime completedAt;


    @Column(columnDefinition = "TEXT")
    private String completedWork;


    @Column(columnDefinition = "TEXT")
    private String pendingWork;


    @Column(columnDefinition = "TEXT")
    private String pendingReason;


    private Integer progressPercent;


    @Column(
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    @Column(nullable = false)
    private LocalDateTime updatedAt;


    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();

        if (currentSignatures == null) {
            currentSignatures = 0;
        }

        if (status == null) {
            status = PetitionStatus.ACTIVE;
        }

        if (progressPercent == null) {
            progressPercent = 0;
        }
    }


    @PreUpdate
    public void onUpdate() {

        updatedAt = LocalDateTime.now();

    }

}