import React from 'react';
import MainLayout from '../layout/MainLayout';
const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="text-center py-10 px-4">
        <h1 className="text-3xl font-bold text-[#08857D] mb-4">
         SmartCart - ברוכים הבאים ל
        </h1>
        <p className="text-gray-600 text-lg">
          הפלטפורמה החכמה להשוואת מחירים בין רשתות השיווק בארץ.
        </p>
      </div>

    </MainLayout>
  );
};
export default Home;