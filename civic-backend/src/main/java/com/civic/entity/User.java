package com.civic.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,length=100) private String name;
 @Column(nullable=false,unique=true,length=150) private String email;
 @Column(nullable=false) private String password;
 @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
 @Column(nullable=false,length=100) private String location;
 @Column(length=120) private String department;
 @Column(length=120) private String designation;
 @Column(nullable=false) @Builder.Default private boolean verified=false;
 @Column(nullable=false) @Builder.Default private boolean active=true;
 @PrePersist public void defaults(){ if(role==Role.CITIZEN){verified=true;} }
}
