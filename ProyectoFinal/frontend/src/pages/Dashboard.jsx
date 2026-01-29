import { useAuthStore } from '../context/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Productos', value: '0', icon: 'pi-box', color: 'bg-blue-500' },
    {
      label: 'Movimientos Hoy',
      value: '0',
      icon: 'pi-arrow-right-arrow-left',
      color: 'bg-green-500',
    },
    {
      label: 'Stock Bajo',
      value: '0',
      icon: 'pi-exclamation-triangle',
      color: 'bg-yellow-500',
    },
    {
      label: 'Bodegas',
      value: '0',
      icon: 'pi-building',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido, {user?.nombre}</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} rounded-full p-3 text-white`}>
                <i className={`pi ${stat.icon} text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Módulos Implementados */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ✅ Sistema Completamente Implementado
        </h2>
        <p className="text-gray-600 mb-6">
          Todos los módulos del sistema están operativos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Módulo 1 */}
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">
              Módulo 1: Usuarios y Autenticación
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Registro de personal
                (4 roles)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Login con JWT
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Gestión de perfil
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Control de roles y
                permisos
              </li>
            </ul>
          </div>

          {/* Módulo 2 */}
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">
              Módulo 2: Inventario y Bodegas
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> CRUD de Bodegas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> CRUD de Productos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Movimientos
                (entrada/salida)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Transferencias entre
                bodegas
              </li>
            </ul>
          </div>

          {/* Módulo 3 */}
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">
              Módulo 3: Rutas y Transporte
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> CRUD de Vehículos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Asignación de
                conductores
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Creación de rutas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Control de estados
              </li>
            </ul>
          </div>

          {/* Módulo 4 */}
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">
              Módulo 4: Entregas y Seguimiento
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Registro de entregas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Estados de entrega
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Tracking GPS simulado
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span> Historial de entregas
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
