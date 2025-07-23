import { Outlet, Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const PrivateLayout = () => {

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navbar */}
      <header className="bg-gray-800 font-tomorrow text-white shadow-md z-10">
        <nav className="mx-auto px-6 py-3 flex justify-between items-center">
          {/* Left Side: Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link to="/school" className="hover:text-blue-400 hover:underline">School</Link>
            <Link to="/inventory" className="hover:text-blue-400 hover:underline">Inventory</Link>
            <Link to="/shop" className="hover:text-blue-400 hover:underline">Shop</Link>
            <Link to="/minigames" className="hover:text-blue-400 hover:underline">Mini-Games</Link>
          </div>

          {/* Right Side: User Menu */}
          <UserMenu />
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;