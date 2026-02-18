
import React, { useState } from 'react';
import { User } from '../types';
import PencilIcon from './icons/PencilIcon';
import LocationPinIcon from './icons/LocationPinIcon';
import SparklesIcon from './icons/SparklesIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';
import UsersIcon from './icons/UsersIcon';
import { ukrainianCities } from '../data/cities';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import HeartIcon from './icons/HeartIcon';
import GiftIcon from './icons/GiftIcon';
import MessageIcon from './icons/MessageIcon';
import ImageUploader from './ImageUploader';
import CameraIcon from './icons/CameraIcon';
import RatingBar from './RatingBar';


interface ProfilePageProps {
    user: User;
    currentUser: User;
    rating: number;
    onUpdateProfile: (updatedData: Partial<User>) => void;
    onBack?: () => void;
    onLike: (userId: string) => void;
    onGift: (user: User) => void;
    onSendMessage: (user: User) => void;
}

const HOBBY_OPTIONS = ["Спорт", "Музика", "Мистецтво", "Ігри", "Подорожі", "Читання", "Кулінарія", "Кіно", "Технології", "Мода"];
const RELATIONSHIP_OPTIONS = ["Неодружений/Незаміжня", "У стосунках", "Одружений/Заміжня", "Все складно"];

const formatRating = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'к';
    }
    return num.toString();
};

