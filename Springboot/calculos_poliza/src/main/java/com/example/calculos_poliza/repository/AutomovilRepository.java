package com.example.calculos_poliza.repository;

import com.example.calculos_poliza.model.Propietario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomovilRepository extends JpaRepository<Propietario, Long> {
}
