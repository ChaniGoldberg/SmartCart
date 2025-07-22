// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../store/redux/userContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('האם את/ה בטוח/ה שברצונך להתנתק?');
    if (confirmed) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      navigate('/login'); // ניווט פנימי בלי רענון דף מלא
    }
  };

  return (
    <header className="shadow-md rounded-b-lg overflow-hidden w-full fixed top-0 left-0 z-50">
      {/* פס אפור עם שלושת העיגולים בצד שמאל */}
      <div className="bg-gray-100 h-6 flex items-center justify-start px-3 space-x-2">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>

      {/* פס הטורקיז עם הלוגו והניווט */}
      <div className="bg-gradient-to-r from-teal-600 to-green-400 text-white px-8 py-3 flex items-center justify-between">
        {/* לוגו בצד ימין */}
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🛒</span>
          <span>SmartShop</span>
        </div>

        {/* תפריט ניווט בצד שמאל */}
        <nav className="flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/map" className="hover:underline">Map</Link>
          <Link to="/cart" className="hover:underline">Shopping Cart</Link>
          <Link to="/search" className="hover:underline">search items</Link>

          {/* כאן במקום לינק Log in — אם יש user מציג כפתור התנתק */}
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm font-semibold"
            >
              התנתק
            </button>
          ) : (
            <Link to="/login" className="hover:underline text-white text-sm font-semibold">
              Log in
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
};

export default Header;
