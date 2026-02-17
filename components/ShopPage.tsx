
import React, { useState } from 'react';
import { User, Gift } from '../types';
import { allGifts } from '../data/gifts';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ShopPageProps {
    currentUser: User;
    targetUser?: User;
    onSendGift: (receiver: User, gift: Gift) => Promise<boolean>;
    onBack: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({ currentUser, targetUser, onSendGift, onBack }) => {
    const [sendingGiftId, setSendingGiftId] = useState<string | null>(null);

    const handleSendGift = async (gift: Gift) => {
        if (!targetUser) return;
        setSendingGiftId(gift.id);
        await onSendGift(targetUser, gift);
        setSendingGiftId(null);
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <div className="flex items-center mb-2 relative">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 absolute left-0">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-2xl font-bold text-center flex-grow text-purple-600 dark:text-purple-300">Магазин подарунків</h2>
            </div>
            {targetUser ? (
                 <p className="text-center text-gray-600 dark:text-gray-300 mb-4">Надіслати подарунок для <span className="font-semibold text-gray-800 dark:text-white">{targetUser.name}</span></p>
            ) : (
                 <p className="text-center text-gray-500 dark:text-gray-400 mb-4 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">Оберіть користувача з рейтингу, щоб надіслати подарунок.</p>
            )}

            <div className="text-center mb-6 p-3 rounded-lg bg-green-100 dark:bg-green-900/50">
                <span className="text-green-800 dark:text-green-200 font-medium">Ваш баланс:</span>
                <span className="text-lg font-bold text-green-900 dark:text-green-100 ml-2">{(currentUser.balance || 0).toFixed(2)} грн</span>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                {allGifts.map(gift => {
                    const canAfford = currentUser.balance >= gift.cost;
                    const isLoading = sendingGiftId === gift.id;
                    return (
                        <div key={gift.id} className={`bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between transition-opacity ${!canAfford && 'opacity-60'}`}>
                            <div className="flex items-center space-x-4">
                                <span className="text-4xl">{gift.icon}</span>
                                <div>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{gift.name}</p>
                                    <p className="text-sm text-purple-500 dark:text-purple-400 font-bold">+{gift.rating} Рейтинг</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleSendGift(gift)}
                                disabled={!canAfford || !targetUser || !!sendingGiftId}
                                className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed w-28 text-center"
                            >
                                {isLoading ? '...' : `${gift.cost} грн`}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ShopPage;