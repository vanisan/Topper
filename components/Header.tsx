
import React from 'react';
import { User } from '../types';
import HeartIcon from './icons/HeartIcon';
import SparklesIcon from './icons/SparklesIcon';

import UserIcon from './icons/UserIcon';
import SettingsIcon from './icons/SettingsIcon';

interface HeaderProps {
    currentUser: User;
    onClaimLikes: () => void;
    onNavigate: (view: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onClaimLikes, onNavigate }) => {
    const now = new Date().getTime();
    const lastClaim = new Date(currentUser.lastRechargeAt).getTime();
    const canClaim = now - lastClaim >= 24 * 60 * 60 * 1000;

    return (
        <header className="bg-white dark:bg-gray-800 p-3 sm:p-4 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">Topper</h1>
                
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-1 mr-2 sm:mr-3">
                        <HeartIcon className="w-4 h-4 text-pink-500 fill-current" />
                        <span className="text-sm font-black text-gray-900 dark:text-white">{currentUser.availableLikes || 0}</span>
                    </div>
                    {canClaim ? (
                        <button 
                            onClick={onClaimLikes}
                            className="flex items-center space-x-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-sm animate-pulse"
                        >
                            <SparklesIcon className="w-3 h-3" />
                            <span>КЛЕЙМ +3</span>
                        </button>
                    ) : (
                        <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tight">
                            ГОТОВО ЧЕРЕЗ 24Г
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => onNavigate('settings')}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    aria-label="Налаштування"
                >
                    <SettingsIcon className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
};

export default Header;