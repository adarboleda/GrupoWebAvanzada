package com.example.calculadora.controller;

import com.example.calculadora.model.Operacion;
import com.example.calculadora.services.CalculadoraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calculadora")
public class CalculadoraControlador {

    @Autowired
    private CalculadoraService calculadoraService;

    @PostMapping("/calcular")
    public ResponseEntity<?> calcular(@RequestBody Operacion operacion) {
        try {
            Operacion resultado = calculadoraService.calcular(
                operacion.getNumero1(),
                operacion.getNumero2(),
                operacion.getOperacion()
            );
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/calcular")
    public ResponseEntity<?> calcularConParametros(
        @RequestParam double numero1,
        @RequestParam double numero2,
        @RequestParam String operacion
    ) {
        try {
            Operacion resultado = calculadoraService.calcular(numero1, numero2, operacion);
            return ResponseEntity.ok(resultado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
