import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      {/* TODO: Navbar will go here */}
      <header className="bg-gray-800 text-white p-4">
        Welcome to Mythic Companions
      </header>
      <main>
        <Outlet /> {/* Child pages will be rendered here */}
      </main>
    </div>
  );
};

export default MainLayout;