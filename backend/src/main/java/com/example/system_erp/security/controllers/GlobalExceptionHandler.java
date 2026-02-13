package com.example.system_erp.security.controllers;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String message = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();

        if (message.contains("Duplicate entry")) {
            if (message.contains("serial_number")) {
                return new ResponseEntity<>("Error: El número de serie ya está registrado en el sistema.",
                        HttpStatus.CONFLICT);
            }
            return new ResponseEntity<>("Error: Ya existe un registro con estos datos únicos.", HttpStatus.CONFLICT);
        }

        return new ResponseEntity<>("Error de integridad de datos: " + message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(org.springframework.dao.InvalidDataAccessApiUsageException.class)
    public ResponseEntity<String> handleInvalidDataAccessApiUsageException(
            org.springframework.dao.InvalidDataAccessApiUsageException ex) {
        if (ex.getMessage().contains("detached entity passed to persist")) {
            return new ResponseEntity<>(
                    "Error técnico de persistencia: Se intentó asociar un componente que ya existe de forma incorrecta. Contacte a soporte.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Error de uso de API de datos: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception ex) {
        return new ResponseEntity<>("Ocurrió un error inesperado: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
