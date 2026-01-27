// URL base de la API
const API_URL = 'http://localhost:8081/api';

// Cargar datos al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
  cargarRubros();
  cargarArticulos();
  cargarOpcionesRubros();
});

// ===== FUNCIONES PARA RUBROS =====

// Cargar todos los rubros
async function cargarRubros() {
  try {
    const response = await fetch(`${API_URL}/rubros`);
    const rubros = await response.json();
    mostrarRubros(rubros);
  } catch (error) {
    console.error('Error al cargar rubros:', error);
    alert('Error al cargar los rubros');
  }
}

// Mostrar rubros en la tabla
function mostrarRubros(rubros) {
  const tbody = document.querySelector('#tablaRubros tbody');
  tbody.innerHTML = '';

  rubros.forEach((rubro) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td>${rubro.id}</td>
            <td>${rubro.nombre}</td>
            <td>
                <button class="btn-edit" onclick='editarRubro(${JSON.stringify(rubro)})'>Actualizar</button>
                <button class="btn-delete" onclick="eliminarRubro(${rubro.id})">Eliminar</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Cargar opciones de rubros en el select
async function cargarOpcionesRubros() {
  try {
    const response = await fetch(`${API_URL}/rubros`);
    const rubros = await response.json();

    const select = document.getElementById('rubroArticulo');
    select.innerHTML = '<option value="">Seleccione una categoría</option>';

    rubros.forEach((rubro) => {
      const option = document.createElement('option');
      option.value = rubro.id;
      option.textContent = rubro.nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar opciones de rubros:', error);
  }
}

// Manejar el formulario de rubro
document
  .getElementById('formRubro')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('rubroId').value;
    const nombre = document.getElementById('nombreRubro').value;

    const isEdit = id !== '';
    const url = isEdit ? `${API_URL}/rubros/${id}` : `${API_URL}/rubros`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre }),
      });

      if (response.ok) {
        alert(
          isEdit
            ? 'Rubro actualizado exitosamente'
            : 'Rubro guardado exitosamente',
        );
        cancelarEdicionRubro();
        cargarRubros();
        cargarOpcionesRubros();
      } else {
        alert('Error al guardar el rubro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el rubro');
    }
  });

// Editar un rubro
function editarRubro(rubro) {
  document.getElementById('rubroId').value = rubro.id;
  document.getElementById('nombreRubro').value = rubro.nombre;
  document.getElementById('tituloFormRubro').textContent = 'Actualizar Rubro';
  document.getElementById('btnGuardarRubro').textContent = 'Actualizar Rubro';
  document.getElementById('btnCancelarRubro').style.display = 'inline-block';

  // Scroll al formulario
  document.getElementById('formRubro').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición de rubro
function cancelarEdicionRubro() {
  document.getElementById('formRubro').reset();
  document.getElementById('rubroId').value = '';
  document.getElementById('tituloFormRubro').textContent =
    'Agregar Nuevo Rubro';
  document.getElementById('btnGuardarRubro').textContent = 'Guardar Rubro';
  document.getElementById('btnCancelarRubro').style.display = 'none';
}

// Eliminar un rubro
async function eliminarRubro(id) {
  if (confirm('¿Está seguro de eliminar este rubro?')) {
    try {
      const response = await fetch(`${API_URL}/rubros/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Rubro eliminado exitosamente');
        cargarRubros();
        cargarOpcionesRubros();
      } else {
        alert(
          'Error al eliminar el rubro. Puede que tenga artículos asociados.',
        );
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el rubro');
    }
  }
}

// ===== FUNCIONES PARA ARTÍCULOS =====

// Cargar todos los artículos
async function cargarArticulos() {
  try {
    const response = await fetch(`${API_URL}/articulos/con-rubro`);
    const articulos = await response.json();
    mostrarArticulos(articulos);
  } catch (error) {
    console.error('Error al cargar artículos:', error);
    alert('Error al cargar los artículos');
  }
}

// Mostrar artículos en la tabla
function mostrarArticulos(articulos) {
  const tbody = document.querySelector('#tablaArticulos tbody');
  tbody.innerHTML = '';

  articulos.forEach((articulo) => {
    const tr = document.createElement('tr');
    const rubroNombre = articulo.rubro
      ? articulo.rubro.nombre
      : 'Sin categoría';

    tr.innerHTML = `
            <td>${articulo.id}</td>
            <td>${articulo.nombre}</td>
            <td>$${parseFloat(articulo.precio).toFixed(2)}</td>
            <td>${articulo.descripcion}</td>
            <td>${rubroNombre}</td>
            <td>
                <button class="btn-edit" onclick='editarArticulo(${JSON.stringify(articulo)})'>Actualizar</button>
                <button class="btn-delete" onclick="eliminarArticulo(${articulo.id})">Eliminar</button>
            </td>
        `;
    tbody.appendChild(tr);
  });
}

// Manejar el formulario de artículo
document
  .getElementById('formArticulo')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    const id = document.getElementById('articuloId').value;
    const nombre = document.getElementById('nombreArticulo').value;
    const precio = parseFloat(document.getElementById('precioArticulo').value);
    const descripcion = document.getElementById('descripcionArticulo').value;
    const rubroId = parseInt(document.getElementById('rubroArticulo').value);

    const isEdit = id !== '';
    const url = isEdit ? `${API_URL}/articulos/${id}` : `${API_URL}/articulos`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          precio,
          descripcion,
          rubroId,
        }),
      });

      if (response.ok) {
        alert(
          isEdit
            ? 'Artículo actualizado exitosamente'
            : 'Artículo guardado exitosamente',
        );
        cancelarEdicionArticulo();
        cargarArticulos();
      } else {
        alert('Error al guardar el artículo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el artículo');
    }
  });

// Editar un artículo
function editarArticulo(articulo) {
  document.getElementById('articuloId').value = articulo.id;
  document.getElementById('nombreArticulo').value = articulo.nombre;
  document.getElementById('precioArticulo').value = articulo.precio;
  document.getElementById('descripcionArticulo').value = articulo.descripcion;
  document.getElementById('rubroArticulo').value = articulo.rubro
    ? articulo.rubro.id
    : '';
  document.getElementById('tituloFormArticulo').textContent =
    'Actualizar Artículo';
  document.getElementById('btnGuardarArticulo').textContent =
    'Actualizar Artículo';
  document.getElementById('btnCancelarArticulo').style.display = 'inline-block';

  // Scroll al formulario
  document
    .getElementById('formArticulo')
    .scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición de artículo
function cancelarEdicionArticulo() {
  document.getElementById('formArticulo').reset();
  document.getElementById('articuloId').value = '';
  document.getElementById('tituloFormArticulo').textContent =
    'Agregar Nuevo Artículo';
  document.getElementById('btnGuardarArticulo').textContent =
    'Guardar Artículo';
  document.getElementById('btnCancelarArticulo').style.display = 'none';
}

// Eliminar un artículo
async function eliminarArticulo(id) {
  if (confirm('¿Está seguro de eliminar este artículo?')) {
    try {
      const response = await fetch(`${API_URL}/articulos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Artículo eliminado exitosamente');
        cargarArticulos();
      } else {
        alert('Error al eliminar el artículo');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el artículo');
    }
  }
}
