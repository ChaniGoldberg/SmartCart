// src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => (
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
        <span className="text-xl">
          <Link to="/cart" className="no-underline">🛒SmartShop</Link></span>
      </div>

      {/* תפריט ניווט בצד שמאל */}
      <nav className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:underline">דף הבית</Link>
        <Link to="/map" className="hover:underline">מפה</Link>
        <Link to="/search" className="hover:underline">חיפוש מוצרים</Link>
        <Link to="/login" className="hover:underline">התחברות</Link>
      </nav>
    </div>
  </header>
);

export default Header;
