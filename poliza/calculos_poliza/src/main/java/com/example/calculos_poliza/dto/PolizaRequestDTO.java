package com.example.calculos_poliza.dto;

import jakarta.validation.constraints.*;

public class PolizaRequestDTO {
    
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @NotNull(message = "La edad es requerida")
    @Min(value = 18, message = "La edad mínima es 18 años")
    @Max(value = 120, message = "La edad no puede ser mayor a 120 años")
    private Integer edad;
    
    @NotNull(message = "El número de accidentes es requerido")
    @Min(value = 0, message = "El número de accidentes no puede ser negativo")
    private Integer numeroAccidentes;
    
    @NotNull(message = "El valor del vehículo es requerido")
    @DecimalMin(value = "0.01", message = "El valor debe ser mayor a 0")
    private Double valor;
    
    @NotBlank(message = "El modelo es requerido")
    @Pattern(regexp = "^[ABC]$", message = "El modelo debe ser A, B o C")
    private String modelo;

    // Getters and Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public Integer getNumeroAccidentes() {
        return numeroAccidentes;
    }

    public void setNumeroAccidentes(Integer numeroAccidentes) {
        this.numeroAccidentes = numeroAccidentes;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }   
}
