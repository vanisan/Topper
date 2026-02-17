
import React from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface SettingsPageProps {
    theme: string;
    setTheme: (theme: string) => void;
    onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ theme, setTheme, onBack }) => {
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
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
            </div>
        </div>
    );
};

export default SettingsPage;
