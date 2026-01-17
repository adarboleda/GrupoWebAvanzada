package com.example.calculadora.services;

import com.example.calculadora.model.Operacion;
import org.springframework.stereotype.Service;

@Service
public class CalculadoraService {

    public Operacion calcular(double numero1, double numero2, String operacion) {
        Operacion op = new Operacion(numero1, numero2, operacion);
        double resultado = 0;

        switch (operacion.toLowerCase()) {
            case "suma":
            case "+":
                resultado = numero1 + numero2;
                break;
            case "resta":
            case "-":
                resultado = numero1 - numero2;
                break;
            case "multiplicacion":
            case "*":
                resultado = numero1 * numero2;
                break;
            case "division":
            case "/":
                if (numero2 != 0) {
                    resultado = numero1 / numero2;
                } else {
                    throw new IllegalArgumentException("No se puede dividir por cero");
                }
                break;
            default:
                throw new IllegalArgumentException("Operación no válida: " + operacion);
        }

        op.setResultado(resultado);
        return op;
    }
}
