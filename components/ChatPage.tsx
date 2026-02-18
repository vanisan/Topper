
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Message } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SendIcon from './icons/SendIcon';
import { supabase } from '../supabaseClient';

interface ChatPageProps {
    currentUser: User;
    chatPartner: User;
    messages: Message[];
    onSendMessage: (receiverId: string, text: string) => void;
    onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, chatPartner, messages, onSendMessage, onBack }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationMessages = useMemo(() => {
        return messages
            .filter(msg => 
                (msg.senderId === currentUser.id && msg.receiverId === chatPartner.id) ||
                (msg.senderId === chatPartner.id && msg.receiverId === currentUser.id)
            )
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [messages, currentUser, chatPartner]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversationMessages]);

    useEffect(() => {
        const markMessagesAsRead = async () => {
            const unreadMessageIds = conversationMessages
                .filter(msg => msg.receiverId === currentUser.id && !msg.is_read)
                .map(msg => msg.id);
    
            if (unreadMessageIds.length > 0) {
                const { error } = await supabase
                    .from('messages')
                    .update({ is_read: true })
                    .in('id', unreadMessageIds);
    
                if (error) {
                    console.error('Error marking messages as read:', error);
                }
            }
        };
    
        markMessagesAsRead();
    }, [conversationMessages, currentUser.id]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(chatPartner.id, newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <img src={chatPartner.avatarUrl} alt={chatPartner.name} className="w-10 h-10 rounded-full mx-3"/>
                <span className="font-bold text-lg text-gray-900 dark:text-white">{chatPartner.name}</span>
            </div>

            {/* Message List */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {conversationMessages.map(msg => {
                        const isSentByMe = msg.senderId === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isSentByMe ? 'bg-purple-600 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-lg'}`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${isSentByMe ? 'text-purple-200' : 'text-gray-500 dark:text-gray-400'} text-right`}>
                                        {new Date(msg.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                 <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Напишіть повідомлення..."
                        className="w-full p-3 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none"
                    />
                    <button type="submit" className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors flex-shrink-0">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;