package com.articulo.articulo.controller;

import com.articulo.articulo.model.Articulo;
import com.articulo.articulo.service.ArticuloService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articulos")
@CrossOrigin(origins = "*")
public class ArticuloController {
    
    private final ArticuloService articuloService;

    public ArticuloController(ArticuloService articuloService) {
        this.articuloService = articuloService;
    }

    // Obtener todos los artículos
    @GetMapping
    public List<Articulo> obtenerTodos() {
        return articuloService.obtenerTodos();
    }

    // Obtener todos los artículos con información del rubro
    @GetMapping("/con-rubro")
    public List<Map<String, Object>> obtenerTodosConRubro() {
        return articuloService.obtenerTodosConRubro();
    }

    // Obtener un artículo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Articulo> obtenerPorId(@PathVariable Long id) {
        return articuloService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Crear un nuevo artículo
    @PostMapping
    public Articulo crear(@RequestBody Map<String, Object> articuloData) {
        Articulo articulo = new Articulo();
        articulo.setNombre((String) articuloData.get("nombre"));
        articulo.setPrecio(((Number) articuloData.get("precio")).doubleValue());
        articulo.setDescripcion((String) articuloData.get("descripcion"));
        
        Long rubroId = articuloData.get("rubroId") != null ? 
            ((Number) articuloData.get("rubroId")).longValue() : null;
        
        return articuloService.guardar(articulo, rubroId);
    }

    // Actualizar un artículo
    @PutMapping("/{id}")
    public ResponseEntity<Articulo> actualizar(@PathVariable Long id, @RequestBody Map<String, Object> articuloData) {
        try {
            Articulo articulo = new Articulo();
            articulo.setNombre((String) articuloData.get("nombre"));
            articulo.setPrecio(((Number) articuloData.get("precio")).doubleValue());
            articulo.setDescripcion((String) articuloData.get("descripcion"));
            
            Long rubroId = articuloData.get("rubroId") != null ? 
                ((Number) articuloData.get("rubroId")).longValue() : null;
            
            Articulo articuloActualizado = articuloService.actualizar(id, articulo, rubroId);
            return ResponseEntity.ok(articuloActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un artículo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        articuloService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
