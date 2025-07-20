import { Routes, Route } from 'react-router-dom';
import AuthLayout from './components/layout/AuthLayout';
import PrivateLayout from './components/layout/PrivateLayout';
import PublicLayout from './components/layout/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SchoolPage from './pages/SchoolPage';
import SanctuaryPage from './pages/SanctuaryPage';
import ShopPage from './pages/ShopPage';
import InventoryPage from './pages/InventoryPage';
import MinigameSelectionPage from './pages/MinigameSelectionPage';

function App() {
  return (
    <Routes>
      {/* Public route for the landing page */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* Public routes for authentication, using the AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Private routes, guarded by ProtectedRoute and using PrivateLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/school" element={<SchoolPage />} />
          <Route path="/sanctuary/:id" element={<SanctuaryPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/minigames" element={<MinigameSelectionPage />} />
          {/* Future private routes like /shop or /inventory will go here */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;