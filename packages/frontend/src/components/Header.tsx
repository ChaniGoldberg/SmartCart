import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../store/redux/userContext';
import UserSidebar from './UserSidebar';

const Header: React.FC = () => {
  const { user, setUser, setToken } = useUser();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="shadow-md rounded-b-lg overflow-hidden w-full fixed top-0 left-0 z-50">
        {/* פס אפור עליון עם עיגולים צבעוניים */}
        <div className="bg-gray-100 h-6 flex items-center justify-start px-3 space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>

        {/* פס הטורקיז עם הלוגו והתפריטים */}
        <div className="bg-gradient-to-r from-teal-600 to-green-400 text-white px-8 py-3 flex items-center justify-between">
          {/* לוגו */}
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">
              <Link to="/cart" className="no-underline">🛒SmartShop</Link>
            </span>
          </div>

          {/* תפריט ניווט */}
          <nav className="flex gap-6 items-center text-sm font-medium">
            <Link to="/" className="hover:underline">דף הבית</Link>
            <Link to="/map" className="hover:underline">מפה</Link>
            <Link to="/search" className="hover:underline">חיפוש מוצרים</Link>
            <Link to="/comparePage" className="hover:underline">השוואת מוצר</Link>
            {user && (
              <Link to="/notification" className="hover:underline">
                ההתראות שלי
              </Link>
            )}

            {user ? (
              <>
                {/* כפתור עיגול עם האות הראשונה */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="w-9 h-9 bg-white text-teal-600 font-bold rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                  title="פרופיל משתמש"
                >
                  {getInitial(user?.userName || user?.email || '?')}
                </button>

              </>
            ) : (
              <Link to="/login" className="hover:underline text-white text-sm font-semibold">
                התחברות
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* סיידבר פרופיל */}
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default Header;