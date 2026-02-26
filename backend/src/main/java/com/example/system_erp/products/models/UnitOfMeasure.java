package com.example.system_erp.products.models;

/**
 * Catálogo de unidades de medida utilizadas en productos.
 * Se serializa como STRING en la base de datos para facilitar lectura
 * y mantenimiento; los nombres de las constantes serán los valores
 * enviados/recibidos por JSON.
 */
public enum UnitOfMeasure {
    // Longitud
    METROS("m"),
    CENTIMETROS("cm"),
    MILIMETROS("mm"),
    PULGADAS("\"") , // nota: escapamos la comilla doble
    PIES("ft"),
    
    // Masa / peso
    KILOGRAMOS("kg"),
    GRAMOS("g"),
    LIBRAS("lb"),
    TONELADAS("t"),
    
    // Volumen
    LITROS("L"),
    MILILITROS("ml"),
    GALONES("gal"),
    METROS_CUBICOS("m³"),
    
    // Conteo
    UNIDAD("un"),
    DOCENA("dz"),
    GRUESA("gruesa"),
    SET("set"),
    JUEGO("juego"),
    KIT("kit");

    private final String abbreviation;

    UnitOfMeasure(String abbreviation) {
        this.abbreviation = abbreviation;
    }

    public String getAbbreviation() {
        return abbreviation;
    }

    @Override
    public String toString() {
        // devolver nombre humanizado si se desea, por ahora la abreviatura
        return abbreviation;
    }
}