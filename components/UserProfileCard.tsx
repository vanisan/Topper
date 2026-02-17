
import React from 'react';
import { User } from '../types';
import CrownIcon from './icons/CrownIcon';
import HeartIcon from './icons/HeartIcon';
import GiftIcon from './icons/GiftIcon';

interface UserProfileCardProps {
    user: User;
    rank: number;
    isCurrentUser: boolean;
    onLike: (userId: string) => void;
    onGift: (user: User) => void;
    onViewProfile: (user: User) => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, rank, isCurrentUser, onLike, onGift, onViewProfile }) => {
    const rankColors: { [key: number]: string } = {
        1: 'border-amber-400 text-amber-400',
        2: 'border-slate-400 dark:border-slate-300 text-slate-500 dark:text-slate-300',
        3: 'border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-400',
    };

    const cardBorder = rank <= 3 ? rankColors[rank] : 'border-gray-200 dark:border-gray-700';
    const textColor = rank <= 3 ? rankColors[rank] : 'text-gray-500 dark:text-gray-400';

    const handleCardClick = (e: React.MouseEvent) => {
        // Prevent click from propagating to like/gift buttons
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        if (!isCurrentUser) {
            onViewProfile(user);
        }
    };

    return (
        <div 
            onClick={handleCardClick}
            className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center space-x-4 border-2 ${cardBorder} transition-all duration-300 ${!isCurrentUser ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''}`}
            role={!isCurrentUser ? "button" : undefined}
            tabIndex={!isCurrentUser ? 0 : -1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isCurrentUser) onViewProfile(user) }}
        >
            <div className={`text-2xl font-bold w-10 text-center ${textColor}`}>
                {rank}
            </div>
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600 pointer-events-none" />
            <div className="flex-grow pointer-events-none">
                <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{user.name}</h3>
                    {isCurrentUser && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Ви</span>}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
                <p className="text-xl font-bold text-purple-500 dark:text-purple-400 mt-1">{user.rating} pts</p>
            </div>
            {!isCurrentUser && (
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 z-10">
                    <button
                        onClick={() => onLike(user.id)}
                        className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 transition-colors text-white"
                        aria-label={`Like ${user.name}`}
                    >
                        <HeartIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => onGift(user)}
                        className="p-2 rounded-full bg-sky-600 hover:bg-sky-500 transition-colors text-white"
                        aria-label={`Send gift to ${user.name}`}
                    >
                        <GiftIcon className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserProfileCard;