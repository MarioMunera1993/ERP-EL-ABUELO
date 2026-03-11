package com.example.system_erp.sales.repositories;

import com.example.system_erp.sales.models.SaleDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public interface SaleDetailRepository extends JpaRepository<SaleDetail, Long> {

    @Query("SELECT sd.product.name as name, SUM(sd.quantity) as totalQty " +
           "FROM SaleDetail sd " +
           "GROUP BY sd.product.id, sd.product.name " +
           "ORDER BY totalQty DESC")
    List<Map<String, Object>> findTopSellingProducts();
}
