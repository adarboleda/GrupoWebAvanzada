'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cotizacionService } from '@/services/apiService';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Textarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import styles from './cotizacion.module.scss';
import { useRef, useEffect } from 'react';

interface FormData {
  vehiculo: {
    marca: string;
    modelo: string;
    anio: number;
    placa: string;
    tipo: string;
    valor: number;
    usoComercial: boolean;
  };
  edadConductor: number;
  accidentesHistorico: number;
  cobertura: {
    responsabilidadCivil: boolean;
    daniosTotal: boolean;
    roboTerceros: boolean;
    asistenciaVial: boolean;
    proteccionPasajeros: boolean;
  };
  metodoPago: {
    tipo: string;
    tarjeta: string;
  };
  comentarios: string;
}

interface Cotizacion {
  _id: string;
  numeroCotizacion: string;
  vehiculo: any;
  edadConductor: number;
  accidentesHistorico: number;
  montoMensual: number;
  montoTotal: number;
  costosBase: any;
  costosAdicionales: any;
  metodoPago: any;
  estado: string;
  fechaExpiracion: string;
  createdAt: string;
}

export default function CotizacionPage() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const toast = useRef<Toast>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!usuario || !token) {
      router.push('/auth/login');
    }
  }, [usuario, token, router]);
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [cotizacion, setCotizacion] = useState<Cotizacion | null>(null);

  const [formData, setFormData] = useState<FormData>({
    vehiculo: {
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      placa: '',
      tipo: 'Sedán',
      valor: 20000,
      usoComercial: false,
    },
    edadConductor: 30,
    accidentesHistorico: 0,
    cobertura: {
      responsabilidadCivil: true,
      daniosTotal: true,
      roboTerceros: false,
      asistenciaVial: false,
      proteccionPasajeros: false,
    },
    metodoPago: {
      tipo: 'Única',
      tarjeta: 'VISA',
    },
    comentarios: '',
  });

  const tiposVehiculo = [
    { label: 'Sedán', value: 'Sedán' },
    { label: 'SUV', value: 'SUV' },
    { label: 'Camioneta', value: 'Camioneta' },
    { label: 'Minivan', value: 'Minivan' },
    { label: 'Hatchback', value: 'Hatchback' },
    { label: 'Deportivo', value: 'Deportivo' },
  ];

  const tiposPago = [
    { label: 'Única', value: 'Única' },
    { label: '3 cuotas', value: '3 cuotas' },
    { label: '6 cuotas', value: '6 cuotas' },
    { label: '12 cuotas', value: '12 cuotas' },
  ];

  const tiposTarjeta = [
    { label: 'VISA', value: 'VISA' },
    { label: 'MASTERCARD', value: 'MASTERCARD' },
    { label: 'AMEX', value: 'AMEX' },
  ];

  const validarPaso1 = (): boolean => {
    const { vehiculo, edadConductor } = formData;
    
    if (!vehiculo.marca || !vehiculo.modelo || !vehiculo.placa) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor completa todos los datos del vehículo',
      });
      return false;
    }
    
    if (edadConductor < 18) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El conductor debe ser mayor de 18 años',
      });
      return false;
    }
    
    if (edadConductor > 75) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pueden cotizar conductores mayores de 75 años',
      });
      return false;
    }
    
    const antiguedad = new Date().getFullYear() - vehiculo.anio;
    if (antiguedad > 20) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se cotizan vehículos con más de 20 años de antigüedad',
      });
      return false;
    }
    
    return true;
  };

  const handleCotizar = async () => {
    if (!validarPaso1()) return;

    setCargando(true);
    const resultado = await cotizacionService.crearCotizacion(formData);
    setCargando(false);

    if (resultado.ok) {
      setCotizacion(resultado.cotizacion);
      setPaso(3);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cotización generada correctamente',
      });
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: resultado.error,
      });
    }
  };

  const handleAprobar = async () => {
    if (!cotizacion) return;

    setCargando(true);
    const resultado = await cotizacionService.aprobarCotizacion(cotizacion._id);
    setCargando(false);

    if (resultado.ok) {
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cotización aprobada. Redirigiendo al historial...',
      });
      setTimeout(() => router.push('/seguros/historial'), 1500);
    } else {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: resultado.error,
      });
    }
  };

  const calcularMontoAproximado = (): number => {
    const precioBase = 650;
    const { edadConductor, accidentesHistorico } = formData;

    let monto = precioBase;

    if (edadConductor <= 24) monto *= 1.25;
    else if (edadConductor > 65) monto *= 1.15;

    if (accidentesHistorico === 0) monto *= 0.9;
    else monto *= 1 + accidentesHistorico * 0.1;

    let coberturasAdicionales = 0;
    if (formData.cobertura.daniosTotal) coberturasAdicionales += 50;
    if (formData.cobertura.roboTerceros) coberturasAdicionales += 75;
    if (formData.cobertura.asistenciaVial) coberturasAdicionales += 30;
    if (formData.cobertura.proteccionPasajeros) coberturasAdicionales += 40;

    monto += coberturasAdicionales;

    return Math.round(monto);
  };

  return (
    <div className={styles.container}>
      <Toast ref={toast} />
      
      <div className={styles.header}>
        <h1>Cotizador de Seguros Vehiculares</h1>
        <p>Calcula el costo de tu seguro en tiempo real</p>
      </div>

      {paso === 1 && (
        <Card className={styles.card}>
          <h2>Paso 1: Datos del Vehículo y Conductor</h2>
          
          <div className={styles.section}>
            <h3>📍 Datos del Vehículo</h3>
            <Divider />
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Marca</label>
                <InputText
                  value={formData.vehiculo.marca}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, marca: e.target.value },
                    })
                  }
                  placeholder="Toyota, Chevrolet..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>Modelo</label>
                <InputText
                  value={formData.vehiculo.modelo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, modelo: e.target.value },
                    })
                  }
                  placeholder="Corolla, Cruze..."
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Año</label>
                <InputNumber
                  value={formData.vehiculo.anio}
                  onValueChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, anio: e.value || new Date().getFullYear() },
                    })
                  }
                  min={2000}
                  max={new Date().getFullYear()}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Placa</label>
                <InputText
                  value={formData.vehiculo.placa}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, placa: e.target.value.toUpperCase() },
                    })
                  }
                  placeholder="ABC-1234"
                  maxLength={8}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tipo de Vehículo</label>
                <Dropdown
                  value={formData.vehiculo.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, tipo: e.value },
                    })
                  }
                  options={tiposVehiculo}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Valor del Vehículo (USD)</label>
                <InputNumber
                  value={formData.vehiculo.valor}
                  onValueChange={(e) =>
                    setFormData({
                      ...formData,
                      vehiculo: { ...formData.vehiculo, valor: e.value || 20000 },
                    })
                  }
                  min={1000}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <Checkbox
                inputId="usoComercial"
                checked={formData.vehiculo.usoComercial}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehiculo: { ...formData.vehiculo, usoComercial: e.checked || false },
                  })
                }
              />
              <label htmlFor="usoComercial">¿Uso comercial? (recargo 15%)</label>
            </div>
          </div>

          <div className={styles.section}>
            <h3>👤 Datos del Conductor</h3>
            <Divider />
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Edad del Conductor</label>
                <InputNumber
                  value={formData.edadConductor}
                  onValueChange={(e) =>
                    setFormData({
                      ...formData,
                      edadConductor: e.value || 30,
                    })
                  }
                  min={18}
                  max={120}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Accidentes Históricos</label>
                <InputNumber
                  value={formData.accidentesHistorico}
                  onValueChange={(e) =>
                    setFormData({
                      ...formData,
                      accidentesHistorico: e.value || 0,
                    })
                  }
                  min={0}
                  max={10}
                />
              </div>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              label="Siguiente →"
              onClick={() => setPaso(2)}
              className="p-button-primary"
            />
          </div>
        </Card>
      )}

      {paso === 2 && (
        <Card className={styles.card}>
          <h2>Paso 2: Coberturas y Forma de Pago</h2>
          
          <div className={styles.section}>
            <h3>🛡️ Coberturas</h3>
            <p className={styles.help}>Responsabilidad Civil está incluida por defecto</p>
            <Divider />
            
            <div className={styles.coberturasGrid}>
              {Object.entries(formData.cobertura).map(([tipo, valor]) =>
                tipo !== 'responsabilidadCivil' ? (
                  <div key={tipo} className={styles.coberturaItem}>
                    <Checkbox
                      inputId={tipo}
                      checked={valor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cobertura: {
                            ...formData.cobertura,
                            [tipo]: e.checked || false,
                          },
                        })
                      }
                    />
                    <label htmlFor={tipo}>
                      {tipo === 'daniosTotal' && '💥 Daños Total'}
                      {tipo === 'roboTerceros' && '🔓 Robo/Terceros'}
                      {tipo === 'asistenciaVial' && '🚗 Asistencia Vial'}
                      {tipo === 'proteccionPasajeros' && '👥 Protección Pasajeros'}
                    </label>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div className={styles.section}>
            <h3>💳 Forma de Pago</h3>
            <Divider />
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Tipo de Pago</label>
                <Dropdown
                  value={formData.metodoPago.tipo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metodoPago: { ...formData.metodoPago, tipo: e.value },
                    })
                  }
                  options={tiposPago}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Tarjeta</label>
                <Dropdown
                  value={formData.metodoPago.tarjeta}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metodoPago: { ...formData.metodoPago, tarjeta: e.value },
                    })
                  }
                  options={tiposTarjeta}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Comentarios Adicionales</label>
              <Textarea
                value={formData.comentarios}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    comentarios: e.target.value,
                  })
                }
                placeholder="Información adicional..."
                rows={3}
              />
            </div>
          </div>

          <div className={styles.montoAproximado}>
            <p>Monto Aproximado Mensual: <strong>${calcularMontoAproximado().toLocaleString()}</strong></p>
            <small>*Cálculo aproximado, el monto final se generará después de validación</small>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              label="← Anterior"
              onClick={() => setPaso(1)}
              className="p-button-secondary"
            />
            <Button
              label="Generar Cotización"
              onClick={handleCotizar}
              loading={cargando}
              className="p-button-primary"
            />
          </div>
        </Card>
      )}

      {paso === 3 && cotizacion && (
        <Card className={styles.card}>
          <h2>✅ Cotización Generada</h2>
          
          <div className={styles.resumenCard}>
            <div className={styles.resumenHeader}>
              <div>
                <p className={styles.numeroCotizacion}>Nº {cotizacion.numeroCotizacion}</p>
                <p className={styles.fecha}>
                  Generada: {new Date(cotizacion.createdAt).toLocaleDateString('es-ES')}
                </p>
              </div>
              <Tag value={cotizacion.estado} severity="success" />
            </div>

            <Divider />

            <div className={styles.resumenGrid}>
              <div className={styles.resumenItem}>
                <span className={styles.label}>Vehículo:</span>
                <span className={styles.valor}>
                  {cotizacion.vehiculo.marca} {cotizacion.vehiculo.modelo} {cotizacion.vehiculo.anio}
                </span>
              </div>
              <div className={styles.resumenItem}>
                <span className={styles.label}>Placa:</span>
                <span className={styles.valor}>{cotizacion.vehiculo.placa}</span>
              </div>
              <div className={styles.resumenItem}>
                <span className={styles.label}>Edad Conductor:</span>
                <span className={styles.valor}>{cotizacion.edadConductor} años</span>
              </div>
              <div className={styles.resumenItem}>
                <span className={styles.label}>Accidentes:</span>
                <span className={styles.valor}>{cotizacion.accidentesHistorico}</span>
              </div>
            </div>

            <Divider />

            <div className={styles.costos}>
              <h3>📊 Desglose de Costos</h3>
              <div className={styles.desglose}>
                <div className={styles.desgloceItem}>
                  <span>Precio Base del Vehículo:</span>
                  <span>${cotizacion.costosBase.precioBaseVehiculo.toFixed(2)}</span>
                </div>
                {cotizacion.costosBase.recargoConductor > 0 && (
                  <div className={styles.desgloceItem}>
                    <span>Recargo por Conductor:</span>
                    <span>+${cotizacion.costosBase.recargoConductor.toFixed(2)}</span>
                  </div>
                )}
                {cotizacion.costosBase.descuentoSinAccidentes > 0 && (
                  <div className={`${styles.desgloceItem} ${styles.discount}`}>
                    <span>Descuento sin Accidentes:</span>
                    <span>-${cotizacion.costosBase.descuentoSinAccidentes.toFixed(2)}</span>
                  </div>
                )}
                {cotizacion.costosBase.recargoAccidentes > 0 && (
                  <div className={styles.desgloceItem}>
                    <span>Recargo por Accidentes:</span>
                    <span>+${cotizacion.costosBase.recargoAccidentes.toFixed(2)}</span>
                  </div>
                )}
                {cotizacion.costosAdicionales.costoCoberturaAdicional > 0 && (
                  <div className={styles.desgloceItem}>
                    <span>Coberturas Adicionales:</span>
                    <span>+${cotizacion.costosAdicionales.costoCoberturaAdicional.toFixed(2)}</span>
                  </div>
                )}
                {cotizacion.costosAdicionales.interesCuotas > 0 && (
                  <div className={styles.desgloceItem}>
                    <span>Interés Cuotas:</span>
                    <span>+${cotizacion.costosAdicionales.interesCuotas.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.resumenTotal}>
              <div className={styles.totalItem}>
                <span>Monto Mensual:</span>
                <strong>${cotizacion.montoMensual.toFixed(2)}</strong>
              </div>
              <div className={styles.totalItem}>
                <span>Monto Total {cotizacion.metodoPago.tipo}:</span>
                <strong>${cotizacion.montoTotal.toFixed(2)}</strong>
              </div>
            </div>

            <div className={styles.infoAlert}>
              <p>💡 <strong>Vigencia:</strong> Esta cotización vence el {new Date(cotizacion.fechaExpiracion).toLocaleDateString('es-ES')}</p>
              <p>✅ <strong>Próximo Paso:</strong> Aprueba esta cotización para crear la póliza</p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              label="Nueva Cotización"
              onClick={() => {
                setPaso(1);
                setCotizacion(null);
              }}
              className="p-button-secondary"
            />
            <Button
              label="✓ Aprobar Cotización"
              onClick={handleAprobar}
              loading={cargando}
              className="p-button-success"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
