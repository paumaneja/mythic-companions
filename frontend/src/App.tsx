import { Routes, Route } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import PrivateLayout from './components/layout/PrivateLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const SchoolPage = () => <h1 className="text-3xl font-bold">My Companions (School Page)</h1>;

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route path="/" element={<HomePage />} />

      {/* Private routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/school" element={<SchoolPage />} />
          {/* Altres rutes privades aniran aquí */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;