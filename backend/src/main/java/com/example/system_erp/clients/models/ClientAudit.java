package com.example.system_erp.clients.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "client_audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "action")
    private String action; // CREATE, UPDATE, DELETE

    @Column(name = "old_data", columnDefinition = "TEXT")
    private String oldData;

    @Column(name = "new_data", columnDefinition = "TEXT")
    private String newData;

    @Column(name = "modified_by")
    private String modifiedBy;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt = LocalDateTime.now();

    public ClientAudit(Long clientId, String action, String oldData, String newData, String modifiedBy) {
        this.clientId = clientId;
        this.action = action;
        this.oldData = oldData;
        this.newData = newData;
        this.modifiedBy = modifiedBy;
    }
}
