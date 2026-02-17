
import React, { useState } from 'react';
import SettingsPage from './SettingsPage';
import InfoIcon from './icons/InfoIcon';
import SettingsIcon from './icons/SettingsIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import MessageIcon from './icons/MessageIcon';
import LogoutIcon from './icons/LogoutIcon';

interface MenuPageProps {
    theme: string;
    setTheme: (theme: string) => void;
    onNavigate: (view: string) => void;
    onLogout: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ theme, setTheme, onNavigate, onLogout }) => {
    const [activeSubView, setActiveSubView] = useState<string | null>(null);

    const menuItems = [
        { id: 'messages', label: 'Мої повідомлення', icon: MessageIcon, action: () => onNavigate('messages') },
        { id: 'info', label: 'Інфо', icon: InfoIcon, action: () => onNavigate('info') },
        { id: 'settings', label: 'Налаштування', icon: SettingsIcon, action: () => setActiveSubView('settings') },
        { id: 'topup', label: 'Поповнення', icon: CreditCardIcon, action: () => onNavigate('topup') },
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
                            <button onClick={item.action} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-4">
                                    <Icon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                    <span className={`text-lg font-medium text-gray-900 dark:text-white ${item.id === 'logout' ? 'text-red-600 dark:text-red-400' : ''}`}>{item.label}</span>
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
        return <SettingsPage theme={theme} setTheme={setTheme} onBack={() => setActiveSubView(null)} />;
    }
    
    return renderMainView();
};

export default MenuPage;