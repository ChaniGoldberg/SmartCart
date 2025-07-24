import React, { useState, useContext } from 'react';
import { cartContext } from '../store/redux/cartRedux';

interface ShareCartPopupProps {
  onClose: () => void;
}

const ShareCartPopup: React.FC<ShareCartPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const context = useContext(cartContext);

  if (!context) throw new Error("Cart must be used within a CartProvider");
  const { cartItems } = context;

  const handleSubmit = async () => {
    if (!email) {
      alert("יש להזין כתובת מייל");
      return;
    }

    const res = await fetch('/api/share-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cart: cartItems }),
    });

    if (res.ok) {
      alert('הסל נשלח בהצלחה!');
      setEmail('');
      onClose();
    } else {
      alert('שליחת הסל נכשלה.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl mb-4 font-semibold text-gray-800 text-center">שלח את הסל במייל</h2>
        <input
          type="email"
          className="border rounded p-2 w-full mb-4"
          placeholder="example@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded w-full"
        >
          שליחה
        </button>
      </div>
    </div>
  );
};

export default ShareCartPopup;
