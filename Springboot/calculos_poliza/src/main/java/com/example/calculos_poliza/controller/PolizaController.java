package com.example.calculos_poliza.controller;

import com.example.calculos_poliza.dto.PolizaDTO;
import com.example.calculos_poliza.dto.PolizaRequestDTO;
import com.example.calculos_poliza.model.Automovil;
import com.example.calculos_poliza.model.Propietario;
import com.example.calculos_poliza.service.PolizaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/poliza")
public class PolizaController {
    //instancias
    public final PolizaService polizaService;

    public PolizaController(PolizaService polizaService) {
        this.polizaService = polizaService;
    }

    @GetMapping("/calcular")
    public PolizaDTO calcular(
            @RequestParam String nombre,
            @RequestParam int edad,
            @RequestParam int numeroAccidentes,
            @RequestParam double valor,
            @RequestParam String modelo
    ) {
        //instanciar las clases
        Propietario propietario = new Propietario(nombre, edad, numeroAccidentes);
        Automovil automovil = new Automovil(valor, modelo);

        //total
        double total = polizaService.calculoCosto(propietario, automovil);
        return new PolizaDTO(propietario.getNombre(), total);
    }

    //Metodo para post - Guarda en la base de datos
    @PostMapping("/calcular")
    public PolizaDTO calcularPost(@RequestBody PolizaRequestDTO requestDTO) {
        //instanciar las clases
        Propietario propietario = new Propietario(requestDTO.getNombre(), requestDTO.getEdad(), requestDTO.getNumeroAccidentes());
        Automovil automovil = new Automovil(requestDTO.getValor(), requestDTO.getModelo());

        //calcular y guardar en la base de datos
        double total = polizaService.calcularYGuardar(propietario, automovil);
        return new PolizaDTO(requestDTO.getNombre(), total);
    }
}
