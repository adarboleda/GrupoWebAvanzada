import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { useState } from 'react';

function MainLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="min-h-screen flex flex-column">
      {/* Navbar superior */}
      <Navbar onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />

      <div className="flex flex-1">
        {/* Sidebar lateral */}
        {sidebarVisible && <Sidebar />}

        {/* Contenido principal */}
        <main
          className="flex-1 p-4"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
