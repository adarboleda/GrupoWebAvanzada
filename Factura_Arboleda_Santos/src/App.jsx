import { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

// Datos iniciales
const initialData = {
  emisor: {
    nombre: 'PICANTERIA DON MARCELO',
    razonSocial: 'ESCOBAR CAJAMARCA IVETH MARICELA',
    ruc: '0503815623001',
    direccion: 'GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN',
    dirSucursal: 'GALO PLAZA S/N Y CALLE GONZALO ALBARRACIN',
    obligadoContabilidad: 'NO',
  },
  factura: {
    numero: '001-001-000001336',
    autorizacion: '2712202501050381562300120010010000013360503815615',
    fecha: '2025-12-27',
    hora: '10:44:44',
    ambiente: 'PRODUCCION',
    emision: 'NORMAL',
    claveAcceso: '2712202501050381562300120010010000013360503815615',
  },
  cliente: {
    razonSocial: 'DORYS CHICAIZA',
    ruc: '0502986508',
    direccion: 'LATACUNGA',
    fechaEmision: '27/12/2025',
    guiaRemision: '',
    correo: 'dorischicaiza78@gmail.com',
    telefono: '0997835381',
  },
  items: [
    {
      id: 1,
      codigo: '12',
      cantidad: 2,
      descripcion: 'CEVICHE COMPLETO CAMARON',
      precioUnitario: 7.39,
      descuento: 0,
    },
    {
      id: 2,
      codigo: '12',
      cantidad: 1,
      descripcion: 'CEVICHE COMPLETO CONCHA',
      precioUnitario: 7.83,
      descuento: 0,
    },
    {
      id: 3,
      codigo: '20',
      cantidad: 3,
      descripcion: 'JUGO DE NARANJA',
      precioUnitario: 1.09,
      descuento: 0,
    },
  ],
  formaPago: {
    codigo: '01',
    descripcion: 'SIN UTILIZACION DEL SISTEMA FINANCIERO',
    valor: 29.75,
    plazo: '',
  },
};

function App() {
  const [data, setData] = useState(initialData);
  const [logo, setLogo] = useState(null);
  const [totales, setTotales] = useState({
    subtotal15: 0,
    subtotal0: 0,
    subtotalNoObjetoIva: 0,
    subtotalExentoIva: 0,
    subtotalSinImpuestos: 0,
    totalDescuento: 0,
    servicio: 0,
    ice: 0,
    iva15: 0,
    valorTotal: 0,
  });

  const facturaRef = useRef(null);

  // Manejar carga de logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calcular totales automáticamente
  useEffect(() => {
    const subtotalSinImpuestos = data.items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precioUnitario - item.descuento);
    }, 0);

    const totalDescuento = data.items.reduce(
      (acc, item) => acc + item.descuento,
      0,
    );
    const iva15 = subtotalSinImpuestos * 0.15;
    const valorTotal = subtotalSinImpuestos + iva15;

    setTotales({
      subtotal15: subtotalSinImpuestos,
      subtotal0: 0,
      subtotalNoObjetoIva: 0,
      subtotalExentoIva: 0,
      subtotalSinImpuestos: subtotalSinImpuestos,
      totalDescuento: totalDescuento,
      servicio: 0,
      ice: 0,
      iva15: iva15,
      valorTotal: valorTotal,
    });

    // Actualizar valor en forma de pago
    setData((prev) => ({
      ...prev,
      formaPago: {
        ...prev.formaPago,
        valor: valorTotal,
      },
    }));
  }, [data.items]);

  // Funciones para actualizar datos
  const updateEmisor = (field, value) => {
    setData((prev) => ({
      ...prev,
      emisor: { ...prev.emisor, [field]: value },
    }));
  };

  const updateFactura = (field, value) => {
    setData((prev) => ({
      ...prev,
      factura: { ...prev.factura, [field]: value },
    }));
  };

  const updateCliente = (field, value) => {
    setData((prev) => ({
      ...prev,
      cliente: { ...prev.cliente, [field]: value },
    }));
  };

  const updateItem = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'cantidad' ||
                field === 'precioUnitario' ||
                field === 'descuento'
                  ? parseFloat(value) || 0
                  : value,
            }
          : item,
      ),
    }));
  };

  const addItem = () => {
    const newId = Math.max(...data.items.map((i) => i.id)) + 1;
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: newId,
          codigo: '',
          cantidad: 1,
          descripcion: '',
          precioUnitario: 0,
          descuento: 0,
        },
      ],
    }));
  };

  const removeItem = (id) => {
    if (data.items.length > 1) {
      setData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const updateFormaPago = (field, value) => {
    setData((prev) => ({
      ...prev,
      formaPago: { ...prev.formaPago, [field]: value },
    }));
  };

  // Función para descargar PDF
  const downloadPDF = () => {
    const element = facturaRef.current;
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `Factura_${data.factura.numero.replace(/-/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        compress: false,
      },
    };
    html2pdf().set(opt).from(element).save();
  };

  // Formatear número
  const formatNumber = (num) => {
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-6 shadow-lg no-print">
        <div className="max-w-full mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            📄 Generador de Facturas Electrónicas Ecuador
          </h1>
          <button
            onClick={downloadPDF}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Descargar PDF
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 p-4">
        {/* FORMULARIO - Lado Izquierdo */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)] no-print">
          <h2 className="section-title">📝 Formulario de Factura</h2>

          {/* Datos del Emisor */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 px-2 py-1 rounded">
                🏢 Datos del Emisor
              </span>
            </h3>

            {/* Campo para subir logo */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <label className="label-field">Logo de la Empresa</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {logo && (
                <div className="mt-3">
                  <p className="text-xs text-green-600 mb-2">
                    ✓ Logo cargado correctamente
                  </p>
                  <img
                    src={logo}
                    alt="Logo preview"
                    className="w-20 h-20 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label-field">Nombre Comercial</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.emisor.nombre}
                  onChange={(e) => updateEmisor('nombre', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Razón Social</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.emisor.razonSocial}
                  onChange={(e) => updateEmisor('razonSocial', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">RUC</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.emisor.ruc}
                  onChange={(e) => updateEmisor('ruc', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Obligado a Contabilidad</label>
                <select
                  className="input-field"
                  value={data.emisor.obligadoContabilidad}
                  onChange={(e) =>
                    updateEmisor('obligadoContabilidad', e.target.value)
                  }
                >
                  <option value="SI">SI</option>
                  <option value="NO">NO</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Dirección</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.emisor.direccion}
                  onChange={(e) => updateEmisor('direccion', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Dirección Sucursal</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.emisor.dirSucursal}
                  onChange={(e) => updateEmisor('dirSucursal', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Datos de la Factura */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 px-2 py-1 rounded">
                📋 Datos de la Factura
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label-field">Número de Factura</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.factura.numero}
                  onChange={(e) => updateFactura('numero', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Fecha</label>
                <input
                  type="date"
                  className="input-field"
                  value={data.factura.fecha}
                  onChange={(e) => updateFactura('fecha', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Hora</label>
                <input
                  type="time"
                  step="1"
                  className="input-field"
                  value={data.factura.hora}
                  onChange={(e) => updateFactura('hora', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Ambiente</label>
                <select
                  className="input-field"
                  value={data.factura.ambiente}
                  onChange={(e) => updateFactura('ambiente', e.target.value)}
                >
                  <option value="PRODUCCION">PRODUCCION</option>
                  <option value="PRUEBAS">PRUEBAS</option>
                </select>
              </div>
              <div>
                <label className="label-field">Emisión</label>
                <select
                  className="input-field"
                  value={data.factura.emision}
                  onChange={(e) => updateFactura('emision', e.target.value)}
                >
                  <option value="NORMAL">NORMAL</option>
                  <option value="CONTINGENCIA">CONTINGENCIA</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Número de Autorización</label>
                <input
                  type="text"
                  className="input-field font-mono text-xs"
                  value={data.factura.autorizacion}
                  onChange={(e) =>
                    updateFactura('autorizacion', e.target.value)
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Clave de Acceso</label>
                <input
                  type="text"
                  className="input-field font-mono text-xs"
                  value={data.factura.claveAcceso}
                  onChange={(e) => updateFactura('claveAcceso', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Datos del Cliente */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 px-2 py-1 rounded">
                👤 Datos del Cliente
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="label-field">Razón Social</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.cliente.razonSocial}
                  onChange={(e) => updateCliente('razonSocial', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">RUC / CI</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.cliente.ruc}
                  onChange={(e) => updateCliente('ruc', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Dirección</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.cliente.direccion}
                  onChange={(e) => updateCliente('direccion', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Guía de Remisión</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.cliente.guiaRemision}
                  onChange={(e) =>
                    updateCliente('guiaRemision', e.target.value)
                  }
                />
              </div>
              <div>
                <label className="label-field">Correo Electrónico</label>
                <input
                  type="email"
                  className="input-field"
                  value={data.cliente.correo}
                  onChange={(e) => updateCliente('correo', e.target.value)}
                />
              </div>
              <div>
                <label className="label-field">Teléfono</label>
                <input
                  type="tel"
                  className="input-field"
                  value={data.cliente.telefono}
                  onChange={(e) => updateCliente('telefono', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Items / Productos */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2 justify-between">
              <span className="bg-blue-100 px-2 py-1 rounded">
                🛒 Productos / Servicios
              </span>
              <button
                onClick={addItem}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                + Agregar Item
              </button>
            </h3>
            <div className="space-y-3">
              {data.items.map((item, index) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-600">
                      Item #{index + 1}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div>
                      <label className="label-field">Código</label>
                      <input
                        type="text"
                        className="input-field"
                        value={item.codigo}
                        onChange={(e) =>
                          updateItem(item.id, 'codigo', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="label-field">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        className="input-field"
                        value={item.cantidad}
                        onChange={(e) =>
                          updateItem(item.id, 'cantidad', e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="label-field">Descripción</label>
                      <input
                        type="text"
                        className="input-field"
                        value={item.descripcion}
                        onChange={(e) =>
                          updateItem(item.id, 'descripcion', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="label-field">P. Unitario</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={item.precioUnitario}
                        onChange={(e) =>
                          updateItem(item.id, 'precioUnitario', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="label-field">Descuento</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="input-field"
                        value={item.descuento}
                        onChange={(e) =>
                          updateItem(item.id, 'descuento', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Forma de Pago */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-blue-600 mb-3 flex items-center gap-2">
              <span className="bg-blue-100 px-2 py-1 rounded">
                💳 Forma de Pago
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="label-field">Código</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.formaPago.codigo}
                  onChange={(e) => updateFormaPago('codigo', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="label-field">Descripción</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.formaPago.descripcion}
                  onChange={(e) =>
                    updateFormaPago('descripcion', e.target.value)
                  }
                />
              </div>
              <div>
                <label className="label-field">Plazo</label>
                <input
                  type="text"
                  className="input-field"
                  value={data.formaPago.plazo}
                  onChange={(e) => updateFormaPago('plazo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Resumen de Totales */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-md font-semibold text-blue-600 mb-3">
              📊 Resumen de Totales
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span>Subtotal 15%:</span>
              <span className="text-right font-semibold">
                ${formatNumber(totales.subtotal15)}
              </span>
              <span>IVA 15%:</span>
              <span className="text-right font-semibold">
                ${formatNumber(totales.iva15)}
              </span>
              <span className="text-lg font-bold">TOTAL:</span>
              <span className="text-right text-lg font-bold text-green-600">
                ${formatNumber(totales.valorTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* VISTA PREVIA - Lado Derecho */}
        <div className="w-full lg:w-1/2 bg-gray-200 rounded-lg p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <h2 className="text-lg font-bold text-gray-700 mb-3 no-print">
            👁️ Vista Previa de Factura
          </h2>

          {/* Factura */}
          <div
            ref={facturaRef}
            className="bg-white shadow-xl mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '12mm',
              fontFamily: 'Arial, sans-serif',
              fontSize: '10pt',
              lineHeight: '1.35',
              color: '#000',
            }}
          >
            {/* ENCABEZADO */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
              {/* Lado Izquierdo - Logo y datos empresa */}
              <div style={{ width: '50%' }}>
                {/* Logo circular */}
                <div
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo empresa"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'contain',
                        border: '3px solid #2c4a6b',
                        borderRadius: '50%',
                        padding: '8px',
                        backgroundColor: 'white',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        border: '3px solid #2c4a6b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '9pt',
                            fontWeight: 'bold',
                            color: '#2c4a6b',
                          }}
                        >
                          PICANTERIA
                        </div>
                        <div
                          style={{
                            fontSize: '36pt',
                            fontWeight: 'bold',
                            color: '#2c4a6b',
                            lineHeight: '0.9',
                          }}
                        >
                          M
                        </div>
                        <div
                          style={{
                            fontSize: '9pt',
                            fontWeight: 'bold',
                            color: '#2c4a6b',
                          }}
                        >
                          D' MARCELO
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    border: '2px solid #000',
                    padding: '8px 10px',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: '11pt',
                      marginBottom: '4px',
                    }}
                  >
                    {data.emisor.razonSocial}
                  </div>
                  <div style={{ fontSize: '10pt', marginBottom: '4px' }}>
                    {data.emisor.nombre}
                  </div>
                  <div style={{ fontSize: '9pt', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>DIRECCIÓN: </span>
                    <span>{data.emisor.direccion}</span>
                  </div>
                  <div style={{ fontSize: '9pt', marginBottom: '3px' }}>
                    <span style={{ fontWeight: '600' }}>DIR. SUCURSAL: </span>
                    <span>{data.emisor.dirSucursal}</span>
                  </div>
                  <div style={{ fontSize: '9pt' }}>
                    <span style={{ fontWeight: '600' }}>
                      OBLIGADO A LLEVAR CONTABILIDAD:{' '}
                    </span>
                    <span>{data.emisor.obligadoContabilidad}</span>
                  </div>
                </div>
              </div>

              {/* Lado Derecho - Datos factura */}
              <div style={{ width: '50%' }}>
                <div
                  style={{
                    border: '2px solid #000',
                    padding: '10px',
                    borderRadius: '6px',
                    fontSize: '9pt',
                  }}
                >
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>R.U.C.: </span>
                    <span>{data.emisor.ruc}</span>
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontSize: '18pt',
                      fontWeight: 'bold',
                      margin: '8px 0',
                      letterSpacing: '5px',
                    }}
                  >
                    F A C T U R A
                  </div>
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ fontWeight: '600' }}>No: </span>
                    <span style={{ fontWeight: 'bold', color: '#dc2626' }}>
                      {data.factura.numero}
                    </span>
                  </div>
                  <div style={{ marginBottom: '3px', fontWeight: '600' }}>
                    NÚMERO DE AUTORIZACIÓN:
                  </div>
                  <div
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '7.5pt',
                      marginBottom: '8px',
                      wordBreak: 'break-all',
                      lineHeight: '1.2',
                    }}
                  >
                    {data.factura.autorizacion}
                  </div>
                  <div style={{ marginBottom: '3px', fontWeight: '600' }}>
                    FECHA Y HORA DE AUTORIZACIÓN:
                  </div>
                  <div style={{ marginBottom: '8px', fontSize: '9pt' }}>
                    {data.factura.fecha.split('-').reverse().join('-')}{' '}
                    {data.factura.hora}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      marginBottom: '8px',
                      fontSize: '9pt',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: '600' }}>AMBIENTE: </span>
                      <span>{data.factura.ambiente}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: '600' }}>EMISION: </span>
                      <span>{data.factura.emision}</span>
                    </div>
                  </div>
                  <div style={{ marginBottom: '3px', fontWeight: '600' }}>
                    CLAVE DE ACCESO:
                  </div>
                  {/* Código de barras simulado */}
                  <div
                    style={{
                      backgroundColor: '#000',
                      height: '40px',
                      marginBottom: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-evenly',
                      padding: '0 2px',
                    }}
                  >
                    {data.factura.claveAcceso.split('').map((char, i) => (
                      <div
                        key={i}
                        style={{
                          height: '32px',
                          width: parseInt(char) % 2 === 0 ? '2px' : '3px',
                          backgroundColor: 'white',
                          flex: '0 0 auto',
                        }}
                      ></div>
                    ))}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Courier New, monospace',
                      fontSize: '6.5pt',
                      textAlign: 'center',
                      wordBreak: 'break-all',
                      lineHeight: '1.1',
                    }}
                  >
                    {data.factura.claveAcceso}
                  </div>
                </div>
              </div>
            </div>

            {/* INFO CLIENTE */}
            <div
              style={{
                border: '2px solid #000',
                padding: '8px 10px',
                marginBottom: '12px',
                borderRadius: '6px',
                fontSize: '9pt',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  gap: '10px',
                  marginBottom: '6px',
                }}
              >
                <div>
                  <span style={{ fontWeight: '600' }}>RAZON SOCIAL: </span>
                  <span>{data.cliente.razonSocial}</span>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>RUC / CI: </span>
                  <span>{data.cliente.ruc}</span>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>FECHA DE EMISION: </span>
                  <span>
                    {data.factura.fecha.split('-').reverse().join('/')}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '10px',
                }}
              >
                <div>
                  <span style={{ fontWeight: '600' }}>DIRECCION : </span>
                  <span>{data.cliente.direccion}</span>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>GUIA DE REMISION: </span>
                  <span>{data.cliente.guiaRemision}</span>
                </div>
              </div>
            </div>

            {/* TABLA DE ITEMS */}
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: '12px',
                fontSize: '9pt',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: 'white' }}>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '30px',
                    }}
                  >
                    No.
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '60px',
                    }}
                  >
                    CODIGO
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                    }}
                  >
                    DESCRIPCION
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '70px',
                    }}
                  >
                    CANTIDAD
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '70px',
                    }}
                  >
                    PRECIO U.
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '50px',
                    }}
                  >
                    DESC.
                  </th>
                  <th
                    style={{
                      border: '2px solid #000',
                      padding: '6px 8px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      fontWeight: '600',
                      width: '70px',
                    }}
                  >
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {item.codigo}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {item.descripcion}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {item.cantidad}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {formatNumber(item.precioUnitario)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {item.descuento}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '6px 8px',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                      }}
                    >
                      {formatNumber(
                        item.cantidad * item.precioUnitario - item.descuento,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PIE DE PÁGINA */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '9pt' }}>
              {/* Columna Izquierda - Info Adicional y Forma de Pago */}
              <div style={{ width: '58%' }}>
                {/* Información Adicional */}
                <div
                  style={{
                    border: '2px solid #000',
                    padding: '8px 10px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      fontWeight: '600',
                      marginBottom: '5px',
                      fontSize: '9pt',
                    }}
                  >
                    INFORMACIÓN ADICIONAL
                  </div>
                  <div style={{ fontSize: '9pt' }}>
                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ fontWeight: '600' }}>CORREO: </span>
                      <span>{data.cliente.correo}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: '600' }}>TELEFONO: </span>
                      <span>{data.cliente.telefono}</span>
                    </div>
                  </div>
                </div>

                {/* Forma de Pago */}
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '9pt',
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: 'white' }}>
                      <th
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontWeight: '600',
                          width: '40px',
                        }}
                      >
                        COD
                      </th>
                      <th
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontWeight: '600',
                        }}
                      >
                        FORMA DE PAGO
                      </th>
                      <th
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontWeight: '600',
                          width: '60px',
                        }}
                      >
                        VALOR
                      </th>
                      <th
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          fontWeight: '600',
                          width: '60px',
                        }}
                      >
                        PLAZO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                        }}
                      >
                        {data.formaPago.codigo}
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                        }}
                      >
                        {data.formaPago.descripcion}
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.valorTotal)}
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'center',
                          verticalAlign: 'middle',
                        }}
                      >
                        {data.formaPago.plazo}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Columna Derecha - Totales */}
              <div style={{ width: '42%' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '9pt',
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SUBTOTAL 15%
                      </td>
                      <td
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.subtotal15)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SUBTOTAL 0%
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.subtotal0)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SUBTOTAL NO OBJETO DE IVA
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.subtotalNoObjetoIva)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SUBTOTAL EXENTO DE IVA
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.subtotalExentoIva)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SUBTOTAL SIN IMPUESTOS
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.subtotalSinImpuestos)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        TOTAL DESCUENTO
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.totalDescuento)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        SERVICIO
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.servicio)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        ICE
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.ice)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          fontWeight: '600',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        IVA 15%
                      </td>
                      <td
                        style={{
                          border: '1px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                        }}
                      >
                        {formatNumber(totales.iva15)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          fontWeight: 'bold',
                          textAlign: 'left',
                          verticalAlign: 'middle',
                        }}
                      >
                        VALOR TOTAL
                      </td>
                      <td
                        style={{
                          border: '2px solid #000',
                          padding: '6px 8px',
                          textAlign: 'right',
                          verticalAlign: 'middle',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatNumber(totales.valorTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                textAlign: 'center',
                fontSize: '8pt',
                color: '#666',
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #ccc',
              }}
            >
              Página 1 de 1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
