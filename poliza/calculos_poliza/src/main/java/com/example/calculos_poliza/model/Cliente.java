package com.example.calculos_poliza.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false)
    private String nombre;
    
    @NotNull(message = "La edad es requerida")
    @Min(value = 18, message = "La edad mínima es 18 años")
    @Max(value = 120, message = "La edad no puede ser mayor a 120 años")
    @Column(nullable = false)
    private Integer edad;
    
    @NotNull(message = "El número de accidentes es requerido")
    @Min(value = 0, message = "El número de accidentes no puede ser negativo")
    @Column(nullable = false)
    private Integer accidentes;
    
    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    public Cliente() {
        this.fechaRegistro = LocalDateTime.now();
    }

    public Cliente(String nombre, Integer edad, Integer accidentes) {
        this.nombre = nombre;
        this.edad = edad;
        this.accidentes = accidentes;
        this.fechaRegistro = LocalDateTime.now();
    }

    public Cliente(Long id, String nombre, Integer edad, Integer accidentes) {
        this.id = id;
        this.nombre = nombre;
        this.edad = edad;
        this.accidentes = accidentes;
        this.fechaRegistro = LocalDateTime.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public Integer getEdad() {
        return edad;
    }

    public Integer getAccidentes() {
        return accidentes;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public void setAccidentes(Integer accidentes) {
        this.accidentes = accidentes;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    @Override
    public String toString() {
        return "Cliente{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", edad=" + edad +
                ", accidentes=" + accidentes +
                ", fechaRegistro=" + fechaRegistro +
                '}';
    }
}
