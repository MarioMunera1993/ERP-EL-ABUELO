package com.example.system_erp.products.controllers;

import com.example.system_erp.products.models.Category;
import com.example.system_erp.products.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'USER')")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public org.springframework.http.ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id).map(cat -> {
            categoryRepository.delete(cat);
            return org.springframework.http.ResponseEntity.ok().<Void>build();
        }).orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}
