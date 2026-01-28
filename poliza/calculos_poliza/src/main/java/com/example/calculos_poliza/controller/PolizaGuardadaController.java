package com.example.calculos_poliza.controller;

import com.example.calculos_poliza.model.Poliza;
import com.example.calculos_poliza.service.PolizaGuardadaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/polizas")
@CrossOrigin(origins = "http://localhost:3000")
public class PolizaGuardadaController {
    
    @Autowired
    private PolizaGuardadaService polizaGuardadaService;

    /**
     * Obtiene todas las pólizas guardadas
     */
    @GetMapping
    public ResponseEntity<List<Poliza>> obtenerTodas() {
        try {
            List<Poliza> polizas = polizaGuardadaService.obtenerTodas();
            return ResponseEntity.ok(polizas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene una póliza por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Poliza> obtenerPorId(@PathVariable Long id) {
        try {
            Optional<Poliza> poliza = polizaGuardadaService.obtenerPorId(id);
            return poliza.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Busca pólizas por nombre del propietario
     */
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<Poliza>> buscarPorNombre(@PathVariable String nombre) {
        try {
            List<Poliza> polizas = polizaGuardadaService.buscarPorNombre(nombre);
            return ResponseEntity.ok(polizas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Guarda una nueva póliza
     */
    @PostMapping
    public ResponseEntity<?> guardar(@Valid @RequestBody Poliza poliza) {
        try {
            Poliza polizaGuardada = polizaGuardadaService.guardar(poliza);
            return ResponseEntity.status(HttpStatus.CREATED).body(polizaGuardada);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la póliza: " + e.getMessage());
        }
    }

    /**
     * Elimina una póliza
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            polizaGuardadaService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar la póliza: " + e.getMessage());
        }
    }

    /**
     * Obtiene estadísticas de las pólizas
     */
    @GetMapping("/estadisticas/total")
    public ResponseEntity<Long> obtenerTotal() {
        try {
            long total = polizaGuardadaService.contar();
            return ResponseEntity.ok(total);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene el monto total recaudado
     */
    @GetMapping("/estadisticas/recaudo")
    public ResponseEntity<Double> obtenerRecaudoTotal() {
        try {
            Double recaudo = polizaGuardadaService.obtenerRecaudoTotal();
            return ResponseEntity.ok(recaudo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
