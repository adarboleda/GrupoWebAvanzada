import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { useState } from 'react';

function MainLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar superior */}
      <Navbar onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />

      <div className="flex flex-1">
        {/* Sidebar lateral */}
        {sidebarVisible && <Sidebar />}

        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
