
import React from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import { User } from '../types';
import PhotographIcon from './icons/PhotographIcon';
import LogoutIcon from './icons/LogoutIcon';
import { GRADIENT_PALETTE } from '../data/gradients';

interface SettingsPageProps {
    currentUser: User;
    theme: string;
    setTheme: (theme: string) => void;
    onBack: () => void;
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onLogout: () => void;
}

const EMOJI_OPTIONS = ['✨', '🚀', '❤️', '👑', '💎', '🌟', '💐', '⚙️', '🎮', '🎨'];

const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser, theme, setTheme, onBack, onUpdateProfile, onLogout }) => {
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    const handleBackgroundSelect = (color: string) => {
        // If white or black is selected, disable emoji pattern for a monotone design
        if (color === '#ffffff' || color === '#000000') {
            onUpdateProfile({ profileBgColor: color, profileBgEmoji: '' });
        } else {
            onUpdateProfile({ profileBgColor: color });
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 absolute left-0">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-2xl font-bold text-center flex-grow text-purple-600 dark:text-purple-300">Налаштування</h2>
            </div>

            <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    {isDark ? <MoonIcon className="w-6 h-6 text-sky-400" /> : <SunIcon className="w-6 h-6 text-amber-400" />}
                        <span className="font-medium text-gray-900 dark:text-white">Тема</span>
                    </div>
                    
                    <button onClick={toggleTheme} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isDark ? 'bg-purple-600' : 'bg-gray-400'}`}>
                        <span className="sr-only">Toggle Theme</span>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                        <PhotographIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                        <span className="font-medium text-gray-900 dark:text-white">Фон картки в рейтингу</span>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Колір (Білий/Чорний вимикають смайли)</label>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {GRADIENT_PALETTE.map(gradient => (
                                    <button
                                        key={gradient.name}
                                        onClick={() => handleBackgroundSelect(gradient.gradient)}
                                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 border ${gradient.gradient === '#ffffff' ? 'border-gray-300' : 'border-transparent'} ${currentUser.profileBgColor === gradient.gradient ? 'ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700' : ''}`}
                                        style={{ background: gradient.gradient }}
                                        aria-label={`Select color ${gradient.name}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Емодзі-візерунок (необов'язково)</label>
                             <div className="flex flex-wrap gap-3 mt-2">
                                {EMOJI_OPTIONS.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => onUpdateProfile({ profileBgEmoji: emoji })}
                                        className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 ${currentUser.profileBgEmoji === emoji ? 'bg-purple-600 ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`}
                                        aria-label={`Select emoji ${emoji}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                                <button
                                    onClick={() => onUpdateProfile({ profileBgEmoji: '' })}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-sm font-bold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 ${!currentUser.profileBgEmoji ? 'bg-purple-600 ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}
                                >
                                    OFF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={onLogout}
                    className="w-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Вийти з акаунту</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
