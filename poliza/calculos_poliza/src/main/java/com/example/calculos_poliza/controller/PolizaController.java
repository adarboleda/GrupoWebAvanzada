package com.example.calculos_poliza.controller;

import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import com.example.calculos_poliza.dto.PolizaDTO;
import com.example.calculos_poliza.dto.PolizaRequestDTO;
import com.example.calculos_poliza.model.Automovil;
import com.example.calculos_poliza.model.Poliza;
import com.example.calculos_poliza.model.Propietario;
import com.example.calculos_poliza.service.PolizaService;
import com.example.calculos_poliza.service.PolizaGuardadaService;

import java.util.List;

@RestController
@RequestMapping("api/poliza")
@Tag(name = "Cálculo de Pólizas", description = "Endpoints para calcular el costo de pólizas de seguros")
@CrossOrigin(origins = "http://localhost:3000")
public class PolizaController {

    private final PolizaService servicio;
    private final PolizaGuardadaService polizaGuardadaService;
    
    public PolizaController(PolizaService servicio, PolizaGuardadaService polizaGuardadaService) {
        this.servicio = servicio;
        this.polizaGuardadaService = polizaGuardadaService;
    }

    @GetMapping("/historial")
    @Operation(summary = "Obtener historial de pólizas", 
               description = "Obtiene todas las pólizas calculadas y guardadas en la base de datos")
    @ApiResponse(responseCode = "200", description = "Historial obtenido exitosamente")
    public List<Poliza> obtenerHistorial() {
        return polizaGuardadaService.obtenerTodas();
    }

    @GetMapping("/calcular")
    @Operation(summary = "Calcular póliza con parámetros GET", 
               description = "Calcula el costo total de una póliza usando parámetros de URL")
    @ApiResponse(responseCode = "200", description = "Cálculo exitoso")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    public PolizaDTO calcularDto(
        @RequestParam String nombre,
        @RequestParam Integer edad,
        @RequestParam Integer numeroAccidentes,
        @RequestParam Double valor,
        @RequestParam String modelo) {

        Propietario p = new Propietario(nombre, edad, numeroAccidentes);
        Automovil a = new Automovil(valor, modelo);
        Double costoTotal = servicio.calcularCostoTotal(p, a);

        return new PolizaDTO(p.getNombre(), costoTotal);
    }   

    @PostMapping("/calcular")
    @Operation(summary = "Calcular póliza con JSON", 
               description = "Calcula el costo total de una póliza usando body JSON")
    @ApiResponse(responseCode = "200", description = "Cálculo exitoso")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    public PolizaDTO calcularDtoPost(@Valid @RequestBody PolizaRequestDTO polizaRequestDTO) {
        try {
            Propietario p = new Propietario(polizaRequestDTO.getNombre(), polizaRequestDTO.getEdad(), polizaRequestDTO.getNumeroAccidentes());
            Automovil a = new Automovil(polizaRequestDTO.getValor(), polizaRequestDTO.getModelo());
            Double costoTotal = servicio.calcularCostoTotal(p, a);

            // Guardar la póliza en la base de datos
            Poliza poliza = new Poliza(
                p.getNombre(),
                p.getEdad(),
                p.getNumeroAccidentes(),
                a.getModelo(),
                a.getValor(),
                costoTotal
            );
            polizaGuardadaService.guardar(poliza);

            return new PolizaDTO(p.getNombre(), costoTotal);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error en validación: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error al calcular la póliza: " + e.getMessage());
        }
    }
}