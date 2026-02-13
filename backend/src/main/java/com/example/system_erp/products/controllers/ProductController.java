package com.example.system_erp.products.controllers;

import com.example.system_erp.products.models.Product;
import com.example.system_erp.products.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        if (id == null)
            return ResponseEntity.badRequest().build();
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public Product createProduct(@RequestBody Product product) {
        // La lógica de validación de compra vs venta se hará en un servicio más
        // adelante
        return productRepository.save(product);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        if (id == null || productDetails == null)
            return ResponseEntity.badRequest().build();
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setCode(productDetails.getCode());
                    product.setCategory(productDetails.getCategory());
                    product.setPurchasePrice(productDetails.getPurchasePrice());
                    product.setSalePrice(productDetails.getSalePrice());
                    product.setStock(productDetails.getStock());
                    product.setStockMin(productDetails.getStockMin());
                    product.setIvaPercentage(productDetails.getIvaPercentage());
                    return ResponseEntity.ok(productRepository.save(product));
                }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    productRepository.delete(product);
                    return ResponseEntity.ok().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alerts")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public List<Product> getStockAlerts() {
        // En una implementación real, esto compararía stock contra stockMin
        // Por ahora usamos el método del repositorio que busca por stock <= N
        return productRepository.findAll().stream()
                .filter(p -> p.getStock() <= p.getStockMin())
                .toList();
    }
}
