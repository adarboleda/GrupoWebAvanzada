package com.articulo.articulo.controller;

import com.articulo.articulo.model.Rubro;
import com.articulo.articulo.service.RubroService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rubros")
@CrossOrigin(origins = "*")
public class RubroController {
    
    private final RubroService rubroService;

    public RubroController(RubroService rubroService) {
        this.rubroService = rubroService;
    }

    // Obtener todos los rubros
    @GetMapping
    public List<Rubro> obtenerTodos() {
        return rubroService.obtenerTodos();
    }

    // Obtener un rubro por ID
    @GetMapping("/{id}")
    public ResponseEntity<Rubro> obtenerPorId(@PathVariable Long id) {
        return rubroService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Crear un nuevo rubro
    @PostMapping
    public Rubro crear(@RequestBody Rubro rubro) {
        return rubroService.guardar(rubro);
    }

    // Actualizar un rubro
    @PutMapping("/{id}")
    public ResponseEntity<Rubro> actualizar(@PathVariable Long id, @RequestBody Rubro rubro) {
        try {
            Rubro rubroActualizado = rubroService.actualizar(id, rubro);
            return ResponseEntity.ok(rubroActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un rubro
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rubroService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
