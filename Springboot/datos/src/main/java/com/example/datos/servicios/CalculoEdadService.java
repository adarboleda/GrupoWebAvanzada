package com.example.datos.servicios;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;

@Service
public class CalculoEdadService {

    /**
     * Calcula la edad en años a partir de la fecha de nacimiento
     */
    public int calcularEdadEnAnios(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return 0;
        }
        return Period.between(fechaNacimiento, LocalDate.now()).getYears();
    }

    /**
     * Calcula la edad total en meses a partir de la fecha de nacimiento
     */
    public long calcularEdadEnMeses(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return 0;
        }
        return ChronoUnit.MONTHS.between(fechaNacimiento, LocalDate.now());
    }

    /**
     * Calcula la edad total en días a partir de la fecha de nacimiento
     */
    public long calcularEdadEnDias(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(fechaNacimiento, LocalDate.now());
    }

    /**
     * Calcula la edad completa (años, meses y días restantes)
     */
    public EdadDetallada calcularEdadDetallada(LocalDate fechaNacimiento) {
        if (fechaNacimiento == null) {
            return new EdadDetallada(0, 0, 0);
        }
        Period periodo = Period.between(fechaNacimiento, LocalDate.now());
        return new EdadDetallada(periodo.getYears(), periodo.getMonths(), periodo.getDays());
    }

    /**
     * Clase interna para representar la edad detallada
     */
    public static class EdadDetallada {
        private final int anios;
        private final int meses;
        private final int dias;

        public EdadDetallada(int anios, int meses, int dias) {
            this.anios = anios;
            this.meses = meses;
            this.dias = dias;
        }

        public int getAnios() {
            return anios;
        }

        public int getMeses() {
            return meses;
        }

        public int getDias() {
            return dias;
        }

        @Override
        public String toString() {
            return anios + " años, " + meses + " meses y " + dias + " días";
        }
    }
}
