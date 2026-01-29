import { useAuthStore } from '../context/authStore';
import { useNavigate } from 'react-router-dom';

function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <i className="pi pi-bars text-xl"></i>
            </button>
            <div className="flex items-center gap-2">
              <i className="pi pi-box text-2xl text-primary-600"></i>
              <span className="text-xl font-bold text-gray-900">
                Plataforma Logística
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
              <i className="pi pi-bell text-xl"></i>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                3
              </span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.nombre}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
              title="Cerrar Sesión"
            >
              <i className="pi pi-sign-out text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
