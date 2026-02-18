
import React from 'react';
import { User } from '../types';

interface HomePageProps {
    city: string;
    topUsers: User[];
    onViewProfile: (user: User) => void;
}

const RankConfig = {
    1: {
        height: 'h-40 sm:h-48',
        avatarSize: 'w-20 h-20 sm:w-28 sm:h-28',
        borderColor: 'border-amber-400',
        bgColor: 'bg-amber-50/90 dark:bg-amber-900/20',
        textColor: 'text-amber-700 dark:text-amber-400',
        order: 'order-2',
        label: '1 місце'
    },
    2: {
        height: 'h-32 sm:h-40',
        avatarSize: 'w-16 h-16 sm:w-24 sm:h-24',
        borderColor: 'border-slate-300',
        bgColor: 'bg-slate-50/90 dark:bg-slate-800/30',
        textColor: 'text-slate-600 dark:text-slate-300',
        order: 'order-1',
        label: '2 місце'
    },
    3: {
        height: 'h-28 sm:h-36',
        avatarSize: 'w-14 h-14 sm:w-20 sm:h-20',
        borderColor: 'border-orange-400',
        bgColor: 'bg-orange-50/90 dark:bg-orange-900/20',
        textColor: 'text-orange-700 dark:text-orange-400',
        order: 'order-3',
        label: '3 місце'
    }
};

const PodiumSpot: React.FC<{ user: User; rank: 1 | 2 | 3; onViewProfile: (user: User) => void; }> = ({ user, rank, onViewProfile }) => {
    const config = RankConfig[rank];

    return (
        <div className={`flex flex-col items-center justify-end ${config.order} w-full max-w-[30%] sm:max-w-[120px]`}>
            {/* Avatar Section */}
            <button
                onClick={() => onViewProfile(user)}
                className={`relative group mb-2 transition-transform duration-300 hover:scale-110`}
            >
                <div className={`rounded-full border-4 ${config.borderColor} overflow-hidden ${config.avatarSize} shadow-xl`}>
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
                {rank === 1 && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-2xl">👑</div>
                )}
            </button>

            {/* Pedestal Section */}
            <div className={`w-full ${config.height} ${config.bgColor} rounded-t-2xl border-x-2 border-t-2 ${config.borderColor} flex flex-col items-center p-1 sm:p-2 shadow-lg text-center`}>
                <span className={`text-[10px] sm:text-sm font-black uppercase tracking-tighter ${config.textColor} mb-1`}>
                    {config.label}
                </span>
                
                <h3 className="text-[11px] sm:text-base font-black text-gray-900 dark:text-white leading-tight truncate w-full mb-1" title={user.name}>
                    {user.name}
                </h3>

                <div className="mt-auto mb-2">
                    <div className="bg-green-600 dark:bg-green-500 text-white text-[8px] sm:text-[10px] font-black px-1 sm:px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        +2 БАЛИ
                    </div>
                    <span className="block text-[7px] sm:text-[9px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">
                        ЗА 24 ГОД
                    </span>
                </div>
            </div>
        </div>
    );
};

const HomePage: React.FC<HomePageProps> = ({ city, topUsers, onViewProfile }) => {
    return (
        <div className="flex flex-col items-center justify-start min-h-full py-4 sm:py-8">
            <header className="text-center mb-8 px-4">
                <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 drop-shadow-sm">
                    {city}
                </h1>
                <p className="mt-2 text-[10px] sm:text-sm font-bold text-gray-600 dark:text-gray-400 max-w-[280px] mx-auto leading-tight uppercase tracking-wide">
                    Тримай лідерство та отримуй пасивний рейтинг щодня!
                </p>
            </header>
            
            {topUsers.length > 0 ? (
                <div className="w-full max-w-lg flex items-end justify-center px-2 sm:px-4 gap-1 sm:gap-4 mt-auto mb-4">
                    {/* Podium logic handles ordering via CSS order property */}
                    {topUsers[0] && <PodiumSpot user={topUsers[0]} rank={1} onViewProfile={onViewProfile} />}
                    {topUsers[1] && <PodiumSpot user={topUsers[1]} rank={2} onViewProfile={onViewProfile} />}
                    {topUsers[2] && <PodiumSpot user={topUsers[2]} rank={3} onViewProfile={onViewProfile} />}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-gray-100/50 dark:bg-gray-800/30 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 mx-4">
                    <p className="text-xl font-black text-gray-400 dark:text-gray-500 uppercase">Місто чекає на героя</p>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">Будь першим у списку лідерів!</p>
                </div>
            )}
            
            <div className="mt-4 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                Оновлюється в реальному часі
            </div>
        </div>
    );
};

export default HomePage;
