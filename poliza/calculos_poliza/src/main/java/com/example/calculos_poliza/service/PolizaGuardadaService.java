package com.example.calculos_poliza.service;

import com.example.calculos_poliza.model.Poliza;
import com.example.calculos_poliza.repository.PolizaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PolizaGuardadaService {
    
    @Autowired
    private PolizaRepository polizaRepository;

    /**
     * Obtiene todas las pólizas guardadas
     */
    public List<Poliza> obtenerTodas() {
        return polizaRepository.findAllByOrderByFechaCalculoDesc();
    }

    /**
     * Obtiene una póliza por ID
     */
    public Optional<Poliza> obtenerPorId(Long id) {
        return polizaRepository.findById(id);
    }

    /**
     * Busca pólizas por nombre del propietario
     */
    public List<Poliza> buscarPorNombre(String nombre) {
        return polizaRepository.findByNombrePropietarioContainingIgnoreCase(nombre);
    }

    /**
     * Guarda una nueva póliza
     */
    public Poliza guardar(Poliza poliza) {
        return polizaRepository.save(poliza);
    }

    /**
     * Elimina una póliza
     */
    public void eliminar(Long id) {
        if (polizaRepository.existsById(id)) {
            polizaRepository.deleteById(id);
        } else {
            throw new RuntimeException("Póliza no encontrada con ID: " + id);
        }
    }

    /**
     * Obtiene el total de pólizas guardadas
     */
    public long contar() {
        return polizaRepository.count();
    }

    /**
     * Obtiene el monto total recaudado en pólizas
     */
    public Double obtenerRecaudoTotal() {
        return polizaRepository.findAll()
                .stream()
                .mapToDouble(Poliza::getCostoPoliza)
                .sum();
    }
}
