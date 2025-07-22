import React, { ReactNode } from 'react';
import Header from '../components/Header';

type Props = {
  children: ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-gray-800 font-sans">
      {/* HEADER עם z-50 ומיקום קבוע */}
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <Header />
      </div>
      <div className="h-20" />

      <main className="flex-grow overflow-hidden">
        {children}
      </main>

      <footer className="text-center text-sm text-gray-400 py-4 border-t border-gray-200 bg-white">
        © {new Date().getFullYear()} SmartCart. כל הזכויות שמורות.
      </footer>
    </div>
  );
};

export default MainLayout;
