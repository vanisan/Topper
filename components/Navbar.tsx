
import React from 'react';
import TrophyIcon from './icons/TrophyIcon';
import UserIcon from './icons/UserIcon';
import MenuIcon from './icons/MenuIcon';

interface NavbarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const navItems = [
    { name: 'rating', label: 'Рейтинг', icon: TrophyIcon },
    { name: 'menu', label: 'Меню', icon: MenuIcon },
];

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-20">
            <nav className="container mx-auto">
                <ul className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.name;
                        const Icon = item.icon;
                        return (
                            <li key={item.name}>
                                <button
                                    onClick={() => onTabChange(item.name)}
                                    className={`flex flex-col items-center justify-center w-20 h-full text-sm transition-colors duration-200 ${
                                        isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className="w-6 h-6 mb-1" />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </footer>
    );
};

export default Navbar;
