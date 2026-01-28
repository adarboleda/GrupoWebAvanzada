package com.example.calculos_poliza.repository;

import com.example.calculos_poliza.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    /**
     * Busca clientes por nombre
     */
    List<Cliente> findByNombreContainingIgnoreCase(String nombre);
    
    /**
     * Obtiene todos los clientes ordenados por fecha de registro (más recientes primero)
     */
    List<Cliente> findAllByOrderByFechaRegistroDesc();
    
    /**
     * Verifica si existe un cliente con el mismo nombre
     */
    boolean existsByNombreIgnoreCase(String nombre);
}
