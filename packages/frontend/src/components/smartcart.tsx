import React from 'react';
// import Header from './Header';

const Smartcart: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
            <header className="fixed top-0 left-0 right-0 bg-gradient-to-br from-[#08857d] to-[#0db0a5] text-white pb-12 z-50">
                <div className="px-6 pt-3">
                    {/* <Header /> */}
                </div>
            </header>

            {/* גוף הדף */}
            <main className="flex-grow px-6 py-12 bg-white mt-16">
                <div className="text-center text-gray-600 text-lg italic">
                    כאן ייכנסו הכרטיסים או כל רכיב שתרצי 🚀
                </div>
            </main>

            {/* פוטר */}
            <footer className="text-center text-sm text-gray-400 py-4 border-t border-gray-200 bg-white">
                © {new Date().getFullYear()} SmartCart. כל הזכויות שמורות
            </footer>
        </div>
    );
};

export default Smartcart;