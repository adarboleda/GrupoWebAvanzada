package com.example.backend_notas_bdd.repository;

import com.example.backend_notas_bdd.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaRepository extends JpaRepository<Nota, Long> {

}
