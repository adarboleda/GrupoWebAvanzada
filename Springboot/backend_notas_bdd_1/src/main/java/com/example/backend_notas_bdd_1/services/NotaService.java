package com.example.backend_notas_bdd_1.services;

import com.example.backend_notas_bdd_1.model.Estudiante;
import com.example.backend_notas_bdd_1.model.Nota;
import com.example.backend_notas_bdd_1.repository.EstudianteRepository;
import com.example.backend_notas_bdd_1.repository.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotaService {
    private final NotaRepository notaRepository;
    private final EstudianteRepository estudianteRepository;

    public NotaService(NotaRepository notaRepository, EstudianteRepository estudianteRepository) {
        this.notaRepository = notaRepository;
        this.estudianteRepository = estudianteRepository;
    }

    /* Crear la nota y asociar a un estudiante */
    public Nota crearNota(Nota nota, Long estudianteId) {
        Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con el id: " + estudianteId));

        //validar nota entre 0 y 10
        if (nota.getNota() < 0 || nota.getNota() > 10) {
            throw new RuntimeException("La nota debe estar entre 0 y 10");
        }
        nota.setEstudiante(estudiante);
        return notaRepository.save(nota);
    }

    /*Obtener las notas*/
    public List<Nota> obtenerNotas() {
        return notaRepository.findAll();
    }

    /*Regla de negocio*/
    public String obtenerEquivalenciaTextual(Double nota) {
        if (nota >= 9 && nota <= 10) {
            return "Sobresaliente";
        } else if (nota >= 7 && nota < 9) {
            return "Notable";
        } else if (nota >= 5 && nota < 7) {
            return "Bien";
        } else if (nota >= 0 && nota < 5) {
            return "Suspenso";
        } else {
            return "Nota fuera de rango";
        }
    }

    /*Metodo actualizar*/
    public Nota actualizarNota(Long id, Nota nota) {
        if (nota.getNota() < 0 || nota.getNota() > 10) {
            throw new RuntimeException("La nota debe estar entre 0 y 10");
        }

        return notaRepository.findById(id)
                .map(notaExistente -> {
                    notaExistente.setAsignatura(nota.getAsignatura());
                    notaExistente.setNota(nota.getNota());
                    // actualiza otros campos necesarios
                    return notaRepository.save(notaExistente);
                })
                .orElseThrow(() -> new RuntimeException("Nota no encontrada con id: " + id));
    }

    /*Eliminar por el id*/
    public void eliminarNotaPorId(Long id) {
        notaRepository.deleteById(id);
    }

    /*Promediar tres notas y obtener equivalencia*/
    public String promediarNotas(Double nota1, Double nota2, Double nota3) {
        //validar que las notas estén entre 0 y 10
        if (nota1 < 0 || nota1 > 10 || nota2 < 0 || nota2 > 10 || nota3 < 0 || nota3 > 10) {
            throw new RuntimeException("Todas las notas deben estar entre 0 y 10");
        }
        
        //calcular el promedio
        Double promedio = (nota1 + nota2 + nota3) / 3.0;
        
        //obtener la equivalencia textual
        return obtenerEquivalenciaTextual(promedio);
    }
}
