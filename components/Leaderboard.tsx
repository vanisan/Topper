
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import UserProfileCard from './UserProfileCard';
import SearchIcon from './icons/SearchIcon';

interface LeaderboardProps {
    users: User[];
    currentUser: User;
    onLike: (userId: string) => void;
    onGift: (user: User) => void;
    onViewProfile: (user: User) => void;
}

type Tab = 'local' | 'global';

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUser, onLike, onGift, onViewProfile }) => {
    const [activeTab, setActiveTab] = useState<Tab>('local');
    const [searchQuery, setSearchQuery] = useState('');

    const usersToDisplay = useMemo(() => activeTab === 'local'
        ? users.filter(u => u.location === currentUser.location)
        : users, [activeTab, users, currentUser.location]);
        
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) {
            return usersToDisplay;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return usersToDisplay.filter(user =>
            user.name.toLowerCase().includes(lowercasedQuery) ||
            (user.location && user.location.toLowerCase().includes(lowercasedQuery))
        );
    }, [searchQuery, usersToDisplay]);

    const getTabClass = (tabName: Tab) => {
        return activeTab === tabName
            ? 'border-purple-500 text-purple-600 dark:text-purple-300'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600';
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-3 sm:p-6 rounded-2xl shadow-2xl overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-purple-600 dark:text-purple-300 truncate px-2">
                 {activeTab === 'local' ? `Топ у місті ${currentUser.location}` : 'Топ по Україні'}
            </h2>

            <div className="mb-4 sm:mb-6 relative px-1">
                <input
                    type="text"
                    placeholder="Пошук..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 pl-9 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none transition-colors text-sm sm:text-base"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            </div>

            <div className="mb-4 sm:mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex justify-center space-x-4 sm:space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${getTabClass('local')}`}
                    >
                        Моє місто
                    </button>
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${getTabClass('global')}`}
                    >
                        Вся Україна
                    </button>
                </nav>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <UserProfileCard
                            key={user.id}
                            user={user}
                            rank={users.findIndex(u => u.id === user.id) + 1}
                            isCurrentUser={user.id === currentUser.id}
                            onLike={onLike}
                            onGift={onGift}
                            onViewProfile={onViewProfile}
                        />
                    ))
                ) : (
                     <p className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
                        Нікого не знайдено.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;
