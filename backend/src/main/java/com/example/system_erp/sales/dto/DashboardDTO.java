package com.example.system_erp.sales.dto;

import com.example.system_erp.products.models.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private BigDecimal totalSales;
    private BigDecimal dailySales;
    private long totalProducts;
    private long totalClients;
    private long lowStockProducts;
    private List<Product> lowStockList;
    private List<Map<String, Object>> topSellingProducts;
    private List<Map<String, Object>> recentSales;
    private List<Map<String, Object>> salesByDay;
}
