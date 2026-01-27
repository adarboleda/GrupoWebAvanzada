package com.articulo.articulo.service;

import com.articulo.articulo.model.Rubro;
import com.articulo.articulo.repository.RubroRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RubroService {
    
    private final RubroRepository rubroRepository;

    public RubroService(RubroRepository rubroRepository) {
        this.rubroRepository = rubroRepository;
    }

    // Obtener todos los rubros
    public List<Rubro> obtenerTodos() {
        return rubroRepository.findAll();
    }

    // Obtener un rubro por ID
    public Optional<Rubro> obtenerPorId(Long id) {
        return rubroRepository.findById(id);
    }

    // Guardar un rubro
    public Rubro guardar(Rubro rubro) {
        return rubroRepository.save(rubro);
    }

    // Actualizar un rubro
    public Rubro actualizar(Long id, Rubro rubroActualizado) {
        return rubroRepository.findById(id)
            .map(rubro -> {
                rubro.setNombre(rubroActualizado.getNombre());
                return rubroRepository.save(rubro);
            })
            .orElseThrow(() -> new RuntimeException("Rubro no encontrado con id: " + id));
    }

    // Eliminar un rubro
    public void eliminar(Long id) {
        rubroRepository.deleteById(id);
    }
}
