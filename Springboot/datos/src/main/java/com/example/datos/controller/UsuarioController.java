package com.example.datos.controller;

import com.example.datos.modelo.Usuario;
import com.example.datos.servicios.CalculoEdadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.time.LocalDate;

// define la clase como un controlador de Spring mvc
@Controller
public class UsuarioController {

    @Autowired
    private CalculoEdadService calculoEdadService;

    //mapeo de la url saludo
    @GetMapping("/saludo")
    //metodo controlador que retorna la vista saludo
    public String saludo(Model model) { // Model model sirve para enviar datos a la vista
        // Crear usuario con fecha de nacimiento (ejemplo: 5 de junio del 2002)
        LocalDate fechaNacimiento = LocalDate.of(1992, 2, 4);
        Usuario usuario = new Usuario("Abner Arboleda", fechaNacimiento);
        
        // Calcular la edad en diferentes formatos usando el servicio
        usuario.setEdadEnAnios(calculoEdadService.calcularEdadEnAnios(fechaNacimiento));
        usuario.setEdadEnMeses(calculoEdadService.calcularEdadEnMeses(fechaNacimiento));
        usuario.setEdadEnDias(calculoEdadService.calcularEdadEnDias(fechaNacimiento));
        
        // Calcular edad detallada (años, meses y días)
        CalculoEdadService.EdadDetallada edadDetallada = calculoEdadService.calcularEdadDetallada(fechaNacimiento);
        usuario.setEdadDetallada(edadDetallada.toString());
        
        // enviar el objeto usuario a la vista
        model.addAttribute("usuario", usuario);
        return "saludo";
    }
}
