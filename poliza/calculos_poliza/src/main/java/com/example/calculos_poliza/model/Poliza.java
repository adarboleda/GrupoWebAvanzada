package com.example.calculos_poliza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "poliza")
public class Poliza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre del propietario es requerido")
    @Column(nullable = false)
    private String nombrePropietario;
    
    @Min(value = 18)
    @Max(value = 120)
    @Column(nullable = false)
    private Integer edad;
    
    @Min(value = 0)
    @Column(nullable = false)
    private Integer numeroAccidentes;
    
    @NotBlank(message = "El modelo del automóvil es requerido")
    @Column(nullable = false)
    private String modeloAutomovil;
    
    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private Double valorAutomovil;
    
    @Column(nullable = false)
    private Double costoPoliza;
    
    @Column(name = "fecha_calculo", nullable = false)
    private LocalDateTime fechaCalculo;

    public Poliza() {
        this.fechaCalculo = LocalDateTime.now();
    }

    public Poliza(String nombrePropietario, Integer edad, Integer numeroAccidentes,
                  String modeloAutomovil, Double valorAutomovil, Double costoPoliza) {
        this.nombrePropietario = nombrePropietario;
        this.edad = edad;
        this.numeroAccidentes = numeroAccidentes;
        this.modeloAutomovil = modeloAutomovil;
        this.valorAutomovil = valorAutomovil;
        this.costoPoliza = costoPoliza;
        this.fechaCalculo = LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombrePropietario() {
        return nombrePropietario;
    }

    public Integer getEdad() {
        return edad;
    }

    public Integer getNumeroAccidentes() {
        return numeroAccidentes;
    }

    public String getModeloAutomovil() {
        return modeloAutomovil;
    }

    public Double getValorAutomovil() {
        return valorAutomovil;
    }

    public Double getCostoPoliza() {
        return costoPoliza;
    }

    public LocalDateTime getFechaCalculo() {
        return fechaCalculo;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNombrePropietario(String nombrePropietario) {
        this.nombrePropietario = nombrePropietario;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public void setNumeroAccidentes(Integer numeroAccidentes) {
        this.numeroAccidentes = numeroAccidentes;
    }

    public void setModeloAutomovil(String modeloAutomovil) {
        this.modeloAutomovil = modeloAutomovil;
    }

    public void setValorAutomovil(Double valorAutomovil) {
        this.valorAutomovil = valorAutomovil;
    }

    public void setCostoPoliza(Double costoPoliza) {
        this.costoPoliza = costoPoliza;
    }

    public void setFechaCalculo(LocalDateTime fechaCalculo) {
        this.fechaCalculo = fechaCalculo;
    }

    @Override
    public String toString() {
        return "Poliza{" +
                "id=" + id +
                ", nombrePropietario='" + nombrePropietario + '\'' +
                ", edad=" + edad +
                ", numeroAccidentes=" + numeroAccidentes +
                ", modeloAutomovil='" + modeloAutomovil + '\'' +
                ", valorAutomovil=" + valorAutomovil +
                ", costoPoliza=" + costoPoliza +
                ", fechaCalculo=" + fechaCalculo +
                '}';
    }
}
