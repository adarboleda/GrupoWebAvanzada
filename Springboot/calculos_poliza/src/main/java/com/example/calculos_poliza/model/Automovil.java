package com.example.calculos_poliza.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Automovil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String modelo;
    private double valor;

    //Consturctores

    public Automovil() {
    }

    public Automovil(double valor, String modelo) {
        this.valor = valor;
        this.modelo = modelo;
    }

    public Automovil(Long id, String modelo, double valor) {
        this.id = id;
        this.modelo = modelo;
        this.valor = valor;
    }

    // getters y setters

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
