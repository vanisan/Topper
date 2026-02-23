
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
    const now = new Date();
    const lastClaim = new Date(currentUser.lastRechargeAt);
    const isSameDay = now.getFullYear() === lastClaim.getFullYear() &&
                      now.getMonth() === lastClaim.getMonth() &&
                      now.getDate() === lastClaim.getDate();
    const neverClaimed = lastClaim.getFullYear() === 1970;
    const canClaim = !isSameDay || neverClaimed;

    return (
        <header className="bg-white dark:bg-gray-800 p-3 sm:p-4 shadow-lg sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <h1 className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tighter">Topper</h1>
                    
                    {/* Like Counter & Claim Button */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full px-2 py-1 sm:px-3 sm:py-1.5 border border-gray-200 dark:border-gray-600">
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
                                ОНОВИТЬСЯ О 00:00
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-5">
                    <div className="text-right hidden xs:block">
                        <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{currentUser.name}</p>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">{currentUser.location}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <button 
                            onClick={() => onNavigate('me')}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-sm"
                            aria-label="Профіль"
                        >
                            <UserIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <button 
                            onClick={() => onNavigate('settings')}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors shadow-sm"
                            aria-label="Налаштування"
                        >
                            <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;