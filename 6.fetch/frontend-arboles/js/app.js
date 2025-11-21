const API = 'http://localhost:3000/api/arboles';

// Variable global para almacenar el último resultado
let ultimoResultado = null;

// ==============================
// Obtener precios en dashboard
// ==============================
async function cargarPrecios() {
  try {
    const resp = await fetch(`${API}/precios`);
    const json = await resp.json();

    const data = json.data;

    let html =
      `<strong>Paltos:</strong> $${data.paltos.precio}<br>` +
      `<strong>Limones:</strong> $${data.limones.precio}<br>` +
      `<strong>Chirimoyos:</strong> $${data.chirimoyos.precio}<br>`;

    document.getElementById('card-precios').innerHTML = html;
  } catch (err) {
    console.error(err);
    document.getElementById('card-precios').textContent = 'Error al cargar';
  }
}

// ==============================
// Calcular total
// ==============================
async function calcular() {
  const paltos = Number(document.getElementById('paltos').value);
  const limones = Number(document.getElementById('limones').value);
  const chirimoyos = Number(document.getElementById('chirimoyos').value);

  try {
    const resp = await fetch(`${API}/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paltos, limones, chirimoyos }),
    });

    const json = await resp.json();
    const data = json.data;

    // ======================
    // ACTUALIZAR CARDS
    // ======================
    document.getElementById('card-total').textContent = data.totalArboles;
    document.getElementById('card-total-pagar').textContent = `$${data.totalPagar.toFixed(2)}`;

    // ======================
    // ACTUALIZAR TABLA
    // ======================
    const tbody = document.getElementById('detalle-body');
    tbody.innerHTML = '';

    const filas = [
      ['Paltos', data.detalle.paltos],
      ['Limones', data.detalle.limones],
      ['Chirimoyos', data.detalle.chirimoyos],
    ];

    filas.forEach(([tipo, info]) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
                <td>${tipo}</td>
                <td>${info.cantidad}</td>
                <td>$${info.precioUnit}</td>
                <td>${info.descuentoAplicado * 100}%</td>
                <td>$${info.subtotalNeto.toFixed(2)}</td>
            `;

      tbody.appendChild(tr);
    });

    document.getElementById('tabla-detalle').hidden = false;

    // ======================
    // JSON COMPLETO
    // ======================
    ultimoResultado = data;
    document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);

    // Habilitar botón de descarga
    document.getElementById('btn-descargar').disabled = false;
  } catch (err) {
    console.error(err);
    alert('Error en la conexión con el backend.');
  }
}

function descargarJSON() {
  if (!ultimoResultado) {
    alert('No hay datos para descargar. Por favor, calcula primero.');
    return;
  }

  // Crear el contenido del archivo
  const jsonString = JSON.stringify(ultimoResultado, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });

  // Crear un enlace temporal
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  // Generar nombre de archivo con fecha y hora
  const fecha = new Date();
  const nombreArchivo = `arboles_${fecha.getFullYear()}-${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${fecha
    .getDate()
    .toString()
    .padStart(2, '0')}_${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}.json`;

  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();

  // Limpiar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Ejecutar al cargar
cargarPrecios();
