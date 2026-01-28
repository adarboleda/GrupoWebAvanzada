package com.example.calculos_poliza.service;

import org.springframework.stereotype.Service;

import com.example.calculos_poliza.model.Automovil;
import com.example.calculos_poliza.model.Propietario;

@Service
public class PolizaService {

    public Double calcularCostoTotal(Propietario p, Automovil a) {
        // Validar edad
        validarPropietario(p);
        validarAutomovil(a);
    
        double total = 0.0;

        total += a.getValor() * 0.035; // 3.5% del valor del automóvil

        switch (a.getModelo()) {
            case "A" -> total += a.getValor() * 0.011;
            case "B" -> total += a.getValor() * 0.012;
            case "C" -> total += a.getValor() * 0.015;
            default -> {
            }
        }

        //cargo por edad
        if(p.getEdad() <= 24){
            total += 360;
        } else if (p.getEdad() <= 53) {
            total += 240;
        } else {
            total += 430;
        }
        
        //cargo por accidentes
        if(p.getNumeroAccidentes() <= 3) {
            total += p.getNumeroAccidentes() * 17;
        } else {
            total += (3 * 17) + ((p.getNumeroAccidentes() - 3) * 21);
        }

        return total;
    }

    // Validaciones
    private void validarPropietario(Propietario p) {
        if (p == null) {
            throw new IllegalArgumentException("El propietario no puede ser nulo.");
        }
        if (p.getEdad() < 18) {
            throw new IllegalArgumentException("El propietario es menor de edad. La edad mínima es 18 años.");
        }
        if (p.getEdad() > 120) {
            throw new IllegalArgumentException("La edad del propietario no es válida.");
        }
        if (p.getNombre() == null || p.getNombre().isEmpty()) {
            throw new IllegalArgumentException("El nombre del propietario es requerido.");
        }
        if (p.getNumeroAccidentes() < 0) {
            throw new IllegalArgumentException("El número de accidentes no puede ser negativo.");
        }
    }

    private void validarAutomovil(Automovil a) {
        if (a == null) {
            throw new IllegalArgumentException("El automóvil no puede ser nulo.");
        }
        if (a.getValor() <= 0) {
            throw new IllegalArgumentException("El valor del automóvil debe ser mayor a 0.");
        }
        if (a.getModelo() == null || a.getModelo().isEmpty()) {
            throw new IllegalArgumentException("El modelo del automóvil es requerido.");
        }
        if (!a.getModelo().matches("[ABC]")) {
            throw new IllegalArgumentException("El modelo debe ser A, B o C.");
        }
    }
}
