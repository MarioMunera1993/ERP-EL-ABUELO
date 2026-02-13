package com.example.system_erp.users.controllers;

import com.example.system_erp.users.models.User;
import com.example.system_erp.users.models.Role;
import com.example.system_erp.users.repositories.UserRepository;
import com.example.system_erp.users.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("El usuario ya existe");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            if (user.getRole() != null && user.getRole().getId() != null) {
                Role role = roleRepository.findById(user.getRole().getId())
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
                user.setRole(role);
            } else {
                Role userRole = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("Rol USER no existe"));
                user.setRole(userRole);
            }

            userRepository.save(user);
            return ResponseEntity.ok("Usuario registrado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setActive(userDetails.isActive());
            if (userDetails.getRole() != null) {
                Role role = roleRepository.findById(userDetails.getRole().getId()).orElse(null);
                if (role != null)
                    user.setRole(role);
            }
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
            }
            userRepository.save(user);
            return ResponseEntity.ok("Usuario actualizado");
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
