package com.example.system_erp.clients.controllers;

import com.example.system_erp.clients.models.Client;
import com.example.system_erp.clients.models.ClientAudit;
import com.example.system_erp.clients.repositories.ClientAuditRepository;
import com.example.system_erp.clients.repositories.ClientRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "*")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientAuditRepository clientAuditRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String getCurrentUsername() {
        try {
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                return SecurityContextHolder.getContext().getAuthentication().getName();
            }
        } catch (Exception e) {}
        return "SYSTEM";
    }

    private void saveAudit(Long clientId, String action, Object oldData, Object newData) {
        try {
            if (clientId == null) return;
            String oldDataJson = oldData != null ? objectMapper.writeValueAsString(oldData) : null;
            String newDataJson = newData != null ? objectMapper.writeValueAsString(newData) : null;
            String username = "SYSTEM";
            try {
                if (SecurityContextHolder.getContext().getAuthentication() != null) {
                    username = SecurityContextHolder.getContext().getAuthentication().getName();
                }
            } catch (Exception e) {}
            
            clientAuditRepository.save(new ClientAudit(clientId, action, oldDataJson, newDataJson, username));
        } catch (Exception e) {
            System.err.println("Error saving audit: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public Client createClient(@RequestBody Client client) {
        client.setModifiedBy(getCurrentUsername());
        Client savedClient = clientRepository.save(client);
        saveAudit(savedClient.getId(), "CREATE", null, savedClient);
        return savedClient;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client clientDetails) {
        return clientRepository.findById(id).map(client -> {
            Client oldClient = new Client(); // Simplified copy for audit
            oldClient.setFullName(client.getFullName());
            oldClient.setTaxId(client.getTaxId());
            oldClient.setDocumentType(client.getDocumentType());
            oldClient.setEmail(client.getEmail());
            oldClient.setPhone(client.getPhone());
            oldClient.setAddress(client.getAddress());

            client.setFullName(clientDetails.getFullName());
            client.setTaxId(clientDetails.getTaxId());
            client.setDocumentType(clientDetails.getDocumentType());
            client.setEmail(clientDetails.getEmail());
            client.setPhone(clientDetails.getPhone());
            client.setAddress(clientDetails.getAddress());
            client.setModifiedBy(getCurrentUsername());
            client.setUpdatedAt(java.time.LocalDateTime.now());

            Client updatedClient = clientRepository.save(client);
            saveAudit(updatedClient.getId(), "UPDATE", oldClient, updatedClient);
            return ResponseEntity.ok(updatedClient);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        return clientRepository.findById(id).map(client -> {
            saveAudit(client.getId(), "DELETE", client, null);
            clientRepository.delete(client);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
