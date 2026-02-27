
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Gift, Message } from './types';
import Header from './components/Header';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import AuthFlow, { RegistrationData } from './components/AuthFlow';
import ProfilePage from './components/ProfilePage';
import MessagesPage from './components/MessagesPage';
import ChatPage from './components/ChatPage';
import { supabase } from './supabaseClient';
import { Session, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import CompleteProfile from './components/CompleteProfile';
import ShopPage from './components/ShopPage';
import TopUpPage from './components/TopUpPage';
import FakePaymentPage from './components/FakePaymentPage';
import SettingsPage from './components/SettingsPage';
import CityChatPage from './components/CityChatPage';

type View = 
    | { name: 'rating' }
    | { name: 'city-chat' }
    | { name: 'me' }
    | { name: 'settings' }
    | { name: 'profile'; user: User }
    | { name: 'messages' }
    | { name: 'chat'; withUser: User }
    | { name: 'info' }
    | { name: 'topup' }
    | { name: 'payment'; amount: number }
    | { name: 'shop'; forUser?: User };

const DUMMY_DOMAIN = 'topper.app';

function dataURLtoBlob(dataurl: string): Blob | null {
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return null;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [view, setView] = useState<View>({ name: 'rating' });
    const [theme, setTheme] = useState(localStorage.getItem('topper-theme') || 'dark');
    
    const activeTab = ['rating', 'me', 'city-chat', 'messages'].includes(view.name) ? view.name : '';
    
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
        const handleRealtimeMessage = (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
            const eventType = payload.eventType;
            const record = (eventType === 'DELETE' ? payload.old : payload.new) as Message;
            if (!record || (record.receiverId !== currentUser.id && record.senderId !== currentUser.id)) return;
            if (eventType === 'INSERT') {
                setMessages(prev => {
                    if (prev.find(m => m.id === record.id)) return prev;
                    return [...prev, { ...record, timestamp: new Date(record.timestamp).getTime() }];
                });
            } else if (eventType === 'UPDATE') {
                setMessages(prev => prev.map(msg => msg.id === record.id ? { ...record, timestamp: new Date(record.timestamp).getTime() } : msg));
            } else if (eventType === 'DELETE') {
                setMessages(prev => prev.filter(msg => msg.id !== record.id));
            }
        };
        const channel = supabase.channel('messages-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handleRealtimeMessage)
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem('topper-theme', theme);
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
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
    
    const unreadMessagesCount = useMemo(() => {
        if (!currentUser) return 0;
        return messages.filter(m => m.receiverId === currentUser.id && !m.is_read).length;
    }, [messages, currentUser]);

    const handleLikeUser = async (userId: string) => {
        if (!currentUser) return;
        
        if (currentUser.availableLikes <= 0) {
            alert("У вас не залишилося лайків. Заберіть щоденний бонус або зачекайте оновлення о 00:00.");
            return;
        }

        const now = new Date().getTime();
        const canLikePartner = !currentUser.likeTimestamps[userId] || (now - currentUser.likeTimestamps[userId] > 24 * 60 * 60 * 1000);
        
        if (!canLikePartner) {
             alert("Ви можете лайкати цього користувача лише раз на день.");
             return;
        }

        const targetUser = users.find(u => u.id === userId);
        if (!targetUser) return;
        
        const newLikeTimestamps = { ...currentUser.likeTimestamps, [userId]: now };
        const newAvailableLikes = currentUser.availableLikes - 1;

        try {
            const { error: targetUserError } = await supabase
                .from('profiles')
                .update({ likesReceived: targetUser.likesReceived + 1 })
                .eq('id', userId);
            
            if (targetUserError) throw targetUserError;

            const { data: updatedCurrentUser, error: currentUserError } = await supabase
                .from('profiles')
                .update({ 
                    likesGiven: currentUser.likesGiven + 1, 
                    likeTimestamps: newLikeTimestamps,
                    availableLikes: newAvailableLikes
                })
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

    const handleClaimDailyLikes = async () => {
        if (!currentUser) return;
        
        const now = new Date().getTime();
        const lastClaim = new Date(currentUser.lastRechargeAt).getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - lastClaim < twentyFourHours) {
            alert("Ви можете забирати лайки лише раз на 24 години.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update({ 
                    availableLikes: currentUser.availableLikes + 3,
                    lastRechargeAt: new Date().toISOString()
                })
                .eq('id', currentUser.id)
                .select()
                .single();

            if (error) throw error;
            setCurrentUser(data);
            setUsers(prev => prev.map(u => u.id === currentUser.id ? data : u));
            alert("Ви отримали +3 лайки!");
        } catch (error) {
            console.error("Error claiming likes:", error);
            alert("Не вдалося отримати лайки.");
        }
    };

    const handleSendGift = async (receiver: User, gift: Gift) => {
        if (!currentUser) return false;
        if (currentUser.balance < gift.cost) {
            alert('Недостатньо коштів на балансі.');
            return false;
        }
        const { error } = await supabase.rpc('send_gift_and_update_balance', {
            sender_id: currentUser.id,
            receiver_id: receiver.id,
            gift_cost: gift.cost,
            gift_payload: gift,
        });
        if (error) {
            alert(`Не вдалося надіслати подарунок: ${error.message}`);
            return false;
        } else {
            alert('Подарунок надіслано!');
            await fetchData();
            setView({ name: 'profile', user: receiver });
            return true;
        }
    };

    const handleNavigateToShop = (user: User) => { setView({ name: 'shop', forUser: user }); };
    
    const handleRegister = async (data: Pick<RegistrationData, 'login' | 'password'>): Promise<{success: boolean, error?: string, rateLimited?: boolean}> => {
        const technicalEmail = `${data.login}@${DUMMY_DOMAIN}`;
        const { error: signUpError } = await supabase.auth.signUp({
            email: technicalEmail,
            password: data.password!,
            options: { data: { login: data.login, name: '' } }
        });
        if (signUpError) {
            const errorMessage = signUpError.message.toLowerCase();
            if (errorMessage.includes('user already registered')) return { success: false, error: 'Цей логін вже зайнятий.' };
            return { success: false, error: 'Помилка реєстрації.' };
        }
        return { success: true };
    };

    const handleLogin = async (login: string, password: string): Promise<{success: boolean, error?: string}> => {
        const technicalEmail = `${login.toLowerCase()}@${DUMMY_DOMAIN}`;
        const { error } = await supabase.auth.signInWithPassword({ email: technicalEmail, password: password });
        if (error) return { success: false, error: "Неправильний логін або пароль." };
        return { success: true };
    }
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setUsers([]);
        setMessages([]);
        setView({ name: 'rating' });
    }

    const handleUpdateProfile = async (updatedData: Partial<User>) => {
        if (!currentUser) return;
        const dataToUpdate = { ...updatedData };
        try {
            const uploadImage = async (dataUrl: string, folder: 'avatars' | 'backgrounds'): Promise<string> => {
                const blob = dataURLtoBlob(dataUrl);
                if (!blob) throw new Error('Недійсний формат.');
                const filePath = `${folder}/${currentUser.id}-${Date.now()}.jpeg`;
                const { data, error } = await supabase.storage.from('profile-media').upload(filePath, blob, { upsert: false, contentType: 'image/jpeg' });
                if (error) throw error;
                const { data: { publicUrl } } = supabase.storage.from('profile-media').getPublicUrl(data.path);
                return publicUrl;
            };
            if (dataToUpdate.avatarUrl && dataToUpdate.avatarUrl.startsWith('data:image')) {
                dataToUpdate.avatarUrl = await uploadImage(dataToUpdate.avatarUrl, 'avatars');
            }
            if (Object.keys(dataToUpdate).length > 0) {
                const { error, data } = await supabase.from('profiles').update(dataToUpdate).eq('id', currentUser.id).select().single();
                if (error) throw error;
                setCurrentUser(data);
                setUsers(prev => prev.map(u => u.id === currentUser.id ? data : u));
            }
        } catch (error) {
            alert(`Помилка: ${(error as Error).message}`);
        }
    };
    
    const handleProceedToPayment = (amount: number) => { setView({ name: 'payment', amount }); };
    
    const handleTopUp = async (amount: number): Promise<boolean> => {
        if (!currentUser) return false;
        const newBalance = (currentUser.balance || 0) + amount;
        const { data, error } = await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id).select().single();
        if (error) return false;
        setCurrentUser(data);
        return true;
    };

    const handleSendMessage = async (receiverId: string, text: string) => {
        if (!currentUser || !text.trim()) return;
        const newMessage = { senderId: currentUser.id, receiverId: receiverId, text: text.trim(), timestamp: new Date().toISOString() };
        await supabase.from('messages').insert(newMessage);
    };

    const renderContent = () => {
        if (!currentUser) return null;
        switch (view.name) {
            case 'rating':
                return <Leaderboard users={sortedUsers} currentUser={currentUser} onLike={handleLikeUser} onGift={handleNavigateToShop} onViewProfile={(user) => setView({ name: 'profile', user })} />;
            case 'city-chat':
                return <CityChatPage currentUser={currentUser} allUsers={users} />;
            case 'me':
                return <ProfilePage user={currentUser} rating={calculateRating(currentUser)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onLike={handleLikeUser} onGift={handleNavigateToShop} onSendMessage={(user) => setView({ name: 'chat', withUser: user })} />;
            case 'profile':
                return <ProfilePage user={view.user} rating={calculateRating(view.user)} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} onBack={() => setView({ name: 'rating' })} onLike={handleLikeUser} onGift={handleNavigateToShop} onSendMessage={(user) => setView({ name: 'chat', withUser: user })} />;
            case 'messages':
                return <MessagesPage currentUser={currentUser} allUsers={users} messages={messages} onViewChat={(user) => setView({ name: 'chat', withUser: user })} onBack={() => setView({ name: 'rating' })} />;
            case 'chat':
                return <ChatPage currentUser={currentUser} chatPartner={view.withUser} messages={messages} onSendMessage={handleSendMessage} onBack={() => setView({ name: 'messages' })} />;
            case 'settings':
                return <SettingsPage currentUser={currentUser} theme={theme} setTheme={setTheme} onBack={() => setView({ name: 'rating' })} onUpdateProfile={handleUpdateProfile} />;
            case 'shop':
                return <ShopPage currentUser={currentUser} targetUser={view.forUser} onSendGift={handleSendGift} onBack={() => view.forUser ? setView({ name: 'profile', user: view.forUser }) : setView({ name: 'rating' })} />;
            case 'topup':
                return <TopUpPage currentUser={currentUser} onProceedToPayment={handleProceedToPayment} onBack={() => setView({ name: 'settings' })} />;
            case 'payment':
                return <FakePaymentPage amount={view.amount} onPaymentSuccess={handleTopUp} onCancel={() => setView({ name: 'topup' })} onPaymentComplete={() => setView({ name: 'settings' })} />;
            default: return null;
        }
    };
    
    if (isLoading) return <div className="h-full flex items-center justify-center text-xl font-bold">Завантаження...</div>
    if (!session || !currentUser) return <AuthFlow onRegister={handleRegister} onLogin={handleLogin}/>;
    if (!currentUser.name) return <CompleteProfile user={currentUser} onComplete={handleUpdateProfile} />;

    return (
        <div className="h-full grid grid-rows-[auto_1fr]">
            <Header currentUser={currentUser} onClaimLikes={handleClaimDailyLikes} onNavigate={(tab) => setView({name: tab as any})} />
            <main className="overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20">{renderContent()}</main>
            <Navbar activeTab={activeTab} onTabChange={(tab) => setView({name: tab as any})} />
        </div>
    );
};

export default App;
