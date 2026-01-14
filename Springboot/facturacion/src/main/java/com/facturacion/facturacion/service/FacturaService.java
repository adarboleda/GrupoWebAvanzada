package com.facturacion.facturacion.service;

import org.springframework.stereotype.Service;
import com.facturacion.facturacion.model.Factura;

@Service
public class FacturaService {

    //metodo para calcular la factura
    public void calcularFactura(Factura factura) {
        // Calcular subtotal
        double subtotal = factura.getCantidad() * factura.getPrecioUnitario();
        factura.setSubtotal(subtotal);

        // Calcular descuento
        double porcentajeDescuento = 0.0;
        if (factura.getCantidad() == 8) {
            porcentajeDescuento = 0.10;
        } else if (factura.getCantidad() == 4) {
            porcentajeDescuento = 0.05;
        }
        
        double montoDescuento = subtotal * porcentajeDescuento;
        factura.setDescuento(montoDescuento);
        
        // Calcular subtotal con descuento
        double subtotalConDescuento = subtotal - montoDescuento;
        
        // Calcular IVA
        double iva = subtotalConDescuento * 0.15;
        factura.setIva(iva);
        
        // Calcular total
        double total = subtotalConDescuento + iva;
        factura.setTotal(total);
    }
}
