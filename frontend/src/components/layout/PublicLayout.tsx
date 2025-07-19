import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      <header className="absolute top-0 left-0 right-0 z-10 bg-transparent">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left side can be empty or have a logo later */}
          <div></div>

          {/* Right Side: Auth buttons */}
          <div className="space-x-4">
            <Link to="/login" className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-md">Login</Link>
            <Link to="/register" className="bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-4 rounded-md">
              Register
            </Link>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;