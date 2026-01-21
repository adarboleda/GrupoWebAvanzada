package com.example.calculos_poliza.repository;

import com.example.calculos_poliza.model.Automovil;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropietarioRepository extends JpaRepository<Automovil, Long> {

}
