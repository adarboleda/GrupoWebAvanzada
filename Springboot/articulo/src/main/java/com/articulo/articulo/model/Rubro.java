package com.articulo.articulo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rubros")
public class Rubro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nombre;

    @OneToMany(mappedBy = "rubro", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Articulo> articulos = new ArrayList<>();

    // Constructores
    public Rubro() {
    }

    public Rubro(String nombre) {
        this.nombre = nombre;
    }

    public Rubro(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public List<Articulo> getArticulos() {
        return articulos;
    }

    public void setArticulos(List<Articulo> articulos) {
        this.articulos = articulos;
    }
}