const ProfilePage: React.FC<ProfilePageProps> = ({ user, currentUser, rating, onUpdateProfile, onBack, onLike, onGift, onSendMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        location: user.location || '',
        hobbies: user.hobbies || [],
        aboutMe: user.aboutMe || '',
        relationshipStatus: user.relationshipStatus || '',
        note: user.note || '',
    });

    const isCurrentUser = user.id === currentUser.id;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHobbyToggle = (hobby: string) => {
        setFormData(prev => {
            const hobbies = prev.hobbies || [];
            if (hobbies.includes(hobby)) {
                return { ...prev, hobbies: hobbies.filter(h => h !== hobby) };
            }
            if (hobbies.length < 5) {
                return { ...prev, hobbies: [...hobbies, hobby] };
            }
            return prev;
        });
    };

    const handleSave = () => {
        onUpdateProfile(formData);
        setIsEditing(false);
    };

    if (isEditing && isCurrentUser) {
        return (
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
                 <h2 className="text-2xl font-bold text-center text-purple-600 dark:text-purple-300">Редагувати профіль</h2>
                 
                 <div className="space-y-2">
                    <label htmlFor="note-input" className="font-semibold text-gray-700 dark:text-gray-300">Заметка (до 200 символів)</label>
                    <div className="relative">
                        <textarea id="note-input" name="note" placeholder="Ваш статус, оголошення або цитата..." value={formData.note} onChange={handleInputChange} rows={3} maxLength={200} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none pr-16"></textarea>
                        <span className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500">
                            {formData.note?.length || 0} / 200
                        </span>
                    </div>
                </div>

                 <div className="space-y-2">
                    <label className="font-semibold text-gray-700 dark:text-gray-300">Місто</label>
                    <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none">
                        <option value="">Не вказано</option>
                        {ukrainianCities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                 </div>
                 
                 <div>
                    <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Хобі (до 5)</label>
                    <div className="flex flex-wrap gap-2">
                        {HOBBY_OPTIONS.map(hobby => (
                            <button key={hobby} onClick={() => handleHobbyToggle(hobby)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${formData.hobbies?.includes(hobby) ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                {hobby}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                     <label className="font-semibold text-gray-700 dark:text-gray-300">Про себе</label>
                     <textarea name="aboutMe" placeholder="Розкажіть про себе..." value={formData.aboutMe} onChange={handleInputChange} rows={4} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none"></textarea>
                 </div>
                 
                 <div className="space-y-2">
                     <label className="font-semibold text-gray-700 dark:text-gray-300">Сімейний стан</label>
                     <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none">
                        <option value="">Не вказано</option>
                        {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                 </div>

                 <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={() => setIsEditing(false)} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Скасувати</button>
                    <button onClick={handleSave} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">Зберегти</button>
                 </div>
            </div>
        );
    }

    return (
        <>
        {isUploaderOpen && (
            <ImageUploader
                onClose={() => setIsUploaderOpen(false)}
                onCropComplete={(croppedImage) => {
                    onUpdateProfile({ avatarUrl: croppedImage });
                    setIsUploaderOpen(false);
                }}
            />
        )}
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl relative">
            {onBack && (
                 <button onClick={onBack} className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700/50 z-10">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
            )}
            <div className="text-center pt-8">
                <div className="relative w-24 h-24 mx-auto">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-purple-500" />
                     {isCurrentUser && (
                        <button onClick={() => setIsUploaderOpen(true)} className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-md">
                           <CameraIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4 dark:[text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{user.name}{user.age ? `, ${user.age}` : ''}</h2>
            </div>
            
            <div className="mt-4">
                 <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-bold text-purple-500 dark:text-purple-300">Рейтинг</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatRating(rating)}</span>
                 </div>
                 <RatingBar rating={rating} />
            </div>
            
            <NoteBlock note={user.note} />

            <div className="mt-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg divide-y divide-gray-200 dark:divide-gray-600 px-4">
                <InfoRow icon={LocationPinIcon} label="Місто" value={user.location} />
                <InfoRow icon={SparklesIcon} label="Хобі" value={user.hobbies} />
                <InfoRow icon={UsersIcon} label="Статус" value={user.relationshipStatus} />
                <InfoRow icon={DocumentTextIcon} label="Про себе" value={user.aboutMe} />
            </div>

            <div className="mt-8">
                {isCurrentUser ? (
                    <button 
                        onClick={() => setIsEditing(true)} 
                        className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                    >
                        <PencilIcon className="w-5 h-5" />
                        <span className="[text-shadow:0_1px_1px_rgba(0,0,0,0.3)]">Редагувати профіль</span>
                    </button>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => onLike(user.id)} className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-colors">
                            <HeartIcon className="w-6 h-6" />
                            <span className="text-xs font-bold [text-shadow:0_1px_1px_rgba(0,0,0,0.3)]">Лайк</span>
                        </button>
                         <button onClick={() => onGift(user)} className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors">
                            <GiftIcon className="w-6 h-6" />
                            <span className="text-xs font-bold [text-shadow:0_1px_1px_rgba(0,0,0,0.3)]">Подарунок</span>
                        </button>
                         <button onClick={() => onSendMessage(user)} className="flex flex-col items-center justify-center space-y-1 p-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition-colors">
                            <MessageIcon className="w-6 h-6" />
                            <span className="text-xs font-bold [text-shadow:0_1px_1px_rgba(0,0,0,0.3)]">Написати</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

const NoteBlock: React.FC<{ note?: string }> = ({ note }) => (
    <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
        <h4 className="font-semibold text-sm text-yellow-700 dark:text-yellow-300 mb-2">Заметка</h4>
        <p className="text-gray-800 dark:text-gray-200 italic whitespace-pre-wrap text-sm">
            {note || 'Користувач ще не додав заметку.'}
        </p>
    </div>
);


const InfoRow: React.FC<{ icon: React.FC<{ className?: string }>, label: string, value?: string | string[] }> = ({ icon: Icon, label, value }) => {
    const displayValue = Array.isArray(value) ? value.join(', ') : value;

    if (!displayValue) return null;

    return (
        <div className="flex items-start space-x-4 py-4 first:pt-3 last:pb-3">
            <Icon className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 break-words">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5 uppercase tracking-wider">{label}</h4>
                <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{displayValue}</p>
            </div>
        </div>
    );
};


export default ProfilePage;
