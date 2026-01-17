import { useState, useRef, useMemo } from 'react';
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
  const totales = useMemo(() => {
    const subtotalSinImpuestos = data.items.reduce((acc, item) => {
      return acc + (item.cantidad * item.precioUnitario - item.descuento);
    }, 0);

    const totalDescuento = data.items.reduce(
      (acc, item) => acc + item.descuento,
      0,
    );
    const iva15 = subtotalSinImpuestos * 0.15;
    const valorTotal = subtotalSinImpuestos + iva15;

    return {
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
    };
  }, [data.items]);

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

  // Totales calculados mediante useMemo (ver declaración arriba)

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
      margin: 0,
      filename: `Factura_${data.factura.numero.replace(/-/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
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

      <style>
        {`
          .border-exact {
            border: 1px solid #000;
          }
          .border-t-exact {
            border-top: 1px solid #000;
          }
          .border-b-exact {
            border-bottom: 1px solid #000;
          }
          table.exact-table {
            width: 100%;
            border-collapse: collapse;
          }
          table.exact-table th,
          table.exact-table td {
            border: 1px solid #000;
            padding: 3px 5px;
            font-size: 10px;
          }
        `}
      </style>

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

          {/* Factura - ESTRUCTURA EXACTA DE PRUEBA.HTML */}
          <div
            ref={facturaRef}
            className="bg-white mx-auto text-[11px] leading-tight"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '12mm',
              boxSizing: 'border-box',
              position: 'relative',
              fontFamily: 'Arial, Helvetica, sans-serif',
              color: '#000',
              backgroundColor: 'white',
            }}
          >
            <div className="flex gap-5 mb-5 items-stretch h-[330px]">
              <div className="w-[50%] flex flex-col">
                <div className="h-36 flex items-center justify-center mb-2">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo empresa"
                      className="w-36 h-36 object-contain rounded-full border-[2px]"
                      style={{ borderColor: '#1e2a4a' }}
                    />
                  ) : (
                    <div className="relative w-36 h-36 border-[2px] border-[#1e2a4a] rounded-full flex flex-col items-center justify-center text-[#1e2a4a]">
                      <span className="absolute top-3 text-[9px] font-bold tracking-[0.2em] uppercase transform -translate-y-1">
                        P I C A N T E R I A
                      </span>
                      <span className="text-[70px] font-serif font-bold leading-none mt-2">
                        M
                      </span>
                      <span className="absolute bottom-10 text-3xl">⚓</span>
                      <span className="absolute bottom-3 text-[9px] font-bold tracking-[0.2em] uppercase">
                        D ' M A R C E L O
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-exact rounded-2xl p-5 flex-grow flex flex-col justify-center">
                  <h2 className="text-[13px] font-bold mb-1">
                    {data.emisor.razonSocial}
                  </h2>
                  <p className="font-bold text-[10px] mb-4 text-gray-700">
                    {data.emisor.nombre}
                  </p>

                  <div className="text-[10px] space-y-2">
                    <div className="flex">
                      <span className="font-bold w-[75px] shrink-0">
                        DIRECCIÓN:
                      </span>
                      <span>{data.emisor.direccion}</span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-[90px] shrink-0 whitespace-nowrap">
                        DIR. SUCURSAL:
                      </span>
                      <span>{data.emisor.dirSucursal}</span>
                    </div>
                    <div className="flex mt-2">
                      <span className="font-bold w-[200px] shrink-0 whitespace-nowrap">
                        OBLIGADO A LLEVAR CONTABILIDAD:
                      </span>
                      <span>{data.emisor.obligadoContabilidad}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-[50%]">
                <div className="border-exact rounded-2xl p-5 h-full text-[10px] flex flex-col relative bg-white">
                  <div className="grid grid-cols-[30px_1fr] gap-y-1 mb-2 items-baseline">
                    <span className="font-bold text-[13px]">R.U.C.:</span>
                    <span className="font-bold text-[13px] pl-4">
                      {data.emisor.ruc}
                    </span>
                  </div>

                  <div className="mb-2">
                    <h2 className="text-[16px] font-bold tracking-widest text-black">
                      F A C T U R A
                    </h2>
                  </div>

                  <div className="grid grid-cols-[30px_1fr] gap-y-1 mb-4 items-baseline">
                    <span className="font-bold text-[12px]">No:</span>
                    <span className="font-mono text-red-600 text-[12px] tracking-widest pl-4">
                      {data.factura.numero}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="font-bold mb-1">NÚMERO DE AUTORIZACIÓN:</p>
                    <p className="text-[10px] text-gray-600 leading-none break-all">
                      {data.factura.autorizacion}
                    </p>
                  </div>

                  <div className="mb-2">
                    <p className="font-bold mb-1">
                      FECHA Y HORA DE AUTORIZACIÓN:
                    </p>
                    <p>
                      {data.factura.fecha} {data.factura.hora}
                    </p>
                  </div>

                  <div className="mb-5">
                    <p>
                      <span className="font-bold">AMBIENTE:</span>{' '}
                      {data.factura.ambiente}
                    </p>
                    <p>
                      <span className="font-bold">EMISION:</span>{' '}
                      {data.factura.emision}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="font-bold mb-1">CLAVE DE ACCESO:</p>

                    <div className="w-full h-[45px] mb-1 overflow-hidden">
                      <svg
                        className="w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 10"
                      >
                        <path
                          d="M0,0 h2 v10 h-2 M4,0 h1 v10 h-1 M7,0 h3 v10 h-3 M12,0 h1 v10 h-1 M15,0 h2 v10 h-2 M19,0 h2 v10 h-2 M23,0 h1 v10 h-1 M26,0 h3 v10 h-3 M32,0 h1 v10 h-1 M35,0 h2 v10 h-2 M39,0 h2 v10 h-2 M44,0 h1 v10 h-1 M47,0 h3 v10 h-3 M52,0 h1 v10 h-1 M55,0 h2 v10 h-2 M59,0 h2 v10 h-2 M64,0 h1 v10 h-1 M67,0 h3 v10 h-3 M72,0 h1 v10 h-1 M75,0 h2 v10 h-2 M79,0 h2 v10 h-2 M84,0 h1 v10 h-1 M87,0 h3 v10 h-3 M92,0 h1 v10 h-1 M95,0 h2 v10 h-2 M99,0 h1 v10 h-1"
                          fill="black"
                        />
                      </svg>
                    </div>

                    <div className="w-full text-center">
                      <p className="text-[9px] font-bold tracking-[1px] leading-none whitespace-nowrap">
                        {data.factura.claveAcceso}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-exact rounded-2xl px-5 py-3 mb-5 text-[10px]">
              <div className="flex items-center w-full">
                <div className="space-y-1 w-[45%]">
                  <div className="flex">
                    <span className="font-bold w-[90px]">RAZON SOCIAL:</span>
                    <span className="uppercase">
                      {data.cliente.razonSocial}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-[90px]">RUC / CI:</span>
                    <span>{data.cliente.ruc}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-[90px]">DIRECCION:</span>
                    <span>{data.cliente.direccion}</span>
                  </div>
                </div>

                <div className="w-[25%] text-center">
                  <span className="font-bold mr-1">FECHA DE EMISION:</span>
                  <span>
                    {data.factura.fecha.split('-').reverse().join('/')}
                  </span>
                </div>

                <div className="w-[30%] text-right">
                  <span className="font-bold mr-2">GUIA DE REMISION:</span>
                  <span>{data.cliente.guiaRemision}</span>
                </div>
              </div>
            </div>

            <table className="exact-table mb-5">
              <thead>
                <tr>
                  <th className="w-10 text-center font-bold">No.</th>
                  <th className="w-16 text-center font-bold">CODIGO</th>
                  <th className="text-left font-bold pl-2">DESCRIPCION</th>
                  <th className="w-20 text-right font-bold">CANTIDAD</th>
                  <th className="w-20 text-right font-bold">PRECIO U.</th>
                  <th className="w-16 text-right font-bold">DESC.</th>
                  <th className="w-20 text-right font-bold">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item.codigo}</td>
                    <td className="pl-2">{item.descripcion}</td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-right">
                      {formatNumber(item.precioUnitario)}
                    </td>
                    <td className="text-right">{item.descuento}</td>
                    <td className="text-right">
                      {formatNumber(
                        item.cantidad * item.precioUnitario - item.descuento,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-5 items-start text-[10px]">
              <div className="w-[60%] flex flex-col gap-4">
                <div className="border-exact">
                  <div className="border-b-exact px-2 py-1 font-bold bg-white">
                    INFORMACIÓN ADICIONAL
                  </div>
                  <div className="p-2 space-y-1">
                    <div className="flex">
                      <span className="font-bold w-[70px]">CORREO:</span>
                      <span>{data.cliente.correo}</span>
                    </div>
                    <div className="flex">
                      <span className="font-bold w-[70px]">TELÉFONO:</span>
                      <span>{data.cliente.telefono}</span>
                    </div>
                  </div>
                </div>

                <table className="exact-table">
                  <thead>
                    <tr>
                      <th className="text-left w-10">COD</th>
                      <th className="text-center">FORMA DE PAGO</th>
                      <th className="text-center w-16">VALOR</th>
                      <th className="text-center w-12">PLAZO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center font-bold">
                        {data.formaPago.codigo}
                      </td>
                      <td>{data.formaPago.descripcion}</td>
                      <td className="text-right">
                        {formatNumber(totales.valorTotal)}
                      </td>
                      <td>{data.formaPago.plazo}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="w-[40%]">
                <table className="exact-table">
                  <tbody>
                    <tr>
                      <td className="font-bold">SUBTOTAL 15%</td>
                      <td className="text-right">
                        {formatNumber(totales.subtotal15)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">SUBTOTAL 0%</td>
                      <td className="text-right">
                        {formatNumber(totales.subtotal0)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">SUBTOTAL NO OBJETO DE IVA</td>
                      <td className="text-right">
                        {formatNumber(totales.subtotalNoObjetoIva)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">SUBTOTAL EXENTO DE IVA</td>
                      <td className="text-right">
                        {formatNumber(totales.subtotalExentoIva)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">SUBTOTAL SIN IMPUESTOS</td>
                      <td className="text-right">
                        {formatNumber(totales.subtotalSinImpuestos)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">TOTAL DESCUENTO</td>
                      <td className="text-right">
                        {formatNumber(totales.totalDescuento)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">SERVICIO</td>
                      <td className="text-right">
                        {formatNumber(totales.servicio)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">ICE</td>
                      <td className="text-right">
                        {formatNumber(totales.ice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold">IVA 15%</td>
                      <td className="text-right">
                        {formatNumber(totales.iva15)}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[12px]">VALOR TOTAL</td>
                      <td className="text-right font-bold text-[12px]">
                        {formatNumber(totales.valorTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
