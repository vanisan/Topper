
import React, { useState, useEffect, useCallback } from 'react';
import { User, Gift, Message } from './types';
import { mockUsers, mockGifts, mockMessages } from './data/mockData';
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

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(() => {
        const storedUsers = localStorage.getItem('topper-allUsers');
        return storedUsers ? JSON.parse(storedUsers) : mockUsers;
    });
    const [messages, setMessages] = useState<Message[]>(() => {
        const storedMessages = localStorage.getItem('topper-messages');
        return storedMessages ? JSON.parse(storedMessages) : mockMessages;
    });
    const [gifts] = useState<Gift[]>(mockGifts);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedUserForGift, setSelectedUserForGift] = useState<User | null>(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [view, setView] = useState<View>({ name: 'rating' });
    const [theme, setTheme] = useState('dark');
    
    // Derived from view state to control Navbar active tab
    const activeTab = ['rating', 'home', 'me', 'menu'].includes(view.name) ? view.name : '';


    useEffect(() => {
        const storedUser = localStorage.getItem('topper-currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);
    
    useEffect(() => {
        localStorage.setItem('topper-allUsers', JSON.stringify(users));
    }, [users]);
    
    useEffect(() => {
        localStorage.setItem('topper-messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
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

    const sortedUsers = React.useMemo(() => 
        [...users]
            .map(user => ({ ...user, rating: calculateRating(user) }))
            .sort((a, b) => b.rating - a.rating),
    [users, calculateRating]);

    const applyPassiveRating = useCallback(() => {
        setUsers(prevUsers => {
            // Group users by location
            const usersByLocation: { [location: string]: User[] } = {};
            for (const user of prevUsers) {
                if (user.location) {
                    if (!usersByLocation[user.location]) {
                        usersByLocation[user.location] = [];
                    }
                    usersByLocation[user.location].push(user);
                }
            }

            const allTopUserIds = new Set<string>();

            // Find top 3 for each location
            for (const location in usersByLocation) {
                const top3InLocation = usersByLocation[location]
                    .map(user => ({ ...user, rating: calculateRating(user) }))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3)
                    .map(u => u.id);
                
                top3InLocation.forEach(id => allTopUserIds.add(id));
            }
            
            // Apply passive rating
            return prevUsers.map(user => {
                if (allTopUserIds.has(user.id)) {
                    return { ...user, passiveRating: user.passiveRating + 2 };
                }
                return user;
            });
        });
    }, [calculateRating]);

    useEffect(() => {
        const interval = setInterval(applyPassiveRating, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [applyPassiveRating]);


    const handleLikeUser = (userId: string) => {
        if (!currentUser) return;
        
        setUsers(prevUsers => {
            const updatedCurrentUserInList = prevUsers.find(u => u.id === currentUser.id);
            if (!updatedCurrentUserInList || updatedCurrentUserInList.likesGiven >= 3) {
                alert("У вас не залишилося лайків на сьогодні.");
                return prevUsers;
            }

            const now = new Date().getTime();
            const canLike = !updatedCurrentUserInList.likeTimestamps[userId] || (now - updatedCurrentUserInList.likeTimestamps[userId] > 24 * 60 * 60 * 1000);
            
            if (!canLike) {
                 alert("Ви можете лайкати цього користувача лише раз на день.");
                 return prevUsers;
            }

            return prevUsers.map(user => {
                if (user.id === userId) {
                    return { ...user, likesReceived: user.likesReceived + 1 };
                }
                if (user.id === currentUser.id) {
                    const updatedUser = {
                        ...user,
                        likesGiven: user.likesGiven + 1,
                        likeTimestamps: { ...user.likeTimestamps, [userId]: now }
                    };
                    const { password: _, ...userForState } = updatedUser;
                    setCurrentUser(userForState); 
                    localStorage.setItem('topper-currentUser', JSON.stringify(userForState));
                    return updatedUser;
                }
                return user;
            });
        });
    };

    const handleSendGift = (userId: string, gift: Gift) => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id === userId) {
                return {
                    ...user,
                    giftsReceived: [...user.giftsReceived, gift]
                };
            }
            return user;
        }));
        setIsGiftModalOpen(false);
        setSelectedUserForGift(null);
    };

    const openGiftModal = (user: User) => {
        setSelectedUserForGift(user);
        setIsGiftModalOpen(true);
    };
    
    const handleRegister = (data: RegistrationData): boolean => {
        if (users.some(user => user.login === data.login)) {
            alert('Цей логін вже зайнятий.');
            return false;
        }

        const newUser: User = {
            id: 'user-' + new Date().getTime(),
            avatarUrl: data.avatarUrl || `https://picsum.photos/seed/${data.name}/200`,
            rating: 0,
            likesReceived: 0,
            giftsReceived: [],
            likesGiven: 0,
            likeTimestamps: {},
            passiveRating: 0,
            ...data
        };
        
        const { password, ...newUserForState } = newUser;
        
        setUsers(prev => [newUser, ...prev]);
        setCurrentUser(newUserForState);
        localStorage.setItem('topper-currentUser', JSON.stringify(newUserForState));
        return true;
    };

    const handleLogin = (login: string, password: string): boolean => {
        const userToLogin = users.find(u => u.login === login && u.password === password);
        if (userToLogin) {
            const { password, ...userForState } = userToLogin;
            setCurrentUser(userForState);
            localStorage.setItem('topper-currentUser', JSON.stringify(userForState));
            return true;
        }
        return false;
    }

    const handleUpdateProfile = (updatedData: Partial<User>) => {
        if (!currentUser) return;
        const fullCurrentUser = users.find(u => u.id === currentUser.id);
        if (!fullCurrentUser) return;
        const updatedUserWithPassword = { ...fullCurrentUser, ...updatedData };
        setUsers(prevUsers => 
            prevUsers.map(u => u.id === currentUser.id ? updatedUserWithPassword : u)
        );
        const { password: _, ...userForState } = updatedUserWithPassword;
        setCurrentUser(userForState);
        localStorage.setItem('topper-currentUser', JSON.stringify(userForState));
    };

    const handleSendMessage = (receiverId: string, text: string) => {
        if (!currentUser || !text.trim()) return;

        const newMessage: Message = {
            id: 'msg-' + new Date().getTime(),
            senderId: currentUser.id,
            receiverId: receiverId,
            text: text.trim(),
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
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
                return <MenuPage theme={theme} setTheme={setTheme} onNavigate={(page) => setView({ name: page as any })} />;
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

    if (!currentUser) {
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
