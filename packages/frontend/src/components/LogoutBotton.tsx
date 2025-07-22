import React from 'react';
import { useUser } from '../store/redux/userContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('האם את/ה בטוח/ה שברצונך להתנתק?');
    if (confirmed) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm font-semibold"
    >
      התנתק
    </button>
  );
};

export default LogoutButton;
