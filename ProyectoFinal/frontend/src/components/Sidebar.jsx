import { Menu } from 'primereact/menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      label: 'Principal',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => navigate('/dashboard'),
        },
      ],
    },
    {
      label: 'Inventario',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-box',
          command: () => navigate('/productos'),
        },
        {
          label: 'Movimientos',
          icon: 'pi pi-arrow-right-arrow-left',
          command: () => navigate('/movimientos'),
        },
      ],
    },
    {
      label: 'Gestión',
      items: [
        {
          label: 'Bodegas',
          icon: 'pi pi-building',
          command: () => navigate('/bodegas'),
        },
        {
          label: 'Vehículos',
          icon: 'pi pi-car',
          command: () => navigate('/vehiculos'),
        },
        {
          label: 'Rutas',
          icon: 'pi pi-map',
          command: () => navigate('/rutas'),
        },
      ],
    },
    {
      label: 'Administración',
      visible: user?.rol === 'admin' || user?.rol === 'coordinador',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          command: () => navigate('/usuarios'),
          visible: user?.rol === 'admin',
        },
      ].filter((item) => item.visible !== false),
    },
  ].filter((section) => section.visible !== false);

  return (
    <div
      className="surface-section h-screen p-3"
      style={{
        width: '280px',
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      }}
    >
      <Menu model={menuItems} className="w-full border-none" />
    </div>
  );
}

export default Sidebar;
