
import React, { useState } from 'react';
import SettingsPage from './SettingsPage';
import InfoIcon from './icons/InfoIcon';
import SettingsIcon from './icons/SettingsIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import MessageIcon from './icons/MessageIcon';

interface MenuPageProps {
    theme: string;
    setTheme: (theme: string) => void;
    onNavigate: (view: string) => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ theme, setTheme, onNavigate }) => {
    const [activeSubView, setActiveSubView] = useState<string | null>(null);

    const menuItems = [
        { id: 'messages', label: 'Мої повідомлення', icon: MessageIcon, view: 'messages' },
        { id: 'info', label: 'Інфо', icon: InfoIcon, view: 'info' },
        { id: 'settings', label: 'Налаштування', icon: SettingsIcon, view: 'settings' },
        { id: 'topup', label: 'Поповнення', icon: CreditCardIcon, view: 'topup' },
        { id: 'shop', label: 'Магазин подарунків', icon: ShoppingBagIcon, view: 'shop' },
    ];
    
    const PlaceholderView: React.FC<{ title: string; onBack: () => void; }> = ({ title, onBack }) => (
        <div className="text-center p-10 text-gray-500 dark:text-gray-400">
            <p>{title} в розробці.</p>
            <button onClick={onBack} className="mt-4 text-purple-600 dark:text-purple-400 font-semibold">Назад до меню</button>
        </div>
    );

    const handleMenuClick = (view: string) => {
        if (view === 'settings') {
            setActiveSubView(view);
        } else {
            onNavigate(view);
        }
    }

    const renderMainView = () => (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {menuItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <li key={item.id}>
                            <button onClick={() => handleMenuClick(item.view)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                <div className="flex items-center space-x-4">
                                    <Icon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                    <span className="text-lg font-medium text-gray-900 dark:text-white">{item.label}</span>
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
    
    // Other sub-views that are placeholders can be handled by the main App component
    // based on the 'onNavigate' call.
    return renderMainView();
};

export default MenuPage;
