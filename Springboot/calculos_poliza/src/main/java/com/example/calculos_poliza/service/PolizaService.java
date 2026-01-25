package com.example.calculos_poliza.service;

import com.example.calculos_poliza.model.Automovil;
import com.example.calculos_poliza.model.Propietario;
import com.example.calculos_poliza.repository.AutomovilRepository;
import com.example.calculos_poliza.repository.PropietarioRepository;
import org.springframework.stereotype.Service;

@Service
public class PolizaService {
    
    private final PropietarioRepository propietarioRepository;
    private final AutomovilRepository automovilRepository;

    public PolizaService(PropietarioRepository propietarioRepository, AutomovilRepository automovilRepository) {
        this.propietarioRepository = propietarioRepository;
        this.automovilRepository = automovilRepository;
    }
    public double calculoCosto(Propietario propietario, Automovil automovil) {

        //validar que el propietario sea mayor de edad
        if(propietario.getEdad() < 18) {
            throw new IllegalArgumentException("No se puede crear una póliza para menores de edad. El propietario debe tener al menos 18 años.");
        }
        double total = 0.0;
        //cargo por valor del automovil (3.5%)
        total += automovil.getValor() * 0.035;
        //cargo por modelo
        switch (automovil.getModelo()){
            case "A":
                total += automovil.getValor() * 0.011;
                break;
            case "B":
                total += automovil.getValor() * 0.012;
                break;
            case "C":
                total += automovil.getValor() * 0.015;
                break;
        }
        //cargo por edad
        if(propietario.getEdad() <= 24) {
            total += 360;
        } else if(propietario.getEdad() <= 53) {
            total += 240;
        } else {
            total += 430;
        }
        //cargo por accidentes
        if(propietario.getNumeroAccidentes() <= 3) {
            total += propietario.getNumeroAccidentes() * 17;
        } else {
            total += (3*17) + ((propietario.getNumeroAccidentes() - 3) * 21);
        }
        return total;
    }

    public double calcularYGuardar(Propietario propietario, Automovil automovil) {
        // Calcular el costo
        double total = calculoCosto(propietario, automovil);
        
        // Guardar en la base de datos
        propietarioRepository.save(propietario);
        automovilRepository.save(automovil);
        
        return total;
    }
}
