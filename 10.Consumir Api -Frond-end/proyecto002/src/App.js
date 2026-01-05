import { useEffect, useState } from "react";
import ProductForm from "./componets/productForm";
import ProductList from "./componets/productList";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "./services/productServices";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoEditar, setProductoEditar] = useState(null);

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
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
      const maxId = productos.length > 0
        ? Math.max(...productos.map(p => p.id))
        : 0;

      const productoConId = {
        ...creado,
        id: maxId + 1 // ID único basado en el máximo actual + 1
      };

      // Agregar el producto creado al inicio de la lista
      setProductos([productoConId, ...productos]);
      

      console.log("Producto creado:", productoConId);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  }

  // Evento que viene del hijo ProductForm - ACTUALIZAR
  async function handleActualizar(id, productoActualizado) {
    try {
      const actualizado = await actualizarProducto(id, productoActualizado);

      // Actualizar el producto en la lista
      setProductos(productos.map(p =>
        p.id === id ? { ...p, ...actualizado } : p
      ));

      // Limpiar el estado de edición
      setProductoEditar(null);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  // Evento que viene del hijo ProductList - ELIMINAR
  async function handleEliminar(id) {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) {
      return;
    }

    try {
      await eliminarProducto(id);

      // Eliminar el producto de la lista
      setProductos(productos.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>React + DummyJSON - CRUD Completo</h1>

      {/* Formulario para crear o editar */}
      <ProductForm
        onCrear={handleCrear}
        onActualizar={handleActualizar}
        productoEditar={productoEditar}
        onCancelar={handleCancelar}
      />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList
          productos={productos}
          onEliminar={handleEliminar}
          onEditar={handleEditar}
        />
      )}
    </div>
  );
}

export default App;