package com.example.system_erp.sales.services;

import com.example.system_erp.products.models.Product;
import com.example.system_erp.products.repositories.ProductRepository;
import com.example.system_erp.sales.models.Sale;
import com.example.system_erp.sales.models.SaleDetail;
import com.example.system_erp.sales.repositories.SaleRepository;
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
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Sale createSale(Sale saleRequest) {
        // 1. Obtener usuario actual (vendedor)
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername()
                : principal.toString();
        User seller = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Vendedor no encontrado"));
        saleRequest.setSeller(seller);

        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal ivaTotal = BigDecimal.ZERO;

        BigDecimal totalDiscountCalculated = BigDecimal.ZERO;
        for (SaleDetail detail : saleRequest.getDetails()) {
            Product product = productRepository.findById(detail.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detail.getProduct().getId()));

            // 2. Validación de Stock Negativo
            if (product.getStock() < detail.getQuantity()) {
                throw new RuntimeException(
                        "Stock insuficiente para: " + product.getName() + " (Disponible: " + product.getStock() + ")");
            }

            // 3. Validación de Precio (Venta >= Compra)
            if (detail.getUnitPrice().compareTo(product.getPurchasePrice()) < 0) {
                throw new RuntimeException(
                        "El precio de venta no puede ser menor al precio de compra para: " + product.getName());
            }

            // Actualizar stock
            product.setStock(product.getStock() - detail.getQuantity());
            productRepository.save(product);

            // Cálculos
            BigDecimal baseTotal = detail.getUnitPrice().multiply(new BigDecimal(detail.getQuantity()));
            BigDecimal itemDiscount = detail.getDiscount() != null ? detail.getDiscount() : BigDecimal.ZERO;
            BigDecimal lineTotal = baseTotal.subtract(itemDiscount);

            detail.setLineTotal(lineTotal);
            detail.setSale(saleRequest);

            subtotal = subtotal.add(baseTotal);
            totalDiscountCalculated = totalDiscountCalculated.add(itemDiscount);

            // IVA (Calculado sobre el precio base o después del descuento? Generalmente
            // sobre el subtotal)
            BigDecimal ivaProduct = lineTotal.multiply(product.getIvaPercentage().divide(new BigDecimal("100")));
            ivaTotal = ivaTotal.add(ivaProduct);
        }

        saleRequest.setSubtotal(subtotal);
        saleRequest.setIvaTotal(ivaTotal);
        // El descuento de la venta es la suma de los descuentos por producto
        saleRequest.setDiscount(totalDiscountCalculated);

        BigDecimal total = subtotal.subtract(totalDiscountCalculated).add(ivaTotal);
        saleRequest.setTotal(total);
        saleRequest.setSaleDate(LocalDateTime.now());

        // Numeración secuencial (FAC-0001)
        long count = saleRepository.count() + 1;
        saleRequest.setInvoiceNumber(String.format("FAC-%04d", count));

        return saleRepository.save(saleRequest);
    }
}
