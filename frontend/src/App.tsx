import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>
      {/* Rutes Públiques amb fons i centrat especial */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Rutes Principals amb la barra de navegació superior */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {/* Altres rutes privades (com /school) aniran aquí dins */}
      </Route>
    </Routes>
  );
}

export default App;