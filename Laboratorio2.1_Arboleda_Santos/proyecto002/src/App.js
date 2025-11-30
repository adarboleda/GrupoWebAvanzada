import { useEffect, useState } from 'react';
import ProductForm from './componets/productForm';
import ProductList from './componets/productList';
import SearchBar from './componets/searchBar';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './services/productServices';

function App() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoEditar, setProductoEditar] = useState(null);

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
        setProductosFiltrados(data); // Inicializar filtrados
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); // [] → solo una vez (como componentDidMount)

  // Evento que viene del hijo ProductForm - CREAR
  async function handleCrear(productoNuevo) {
    try {
      const creado = await crearProducto(productoNuevo);

      // DummyJSON siempre devuelve el mismo ID para productos nuevos (simulación)
      // Generamos un ID único local para evitar duplicados
      const maxId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) : 0;

      const productoConId = {
        ...creado,
        id: maxId + 1, // ID único basado en el máximo actual + 1
      };

      // Agregar el producto creado al inicio de la lista
      const nuevaLista = [productoConId, ...productos];
      setProductos(nuevaLista);
      setProductosFiltrados(nuevaLista);

      console.log('Producto creado:', productoConId);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  }

  // Evento que viene del hijo ProductForm - ACTUALIZAR
  async function handleActualizar(id, productoActualizado) {
    try {
      const actualizado = await actualizarProducto(id, productoActualizado);

      // Actualizar el producto en la lista
      const listaActualizada = productos.map((p) => (p.id === id ? { ...p, ...actualizado } : p));
      setProductos(listaActualizada);
      setProductosFiltrados(listaActualizada);

      // Limpiar el estado de edición
      setProductoEditar(null);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  }

  // Evento que viene del hijo ProductList - ELIMINAR
  async function handleEliminar(id) {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }

    try {
      await eliminarProducto(id);

      // Eliminar el producto de la lista
      const listaFiltrada = productos.filter((p) => p.id !== id);
      setProductos(listaFiltrada);
      setProductosFiltrados(listaFiltrada);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  // Evento que viene del hijo ProductList - EDITAR
  function handleEditar(producto) {
    setProductoEditar(producto);
  }

  // Cancelar edición
  function handleCancelar() {
    setProductoEditar(null);
  }

  // Búsqueda de productos
  function handleBuscar(termino, tipoBusqueda) {
    if (!termino || termino.trim() === '') {
      // Si no hay término, mostrar todos
      setProductosFiltrados(productos);
      return;
    }

    const terminoLower = termino.toLowerCase();

    if (tipoBusqueda === 'id') {
      // Búsqueda por ID (exacta)
      const resultado = productos.filter((p) => p.id === parseInt(termino));
      setProductosFiltrados(resultado);
    } else {
      // Búsqueda por nombre (contiene)
      const resultado = productos.filter((p) => p.title.toLowerCase().includes(terminoLower));
      setProductosFiltrados(resultado);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React + DummyJSON - CRUD Completo</h1>

      {/* Formulario para crear o editar */}
      <ProductForm
        onCrear={handleCrear}
        onActualizar={handleActualizar}
        productoEditar={productoEditar}
        onCancelar={handleCancelar}
      />

      {/* Barra de búsqueda */}
      {!cargando && <SearchBar onBuscar={handleBuscar} />}

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <>
          {productosFiltrados.length === 0 && productos.length > 0 && (
            <p
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#fff3cd',
                borderRadius: '5px',
                color: '#856404',
              }}
            >
              No se encontraron productos con ese criterio de búsqueda.
            </p>
          )}
          <ProductList
            productos={productosFiltrados}
            onEliminar={handleEliminar}
            onEditar={handleEditar}
          />
        </>
      )}
    </div>
  );
}

export default App;
