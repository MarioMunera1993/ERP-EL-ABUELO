package com.example.system_erp.suppliers.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "supplier_audit")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "supplier_id")
    private Long supplierId;

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

    public SupplierAudit(Long supplierId, String action, String oldData, String newData, String modifiedBy) {
        this.supplierId = supplierId;
        this.action = action;
        this.oldData = oldData;
        this.newData = newData;
        this.modifiedBy = modifiedBy;
    }
}
