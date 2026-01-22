package com.example.backend_notas_bdd_1.repository;

import com.example.backend_notas_bdd_1.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotaRepository extends JpaRepository<Nota, Long> {

}
