package com.facturacion.facturacion.model;

public class Factura {
    //atributos iniciar
    private String codigo;
    private String descripcion;
    private int cantidad;
    private double precioUnitario;
    private double descuento;

    private double subtotal;
    private double iva;
    private double total;

    //funcion calcular total
    public void calcularTotales() {
        this.subtotal = this.cantidad * this.precioUnitario;
        this.iva = this.subtotal * 0.15; // Suponiendo un IVA del 15%
        this.total = this.subtotal + this.iva;
    }

    //metodos get y set
    public String getCodigo() {
        return codigo;
    }
    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public int getCantidad() {
        return cantidad;
    }
    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
    public double getPrecioUnitario() {
        return precioUnitario;
    }
    public void setPrecioUnitario(double precioUnitario) {
        this.precioUnitario = precioUnitario;
    }
    public double getSubtotal() {
        return subtotal;
    }
    public double getIva() {
        return iva;
    }
    public double getTotal() {
        return total;
    }
    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
    public void setIva(double iva) {
        this.iva = iva;
    }
    public void setTotal(double total) {
        this.total = total;
    }
    public double getDescuento() {
        return descuento;
    }
    public void setDescuento(double descuento) {
        this.descuento = descuento;
    }
}
