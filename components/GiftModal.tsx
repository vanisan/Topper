
import React from 'react';
import { User, Gift } from '../types';

interface GiftModalProps {
    user: User;
    gifts: Gift[];
    onSendGift: (gift: Gift) => void;
    onClose: () => void;
}

const GiftModal: React.FC<GiftModalProps> = ({ user, gifts, onSendGift, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in-up">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-center mb-2 text-purple-600 dark:text-purple-300">Надіслати подарунок</h2>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">користувачу <span className="font-semibold text-gray-800 dark:text-white">{user.name}</span></p>

                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {gifts.map(gift => (
                        <div key={gift.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl">{gift.icon}</span>
                                <div>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{gift.name}</p>
                                    <p className="text-sm text-purple-500 dark:text-purple-400 font-bold">+{gift.rating} Рейтинг</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onSendGift(gift)}
                                className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-500 transition-colors"
                            >
                                {gift.cost} грн
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GiftModal;
