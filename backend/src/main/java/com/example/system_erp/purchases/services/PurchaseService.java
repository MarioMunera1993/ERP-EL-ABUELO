package com.example.system_erp.purchases.services;

import com.example.system_erp.products.models.Product;
import com.example.system_erp.products.repositories.ProductRepository;
import com.example.system_erp.purchases.models.Purchase;
import com.example.system_erp.purchases.models.PurchaseDetail;
import com.example.system_erp.purchases.repositories.PurchaseRepository;
import com.example.system_erp.users.models.User;
import com.example.system_erp.users.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PurchaseService {

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Purchase createPurchase(Purchase purchaseRequest) {
        // 1. Obtener comprador (usuario actual)
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                : principal.toString();
        User purchaser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        purchaseRequest.setPurchaser(purchaser);

        BigDecimal grandTotal = BigDecimal.ZERO;

        for (PurchaseDetail detail : purchaseRequest.getDetails()) {
            Product product = productRepository.findById(detail.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detail.getProduct().getId()));

            // Actualizar stock (Suma)
            product.setStock(product.getStock() + detail.getQuantity());

            // Actualizar precios del producto basados en la compra
            product.setPurchasePrice(detail.getPurchasePrice());
            if (detail.getSuggestedSalePrice() != null
                    && detail.getSuggestedSalePrice().compareTo(BigDecimal.ZERO) > 0) {
                product.setSalePrice(detail.getSuggestedSalePrice());
            }

            productRepository.save(product);

            // Cálculos del detalle
            BigDecimal lineTotal = detail.getPurchasePrice().multiply(new BigDecimal(detail.getQuantity()));
            detail.setLineTotal(lineTotal);
            detail.setPurchase(purchaseRequest);

            grandTotal = grandTotal.add(lineTotal);
        }

        purchaseRequest.setTotal(grandTotal);
        purchaseRequest.setPurchaseDate(LocalDateTime.now());

        return purchaseRepository.save(purchaseRequest);
    }
}
