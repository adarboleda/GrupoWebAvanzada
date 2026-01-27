import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div
      className="min-h-screen flex align-items-center justify-content-center"
      style={{
        background:
          'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
      }}
    >
      <Outlet />
    </div>
  );
}

export default AuthLayout;
