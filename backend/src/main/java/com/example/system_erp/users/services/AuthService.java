package com.example.system_erp.users.services;

import com.example.system_erp.users.dto.LoginRequest;
import com.example.system_erp.security.JwtUtils;
import com.example.system_erp.users.dto.AuthResponse;
import com.example.system_erp.users.models.User;
import com.example.system_erp.users.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // Indica que aquí vive la lógica de negocio
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        // 1. Buscamos al usuario
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // DEBUG TEMP (Con comillas para ver espacios)
        System.out.println("Username: [" + request.getUsername() + "]");
        System.out.println("Password recibida (plano): [" + request.getPassword() + "]");
        System.out.println("Hash en DB: [" + user.getPassword() + "]");
        System.out.println("Longitud Hash en DB: " + user.getPassword().length());

        // 2. Verificamos la contraseña
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
        System.out.println("¿Coinciden?: " + matches);

        if (!matches) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        // 3. Generamos el Token REAL
        String token = jwtUtils.generateToken(user.getUsername());
        return new AuthResponse(token, user.getUsername(), user.getRole().getName());
    }
}
