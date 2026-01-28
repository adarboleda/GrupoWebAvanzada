package com.example.calculos_poliza.service;

import com.example.calculos_poliza.model.Cliente;
import com.example.calculos_poliza.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ClienteService {
    
    @Autowired
    private ClienteRepository clienteRepository;

    /**
     * Obtiene todos los clientes
     */
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAllByOrderByFechaRegistroDesc();
    }

    /**
     * Obtiene un cliente por ID
     */
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }

    /**
     * Busca clientes por nombre
     */
    public List<Cliente> buscarPorNombre(String nombre) {
        return clienteRepository.findByNombreContainingIgnoreCase(nombre);
    }

    /**
     * Crea un nuevo cliente
     */
    public Cliente crear(Cliente cliente) {
        validarCliente(cliente);
        return clienteRepository.save(cliente);
    }

    /**
     * Actualiza un cliente existente
     */
    public Cliente actualizar(Long id, Cliente clienteActualizado) {
        Optional<Cliente> clienteExistente = clienteRepository.findById(id);
        
        if (clienteExistente.isPresent()) {
            Cliente cliente = clienteExistente.get();
            
            if (clienteActualizado.getNombre() != null) {
                cliente.setNombre(clienteActualizado.getNombre());
            }
            if (clienteActualizado.getEdad() != null) {
                cliente.setEdad(clienteActualizado.getEdad());
            }
            if (clienteActualizado.getAccidentes() != null) {
                cliente.setAccidentes(clienteActualizado.getAccidentes());
            }
            
            validarCliente(cliente);
            return clienteRepository.save(cliente);
        }
        
        throw new RuntimeException("Cliente no encontrado con ID: " + id);
    }

    /**
     * Elimina un cliente
     */
    public void eliminar(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cliente no encontrado con ID: " + id);
        }
    }

    /**
     * Obtiene el número total de clientes
     */
    public long contar() {
        return clienteRepository.count();
    }

    /**
     * Valida los datos del cliente
     */
    private void validarCliente(Cliente cliente) {
        if (cliente.getNombre() == null || cliente.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cliente es obligatorio");
        }
        
        if (cliente.getEdad() == null || cliente.getEdad() < 18 || cliente.getEdad() > 120) {
            throw new IllegalArgumentException("La edad debe estar entre 18 y 120 años");
        }
        
        if (cliente.getAccidentes() == null || cliente.getAccidentes() < 0) {
            throw new IllegalArgumentException("El número de accidentes no puede ser negativo");
        }
    }
}
