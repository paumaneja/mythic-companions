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
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <header className="bg-gray-800 text-white shadow-md z-10">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          {/* Left Side: Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/school" className="hover:text-blue-400">School</Link>
            <Link to="/inventory" className="hover:text-blue-400">Inventory</Link>
            <Link to="/shop" className="hover:text-blue-400">Shop</Link>
          </div>

          {/* Right Side: User Menu */}
          <div className="flex items-center space-x-4">
            <span>{user?.mythicCoins} Coins</span>
            <div className="relative">
               {/* TODO: Implement dropdown menu */}
               <span className="font-bold">{user?.username}</span>
            </div>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;