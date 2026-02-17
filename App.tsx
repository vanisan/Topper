
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Gift, Message } from './types';
import { mockGifts } from './data/mockData';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import GiftModal from './components/GiftModal';
import Navbar from './components/Navbar';
import MenuPage from './components/MenuPage';
import AuthFlow, { RegistrationData } from './components/AuthFlow';
import ProfilePage from './components/ProfilePage';
import MessagesPage from './components/MessagesPage';
import ChatPage from './components/ChatPage';
import HomePage from './components/HomePage';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

type View = 
    | { name: 'rating' }
    | { name: 'home' }
    | { name: 'me' }
    | { name: 'menu' }
    | { name: 'profile'; user: User }
    | { name: 'messages' }
    | { name: 'chat'; withUser: User }
    | { name: 'info' }
    | { name: 'topup' }
    | { name: 'shop' };

// Dummy domain for creating technical emails from logins
const DUMMY_DOMAIN = 'topper.app';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [gifts] = useState<Gift[]>(mockGifts);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUserForGift, setSelectedUserForGift] = useState<User | null>(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [view, setView] = useState<View>({ name: 'rating' });
    const [theme, setTheme] = useState(localStorage.getItem('topper-theme') || 'dark');
    
    const activeTab = ['rating', 'home', 'me', 'menu'].includes(view.name) ? view.name : '';
    
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchData = useCallback(async () => {
        if (!session) {
            setIsLoading(false);
            return;
        };

        setIsLoading(true);
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profileError) throw profileError;
            setCurrentUser(profileData);

            const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
            if (usersError) throw usersError;
            setUsers(usersData);

            const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*');
            if (messagesError) throw messagesError;
            setMessages(messagesData.map(m => ({ ...m, timestamp: new Date(m.timestamp).getTime() })));

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchData();
    }, [session, fetchData]);
    
    useEffect(() => {
        if (!currentUser) return;

        const channel = supabase.channel('public:messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const newMessage = payload.new as any;
                 if (newMessage.receiverId === currentUser.id || newMessage.senderId === currentUser.id) {
                     setMessages(prev => [...prev, { ...newMessage, timestamp: new Date(newMessage.timestamp).getTime() }]);
                }
            })
            .subscribe();
        
        return () => {
            supabase.removeChannel(channel);
        };
    }, [currentUser]);


    useEffect(() => {
        localStorage.setItem('topper-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const calculateRating = useCallback((user: User): number => {
        let profilePoints = 0;
        if (user.name) profilePoints += 1;
        if (user.age) profilePoints += 1;
        if (user.location) profilePoints += 20;
        if (user.hobbies) profilePoints += user.hobbies.length * 2;
        if (user.aboutMe && user.aboutMe.length >= 50) profilePoints += 3;
        if (user.relationshipStatus) profilePoints += 5;

        const likePoints = user.likesReceived;
        const giftPoints = user.giftsReceived.reduce((sum, gift) => sum + gift.rating, 0);
        return profilePoints + likePoints + giftPoints + user.passiveRating;
    }, []);

    const sortedUsers = useMemo(() => 
        [...users]
            .map(user => ({ ...user, rating: calculateRating(user) }))
            .sort((a, b) => b.rating - a.rating),
    [users, calculateRating]);

    const handleLikeUser = async (userId: string) => {
        if (!currentUser) return;
        
        if (currentUser.likesGiven >= 3) {
            alert("У вас не залишилося лайків на сьогодні.");
            return;
        }

        const now = new Date().getTime();
        const canLike = !currentUser.likeTimestamps[userId] || (now - currentUser.likeTimestamps[userId] > 24 * 60 * 60 * 1000);
        
        if (!canLike) {
             alert("Ви можете лайкати цього користувача лише раз на день.");
             return;
        }

        const targetUser = users.find(u => u.id === userId);
        if (!targetUser) return;
        
        const newLikeTimestamps = { ...currentUser.likeTimestamps, [userId]: now };

        try {
            const { error: targetUserError } = await supabase
                .from('profiles')
                .update({ likesReceived: targetUser.likesReceived + 1 })
                .eq('id', userId);
            
            if (targetUserError) throw targetUserError;

            const { data: updatedCurrentUser, error: currentUserError } = await supabase
                .from('profiles')
                .update({ likesGiven: currentUser.likesGiven + 1, likeTimestamps: newLikeTimestamps })
                .eq('id', currentUser.id)
                .select()
                .single();

            if (currentUserError) throw currentUserError;

            setCurrentUser(updatedCurrentUser);
            setUsers(prev => prev.map(u => {
                if (u.id === userId) return { ...u, likesReceived: u.likesReceived + 1 };
                if (u.id === currentUser.id) return updatedCurrentUser;
                return u;
            }));

        } catch (error) {
            console.error("Error liking user:", error);
            alert("Не вдалося поставити лайк.");
        }
    };

    const handleSendGift = async (userId: string, gift: Gift) => {
        const targetUser = users.find(u => u.id === userId);
        if (!targetUser) return;
        
        const newGifts = [...targetUser.giftsReceived, gift];

        const { error } = await supabase
            .from('profiles')
            .update({ giftsReceived: newGifts })
            .eq('id', userId);

        if (error) {
            console.error('Error sending gift:', error);
            alert("Не вдалося надіслати подарунок.");
        } else {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, giftsReceived: newGifts } : u));
        }

        setIsGiftModalOpen(false);
        setSelectedUserForGift(null);
    };

    const openGiftModal = (user: User) => {
        setSelectedUserForGift(user);
        setIsGiftModalOpen(true);
    };
    
    const handleRegister = async (data: RegistrationData): Promise<{success: boolean, error?: string}> => {
        const technicalEmail = `${data.login}@${DUMMY_DOMAIN}`;

        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: technicalEmail,
            password: data.password!,
            options: {
                data: {
                    login: data.login, // Pass the real login
                    name: data.name,
                    avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${data.login}`,
                    age: data.age,
                    location: data.location,
                    hobbies: data.hobbies,
                    aboutMe: data.aboutMe,
                    relationshipStatus: data.relationshipStatus,
                }
            }
        });

        if (signUpError) {
            console.error("Sign up error:", signUpError);
            return { success: false, error: signUpError.message };
        }
        if (!user) return { success: false, error: "Не вдалося створити користувача."};

        // Profile is created by the trigger. The onAuthStateChange listener will handle the rest.
        return { success: true };
    };

    const handleLogin = async (login: string, password: string): Promise<{success: boolean, error?: string}> => {
        const technicalEmail = `${login}@${DUMMY_DOMAIN}`;
        const { error } = await supabase.auth.signInWithPassword({
            email: technicalEmail,
            password: password,
        });

        if (error) {
            console.error("Login error:", error);
            return { success: false, error: "Неправильний логін або пароль." };
        }
        return { success: true };
    }
    
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
        else {
            setCurrentUser(null);
            setUsers([]);
            setMessages([]);
            setView({ name: 'rating' });
        }
    }

    const handleUpdateProfile = async (updatedData: Partial<User>) => {
        if (!currentUser) return;
        const { error, data } = await supabase
            .from('profiles')
            .update(updatedData)
            .eq('id', currentUser.id)
            .select()
            .single();

        if (error) {
            console.error("Profile update error:", error);
        } else {
            setCurrentUser(data);
            setUsers(prev => prev.map(u => u.id === currentUser.id ? data : u));
        }
    };

    const handleSendMessage = async (receiverId: string, text: string) => {
        if (!currentUser || !text.trim()) return;

        const newMessage = {
            senderId: currentUser.id,
            receiverId: receiverId,
            text: text.trim(),
            timestamp: new Date().toISOString()
        };

        const { error } = await supabase.from('messages').insert(newMessage);
        if (error) {
            console.error('Error sending message:', error);
            alert("Не вдалося відправити повідомлення.");
        }
    };

    const renderContent = () => {
        if (!currentUser) return null;
        switch (view.name) {
            case 'rating':
                return <Leaderboard users={sortedUsers} currentUser={currentUser} onLike={handleLikeUser} onGift={openGiftModal} onViewProfile={(user) => setView({ name: 'profile', user })} />;
            case 'home':
                const topUsersInCity = sortedUsers.filter(u => u.location === currentUser.location).slice(0, 3);
                return <HomePage city={currentUser.location || ''} topUsers={topUsersInCity} onViewProfile={(user) => setView({ name: 'profile', user })} />;
            case 'me':
                return <ProfilePage user={currentUser} rating={calculateRating(currentUser)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onLike={handleLikeUser} onGift={openGiftModal} onSendMessage={(user) => setView({ name: 'chat', withUser: user })} />;
            case 'menu':
                return <MenuPage theme={theme} setTheme={setTheme} onNavigate={(page) => setView({ name: page as any })} onLogout={handleLogout} />;
            case 'profile':
                return <ProfilePage user={view.user} rating={calculateRating(view.user)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onBack={() => setView({ name: 'rating' })} onLike={handleLikeUser} onGift={openGiftModal} onSendMessage={(user) => setView({ name: 'chat', withUser: user })} />;
            case 'messages':
                return <MessagesPage currentUser={currentUser} allUsers={users} messages={messages} onViewChat={(user) => setView({ name: 'chat', withUser: user })} onBack={() => setView({ name: 'menu' })} />;
            case 'chat':
                return <ChatPage currentUser={currentUser} chatPartner={view.withUser} messages={messages} onSendMessage={handleSendMessage} onBack={() => setView({ name: 'messages' })} />;
            case 'info':
            case 'topup':
            case 'shop':
                 return <div className="text-center p-10 text-gray-500 dark:text-gray-400">{view.name} в розробці. <button onClick={() => setView({name: 'menu'})} className="text-purple-500">Назад</button></div>;
            default:
                return null;
        }
    };
    
    if (isLoading) {
        return <div className="h-full flex items-center justify-center text-xl font-bold">Завантаження...</div>
    }

    if (!session || !currentUser) {
        return <AuthFlow onRegister={handleRegister} onLogin={handleLogin}/>;
    }

    return (
        <div className="h-full grid grid-rows-[auto_1fr] font-sans">
            <Header currentUser={currentUser} />
            <main className="overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">
                {renderContent()}
            </main>
            {isGiftModalOpen && selectedUserForGift && (
                <GiftModal
                    user={selectedUserForGift}
                    gifts={gifts}
                    onSendGift={(gift) => handleSendGift(selectedUserForGift.id, gift)}
                    onClose={() => setIsGiftModalOpen(false)}
                />
            )}
            <Navbar activeTab={activeTab} onTabChange={(tab) => setView({name: tab as any})} />
        </div>
    );
};

export default App;
