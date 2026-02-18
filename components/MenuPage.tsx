
import React, { useState } from 'react';
import SettingsPage from './SettingsPage';
import InfoIcon from './icons/InfoIcon';
import SettingsIcon from './icons/SettingsIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import MessageIcon from './icons/MessageIcon';
import LogoutIcon from './icons/LogoutIcon';
import { User } from '../types';

interface MenuPageProps {
    theme: string;
    setTheme: (theme: string) => void;
    onNavigate: (view: string) => void;
    onLogout: () => void;
    unreadCount: number;
    currentUser: User;
    onUpdateProfile: (updatedData: Partial<User>) => void;
}

type MenuItem = {
    id: string;
    label: string;
    icon: React.FC<{ className?: string }>;
    action: () => void;
    badge?: number;
    disabled?: boolean;
};

const MenuPage: React.FC<MenuPageProps> = ({ theme, setTheme, onNavigate, onLogout, unreadCount, currentUser, onUpdateProfile }) => {
    const [activeSubView, setActiveSubView] = useState<string | null>(null);

    const menuItems: MenuItem[] = [
        { id: 'messages', label: 'Мої повідомлення', icon: MessageIcon, action: () => onNavigate('messages'), badge: unreadCount },
        { id: 'info', label: 'Інфо', icon: InfoIcon, action: () => onNavigate('info') },
        { id: 'settings', label: 'Налаштування', icon: SettingsIcon, action: () => setActiveSubView('settings') },
        { id: 'topup', label: 'Поповнення', icon: CreditCardIcon, action: () => onNavigate('topup'), disabled: true },
        { id: 'shop', label: 'Магазин подарунків', icon: ShoppingBagIcon, action: () => onNavigate('shop') },
        { id: 'logout', label: 'Вийти', icon: LogoutIcon, action: onLogout },
    ];
    
    const PlaceholderView: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
            <p>{title} в розробці.</p>
            <button onClick={onBack} className="mt-4 text-purple-600 dark:text-purple-400 font-semibold">Назад до меню</button>
        </div>
    );

    const renderMainView = () => (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button 
                                onClick={item.action} 
                                disabled={item.disabled}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center space-x-4">
                                    <Icon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                    <span className={`text-lg font-medium text-gray-900 dark:text-white ${item.id === 'logout' ? 'text-red-600 dark:text-red-400' : ''}`}>{item.label}</span>
                                    {item.disabled && (
                                        <span className="text-xs bg-gray-400 dark:bg-gray-600 text-white px-2 py-0.5 rounded-full flex-shrink-0">Скоро</span>
                                    )}
                                    {item.badge && item.badge > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <ChevronRightIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
    
    if (activeSubView === 'settings') {
        return <SettingsPage currentUser={currentUser} theme={theme} setTheme={setTheme} onBack={() => setActiveSubView(null)} onUpdateProfile={onUpdateProfile} />;
    }
    
    return renderMainView();
};

export default MenuPage;
