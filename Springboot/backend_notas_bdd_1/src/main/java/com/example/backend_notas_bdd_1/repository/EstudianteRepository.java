package com.example.backend_notas_bdd_1.repository;

import com.example.backend_notas_bdd_1.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EstudianteRepository extends JpaRepository<Estudiante,Long> {
}
