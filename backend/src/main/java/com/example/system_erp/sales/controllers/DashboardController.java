package com.example.system_erp.sales.controllers;

import com.example.system_erp.products.models.Product;
import com.example.system_erp.sales.dto.DashboardDTO;
import com.example.system_erp.sales.models.Sale;
import com.example.system_erp.sales.repositories.SaleDetailRepository;
import com.example.system_erp.sales.repositories.SaleRepository;
import com.example.system_erp.products.repositories.ProductRepository;
import com.example.system_erp.clients.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private SaleDetailRepository saleDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public DashboardDTO getDashboardStats() {
        DashboardDTO dto = new DashboardDTO();

        // 1. Ventas Totales (Histórico)
        List<Sale> allSales = saleRepository.findAll();
        dto.setTotalSales(allSales.stream()
                .map(Sale::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        // 2. Ventas del Día
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        BigDecimal daily = saleRepository.sumTotalSalesFrom(startOfDay);
        dto.setDailySales(daily != null ? daily : BigDecimal.ZERO);

        // 3. Conteos Básicos
        dto.setTotalProducts(productRepository.count());
        dto.setTotalClients(clientRepository.count());

        // 4. Stock Bajo (Detallado)
        List<Product> lowStockItems = productRepository.findAll().stream()
                .filter(p -> p.getIsActive() && p.getStock() <= p.getStockMin())
                .collect(Collectors.toList());
        dto.setLowStockProducts(lowStockItems.size());
        dto.setLowStockList(lowStockItems);

        // 5. Productos Más Vendidos
        dto.setTopSellingProducts(saleDetailRepository.findTopSellingProducts().stream()
                .limit(5)
                .collect(Collectors.toList()));

        // 6. Ventas Recientes (Últimas 5)
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

        dto.setSalesByDay(new ArrayList<>()); // Opcional para gráficas futuras

        return dto;
    }
}
