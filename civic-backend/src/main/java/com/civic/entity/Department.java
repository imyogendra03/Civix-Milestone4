package com.civic.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Table(name="departments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false,unique=true,length=120) private String name; @Column(nullable=false) @Builder.Default private boolean active=true; }
