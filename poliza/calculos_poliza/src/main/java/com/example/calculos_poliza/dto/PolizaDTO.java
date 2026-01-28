package com.example.calculos_poliza.dto;

public class PolizaDTO {
    private String propietario;
    private Double costoTotal;

    // Constructor
    public PolizaDTO(String propietario, Double costoTotal) {
        this.propietario = propietario;
        this.costoTotal = costoTotal;
    }

    // Getters and Setters
    public String getPropietario() {
        return propietario;
    }
    public void setPropietario(String propietario) {
        this.propietario = propietario;
    }
    public Double getCostoTotal() {
        return costoTotal;
    }
    public void setCostoTotal(Double costoTotal) {
        this.costoTotal = costoTotal;
    }
    
}
