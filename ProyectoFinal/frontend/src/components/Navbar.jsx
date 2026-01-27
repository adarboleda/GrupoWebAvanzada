import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const start = (
    <div className="flex align-items-center gap-2">
      <Button
        icon="pi pi-bars"
        onClick={onToggleSidebar}
        className="p-button-text p-button-rounded"
      />
      <i className="pi pi-box text-3xl text-primary"></i>
      <span className="font-bold text-xl text-primary">Logística</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      {/* Notificaciones */}
      <Button
        icon="pi pi-bell"
        className="p-button-rounded p-button-text"
        badge="3"
        badgeClassName="p-badge-danger"
      />

      {/* Usuario */}
      <div className="flex align-items-center gap-2">
        <Avatar
          label={user?.nombre?.charAt(0).toUpperCase()}
          className="mr-2"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          shape="circle"
        />
        <div className="flex flex-column">
          <span className="font-semibold">{user?.nombre}</span>
          <span className="text-sm text-500">{user?.rol}</span>
        </div>
      </div>

      {/* Logout */}
      <Button
        icon="pi pi-sign-out"
        onClick={handleLogout}
        className="p-button-rounded p-button-text p-button-danger"
        tooltip="Cerrar Sesión"
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  );

  return <Menubar start={start} end={end} style={{ borderRadius: 0 }} />;
}

export default Navbar;
