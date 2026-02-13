package com.example.system_erp.products.repositories;

import com.example.system_erp.products.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStockLessThanEqual(Integer stock);
}
