package com.example.system_erp.suppliers.repositories;

import com.example.system_erp.suppliers.models.SupplierAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierAuditRepository extends JpaRepository<SupplierAudit, Long> {
}
