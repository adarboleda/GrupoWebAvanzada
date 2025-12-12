'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cotizacionService } from '@/services/apiService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { useRef } from 'react';
import styles from './historial.module.scss';

interface Cotizacion {
  _id: string;
  numeroCotizacion: string;
  vehiculo: {
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    tipo: string;
  };
  edadConductor: number;
  montoTotal: number;
  montoMensual: number;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Expirada';
  fechaCreacion: string;
  fechaExpiracion: string;
  metodoPago: {
    tipo: string;
  };
  comments?: string;
}

interface FilterState {
  global: string;
  estado: string;
  searchValue: string;
}

export default function HistorialPage() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [filteredCotizaciones, setFilteredCotizaciones] = useState<Cotizacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const toastRef = useRef<Toast>(null);
  const [filters, setFilters] = useState<FilterState>({
    global: '',
    estado: '',
    searchValue: '',
  });
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);
  const [cotizacionToApprove, setCotizacionToApprove] = useState<Cotizacion | null>(null);

  useEffect(() => {
    if (!usuario || !token) {
      router.push('/auth/login');
      return;
    }

    cargarCotizaciones();
  }, [usuario, token, router]);

  useEffect(() => {
    filtrarCotizaciones();
  }, [cotizaciones, filters]);

  const cargarCotizaciones = async () => {
    try {
      setCargando(true);
      setError('');
      const response = await cotizacionService.obtenerCotizaciones();
      if (response.success && response.data) {
        setCotizaciones(response.data);
      } else {
        setError(response.message || 'Error al cargar cotizaciones');
      }
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido';
      setError(mensaje);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: mensaje,
      });
    } finally {
      setCargando(false);
    }
  };

  const filtrarCotizaciones = () => {
    let filtered = [...cotizaciones];

    // Filtrar por búsqueda global
    if (filters.searchValue) {
      const searchLower = filters.searchValue.toLowerCase();
      filtered = filtered.filter((cot) => {
        return (
          cot.numeroCotizacion.toLowerCase().includes(searchLower) ||
          cot.vehiculo.marca.toLowerCase().includes(searchLower) ||
          cot.vehiculo.modelo.toLowerCase().includes(searchLower) ||
          cot.vehiculo.placa.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filtrar por estado
    if (filters.estado) {
      filtered = filtered.filter((cot) => cot.estado === filters.estado);
    }

    setFilteredCotizaciones(filtered);
  };

  const handleEliminarFiltros = () => {
    setFilters({
      global: '',
      estado: '',
      searchValue: '',
    });
  };

  const handleVerDetalle = (cotizacion: Cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowDetailDialog(true);
  };

  const handleAprobarClick = (cotizacion: Cotizacion) => {
    if (cotizacion.estado !== 'Pendiente') {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Advertencia',
        detail: `No se puede aprobar una cotización en estado ${cotizacion.estado}`,
      });
      return;
    }
    setCotizacionToApprove(cotizacion);
    setShowConfirmApprove(true);
  };

  const handleAprobarConfirmado = async () => {
    if (!cotizacionToApprove) return;

    try {
      const response = await cotizacionService.aprobarCotizacion(cotizacionToApprove._id);
      if (response.success) {
        setSuccessMessage(`Cotización ${cotizacionToApprove.numeroCotizacion} aprobada exitosamente`);
        toastRef.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cotización aprobada',
        });
        await cargarCotizaciones();
        setShowConfirmApprove(false);
        setCotizacionToApprove(null);
      } else {
        setError(response.message || 'Error al aprobar cotización');
        toastRef.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Error al aprobar cotización',
        });
      }
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error desconocido';
      setError(mensaje);
      toastRef.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: mensaje,
      });
    }
  };

  const getEstadoTemplate = (rowData: Cotizacion) => {
    const estadoConfig: Record<string, { severity: string; label: string }> = {
      Pendiente: { severity: 'warning', label: 'Pendiente' },
      Aprobada: { severity: 'success', label: 'Aprobada' },
      Rechazada: { severity: 'danger', label: 'Rechazada' },
      Expirada: { severity: 'info', label: 'Expirada' },
    };

    const config = estadoConfig[rowData.estado] || estadoConfig.Pendiente;

    return (
      <Tag
        value={config.label}
        severity={config.severity as any}
      />
    );
  };

  const getMontosTemplate = (rowData: Cotizacion) => {
    return (
      <div className={styles.montos}>
        <div className={styles.montoTotal}>${rowData.montoTotal.toFixed(2)}</div>
        <small className={styles.montoMensual}>${rowData.montoMensual.toFixed(2)}/mes</small>
      </div>
    );
  };

  const getAccionesTemplate = (rowData: Cotizacion) => {
    return (
      <div className={styles.acciones}>
        <Button
          label="Ver Detalle"
          icon="pi pi-eye"
          className="p-button-sm p-button-info"
          onClick={() => handleVerDetalle(rowData)}
          style={{ marginRight: '0.5rem' }}
        />
        {rowData.estado === 'Pendiente' && (
          <Button
            label="Aprobar"
            icon="pi pi-check"
            className="p-button-sm p-button-success"
            onClick={() => handleAprobarClick(rowData)}
          />
        )}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Toast ref={toastRef} />

      <div className={styles.header}>
        <h1>Historial de Cotizaciones</h1>
        <p>Gestiona todas tus cotizaciones de seguros vehiculares</p>
      </div>

      {successMessage && (
        <div className={styles.successAlert}>
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className={styles.errorAlert}>
          <p>{error}</p>
        </div>
      )}

      <Card>
        <div className={styles.filtrosSection}>
          <h3>Filtros de búsqueda</h3>

          <div className={styles.filterGrid}>
            <div className={styles.filterItem}>
              <label>Búsqueda Global</label>
              <InputText
                placeholder="Nro. Cotización, Marca, Modelo, Placa..."
                value={filters.searchValue}
                onChange={(e) =>
                  setFilters({ ...filters, searchValue: e.target.value })
                }
                className={styles.input}
              />
            </div>

            <div className={styles.filterItem}>
              <label>Estado</label>
              <Dropdown
                value={filters.estado}
                onChange={(e) =>
                  setFilters({ ...filters, estado: e.value })
                }
                options={[
                  { label: 'Todos', value: '' },
                  { label: 'Pendiente', value: 'Pendiente' },
                  { label: 'Aprobada', value: 'Aprobada' },
                  { label: 'Rechazada', value: 'Rechazada' },
                  { label: 'Expirada', value: 'Expirada' },
                ]}
                optionLabel="label"
                optionValue="value"
                placeholder="Selecciona un estado"
                className={styles.dropdown}
              />
            </div>

            <div className={styles.filterItem}>
              <label>&nbsp;</label>
              <Button
                label="Limpiar Filtros"
                icon="pi pi-filter-slash"
                onClick={handleEliminarFiltros}
                className="p-button-secondary"
              />
            </div>
          </div>
        </div>

        <div className={styles.tableSection}>
          {cargando ? (
            <div className={styles.cargando}>
              <p>Cargando cotizaciones...</p>
            </div>
          ) : filteredCotizaciones.length === 0 ? (
            <div className={styles.noData}>
              <p>No hay cotizaciones registradas</p>
              <Button
                label="Crear Nueva Cotización"
                icon="pi pi-plus"
                onClick={() => router.push('/seguros/cotizacion')}
              />
            </div>
          ) : (
            <DataTable
              value={filteredCotizaciones}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 20]}
              tableStyle={{ minWidth: '100%' }}
              className={styles.dataTable}
              responsiveLayout="scroll"
              stripedRows
              showGridlines
            >
              <Column
                field="numeroCotizacion"
                header="Nro. Cotización"
                sortable
                style={{ width: '150px' }}
              />

              <Column
                field="vehiculo"
                header="Vehículo"
                body={(rowData: Cotizacion) =>
                  `${rowData.vehiculo.marca} ${rowData.vehiculo.modelo} (${rowData.vehiculo.placa})`
                }
                sortable
                style={{ width: '250px' }}
              />

              <Column
                field="estado"
                header="Estado"
                body={getEstadoTemplate}
                sortable
                style={{ width: '120px' }}
              />

              <Column
                field="montos"
                header="Montos"
                body={getMontosTemplate}
                style={{ width: '150px' }}
              />

              <Column
                field="metodoPago.tipo"
                header="Método de Pago"
                sortable
                style={{ width: '150px' }}
              />

              <Column
                field="fechaCreacion"
                header="Fecha Creación"
                body={(rowData: Cotizacion) =>
                  new Date(rowData.fechaCreacion).toLocaleDateString('es-ES')
                }
                sortable
                style={{ width: '150px' }}
              />

              <Column
                header="Acciones"
                body={getAccionesTemplate}
                style={{ width: '250px' }}
              />
            </DataTable>
          )}
        </div>

        <div className={styles.actionsBottom}>
          <Button
            label="Nueva Cotización"
            icon="pi pi-plus"
            onClick={() => router.push('/seguros/cotizacion')}
          />
        </div>
      </Card>

      {/* Dialog para ver detalles */}
      <Dialog
        header="Detalles de Cotización"
        visible={showDetailDialog}
        onHide={() => setShowDetailDialog(false)}
        modal
        style={{ width: '90vw', maxWidth: '800px' }}
      >
        {selectedCotizacion && (
          <div className={styles.detailsDialog}>
            <div className={styles.detailsSection}>
              <h3>Información General</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Número de Cotización:</span>
                  <span className={styles.value}>{selectedCotizacion.numeroCotizacion}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Estado:</span>
                  <span className={styles.value}>
                    {getEstadoTemplate(selectedCotizacion)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Fecha Creación:</span>
                  <span className={styles.value}>
                    {new Date(selectedCotizacion.fechaCreacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Fecha Expiración:</span>
                  <span className={styles.value}>
                    {new Date(selectedCotizacion.fechaExpiracion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Información del Vehículo</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Marca:</span>
                  <span className={styles.value}>{selectedCotizacion.vehiculo.marca}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Modelo:</span>
                  <span className={styles.value}>{selectedCotizacion.vehiculo.modelo}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Año:</span>
                  <span className={styles.value}>{selectedCotizacion.vehiculo.anio}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Placa:</span>
                  <span className={styles.value}>{selectedCotizacion.vehiculo.placa}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Tipo:</span>
                  <span className={styles.value}>{selectedCotizacion.vehiculo.tipo}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Información del Conductor</h3>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.label}>Edad:</span>
                  <span className={styles.value}>{selectedCotizacion.edadConductor} años</span>
                </div>
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>Montos</h3>
              <div className={styles.montosDetail}>
                <div className={styles.montoRow}>
                  <span className={styles.label}>Monto Total:</span>
                  <span className={styles.valueMontos}>${selectedCotizacion.montoTotal.toFixed(2)}</span>
                </div>
                <div className={styles.montoRow}>
                  <span className={styles.label}>Monto Mensual:</span>
                  <span className={styles.valueMontos}>${selectedCotizacion.montoMensual.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {selectedCotizacion.comments && (
              <div className={styles.detailsSection}>
                <h3>Observaciones</h3>
                <p>{selectedCotizacion.comments}</p>
              </div>
            )}

            <div className={styles.detailsActions}>
              {selectedCotizacion.estado === 'Pendiente' && (
                <Button
                  label="Aprobar Cotización"
                  icon="pi pi-check"
                  className="p-button-success"
                  onClick={() => {
                    setShowDetailDialog(false);
                    handleAprobarClick(selectedCotizacion);
                  }}
                />
              )}
              <Button
                label="Cerrar"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => setShowDetailDialog(false)}
              />
            </div>
          </div>
        )}
      </Dialog>

      {/* Confirm Dialog para aprobar */}
      <ConfirmDialog
        visible={showConfirmApprove}
        onHide={() => setShowConfirmApprove(false)}
        message={`¿Deseas aprobar la cotización ${cotizacionToApprove?.numeroCotizacion}?`}
        header="Confirmar Aprobación"
        icon="pi pi-exclamation-triangle"
        accept={handleAprobarConfirmado}
        reject={() => setShowConfirmApprove(false)}
        acceptLabel="Sí, Aprobar"
        rejectLabel="Cancelar"
      />
    </div>
  );
}
