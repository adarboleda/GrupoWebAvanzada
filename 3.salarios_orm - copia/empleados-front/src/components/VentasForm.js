import React, { useState } from "react";

function VentasForm({ onProcesar }) {
  const [texto, setTexto] = useState("");

  // Parsear valores separados por comas o saltos de línea
  const parsearVentas = (str) => {
    return str
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => Number(s))
      .filter((n) => !Number.isNaN(n));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ventas = parsearVentas(texto);
    if (ventas.length === 0) {
      alert("Ingresa al menos una venta válida (números separados por coma o nueva línea).");
      return;
    }
    onProcesar(ventas);
    setTexto("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
      <h2>Procesar Ventas - Tiki Taka</h2>
      <p>Ingresa montos separados por comas o saltos de línea (ej: 100, 550, 1200)</p>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: "8px" }}
      />
      <div style={{ marginTop: "8px" }}>
        <button type="submit">Procesar ventas</button>
      </div>
    </form>
  );
}

export default VentasForm;
