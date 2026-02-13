package com.example.system_erp.clients.repositories;

import com.example.system_erp.clients.models.ClientAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientAuditRepository extends JpaRepository<ClientAudit, Long> {
}
