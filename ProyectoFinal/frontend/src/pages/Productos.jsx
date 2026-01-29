import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { FilterMatchMode } from 'primereact/api';
import { productoService, bodegaService } from '../services';

function Productos() {
  const toast = useRef(null);
  const [productos, setProductos] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: 0,
    stock_minimo: 0,
    bodega: null,
  });

  const categorias = [
    { label: 'Alimentos', value: 'alimentos' },
    { label: 'Bebidas', value: 'bebidas' },
    { label: 'Limpieza', value: 'limpieza' },
    { label: 'Electrónica', value: 'electronica' },
    { label: 'Oficina', value: 'oficina' },
    { label: 'Otros', value: 'otros' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [respProductos, respBodegas] = await Promise.all([
        productoService.obtenerTodos({ limit: 100 }),
        bodegaService.obtenerTodas({ activo: true }),
      ]);

      if (respProductos.success) {
        setProductos(respProductos.data.productos);
      }
      if (respBodegas.success) {
        setBodegas(respBodegas.data.bodegas);
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron cargar los datos',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirDialogoNuevo = () => {
    resetFormulario();
    setEditMode(false);
    setShowDialog(true);
  };

  const abrirDialogoEditar = (producto) => {
    setFormData({
      _id: producto._id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria: producto.categoria,
      precio: producto.precio,
      stock_minimo: producto.stock_minimo,
      bodega: producto.bodega?._id || null,
    });
    setEditMode(true);
    setShowDialog(true);
  };

  const resetFormulario = () => {
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      precio: 0,
      stock_minimo: 0,
      bodega: null,
    });
  };

  const handleSubmit = async () => {
    if (!formData.codigo || !formData.nombre || !formData.categoria) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'Complete los campos requeridos',
        life: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      let response;
      if (editMode) {
        response = await productoService.actualizar(formData._id, formData);
      } else {
        response = await productoService.crear(formData);
      }

      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: editMode ? 'Producto actualizado' : 'Producto creado',
          life: 3000,
        });
        setShowDialog(false);
        cargarDatos();
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || 'Error al guardar el producto',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminar = (producto) => {
    confirmDialog({
      message: `¿Está seguro de eliminar el producto "${producto.nombre}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => eliminarProducto(producto._id),
    });
  };

  const eliminarProducto = async (id) => {
    setLoading(true);
    try {
      const response = await productoService.eliminar(id);
      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Producto eliminado',
          life: 3000,
        });
        cargarDatos();
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo eliminar el producto',
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleActivo = async (producto) => {
    try {
      const response = await productoService.actualizar(producto._id, {
        activo: !producto.activo,
      });
      if (response.success) {
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: `Producto ${producto.activo ? 'desactivado' : 'activado'}`,
          life: 3000,
        });
        cargarDatos();
      }
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el estado',
        life: 3000,
      });
    }
  };

  // Templates para columnas
  const stockTemplate = (rowData) => {
    const isLow = rowData.stock_actual <= rowData.stock_minimo;
    return (
      <Tag
        value={rowData.stock_actual}
        severity={isLow ? 'danger' : 'success'}
        icon={isLow ? 'pi pi-exclamation-triangle' : 'pi pi-check'}
      />
    );
  };

  const precioTemplate = (rowData) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(rowData.precio || 0);
  };

  const activoTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.activo ? 'Activo' : 'Inactivo'}
        severity={rowData.activo ? 'success' : 'danger'}
      />
    );
  };

  const accionesTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="info"
          onClick={() => abrirDialogoEditar(rowData)}
          tooltip="Editar"
        />
        <Button
          icon={rowData.activo ? 'pi pi-ban' : 'pi pi-check'}
          rounded
          outlined
          severity="warning"
          onClick={() => toggleActivo(rowData)}
          tooltip={rowData.activo ? 'Desactivar' : 'Activar'}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmarEliminar(rowData)}
          tooltip="Eliminar"
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex gap-2">
        <Button
          label="Nuevo Producto"
          icon="pi pi-plus"
          severity="success"
          onClick={abrirDialogoNuevo}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => {
            setGlobalFilter(e.target.value);
            setFilters({
              global: {
                value: e.target.value,
                matchMode: FilterMatchMode.CONTAINS,
              },
            });
          }}
          placeholder="Buscar productos..."
          style={{ width: '300px' }}
        />
      </span>
    );
  };

  const dialogFooter = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={() => setShowDialog(false)}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        loading={loading}
        onClick={handleSubmit}
      />
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <ConfirmDialog />

      <Card
        title="Gestión de Productos"
        className="shadow-lg"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <Toolbar
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
          className="mb-4"
          style={{
            backgroundColor: 'var(--color-accent)',
            border: '1px solid var(--color-border)',
          }}
        />

        <DataTable
          value={productos}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          filters={filters}
          globalFilterFields={['codigo', 'nombre', 'categoria']}
          emptyMessage="No se encontraron productos"
          stripedRows
          style={{ border: '1px solid var(--color-border)' }}
        >
          <Column
            field="codigo"
            header="Código"
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ minWidth: '200px' }}
          />
          <Column
            field="categoria"
            header="Categoría"
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            field="stock_actual"
            header="Stock"
            body={stockTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            field="precio"
            header="Precio"
            body={precioTemplate}
            sortable
            style={{ minWidth: '120px' }}
          />
          <Column
            field="activo"
            header="Estado"
            body={activoTemplate}
            sortable
            style={{ minWidth: '100px' }}
          />
          <Column
            header="Acciones"
            body={accionesTemplate}
            style={{ minWidth: '180px' }}
          />
        </DataTable>
      </Card>

      <Dialog
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        header={editMode ? 'Editar Producto' : 'Nuevo Producto'}
        modal
        style={{ width: '600px' }}
        footer={dialogFooter}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Código *
            </label>
            <InputText
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value })
              }
              className="w-full"
              disabled={editMode}
            />
          </div>

          <div className="col-span-1">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Categoría *
            </label>
            <Dropdown
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.value })}
              options={categorias}
              placeholder="Seleccione"
              className="w-full"
            />
          </div>

          <div className="col-span-2">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Nombre *
            </label>
            <InputText
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="col-span-2">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Descripción
            </label>
            <InputText
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Precio
            </label>
            <InputNumber
              value={formData.precio}
              onValueChange={(e) =>
                setFormData({ ...formData, precio: e.value })
              }
              mode="currency"
              currency="COP"
              locale="es-CO"
              className="w-full"
            />
          </div>

          <div className="col-span-1">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Stock Mínimo
            </label>
            <InputNumber
              value={formData.stock_minimo}
              onValueChange={(e) =>
                setFormData({ ...formData, stock_minimo: e.value })
              }
              className="w-full"
              min={0}
            />
          </div>

          <div className="col-span-1">
            <label
              className="block mb-2 font-semibold"
              style={{ color: 'var(--color-secondary)' }}
            >
              Bodega
            </label>
            <Dropdown
              value={formData.bodega}
              onChange={(e) => setFormData({ ...formData, bodega: e.value })}
              options={bodegas.map((b) => ({ label: b.nombre, value: b._id }))}
              placeholder="Seleccione"
              className="w-full"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Productos;
