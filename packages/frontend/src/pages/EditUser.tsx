// packages/frontend/src/pages/EditUser.tsx
import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../store/redux/userContext';
import { User } from '@smartcart/shared/src/user';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

const UserEditComponent: React.FC = () => {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error('UserEditComponent חייב להיות בשימוש בתוך UserProvider');
    }

    const { user, setUser } = context;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const [name, setName] = useState<string>(user?.userName || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [preferredStore, setPreferredStore] = useState<string>(user?.preferred_store || '');

    if (!user) {
        return <div>טוען נתוני משתמש או מפנה מחדש...</div>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasChanges =
            email !== user.email ||
            name !== user.userName ||
            password !== '' ||
            preferredStore !== user.preferred_store;

        if (!hasChanges) {
            alert('לא זוהו שינויים לעדכון.');
            navigate('/');
            return;
        }

        if (password && password !== confirmPassword) {
            alert('הסיסמאות אינן תואמות!');
            return;
        }

        const updatedUser: User = {
            ...user,
            userName: name,
            email,
            password: password !== '' ? password : user.password,
            preferred_store: preferredStore,
        };

        try {
            const response = await apiClient.post('/updateUser', updatedUser);

            if (response.status === 200 || response.status === 201) {
                setUser(response.data || updatedUser);
                alert('הפרופיל שלך עודכן בהצלחה!');
                navigate('/');
            } else {
                alert(`שגיאה בעדכון פרופיל: ${response.data?.message || 'שגיאה לא ידועה'}`);
            }
        } catch (error: any) {
            console.error('שגיאת API במהלך העדכון:', error);
            alert(`נכשל עדכון פרופיל: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">עריכת פרופיל</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">שם:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">אימייל:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="preferred_store" className="block text-sm font-medium text-gray-700">חנות מועדפת:</label>
                        <input
                            type="text"
                            id="preferred_store"
                            value={preferredStore}
                            onChange={(e) => setPreferredStore(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            סיסמה חדשה (השאר ריק כדי לשמור את הסיסמה הנוכחית):
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                        {password && !/[0-9]/.test(password) && (
                            <p className="text-red-500 text-sm mt-1">הסיסמה חייבת להכיל לפחות מספר אחד</p>
                        )}
                    </div>

                    {password && (
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">אשר סיסמה חדשה:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            {confirmPassword && password !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">הסיסמאות אינן תואמות</p>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        שמור שינויים
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UserEditComponent;
