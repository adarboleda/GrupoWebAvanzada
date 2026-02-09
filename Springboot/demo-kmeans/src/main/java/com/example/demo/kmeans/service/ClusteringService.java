package com.example.demo.kmeans.service;

import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class ClusteringService {
    @Value("${r.api.baseurl}")
    private String baseUrl;

    /* resTemplate: es el cliente HTTP para llamar a la API de REST */
    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Map<String, Object> obtenerDatosGraficos(){
        String url = baseUrl + "/cluster/plot";
        return Objects.requireNonNull(restTemplate.getForObject(url, Map.class));
    }
}