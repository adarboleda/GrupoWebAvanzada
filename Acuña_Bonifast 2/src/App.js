// src/App.js
import { useEffect, useState } from "react";
import "./App.css";
import ProductForm from "./Components/productForm";
import ProductList from "./Components/productList";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "./Services/productServices";

function App() {
  const [productos, setProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [productoEdicion, setProductoEdicion] = useState(null);
  const [nextId, setNextId] = useState(101);

  // useEffect: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const data = await obtenerProductos();
        setProductos(data);
        setProductosOriginales(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []); // [] → solo una vez (como componentDidMount)

  //  Evento que viene del hijo ProductForm - Crear
  async function handleCrear(productoNuevo) {
    try {
      const creado = await crearProducto(productoNuevo);
      
      // Agregar ID único local
      const productoConId = {
        ...creado,
        id: nextId
      };
      
      setNextId(nextId + 1);
      setProductos([productoConId, ...productos]);
      setProductosOriginales([productoConId, ...productosOriginales]);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  }

  //  Evento para Actualizar
  async function handleActualizar(id, productoActualizado) {
    try {
      const actualizado = await actualizarProducto(id, productoActualizado);

      // Actualizar el producto en ambos arrays
      const productosActualizados = productos.map(p => p.id === id ? { ...p, ...actualizado } : p);
      const originalesActualizados = productosOriginales.map(p => p.id === id ? { ...p, ...actualizado } : p);
      
      setProductos(productosActualizados);
      setProductosOriginales(originalesActualizados);
      setProductoEdicion(null);
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  }

  //  Evento para Eliminar
  async function handleEliminar(id) {
    try {
      await eliminarProducto(id);

      // Eliminar el producto de ambos arrays
      setProductos(productos.filter(p => p.id !== id));
      setProductosOriginales(productosOriginales.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }

  //  Evento para Editar
  function handleEditar(producto) {
    setProductoEdicion(producto);
  }

  //  Evento para Cancelar edición
  function handleCancelar() {
    setProductoEdicion(null);
  }

  //  Evento para Buscar productos
  function handleBuscar(termino) {
    if (termino.trim() === '') {
      setProductos(productosOriginales);
    } else {
      const filtrados = productosOriginales.filter(p =>
        p.title.toLowerCase().includes(termino.toLowerCase())
      );
      setProductos(filtrados);
    }
  }

  return (
    <div className="App">
      <h1>React + DummyJSON</h1>

      {/* HIJO que genera evento */}
      <ProductForm 
        onCrear={handleCrear}
        onActualizar={handleActualizar}
        productoEdicion={productoEdicion}
        onCancelar={handleCancelar}
      />

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <ProductList 
          products={productos}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
          onBuscar={handleBuscar}
        />
      )}
    </div>
  );
}

export default App;