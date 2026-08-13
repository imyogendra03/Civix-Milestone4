package com.civic.dto; import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder public class OfficialAdminRequest { private boolean approved; private boolean active; private String department; private String designation; }
