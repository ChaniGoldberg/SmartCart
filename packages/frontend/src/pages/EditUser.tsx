import React, { use, useContext, useState } from 'react';
import { UserContext } from '../store/redux/userContext';
import { User } from '@smartcart/shared/src/user';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';

const UserEditComponent: React.FC = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('UserProfile must be used within a UserProvider');
    }
    const { user, setUser } = context
    const [name, setName] = useState<string>(user ? user.userName : '');
    const [email, setEmail] = useState<string>(user ? user.email : '');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email !== user?.email || name !== user?.userName || password) {
            const updatedUser: User = {
                ...user,
                userName: name,
                email: email,
                password: password !== '' && password === confirmPassword ? password : user ? user.password : '',
                userId: user ? user.userId : 0,
                preferred_store: "7290058140886-1-006"

            };

            setUser(updatedUser);
            const response = await apiClient.post('/updateUser', updatedUser);
            if (response.status !== 201) {
                alert('Error updating profile'); // Replace with actual error handling
                return;
            }
            alert('your Profile updated successfully!'); // Replace with actual update logic
            navigate('/'); // Redirect to home or another page after update

        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
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
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            minLength={2}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>
                    {(!/[0-9]/.test(password)) && <p>'Password must contain at least one number'</p>};
                    {password && (
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            />
                            <p className='error text-red-500 mt-2'>
                                {password && confirmPassword && password !== confirmPassword ? 'Passwords do not match' : ''}
                            </p>
                        </div>
                    )}
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UserEditComponent;
