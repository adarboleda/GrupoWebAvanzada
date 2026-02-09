package com.example.demo.kmeans.controller;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.demo.kmeans.service.ClusteringService;

@Controller
public class ClusteringController {

    private final ClusteringService clusteringService;

    public ClusteringController(ClusteringService clusteringService) {
        this.clusteringService = clusteringService;
    }

    // método principal
    @GetMapping("/")
    public String index(Model model) {
        Map<String, Object> datosGraficos = clusteringService.obtenerDatosGraficos();
        model.addAttribute("puntos", datosGraficos.get("puntos"));
        model.addAttribute("clusters", datosGraficos.get("clusters"));
        return "index";
    }
}
