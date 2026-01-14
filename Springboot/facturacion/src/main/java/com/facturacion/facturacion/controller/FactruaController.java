package com.facturacion.facturacion.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.facturacion.facturacion.model.Factura;
import com.facturacion.facturacion.service.FacturaService;

@Controller
public class FactruaController {
    @Autowired
    private FacturaService facturaService;

    

    //defino la ruta
    @GetMapping("/")
    public String formularioFactura(Model model) {
        model.addAttribute("factura", new Factura());
        return "factura"; //nombre de la vista factura.html
    }
    //sirve para recibir los datos del formulario
    @PostMapping("/calcular")
    public String calcularFactura(@ModelAttribute Factura factura,  Model model) {
        //factura.calcularTotales();
        facturaService.calcularFactura(factura);
        model.addAttribute("factura", factura);
        return "factura";
    }


}
