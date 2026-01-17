package com.example.backend_notas_bdd.model;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "estudiantes")
public class Estudiante {
    // es campo id, definirse como clave primaria de la tabla
    @Id
    // permite que el valor del id se genere automaticamente
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //Definir atributos
    private String nombre;
    private String apellido;
    private String email;
    @Temporal(TemporalType.DATE)
    private Date fechaNacimiento;

    @OneToMany(mappedBy = "estudiante", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Nota> notas;
    
    //Constructores
    public Estudiante() {
    }

    public Estudiante(String nombre, String apellido, String email, Date fechaNacimiento) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.fechaNacimiento = fechaNacimiento;
    }

    //Getters y Setters
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

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(Date fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
