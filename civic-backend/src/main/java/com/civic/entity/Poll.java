package com.civic.entity;
import com.civic.enums.PollStatus; import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime; import java.util.List;
@Entity @Table(name="polls") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Poll {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String title; @Column(columnDefinition="TEXT") private String description;
 @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="poll_options",joinColumns=@JoinColumn(name="poll_id")) @Column(name="option_value") private List<String> options;
 @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private PollStatus status=PollStatus.ACTIVE;
 @Column(nullable=false) private String targetLocation; @Column(length=120) private String department;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="created_by",nullable=false) private User createdBy;
 @Column(nullable=false,updatable=false) private LocalDateTime createdAt; private LocalDateTime updatedAt; @Column(nullable=false) private LocalDateTime closeDate;
 @PrePersist public void onCreate(){createdAt=LocalDateTime.now();if(status==null)status=PollStatus.ACTIVE;}
 @PreUpdate public void onUpdate(){updatedAt=LocalDateTime.now();}
}
