package com.example.calculos_poliza.dto;

public class PolizaDTO {
    private String propietario;
    private Double costoTotal;

    // Constructor
    public PolizaDTO(String propietario, Double costoTotal) {
        this.propietario = propietario;
        this.costoTotal = costoTotal;
    }
}
