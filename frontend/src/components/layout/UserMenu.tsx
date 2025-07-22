import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useClickOutside } from '../../hooks/useClickOutside';
import defaultAvatar from '../../assets/images/default-avatar.png';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const domNode = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div ref={domNode} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2">
        <img 
          src={user.avatarUrl || defaultAvatar} 
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
        />
        <span className="font-semibold text-white">{user.mythicCoins} Coins</span>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            Signed in as <br/>
            <strong className="font-bold">{user.username}</strong>
          </div>
          <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            My Profile
          </Link>
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}