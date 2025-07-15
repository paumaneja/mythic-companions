import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      {/* TODO: Navbar will go here */}
      <header className="bg-gray-800 text-white p-4">
        MythicCompanions
      </header>
      <main className="p-4">
        <Outlet /> {/* Child pages will be rendered here */}
      </main>
    </div>
  );
};

export default MainLayout;