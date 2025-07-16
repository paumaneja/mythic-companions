import { Outlet } from 'react-router-dom';
import AuthBackgroundImage from '../../assets/images/auth-background.jpg';

const AuthLayout = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${AuthBackgroundImage})` }}
    >
      <Outlet />
    </div>
  );
};

export default AuthLayout;