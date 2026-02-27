import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

interface CityChatPageProps {
    currentUser: User;
    allUsers: User[];
}

interface CityMessage {
    id: number;
    user_id: string;
    city: string;
    content: string;
    created_at: string;
}

const CityChatPage: React.FC<CityChatPageProps> = ({ currentUser, allUsers }) => {
    const [messages, setMessages] = useState<CityMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const city = currentUser.location;

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('city_chats')
                .select('*')
                .eq('city', city)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching city chat messages:', error);
            } else {
                setMessages(data);
            }
        };

        if (city) {
            fetchMessages();
        }

        const channel = supabase.channel(`city-chat-${city}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'city_chats', filter: `city=eq.${city}` }, (payload) => {
                setMessages(prevMessages => [...prevMessages, payload.new as CityMessage]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [city]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !city) return;

        const optimisticMessage: CityMessage = {
            id: Date.now(), // Temporary ID
            user_id: currentUser.id,
            city: city,
            content: newMessage.trim(),
            created_at: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, optimisticMessage]);
        setNewMessage('');

        const { error } = await supabase.from('city_chats').insert([
            { user_id: currentUser.id, city, content: newMessage.trim() }
        ]);

        if (error) {
            console.error('Error sending message:', error);
            // Revert optimistic update on error
            setMessages(prevMessages => prevMessages.filter(m => m.id !== optimisticMessage.id));
        }
    };

    const getUserById = (id: string) => allUsers.find(user => user.id === id);

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Чат міста: {city}</h2>
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {messages.map(msg => {
                    const sender = getUserById(msg.user_id);
                    const isCurrentUser = msg.user_id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex items-start gap-3 my-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <img src={sender?.avatarUrl} alt={sender?.name} className="w-10 h-10 rounded-full" />
                            <div className={`p-3 rounded-lg max-w-xs ${isCurrentUser ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-700'}`}>
                                <p className="font-bold text-sm">{sender?.name || '...'}</p>
                                <p>{msg.content}</p>
                                <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ваше повідомлення..."
                    className="flex-grow p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                />
                <button type="submit" className="p-2 bg-purple-600 text-white rounded-lg">Надіслати</button>
            </form>
        </div>
    );
};

export default CityChatPage;
