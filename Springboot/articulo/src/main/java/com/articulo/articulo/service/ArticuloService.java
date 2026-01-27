package com.articulo.articulo.service;

import com.articulo.articulo.model.Articulo;
import com.articulo.articulo.model.Rubro;
import com.articulo.articulo.repository.ArticuloRepository;
import com.articulo.articulo.repository.RubroRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticuloService {
    
    private final ArticuloRepository articuloRepository;
    private final RubroRepository rubroRepository;

    public ArticuloService(ArticuloRepository articuloRepository, RubroRepository rubroRepository) {
        this.articuloRepository = articuloRepository;
        this.rubroRepository = rubroRepository;
    }

    // Obtener todos los artículos
    public List<Articulo> obtenerTodos() {
        return articuloRepository.findAll();
    }

    // Obtener todos los artículos con información del rubro
    public List<Map<String, Object>> obtenerTodosConRubro() {
        List<Articulo> articulos = articuloRepository.findAll();
        return articulos.stream().map(articulo -> {
            Map<String, Object> articuloMap = new HashMap<>();
            articuloMap.put("id", articulo.getId());
            articuloMap.put("nombre", articulo.getNombre());
            articuloMap.put("precio", articulo.getPrecio());
            articuloMap.put("descripcion", articulo.getDescripcion());
            
            if (articulo.getRubro() != null) {
                Map<String, Object> rubroMap = new HashMap<>();
                rubroMap.put("id", articulo.getRubro().getId());
                rubroMap.put("nombre", articulo.getRubro().getNombre());
                articuloMap.put("rubro", rubroMap);
            } else {
                articuloMap.put("rubro", null);
            }
            
            return articuloMap;
        }).collect(Collectors.toList());
    }

    // Obtener un artículo por ID
    public Optional<Articulo> obtenerPorId(Long id) {
        return articuloRepository.findById(id);
    }

    // Guardar un artículo
    public Articulo guardar(Articulo articulo, Long rubroId) {
        if (rubroId != null) {
            Rubro rubro = rubroRepository.findById(rubroId)
                .orElseThrow(() -> new RuntimeException("Rubro no encontrado con id: " + rubroId));
            articulo.setRubro(rubro);
        }
        return articuloRepository.save(articulo);
    }

    // Actualizar un artículo
    public Articulo actualizar(Long id, Articulo articuloActualizado, Long rubroId) {
        return articuloRepository.findById(id)
            .map(articulo -> {
                articulo.setNombre(articuloActualizado.getNombre());
                articulo.setPrecio(articuloActualizado.getPrecio());
                articulo.setDescripcion(articuloActualizado.getDescripcion());
                
                if (rubroId != null) {
                    Rubro rubro = rubroRepository.findById(rubroId)
                        .orElseThrow(() -> new RuntimeException("Rubro no encontrado con id: " + rubroId));
                    articulo.setRubro(rubro);
                }
                
                return articuloRepository.save(articulo);
            })
            .orElseThrow(() -> new RuntimeException("Artículo no encontrado con id: " + id));
    }

    // Eliminar un artículo
    public void eliminar(Long id) {
        articuloRepository.deleteById(id);
    }
}
