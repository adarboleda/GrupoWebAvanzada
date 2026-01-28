package com.example.calculos_poliza.repository;

import com.example.calculos_poliza.model.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolizaRepository extends JpaRepository<Poliza, Long> {
    List<Poliza> findAllByOrderByFechaCalculoDesc();
    List<Poliza> findByNombrePropietarioContainingIgnoreCase(String nombre);
}
