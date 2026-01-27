import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuthStore } from '../context/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Productos', value: '0', icon: 'pi-box', color: '#6D8196' },
    {
      label: 'Movimientos Hoy',
      value: '0',
      icon: 'pi-arrow-right-arrow-left',
      color: '#4A4A4A',
    },
    {
      label: 'Stock Bajo',
      value: '0',
      icon: 'pi-exclamation-triangle',
      color: '#6D8196',
    },
    { label: 'Bodegas', value: '0', icon: 'pi-building', color: '#4A4A4A' },
  ];

  return (
    <div className="flex flex-column gap-4">
      <div className="flex justify-content-between align-items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-500">Bienvenido, {user?.nombre}</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3">
            <Card className="shadow-2">
              <div className="flex justify-content-between align-items-center">
                <div>
                  <div className="text-500 mb-2">{stat.label}</div>
                  <div className="text-4xl font-bold">{stat.value}</div>
                </div>
                <i
                  className={`pi ${stat.icon} text-4xl`}
                  style={{ color: stat.color }}
                ></i>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Módulos Implementados */}
      <Card title="✅ Sistema Completamente Implementado" className="shadow-2">
        <p className="mb-3">Todos los módulos del sistema están operativos:</p>

        <div className="grid">
          <div className="col-12 md:col-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Módulo 1: Usuarios y Autenticación
            </h3>
            <ul className="list-disc pl-4">
              <li>✅ Registro de personal (4 roles)</li>
              <li>✅ Login con JWT</li>
              <li>✅ Gestión de perfil</li>
              <li>✅ Control de roles y permisos</li>
            </ul>
          </div>

          <div className="col-12 md:col-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Módulo 2: Inventario y Bodegas
            </h3>
            <ul className="list-disc pl-4">
              <li>✅ CRUD de Bodegas</li>
              <li>✅ CRUD de Productos</li>
              <li>✅ Movimientos (entrada/salida)</li>
              <li>✅ Transferencias entre bodegas</li>
            </ul>
          </div>

          <div className="col-12 md:col-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Módulo 3: Rutas y Transporte
            </h3>
            <ul className="list-disc pl-4">
              <li>✅ CRUD de Vehículos</li>
              <li>✅ Asignación de conductores</li>
              <li>✅ Creación de rutas</li>
              <li>✅ Control de estados</li>
            </ul>
          </div>

          <div className="col-12 md:col-6">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--color-primary)' }}
            >
              Módulo 4: Entregas y Seguimiento
            </h3>
            <ul className="list-disc pl-4">
              <li>✅ Registro de entregas</li>
              <li>✅ Estados de entrega</li>
              <li>✅ Tracking GPS simulado</li>
              <li>✅ Historial de entregas</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-4 p-3"
          style={{
            backgroundColor: 'var(--color-accent)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            className="font-semibold mb-2"
            style={{ color: 'var(--color-secondary)' }}
          >
            🎨 Diseño actualizado con paleta oficial:
          </p>
          <div className="flex gap-2 align-items-center">
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#6D8196',
                borderRadius: '4px',
              }}
            ></div>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#4A4A4A',
                borderRadius: '4px',
              }}
            ></div>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#FFFFE3',
                border: '1px solid #CBCBCB',
                borderRadius: '4px',
              }}
            ></div>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#CBCBCB',
                borderRadius: '4px',
              }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
