import React, { ReactNode } from 'react';
import Header from '../components/Header';

type Props = {
  children: ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      <Header />

      <main className="flex-grow px-6 py-12 mt-20">
        {children}
      </main>

      <footer className="text-center text-sm text-gray-400 py-4 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} SmartCart. כל הזכויות שמורות.
      </footer>
    </div>
  );
};

export default MainLayout;
