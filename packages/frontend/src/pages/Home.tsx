// import React from 'react';
// import MainLayout from '../layout/MainLayout';
// const Home: React.FC = () => {
//   return (
    
//       <div className="text-center py-10 px-4">
//         <h1 className="text-3xl font-bold text-[#08857D] mb-4">
//          SmartCart - ברוכים הבאים ל
//         </h1>
//         <p className="text-gray-600 text-lg">
//           הפלטפורמה החכמה להשוואת מחירים בין רשתות השיווק בארץ.
//         </p>
//       </div>
 
//   );
// };
// export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BarChart3, ShoppingCart, CheckCircle } from 'lucide-react';
const Home: React.FC = () => {
    const navigate = useNavigate(); // הוסיפי שורה זו
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen px-4 pt-32 text-center">
      {/* כותרת */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#08857D] mb-3">
        SmartCart ברוכים הבאים ל
      </h1>
      {/* תיאור */}
      <p className="text-gray-700 text-base md:text-lg mb-10">
        הפלטפורמה החכמה להשוואת מחירים בין רשתות השיווק בארץ
      </p>
      {/* שלושת הקלפים */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
        {/* 1 */}
        <div className="flex flex-col items-center text-center">
          <Search className="text-[#08857D]" size={48} />
          <h3 className="font-bold text-lg mt-4">חיפוש מוצר</h3>
          <p className="text-gray-600 text-sm mt-1">הקלידו שם המוצר שברצונכם לחפש</p>
        </div>
        {/* 2 */}
        <div className="flex flex-col items-center text-center">
          <BarChart3 className="text-[#08857D]" size={48} />
          <h3 className="font-bold text-lg mt-4">השוואת מחירים</h3>
          <p className="text-gray-600 text-sm mt-1">בדקו היכן המוצר זול יותר מבין סופרים</p>
        </div>
        {/* 3 */}
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="text-[#08857D]" size={48} />
          <h3 className="font-bold text-lg mt-4">סל קניות חכם</h3>
          <p className="text-gray-600 text-sm mt-1">הוסיפו מוצרים לפי הצרכים והתחילו לחסוך</p>
        </div>
      </div>
      {/* כפתור */}
      <button className="bg-[#08857D] hover:bg-[#06665E] text-white text-lg font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
        onClick={() => navigate('/cart')}
  >
        התחילו לבנות את הסל שלכם
      </button>
      {/* איור עגלה – כתחליף נשתמש באייקון גדול */}
      <div className="mt-12 flex justify-center">
        <ShoppingCart size={80} className="text-[#08857D]" />
      </div>
    </div>
  );
};
export default Home;






