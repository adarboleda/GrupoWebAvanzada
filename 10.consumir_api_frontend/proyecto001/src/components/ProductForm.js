import { useState, useEffect } from 'react';
import './ProductForm.css';

function ProductForm({ onCrear, onActualizar, productoEditando, onCancelarEdicion }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  // Cargar datos cuando hay un producto en edición
  useEffect(() => {
    if (productoEditando) {
      setTitle(productoEditando.title);
      setPrice(productoEditando.price);
    } else {
      setTitle('');
      setPrice('');
    }
  }, [productoEditando]);

  function manejarSubmit(e) {
    e.preventDefault();
    if (title.trim() === '' || price === '') return;

    const producto = {
      title,
      price: Number(price),
    };

    if (productoEditando) {
      // Modo edición
      onActualizar(productoEditando.id, producto);
    } else {
      // Modo crear
      onCrear(producto);
    }

    // Limpiar el formulario
    setTitle('');
    setPrice('');
  }

  function handleCancelar() {
    setTitle('');
    setPrice('');
    onCancelarEdicion();
  }

  return (
    <div className="form-container">
      <h2>{productoEditando ? 'Editar Producto' : 'Crear Producto'}</h2>
      <form onSubmit={manejarSubmit}>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del producto"
          />
        </div>
        <div className="form-group">
          <label>Precio:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {productoEditando ? 'Actualizar' : 'Crear'}
          </button>
          {productoEditando && (
            <button type="button" className="btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
