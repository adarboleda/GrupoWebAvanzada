import React from "react";

function EmpleadoDetalle({ detalle }) {
  return (
    <div
      style={{
        marginTop: "2rem",
        background: "#f9f9f9",
        padding: "1rem",
        borderRadius: "8px",
      }}
    >
      <h3>Detalle del Salario - {detalle.nombreCompleto}</h3>
      <p>
        <b>ID:</b> {detalle.id}
      </p>
      <p>
        <b>Horas Trabajadas:</b> {detalle.horasTrabajadas} horas
      </p>
      <p>
        <b>Horas Normales (hasta 40h):</b> {detalle.horasNormales} horas × $20 =
        ${detalle.pagoNormal}
      </p>
      <p>
        <b>Horas Extras (más de 40h):</b> {detalle.horasExtras} horas × $25 = $
        {detalle.pagoExtra}
      </p>
      <h4>
        <b>Salario Total Semanal:</b> ${detalle.total}
      </h4>
    </div>
  );
}

export default EmpleadoDetalle;
