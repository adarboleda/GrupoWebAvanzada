import { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { Tag } from 'primereact/tag';
import { useRef } from 'react';
import { productoService, usuarioService } from '../services';
import api from '../services/api';

function Rutas() {
  const toast = useRef(null);

  // Estados del formulario
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    origen: {
      nombre: '',
      direccion: '',
      latitud: '',
      longitud: '',
    },
    destino: {
      nombre: '',
      direccion: '',
      latitud: '',
      longitud: '',
      contacto: {
        nombre: '',
        telefono: '',
        email: '',
      },
    },
    fecha_programada: null,
    vehiculo: null,
    conductor: null,
    observaciones: '',
    distancia_estimada: 0,
    tiempo_estimado: 0,
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    setLoading(true);
    try {
      // Cargar productos
      const respProductos = await productoService.obtenerTodos({
        activo: true,
        limit: 100,
      });
      if (respProductos.success) {
        setProductos(respProductos.data.productos);
      }

      // Cargar conductores
      const respConductores =
        await usuarioService.obtenerConductoresDisponibles();
      if (respConductores.success) {
        setConductores(respConductores.data.conductores);
      }

      // Cargar vehículos (simulado - ajustar cuando tengas el endpoint)
      const respVehiculos = await api.get('/vehiculos?estado=disponible');
      if (respVehiculos.data.success) {
        setVehiculos(respVehiculos.data.data.vehiculos);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos iniciales',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoCrear = () => {
    resetFormulario();
    setShowDialog(true);
  };

  const resetFormulario = () => {
    setFormData({
      origen: {
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
      },
      destino: {
        nombre: '',
        direccion: '',
        latitud: '',
        longitud: '',
        contacto: {
          nombre: '',
          telefono: '',
          email: '',
        },
      },
      fecha_programada: null,
      vehiculo: null,
      conductor: null,
      observaciones: '',
      distancia_estimada: 0,
      tiempo_estimado: 0,
    });
    setProductosSeleccionados([]);
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!formData.origen.nombre || !formData.origen.direccion) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Complete los datos del origen',
        life: 3000,
      });
      return;
    }

    if (!formData.destino.nombre || !formData.destino.direccion) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Complete los datos del destino',
        life: 3000,
      });
      return;
    }

    if (!formData.vehiculo) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione un vehículo',
        life: 3000,
      });
      return;
    }

    if (!formData.conductor) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione un conductor',
        life: 3000,
      });
      return;
    }

    if (!formData.fecha_programada) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione la fecha programada',
        life: 3000,
      });
      return;
    }

    if (productosSeleccionados.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Seleccione al menos un producto',
        life: 3000,
      });
      return;
    }

    // Confirmar creación
    confirmDialog({
      message: '¿Está seguro de crear esta ruta?',
      header: 'Confirmar Creación',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        setLoading(true);
        try {
          // Preparar datos para enviar
          const rutaData = {
            origen: {
              nombre: formData.origen.nombre,
              direccion: formData.origen.direccion,
              coordenadas: {
                latitud: parseFloat(formData.origen.latitud) || 0,
                longitud: parseFloat(formData.origen.longitud) || 0,
              },
            },
            destino: {
              nombre: formData.destino.nombre,
              direccion: formData.destino.direccion,
              coordenadas: {
                latitud: parseFloat(formData.destino.latitud) || 0,
                longitud: parseFloat(formData.destino.longitud) || 0,
              },
              contacto: {
                nombre: formData.destino.contacto.nombre,
                telefono: formData.destino.contacto.telefono,
                email: formData.destino.contacto.email,
              },
            },
            fecha_programada: formData.fecha_programada,
            vehiculo: formData.vehiculo._id,
            conductor: formData.conductor._id,
            lista_productos: productosSeleccionados.map((p) => ({
              producto: p._id,
              cantidad: p.cantidadRuta || 1,
            })),
            observaciones: formData.observaciones,
            distancia_km: formData.distancia_estimada,
            tiempo_estimado_horas: formData.tiempo_estimado,
          };

          const response = await api.post('/rutas', rutaData);

          if (response.data.success) {
            toast.current?.show({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Ruta creada exitosamente',
              life: 3000,
            });
            setShowDialog(false);
            resetFormulario();
            // Aquí podrías recargar la lista de rutas
          }
        } catch (error) {
          console.error('Error creando ruta:', error);
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error.response?.data?.message || 'No se pudo crear la ruta',
            life: 4000,
          });
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Templates para las columnas de productos
  const nombreProductoTemplate = (rowData) => {
    return (
      <div>
        <div
          className="font-semibold"
          style={{ color: 'var(--color-secondary)' }}
        >
          {rowData.nombre}
        </div>
        <div className="text-sm text-500">{rowData.codigo}</div>
      </div>
    );
  };

  const stockTemplate = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        <span>{rowData.stock_actual}</span>
        <span className="text-500">{rowData.unidadMedida}</span>
      </div>
    );
  };

  const cantidadTemplate = (rowData) => {
    return (
      <InputNumber
        value={rowData.cantidadRuta || 1}
        onValueChange={(e) => {
          const updatedProductos = productosSeleccionados.map((p) =>
            p._id === rowData._id ? { ...p, cantidadRuta: e.value } : p,
          );
          setProductosSeleccionados(updatedProductos);
        }}
        min={1}
        max={rowData.stock_actual}
        showButtons
        buttonLayout="horizontal"
        decrementButtonClassName="p-button-outlined"
        incrementButtonClassName="p-button-outlined"
      />
    );
  };

  const bodegaTemplate = (rowData) => {
    return rowData.bodega?.nombre || 'N/A';
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <Card
        title="Gestión de Rutas"
        className="shadow-lg"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <Toolbar
          left={() => (
            <Button
              label="Nueva Ruta"
              icon="pi pi-plus"
              severity="success"
              onClick={abrirDialogoCrear}
            />
          )}
          className="mb-4"
          style={{
            backgroundColor: 'var(--color-accent)',
            border: '1px solid var(--color-border)',
          }}
        />

        <div
          className="text-center py-6"
          style={{
            backgroundColor: 'var(--color-accent)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <i
            className="pi pi-map mb-3"
            style={{ fontSize: '4rem', color: 'var(--color-primary)' }}
          ></i>
          <h3
            className="mb-2"
            style={{ fontSize: '1.5rem', color: 'var(--color-secondary)' }}
          >
            Lista de Rutas
          </h3>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            La vista de lista de rutas se implementará próximamente
          </p>
          <Button
            label="Crear Primera Ruta"
            icon="pi pi-plus"
            onClick={abrirDialogoCrear}
            outlined
          />
        </div>
      </Card>

      {/* Dialog para crear ruta */}
      <Dialog
        header="Crear Nueva Ruta"
        visible={showDialog}
        style={{ width: '90vw', maxWidth: '1200px' }}
        onHide={() => setShowDialog(false)}
        maximizable
        modal
      >
        <div className="grid">
          {/* Columna Izquierda - Información General */}
          <div className="col-12 lg:col-6">
            <Card
              title="Información de Origen"
              className="mb-3"
              style={{
                backgroundColor: 'var(--color-accent)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex flex-column gap-3">
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="origen-nombre"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Nombre del Lugar
                  </label>
                  <InputText
                    id="origen-nombre"
                    value={formData.origen.nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        origen: { ...formData.origen, nombre: e.target.value },
                      })
                    }
                    placeholder="Ej: Bodega Central"
                  />
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="origen-direccion"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Dirección
                  </label>
                  <InputTextarea
                    id="origen-direccion"
                    value={formData.origen.direccion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        origen: {
                          ...formData.origen,
                          direccion: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    placeholder="Dirección completa del origen"
                  />
                </div>

                <div className="grid">
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Latitud
                    </label>
                    <InputText
                      value={formData.origen.latitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          origen: {
                            ...formData.origen,
                            latitud: e.target.value,
                          },
                        })
                      }
                      placeholder="0.000000"
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Longitud
                    </label>
                    <InputText
                      value={formData.origen.longitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          origen: {
                            ...formData.origen,
                            longitud: e.target.value,
                          },
                        })
                      }
                      placeholder="0.000000"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card
              title="Información de Destino"
              className="mb-3"
              style={{
                backgroundColor: 'var(--color-accent)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex flex-column gap-3">
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="destino-nombre"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Nombre del Lugar
                  </label>
                  <InputText
                    id="destino-nombre"
                    value={formData.destino.nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destino: {
                          ...formData.destino,
                          nombre: e.target.value,
                        },
                      })
                    }
                    placeholder="Ej: Cliente ABC"
                  />
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="destino-direccion"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Dirección
                  </label>
                  <InputTextarea
                    id="destino-direccion"
                    value={formData.destino.direccion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destino: {
                          ...formData.destino,
                          direccion: e.target.value,
                        },
                      })
                    }
                    rows={2}
                    placeholder="Dirección completa del destino"
                  />
                </div>

                <div className="grid">
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Latitud
                    </label>
                    <InputText
                      value={formData.destino.latitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destino: {
                            ...formData.destino,
                            latitud: e.target.value,
                          },
                        })
                      }
                      placeholder="0.000000"
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Longitud
                    </label>
                    <InputText
                      value={formData.destino.longitud}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          destino: {
                            ...formData.destino,
                            longitud: e.target.value,
                          },
                        })
                      }
                      placeholder="0.000000"
                    />
                  </div>
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Contacto en Destino (Opcional)
                  </label>
                  <InputText
                    value={formData.destino.contacto.nombre}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destino: {
                          ...formData.destino,
                          contacto: {
                            ...formData.destino.contacto,
                            nombre: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Nombre del contacto"
                    className="mb-2"
                  />
                  <InputText
                    value={formData.destino.contacto.telefono}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destino: {
                          ...formData.destino,
                          contacto: {
                            ...formData.destino.contacto,
                            telefono: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Teléfono"
                    className="mb-2"
                  />
                  <InputText
                    value={formData.destino.contacto.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destino: {
                          ...formData.destino,
                          contacto: {
                            ...formData.destino.contacto,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                    placeholder="Email"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Columna Derecha - Asignación y Productos */}
          <div className="col-12 lg:col-6">
            <Card
              title="Asignación de Recursos"
              className="mb-3"
              style={{
                backgroundColor: 'var(--color-accent)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex flex-column gap-3">
                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="vehiculo"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    <i className="pi pi-car mr-2"></i>
                    Vehículo *
                  </label>
                  <Dropdown
                    id="vehiculo"
                    value={formData.vehiculo}
                    options={vehiculos}
                    onChange={(e) =>
                      setFormData({ ...formData, vehiculo: e.value })
                    }
                    optionLabel="placa"
                    placeholder="Seleccione un vehículo"
                    filter
                    showClear
                    emptyMessage="No hay vehículos disponibles"
                    itemTemplate={(option) => (
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-car"></i>
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: 'var(--color-secondary)' }}
                          >
                            {option.placa}
                          </div>
                          <div className="text-sm text-500">
                            {option.marca} {option.modelo} - {option.tipo}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="conductor"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    <i className="pi pi-user mr-2"></i>
                    Conductor *
                  </label>
                  <Dropdown
                    id="conductor"
                    value={formData.conductor}
                    options={conductores}
                    onChange={(e) =>
                      setFormData({ ...formData, conductor: e.value })
                    }
                    optionLabel="nombre"
                    placeholder="Seleccione un conductor"
                    filter
                    showClear
                    emptyMessage="No hay conductores disponibles"
                    itemTemplate={(option) => (
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-user"></i>
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: 'var(--color-secondary)' }}
                          >
                            {option.nombre}
                          </div>
                          <div className="text-sm text-500">{option.email}</div>
                        </div>
                      </div>
                    )}
                  />
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="fecha"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    <i className="pi pi-calendar mr-2"></i>
                    Fecha Programada *
                  </label>
                  <Calendar
                    id="fecha"
                    value={formData.fecha_programada}
                    onChange={(e) =>
                      setFormData({ ...formData, fecha_programada: e.value })
                    }
                    showTime
                    hourFormat="24"
                    dateFormat="dd/mm/yy"
                    placeholder="Seleccione fecha y hora"
                    showIcon
                    minDate={new Date()}
                  />
                </div>

                <div className="grid">
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Distancia (km)
                    </label>
                    <InputNumber
                      value={formData.distancia_estimada}
                      onValueChange={(e) =>
                        setFormData({
                          ...formData,
                          distancia_estimada: e.value,
                        })
                      }
                      min={0}
                      suffix=" km"
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="font-semibold"
                      style={{ color: 'var(--color-secondary)' }}
                    >
                      Tiempo (min)
                    </label>
                    <InputNumber
                      value={formData.tiempo_estimado}
                      onValueChange={(e) =>
                        setFormData({ ...formData, tiempo_estimado: e.value })
                      }
                      min={0}
                      suffix=" min"
                    />
                  </div>
                </div>

                <div className="flex flex-column gap-2">
                  <label
                    htmlFor="observaciones"
                    className="font-semibold"
                    style={{ color: 'var(--color-secondary)' }}
                  >
                    Observaciones
                  </label>
                  <InputTextarea
                    id="observaciones"
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observaciones: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="Observaciones adicionales..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Productos - Ancho Completo */}
          <div className="col-12">
            <Card
              title="Productos a Transportar"
              className="mb-3"
              style={{
                backgroundColor: 'var(--color-accent)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Message
                severity="info"
                text="Seleccione los productos y defina las cantidades a transportar en esta ruta"
                className="mb-3"
              />

              <DataTable
                value={productos}
                selection={productosSeleccionados}
                onSelectionChange={(e) => setProductosSeleccionados(e.value)}
                dataKey="_id"
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                emptyMessage="No hay productos disponibles"
                loading={loading}
                stripedRows
                selectionMode="checkbox"
              >
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: '3rem' }}
                />
                <Column
                  field="nombre"
                  header="Producto"
                  body={nombreProductoTemplate}
                  sortable
                />
                <Column field="categoria" header="Categoría" sortable />
                <Column
                  field="stock_actual"
                  header="Stock Disponible"
                  body={stockTemplate}
                  sortable
                />
                <Column
                  field="bodega"
                  header="Bodega"
                  body={bodegaTemplate}
                  sortable
                />
                <Column
                  header="Cantidad a Transportar"
                  body={cantidadTemplate}
                  style={{ width: '200px' }}
                />
              </DataTable>

              {productosSeleccionados.length > 0 && (
                <div
                  className="mt-3 p-3 border-round"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <strong style={{ color: 'var(--color-secondary)' }}>
                    Resumen:
                  </strong>{' '}
                  {productosSeleccionados.length} producto(s) seleccionado(s)
                  <div
                    className="text-sm mt-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    Total de unidades:{' '}
                    {productosSeleccionados.reduce(
                      (sum, p) => sum + (p.cantidadRuta || 1),
                      0,
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Botones del Dialog */}
        <div className="flex justify-content-end gap-2 mt-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            outlined
            onClick={() => setShowDialog(false)}
            disabled={loading}
          />
          <Button
            label="Crear Ruta"
            icon="pi pi-check"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Dialog>
    </div>
  );
}

export default Rutas;
