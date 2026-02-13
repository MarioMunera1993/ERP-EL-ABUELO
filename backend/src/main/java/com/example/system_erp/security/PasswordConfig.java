package com.example.system_erp.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Le dice a Spring que aquí hay configuraciones globales
public class PasswordConfig {
    @Bean // Crea un "componente" que podremos usar en cualquier parte para cifrar
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
