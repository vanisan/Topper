
import React from 'react';
import { User } from '../types';

interface HeaderProps {
    currentUser: User;
}

const Header: React.FC<HeaderProps> = ({ currentUser }) => {
    return (
        <header className="bg-white dark:bg-gray-800 p-4 shadow-lg sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Topper</h1>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.location}</p>
                    </div>
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full border-2 border-purple-500 dark:border-purple-400" />
                </div>
            </div>
        </header>
    );
};

export default Header;