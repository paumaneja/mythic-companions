import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const PrivateLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">MythicCompanions</div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link to="/school" className="block px-4 py-2 rounded hover:bg-gray-700">School</Link>
          <Link to="/inventory" className="block px-4 py-2 rounded hover:bg-gray-700">Inventory</Link>
          <Link to="/shop" className="block px-4 py-2 rounded hover:bg-gray-700">Shop</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-md p-4 flex justify-end items-center">
          <div className="mr-4">
            <span className="font-bold">{user?.username}</span> - {user?.mythicCoins} Coins
          </div>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;