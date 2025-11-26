// src/App.js
import { useEffect, useState } from 'react';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './services/productServices';

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoEditando, setProductoEditando] = useState(null);

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); // [] → solo una vez (como componentDidMount)

  //  Evento que viene del hijo ProductForm
  async function handleCrear(productoNuevo) {
    try {
      const creado = await crearProducto(productoNuevo);

      // Generar un ID único local para el nuevo producto
      // Usamos timestamp + random para evitar colisiones
      const productoConId = {
        ...creado,
        id: Date.now() + Math.floor(Math.random() * 1000),
      };

      // Agregar el producto creado al inicio de la lista
      setProductos([productoConId, ...productos]);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  }

  // Evento para eliminar producto
  async function handleEliminar(id) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await eliminarProducto(id);
      // Actualizar la lista eliminando el producto
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  // Evento para actualizar producto
  async function handleActualizar(id, productoActualizado) {
    try {
      const actualizado = await actualizarProducto(id, productoActualizado);

      // Mantener el ID original del producto local
      const productoFinal = {
        ...actualizado,
        id: id, // Preservar el ID original
      };

      // Actualizar la lista con el producto modificado
      setProductos(productos.map((p) => (p.id === id ? productoFinal : p)));
      setProductoEditando(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  }

  // Evento para iniciar edición
  function handleEditar(producto) {
    setProductoEditando(producto);
  }

  // Evento para cancelar edición
  function handleCancelarEdicion() {
    setProductoEditando(null);
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>React + DummyJSON</h1>

      {/* HIJO que genera evento */}
      <ProductForm
        onCrear={handleCrear}
        onActualizar={handleActualizar}
        productoEditando={productoEditando}
        onCancelarEdicion={handleCancelarEdicion}
      />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList productos={productos} onEliminar={handleEliminar} onEditar={handleEditar} />
      )}
    </div>
  );
}

export default App;
