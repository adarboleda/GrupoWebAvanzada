import { useState, useEffect } from 'react';

function ProductForm({ onCrear, onActualizar, productoEdicion, onCancelar }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  // Cargar datos cuando entra en modo edición
  useEffect(() => {
    if (productoEdicion) {
      setTitle(productoEdicion.title || '');
      setPrice(productoEdicion.price || '');
    } else {
      setTitle('');
      setPrice('');
    }
  }, [productoEdicion]);

  function manejarSubmit(e) {
    e.preventDefault();
    if (title.trim() === '' || price === '') return;

    const producto = {
      title,
      price: Number(price),
    };

    if (productoEdicion) {
      onActualizar(productoEdicion.id, producto);
    } else {
      onCrear(producto);
      setTitle('');
      setPrice('');
    }
  }

  return (
    <form onSubmit={manejarSubmit}>
      <div>
        <label>Título:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      </div>
      <button type="submit">{productoEdicion ? 'Actualizar' : 'Crear'} Producto</button>
      {productoEdicion && <button type="button" onClick={onCancelar}>Cancelar</button>}
    </form>
  );
}

export default ProductForm;