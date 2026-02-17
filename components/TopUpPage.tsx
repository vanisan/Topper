
import React, { useState } from 'react';
import { User } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface TopUpPageProps {
    currentUser: User;
    onTopUp: (amount: number) => Promise<boolean>;
    onBack: () => void;
}

const TopUpPage: React.FC<TopUpPageProps> = ({ currentUser, onTopUp, onBack }) => {
    const [amount, setAmount] = useState<string>('100');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        const value = e.target.value;
        // Allow empty string or numbers only
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setAmount(value);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseInt(amount, 10);

        if (isNaN(numericAmount) || numericAmount < 10 || numericAmount > 999) {
            setError('Сума повинна бути від 10 до 999 грн.');
            return;
        }
        
        setError('');
        setIsLoading(true);
        const success = await onTopUp(numericAmount);
        setIsLoading(false);
        if (success) {
            setAmount('100'); // Reset on success
        }
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center mb-6 relative">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 absolute left-0">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-2xl font-bold text-center flex-grow text-purple-600 dark:text-purple-300">Поповнення балансу</h2>
            </div>
            
            <div className="text-center mb-6 p-4 rounded-lg bg-green-100 dark:bg-green-900/50">
                <span className="text-green-800 dark:text-green-200 font-medium">Поточний баланс:</span>
                <span className="text-2xl font-bold text-green-900 dark:text-green-100 ml-2">{(currentUser.balance || 0).toFixed(2)} грн</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Сума поповнення (10-999 грн)</label>
                    <div className="relative">
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={amount}
                            onChange={handleAmountChange}
                            min="10"
                            max="999"
                            placeholder="100"
                            className="w-full p-4 text-2xl font-bold text-center rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none"
                        />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-xl font-bold">грн</span>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-lg disabled:bg-gray-400 dark:disabled:bg-gray-500"
                >
                    {isLoading ? 'Обробка...' : 'Поповнити'}
                </button>
            </form>
        </div>
    );
};

export default TopUpPage;