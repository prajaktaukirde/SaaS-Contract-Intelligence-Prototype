
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-200">
             <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.username || 'User'}!</h1>
            <div className="relative">
                <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                    className="relative z-10 block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-300 focus:outline-none focus:border-brand-primary bg-gray-200 text-gray-600 flex items-center justify-center"
                >
                    <UserIcon />
                </button>
                {dropdownOpen && (
                    <div 
                        className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20"
                        onMouseLeave={() => setDropdownOpen(false)}
                    >
                        <a href="#/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-accent hover:text-white">Settings</a>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-brand-accent hover:text-white"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
