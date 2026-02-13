package com.example.system_erp.users.repositories;

import com.example.system_erp.users.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Necesitamos buscar usuarios por username para el Login
    Optional<User> findByUsername(String username);

    // También es útil buscar por email
    Optional<User> findByEmail(String email);

    // ¿Existe ya este usuario? (Para el registro)
    Boolean existsByUsername(String username);
}
