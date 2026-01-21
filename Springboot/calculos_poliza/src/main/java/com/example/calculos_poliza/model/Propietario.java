package com.example.calculos_poliza.model;

import jakarta.persistence.*;

@Entity
public class Propietario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private int edad;
    private int numeroAccidentes;

    public Propietario() {
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
