package com.example.backend_notas_bdd_1.controller;

import com.example.backend_notas_bdd_1.model.Nota;
import com.example.backend_notas_bdd_1.services.NotaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService notaService;
    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    //obtener todas
    @GetMapping
    public List<Nota> obtenerTodas() {
        return notaService.obtenerNotas();
    }

    //agregar la nota al estudiante
    @PostMapping("/estudiante/{estudianteId}")
    public Nota agregarNotaAEstudiante(@PathVariable Long estudianteId, @RequestBody Nota nota) {
        return notaService.crearNota(nota, estudianteId);
    }

    //actualizar nota
    @PutMapping("/{id}")
    public Nota actualizarNota(@PathVariable Long id, @RequestBody Nota nota) {
        return notaService.actualizarNota(id, nota);
    }

    //eliminar nota
    @DeleteMapping("/{id}")
    public void eliminarNota(@PathVariable Long id) {
        notaService.eliminarNotaPorId(id);
    }

    //promediar tres notas
    @GetMapping("/promedio")
    public String promediarNotas(@RequestParam Double nota1, @RequestParam Double nota2, @RequestParam Double nota3) {
        return notaService.promediarNotas(nota1, nota2, nota3);
    }
}
