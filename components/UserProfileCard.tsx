
import React, { useMemo } from 'react';
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

const formatRating = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'к';
    }
    return num.toString();
};

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
    
    const cardStyle = useMemo<React.CSSProperties>(() => ({
        background: user.profileBgColor || 'linear-gradient(to top right, #4b5563, #1f2937)', // Default dark gradient
    }), [user.profileBgColor]);
    
    const patternStyle = useMemo<React.CSSProperties | null>(() => {
        if (!user.profileBgEmoji) return null;
        
        try {
            // Creates a very dense, staggered pattern similar to the user's request.
            // The pattern tile is smaller (32x32) for higher density.
            const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>
                            <defs>
                                <pattern id='p' width='32' height='32' patternUnits='userSpaceOnUse'>
                                    <text x='16' y='8' dominant-baseline='middle' text-anchor='middle' font-size='20'>${user.profileBgEmoji}</text>
                                    <text x='0' y='24' dominant-baseline='middle' text-anchor='middle' font-size='20'>${user.profileBgEmoji}</text>
                                </pattern>
                            </defs>
                            <rect width='100%' height='100%' fill='url(#p)'/>
                        </svg>`;

            const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

            return {
                backgroundImage: patternUrl,
            };
        } catch (error) {
            console.error("Error creating emoji pattern:", error);
            return null; // Return null if emoji is invalid
        }
    }, [user.profileBgEmoji]);

    return (
        <div 
            onClick={handleCardClick}
            className={`group relative p-4 rounded-xl shadow-lg border-2 ${cardBorder} transition-all duration-300 overflow-hidden ${!isCurrentUser ? 'cursor-pointer' : ''}`}
            style={cardStyle}
            role={!isCurrentUser ? "button" : undefined}
            tabIndex={!isCurrentUser ? 0 : -1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !isCurrentUser) onViewProfile(user) }}
        >
            {patternStyle && <div className="absolute inset-0 opacity-40" style={patternStyle}></div>}
            
            <div className={`absolute inset-0 bg-white/60 dark:bg-gray-800/60 transition-colors duration-300 ${!isCurrentUser ? 'group-hover:bg-white/50 dark:group-hover:bg-gray-700/50' : ''}`}></div>

            <div className="relative z-10 flex items-center space-x-4">
                <div className={`text-2xl font-bold w-10 text-center ${textColor}`}>
                    {rank}
                </div>
                <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                <div className="flex-grow overflow-hidden">
                    <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-bold text-black dark:text-white truncate">{user.name}</h3>
                        {isCurrentUser && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full flex-shrink-0">Ви</span>}
                    </div>
                    <p className="text-sm font-bold text-black dark:text-white truncate">{user.location}</p>
                    <p className="text-xl font-bold text-black dark:text-white mt-1">{formatRating(user.rating)} ⭐</p>

                    {user.giftsReceived && user.giftsReceived.length > 0 && (
                        <div className="mt-2 flex items-center space-x-1" aria-label="Останні подарунки">
                            {[...user.giftsReceived].reverse().slice(0, 5).map((gift, index) => (
                                <span key={`${gift.id}-${index}`} title={gift.name} className="text-lg transition-transform hover:scale-125 cursor-default">
                                    {gift.icon}
                                </span>
                            ))}
                            {user.giftsReceived.length > 5 && (
                                <span className="text-xs font-bold text-black dark:text-white ml-1">
                                    +{user.giftsReceived.length - 5}
                                </span>
                            )}
                        </div>
                    )}

                </div>
                {!isCurrentUser && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 z-20 flex-shrink-0">
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
        </div>
    );
};

export default UserProfileCard;
