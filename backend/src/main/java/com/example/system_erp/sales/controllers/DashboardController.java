package com.example.system_erp.sales.controllers;

import com.example.system_erp.sales.dto.DashboardDTO;
import com.example.system_erp.sales.models.Sale;
import com.example.system_erp.sales.repositories.SaleRepository;
import com.example.system_erp.products.repositories.ProductRepository;
import com.example.system_erp.clients.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public DashboardDTO getDashboardStats() {
        DashboardDTO dto = new DashboardDTO();

        List<Sale> allSales = saleRepository.findAll();

        // Ventas Totales
        dto.setTotalSales(allSales.stream()
                .map(Sale::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        // Conteos Básicos
        dto.setTotalProducts(productRepository.count());
        dto.setTotalClients(clientRepository.count());

        // Stock Bajo (stock <= stockMin)
        dto.setLowStockProducts(productRepository.findAll().stream()
                .filter(p -> p.getStock() <= p.getStockMin())
                .count());

        // Ventas Recientes (Últimas 5)
        dto.setRecentSales(allSales.stream()
                .sorted(Comparator.comparing(Sale::getSaleDate).reversed())
                .limit(5)
                .map(s -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("invoice", s.getInvoiceNumber());
                    map.put("client", s.getClient() != null ? s.getClient().getFullName() : "Consumidor Final");
                    map.put("total", s.getTotal());
                    map.put("date", s.getSaleDate());
                    return map;
                }).collect(Collectors.toList()));

        // Esto es una simplificación - En un ERP real usaríamos queries agregadas
        dto.setSalesByDay(new ArrayList<>());
        dto.setTopSellingProducts(new ArrayList<>());

        return dto;
    }
}
