
import React, { useState } from 'react';
import { User } from '../types';
import UserProfileCard from './UserProfileCard';

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
    
    const usersToDisplay = activeTab === 'local'
        ? users.filter(u => u.location === currentUser.location)
        : users;

    const getTabClass = (tabName: Tab) => {
        return activeTab === tabName
            ? 'border-purple-500 text-purple-600 dark:text-purple-300'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600';
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4 text-center text-purple-600 dark:text-purple-300">
                 {activeTab === 'local' ? `Топ у місті ${currentUser.location}` : 'Топ по Україні'}
            </h2>

            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex justify-center space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('local')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${getTabClass('local')}`}
                    >
                        Моє місто
                    </button>
                    <button
                        onClick={() => setActiveTab('global')}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${getTabClass('global')}`}
                    >
                        Вся Україна
                    </button>
                </nav>
            </div>
            
            <div className="space-y-4">
                {usersToDisplay.map((user, index) => (
                    <UserProfileCard
                        key={user.id}
                        user={user}
                        rank={index + 1}
                        isCurrentUser={user.id === currentUser.id}
                        onLike={onLike}
                        onGift={onGift}
                        onViewProfile={onViewProfile}
                    />
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;