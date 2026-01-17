package com.example.datos.modelo;

import java.time.LocalDate;

public class Usuario {
    private String nombre;
    private LocalDate fechaNacimiento;
    private int edadEnAnios;
    private long edadEnMeses;
    private long edadEnDias;
    private String edadDetallada;

    public Usuario(String nombre, LocalDate fechaNacimiento) {
        this.nombre = nombre;
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public int getEdadEnAnios() {
        return edadEnAnios;
    }

    public void setEdadEnAnios(int edadEnAnios) {
        this.edadEnAnios = edadEnAnios;
    }

    public long getEdadEnMeses() {
        return edadEnMeses;
    }

    public void setEdadEnMeses(long edadEnMeses) {
        this.edadEnMeses = edadEnMeses;
    }

    public long getEdadEnDias() {
        return edadEnDias;
    }

    public void setEdadEnDias(long edadEnDias) {
        this.edadEnDias = edadEnDias;
    }

    public String getEdadDetallada() {
        return edadDetallada;
    }

    public void setEdadDetallada(String edadDetallada) {
        this.edadDetallada = edadDetallada;
    }
}
