
import React, { useMemo } from 'react';
import { User, Message } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface MessagesPageProps {
    currentUser: User;
    allUsers: User[];
    messages: Message[];
    onViewChat: (user: User) => void;
    onBack: () => void;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ currentUser, allUsers, messages, onViewChat, onBack }) => {

    const conversations = useMemo(() => {
        const convos: { [userId: string]: { user: User; lastMessage: Message } } = {};

        messages.forEach(msg => {
            const otherUserId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
            if (otherUserId === currentUser.id) return; // Skip messages sent to oneself

            if (!convos[otherUserId] || msg.timestamp > convos[otherUserId].lastMessage.timestamp) {
                const user = allUsers.find(u => u.id === otherUserId);
                if (user) {
                    convos[otherUserId] = {
                        user: user,
                        lastMessage: msg
                    };
                }
            }
        });
        
        return Object.values(convos).sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
    }, [messages, currentUser, allUsers]);


    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl h-full flex flex-col">
            <div className="flex items-center mb-6 relative flex-shrink-0">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 absolute left-0">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <h2 className="text-2xl font-bold text-center flex-grow text-purple-600 dark:text-purple-300">Повідомлення</h2>
            </div>

            {conversations.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center text-gray-500 dark:text-gray-400 py-10">У вас ще немає повідомлень.</p>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
                    {conversations.map(({ user, lastMessage }) => (
                        <li key={user.id}>
                            <button onClick={() => onViewChat(user)} className="w-full flex items-center space-x-4 p-3 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                                <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {lastMessage.senderId === currentUser.id && "Ви: "}
                                        {lastMessage.text}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(lastMessage.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MessagesPage;
