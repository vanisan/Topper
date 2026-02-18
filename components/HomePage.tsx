
import React from 'react';
import { User } from '../types';
import CrownIcon from './icons/CrownIcon';

interface HomePageProps {
    city: string;
    topUsers: User[];
    onViewProfile: (user: User) => void;
}

const RankSpecifics = {
    1: {
        borderColor: 'border-amber-400',
        shadowColor: 'shadow-amber-500/40',
        textColor: 'text-amber-400',
    },
    2: {
        borderColor: 'border-slate-300',
        shadowColor: 'shadow-slate-400/40',
        textColor: 'text-slate-300',
    },
    3: {
        borderColor: 'border-orange-500',
        shadowColor: 'shadow-orange-500/40',
        textColor: 'text-orange-500',
    },
};

const TopUserSpot: React.FC<{ user: User; rank: 1 | 2 | 3; onViewProfile: (user: User) => void; }> = ({ user, rank, onViewProfile }) => {
    const specifics = RankSpecifics[rank];
    const isTopRank = rank === 1;

    // Define sizes based on rank for visual hierarchy
    const containerSize = isTopRank ? 'w-32 h-32 md:w-36 md:h-36' : 'w-28 h-28 md:w-32 md:h-32';
    const avatarSize = isTopRank ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';

    return (
        <div className="flex flex-col items-center justify-start transition-transform duration-300 hover:scale-110">
            <button
                onClick={() => onViewProfile(user)}
                className={`rounded-full flex flex-col items-center justify-center p-2 bg-gray-700/50 backdrop-blur-sm
                    border-4 ${specifics.borderColor} shadow-2xl ${specifics.shadowColor} ${containerSize}`}
            >
                <img src={user.avatarUrl} alt={user.name} className={`rounded-full object-cover border-2 border-white/20 ${avatarSize}`} />
            </button>
            <h3 className="mt-3 font-bold text-lg text-white text-center break-words w-full [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">{user.name}</h3>
            <p className={`font-semibold ${specifics.textColor}`}>#{rank} місце</p>
            <div className="mt-1 text-xs bg-green-500/30 text-green-200 font-semibold px-2 py-1 rounded-full [text-shadow:-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">
                +2 бали / 24 год
            </div>
        </div>
    );
};


const HomePage: React.FC<HomePageProps> = ({ city, topUsers, onViewProfile }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                {city}
            </h1>
            <p className="text-gray-400 mb-10 md:mb-16 max-w-md text-center">Топ-3 користувачі вашого міста отримують по +2 рейтинга за добу, поспішай стати першими!</p>
            
            {topUsers.length > 0 ? (
                <div className="w-full max-w-md flex flex-col items-center">
                    {/* Rank 1 */}
                    {topUsers[0] && (
                        <div className="z-10">
                             <TopUserSpot user={topUsers[0]} rank={1} onViewProfile={onViewProfile} />
                        </div>
                    )}

                    {/* Ranks 2 and 3 */}
                    {(topUsers[1] || topUsers[2]) && (
                        <div className="flex justify-between w-full -mt-8 px-4 sm:px-0">
                            {topUsers[1] ? (
                                <TopUserSpot user={topUsers[1]} rank={2} onViewProfile={onViewProfile} />
                            ) : (
                                <div className="w-28 md:w-32"/> // Spacer
                            )}
                            
                            {topUsers[2] ? (
                                <TopUserSpot user={topUsers[2]} rank={3} onViewProfile={onViewProfile} />
                            ) : (
                                <div className="w-28 md:w-32"/> // Spacer
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-8">
                    <p>У вашому місті поки немає лідерів.</p>
                    <p>Будьте першим!</p>
                </div>
            )}
        </div>
    );
};

export default HomePage;
