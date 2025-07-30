import React, { useState, useEffect } from 'react';
import { useUser } from '../store/redux/userContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const { user, setUser, token, setToken } = useUser();
  useEffect(() => {
    if (token !== null) {
      console.log("🔑 Current token:", token);
    }
  }, [token]);

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.userName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [isSwalActive, setIsSwalActive] = useState(false);

  useEffect(() => {
    setName(user?.userName || '');
    setEmail(user?.email || '');
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        setUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
      if (event.key === 'token') {
        setToken(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setUser, setToken]);


  const handleLogout = async () => {
    setIsSwalActive(true);

    const result = await Swal.fire({
      title: 'האם את/ה בטוח/ה שברצונך להתנתק?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'כן, התנתק',
      cancelButtonText: 'ביטול',
      background: '#fff',
      customClass: {
        popup: 'text-right rtl',
      }
    });

    setIsSwalActive(false);

    if (result.isConfirmed) {
      setIsSwalActive(true);
      await Swal.fire({
        title: 'התנתקת בהצלחה',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        background: '#fff',
        customClass: {
          popup: 'text-right rtl',
        },
      });
      setIsSwalActive(false);

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      navigate('/');
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password && password !== confirmPassword) {
      setError('הסיסמאות לא תואמות');
      return;
    }
    if (password && !/\d/.test(password)) {
      setError('הסיסמה חייבת לכלול לפחות ספרה אחת');
      return;
    }

    if (!user?.userId) {
      console.error("❌ User ID is missing. Cannot update user.");
      return;
    }

    const updatedUser: any = {
      email,
    };


    if (name.trim() && name !== user?.userName) {
      updatedUser.userName = name;
    }
    if (user?.preferred_store) {
      updatedUser.preferred_store = user.preferred_store;
    }
    if (password) {
      updatedUser.password = password;
    }

    if (
      !updatedUser.userName &&
      !updatedUser.preferred_store &&
      !updatedUser.password
    ) {
      Swal.fire({
        icon: 'info',
        title: 'לא בוצע שינוי',
        text: 'לא הזנת אף שדה לעדכון',
        confirmButtonText: 'סגור',
        customClass: {
          popup: 'text-right rtl',
        },
      });
      return;
    }


    try {
      const response = await fetch('/api/users/updateUser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'עדכון נכשל',
          confirmButtonText: 'אוקיי',
          customClass: {
            popup: 'text-right rtl',
          },
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'עודכן בהצלחה',
        confirmButtonText: 'אישור',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'text-right rtl',
        },
      });

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);

      setIsEditing(false);
      onClose();

    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'שגיאת שרת',
        text: 'נסי שוב מאוחר יותר',
        confirmButtonText: 'סגור',
        confirmButtonColor: '#d33',
        customClass: {
          popup: 'text-right rtl',
        },
      });
    }
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold text-teal-700">
            שלום, <span className="text-black">{user?.userName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
            aria-label="סגור תפריט משתמש"
          >
            &times;
          </button>
        </div>

        {!isEditing ? (
          <div className="p-4 flex flex-col flex-grow">
            <p><strong>שם:</strong> {name}</p>
            <p><strong>אימייל:</strong> {email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold"
            >
              ערוך פרופיל
            </button>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded font-semibold"
            >
              התנתק
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 flex flex-col flex-grow">
            <label className="mb-1 font-semibold text-sm" htmlFor="name">
              שם:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            <label className="mb-1 font-semibold text-sm" htmlFor="email">
              אימייל:
            </label>
            <input
              id="email"
              type="email"
              readOnly
              className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />

            <label className="mb-1 font-semibold text-sm" htmlFor="password">
              סיסמה חדשה (אופציונלי):
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              minLength={8}
              placeholder="לפחות 8 תווים"
            />

            <label className="mb-1 font-semibold text-sm" htmlFor="confirmPassword">
              אישור סיסמה:
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="הזן שוב את הסיסמה"
            />

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <button
              type="submit"
              className="mt-auto bg-teal-600 hover:bg-teal-700 text-white py-2 rounded font-semibold"
            >
              עדכן פרופיל
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded font-semibold"
            >
              ביטול
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserSidebar;
