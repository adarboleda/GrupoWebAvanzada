package com.example.calculos_poliza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
public class Propietario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @Min(value = 18, message = "La edad mínima es 18 años")
    @Max(value = 120, message = "La edad no puede ser mayor a 120 años")
    private int edad;
    
    @Min(value = 0, message = "El número de accidentes no puede ser negativo")
    private int numeroAccidentes;

    public Propietario() {
    }

    public Propietario(String nombre, int edad, int numeroAccidentes) {
        this.nombre = nombre;
        this.edad = edad;
        this.numeroAccidentes = numeroAccidentes;
    }

    public Propietario(Long id, String nombre, int edad, int numeroAccidentes) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.numeroAccidentes = numeroAccidentes;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public int getNumeroAccidentes() {
        return numeroAccidentes;
    }

    public void setNumeroAccidentes(int numeroAccidentes) {
        this.numeroAccidentes = numeroAccidentes;
    }
}
