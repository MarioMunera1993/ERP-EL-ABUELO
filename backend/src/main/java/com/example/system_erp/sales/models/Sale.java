package com.example.system_erp.sales.models;

import com.example.system_erp.clients.models.Client;
import com.example.system_erp.users.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 20)
    private String invoiceNumber;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    @Column(name = "sale_date")
    private LocalDateTime saleDate = LocalDateTime.now();

    @Column(nullable = false)
    private BigDecimal subtotal;

    @Column(name = "discount")
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "iva_total", nullable = false)
    private BigDecimal ivaTotal;

    @Column(nullable = false)
    private BigDecimal total;

    @Column(length = 20)
    private String status = "COMPLETED";

    @OneToMany(mappedBy = "sale", cascade = CascadeType.ALL)
    private List<SaleDetail> details;
}
