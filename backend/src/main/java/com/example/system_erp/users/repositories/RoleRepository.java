package com.example.system_erp.users.repositories;

import com.example.system_erp.users.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository // Le dice a Spring que esta clase maneja la base de datos
public interface RoleRepository extends JpaRepository<Role, Long> {

    // JpaRepository ya te da: save(), findById(), delete(), findAll()

    // Agregamos este para buscar un rol por su nombre (ej: "ADMIN")
    Optional<Role> findByName(String name);
}
