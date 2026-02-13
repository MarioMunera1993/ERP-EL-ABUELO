package com.example.system_erp.suppliers.controllers;

import com.example.system_erp.suppliers.models.Supplier;
import com.example.system_erp.suppliers.models.SupplierAudit;
import com.example.system_erp.suppliers.repositories.SupplierAuditRepository;
import com.example.system_erp.suppliers.repositories.SupplierRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private SupplierAuditRepository supplierAuditRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private void saveAudit(Long supplierId, String action, Object oldData, Object newData) {
        try {
            String oldDataJson = oldData != null ? objectMapper.writeValueAsString(oldData) : null;
            String newDataJson = newData != null ? objectMapper.writeValueAsString(newData) : null;
            supplierAuditRepository
                    .save(new SupplierAudit(supplierId, action, oldDataJson, newDataJson, getCurrentUsername()));
        } catch (Exception e) {
            System.err.println("Error saving supplier audit: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        supplier.setModifiedBy(getCurrentUsername());
        Supplier savedSupplier = supplierRepository.save(supplier);
        saveAudit(savedSupplier.getId(), "CREATE", null, savedSupplier);
        return savedSupplier;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        return supplierRepository.findById(id).map(supplier -> {
            Supplier oldSupplier = new Supplier();
            oldSupplier.setCompanyName(supplier.getCompanyName());
            oldSupplier.setDocumentType(supplier.getDocumentType());
            oldSupplier.setTaxId(supplier.getTaxId());
            oldSupplier.setContactName(supplier.getContactName());
            oldSupplier.setEmail(supplier.getEmail());
            oldSupplier.setPhone(supplier.getPhone());
            oldSupplier.setAddress(supplier.getAddress());

            supplier.setCompanyName(supplierDetails.getCompanyName());
            supplier.setDocumentType(supplierDetails.getDocumentType());
            supplier.setTaxId(supplierDetails.getTaxId());
            supplier.setContactName(supplierDetails.getContactName());
            supplier.setEmail(supplierDetails.getEmail());
            supplier.setPhone(supplierDetails.getPhone());
            supplier.setAddress(supplierDetails.getAddress());
            supplier.setModifiedBy(getCurrentUsername());
            supplier.setUpdatedAt(java.time.LocalDateTime.now());

            Supplier updatedSupplier = supplierRepository.save(supplier);
            saveAudit(updatedSupplier.getId(), "UPDATE", oldSupplier, updatedSupplier);
            return ResponseEntity.ok(updatedSupplier);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        return supplierRepository.findById(id).map(supplier -> {
            saveAudit(supplier.getId(), "DELETE", supplier, null);
            supplierRepository.delete(supplier);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
