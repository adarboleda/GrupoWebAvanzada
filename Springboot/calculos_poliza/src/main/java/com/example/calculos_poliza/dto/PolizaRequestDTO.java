package com.example.calculos_poliza.dto;

public class PolizaRequestDTO {
    private String nombre;
    private int edad;
    private int numeroAccidentes;
    private String modelo;
    private double valor;
    private Double costoTotal;

    // Constructor
    public PolizaRequestDTO() {
    }

    public PolizaRequestDTO(String nombre, Double costoTotal) {
        this.nombre = nombre;
        this.costoTotal = costoTotal;
    }

    public PolizaRequestDTO(String nombre, int edad, int numeroAccidentes, String modelo, double valor, Double costoTotal) {
        this.nombre = nombre;
        this.edad = edad;
        this.numeroAccidentes = numeroAccidentes;
        this.modelo = modelo;
        this.valor = valor;
        this.costoTotal = costoTotal;
    }

    // Getters and Setters

    public Double getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(Double costoTotal) {
        this.costoTotal = costoTotal;
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

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }
}
