package com.example.backend_notas_bdd_1.services;

import com.example.backend_notas_bdd_1.model.Estudiante;
import com.example.backend_notas_bdd_1.repository.EstudianteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {
    //llamar al estudiante repository
    private final EstudianteRepository estudianteRepository;

    public EstudianteService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    //Metodo obtener todos los estudiantes
    public List<Estudiante> obtenerTodos() {
        return estudianteRepository.findAll();
    }

    //Metodo guardar estudiante
    public Estudiante guardarEstudiante(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    // Metodo eliminar estudiante por id
    public void eliminarEstudiantePorId(Long id) {
        estudianteRepository.deleteById(id);
    }

    //Metodo actualizar estudiante
    public Estudiante actualizarEstudiante(Long id, Estudiante estudiante) {
    return estudianteRepository.findById(id)
        .map(estudianteExistente -> {
            estudianteExistente.setNombre(estudiante.getNombre());
            estudianteExistente.setApellido(estudiante.getApellido());
            estudianteExistente.setEmail(estudiante.getEmail());
            estudianteExistente.setFechaNacimiento(estudiante.getFechaNacimiento());
            // actualiza otros campos necesarios
            return estudianteRepository.save(estudianteExistente);
        })
        .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
    }
}