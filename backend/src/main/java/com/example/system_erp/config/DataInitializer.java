package com.example.system_erp.config;

import com.example.system_erp.users.models.Role;
import com.example.system_erp.users.models.User;
import com.example.system_erp.users.repositories.RoleRepository;
import com.example.system_erp.users.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Inicializar Roles si no existen
        if (roleRepository.count() < 3) {
            createRoleIfNotFound("SUPER_ADMIN", "Control absoluto del sistema");
            createRoleIfNotFound("ADMIN", "Gestión operativa completa (sin borrado)");
            createRoleIfNotFound("USER", "Perfil operativo (Ventas, consultas)");
        }

        // Asegurar que el usuario administrador existe y tiene el rol SUPER_ADMIN
        userRepository.findByUsername("admin").ifPresentOrElse(
                user -> {
                    Role superAdminRole = roleRepository.findByName("SUPER_ADMIN").orElse(null);
                    if (superAdminRole != null && !user.getRole().equals(superAdminRole)) {
                        user.setRole(superAdminRole);
                        userRepository.save(user);
                        System.out.println(">>> Rol de admin actualizado a SUPER_ADMIN");
                    }
                    if (user.getPassword().length() < 60) {
                        user.setPassword(passwordEncoder.encode("admin123"));
                        userRepository.save(user);
                        System.out.println(">>> Contraseña de admin reparada");
                    }
                },
                () -> {
                    Role superAdminRole = roleRepository.findByName("SUPER_ADMIN").get();
                    User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setFullName("Super Administrador");
                    admin.setEmail("admin@erp.com");
                    admin.setRole(superAdminRole);
                    admin.setActive(true);
                    userRepository.save(admin);
                    System.out.println(">>> Super Admin creado: admin / admin123");
                });
    }

    private void createRoleIfNotFound(String name, String description) {
        if (!roleRepository.findByName(name).isPresent()) {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            roleRepository.save(role);
        }
    }
}
