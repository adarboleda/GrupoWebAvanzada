package com.example.backend_notas_bdd.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "notas")
public class Nota {
    // Definir atributos
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String asignatura;
    private Double nota;
    private Date fechaRegistro = new Date();

    //Relacion ManyToOne con Estudiante
    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante; //instancia de la clase Estudiante

    // Constructores
    // Constructor vacio
    public Nota() {
    }
    //Constructor con parametros
    public Nota(String asignatura, Double nota) {
        this.asignatura = asignatura;
        this.nota = nota;
    }
    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAsignatura() {
        return asignatura;
    }

    public void setAsignatura(String asignatura) {
        this.asignatura = asignatura;
    }

    public Double getNota() {
        return nota;
    }

    public void setNota(Double nota) {
        this.nota = nota;
    }
}
