import { useState } from 'react';

function SearchBar({ onBuscar }) {
  const [termino, setTermino] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState('nombre'); // 'nombre' o 'id'

  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar(termino, tipoBusqueda);
  };

  const handleLimpiar = () => {
    setTermino('');
    onBuscar('', tipoBusqueda); // Muestra todos los productos
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}
    >
      <h3 style={{ marginTop: 0 }}>Buscar Producto</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Buscar por:
            </label>
            <select
              value={tipoBusqueda}
              onChange={(e) => setTipoBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            >
              <option value="nombre">Nombre</option>
              <option value="id">ID</option>
            </select>
          </div>

          <div style={{ flex: '2', minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              {tipoBusqueda === 'id' ? 'ID del producto' : 'Nombre del producto'}:
            </label>
            <input
              type={tipoBusqueda === 'id' ? 'number' : 'text'}
              value={termino}
              onChange={(e) => setTermino(e.target.value)}
              placeholder={tipoBusqueda === 'id' ? 'Ej: 1' : 'Ej: iPhone'}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            🔍 Buscar
          </button>

          <button
            type="button"
            onClick={handleLimpiar}
            style={{
              padding: '8px 20px',
              backgroundColor: '#9e9e9e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            ✖ Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
