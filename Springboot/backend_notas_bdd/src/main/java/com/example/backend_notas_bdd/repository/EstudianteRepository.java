package com.example.backend_notas_bdd.repository;

import com.example.backend_notas_bdd.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstudianteRepository extends JpaRepository<Estudiante,Long> {
}
