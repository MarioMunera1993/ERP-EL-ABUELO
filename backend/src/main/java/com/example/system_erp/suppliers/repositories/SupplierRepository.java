package com.example.system_erp.suppliers.repositories;

import com.example.system_erp.suppliers.models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByTaxId(String taxId);
}
