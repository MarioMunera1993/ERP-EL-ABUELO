package com.example.system_erp.sales.repositories;

import com.example.system_erp.sales.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT SUM(s.total) FROM Sale s WHERE s.saleDate >= :startOfDay")
    BigDecimal sumTotalSalesFrom(@Param("startOfDay") LocalDateTime startOfDay);
}
