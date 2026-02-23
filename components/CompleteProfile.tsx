
import React, { useState } from 'react';
import { User } from '../types';
import { ukrainianCities } from '../data/cities';
import ImageUploader from './ImageUploader';
import PhotographIcon from './icons/PhotographIcon';
import { GRADIENT_PALETTE } from '../data/gradients';


interface CompleteProfileProps {
    user: User;
    onComplete: (data: Partial<User>) => void;
}

const HOBBY_OPTIONS = ["Спорт", "Музика", "Мистецтво", "Ігри", "Подорожі", "Читання", "Кулінарія", "Кіно", "Технології", "Мода"];
const RELATIONSHIP_OPTIONS = ["Неодружений/Незаміжня", "У стосунках", "Одружений/Заміжня", "Все складно"];
const EMOJI_OPTIONS = ['✨', '🚀', '❤️', '👑', '💎', '🌟', '💐', '⚙️', '🎮', '🎨'];


const CompleteProfile: React.FC<CompleteProfileProps> = ({ user, onComplete }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        name: user.name || '',
        avatarUrl: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.login}`,
        birthDate: user.birthDate || '',
        location: user.location || '',
        hobbies: user.hobbies || [],
        aboutMe: user.aboutMe || '',
        relationshipStatus: user.relationshipStatus || '',
        profileBgColor: user.profileBgColor || GRADIENT_PALETTE[5].gradient, // default Twilight
        profileBgEmoji: user.profileBgEmoji || '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleHobbyToggle = (hobby: string) => {
        const hobbies = formData.hobbies || [];
        if (hobbies.includes(hobby)) {
            setFormData(prev => ({ ...prev, hobbies: hobbies.filter((h: string) => h !== hobby) }));
        } else if (hobbies.length < 5) {
            setFormData(prev => ({ ...prev, hobbies: [...hobbies, hobby] }));
        } else {
            alert('Можна обрати не більше 5 хобі.');
        }
    };
    
    const handleColorSelect = (color: string) => {
        setFormData(prev => ({ ...prev, profileBgColor: color }));
    };

    const handleEmojiSelect = (emoji: string) => {
        setFormData(prev => ({ ...prev, profileBgEmoji: emoji }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim() || !formData.location) {
            setError('Ім\'я та місто є обов\'язковими.');
            return;
        }
        setError('');
        setIsLoading(true);
        await onComplete(formData);
        // On success, the component will be unmounted by the parent.
    };
    
    return (
        <>
            {isUploaderOpen && (
                <ImageUploader 
                    onClose={() => setIsUploaderOpen(false)}
                    onCropComplete={(img) => {
                        setFormData(prev => ({ ...prev, avatarUrl: img }));
                        setIsUploaderOpen(false);
                    }}
                />
            )}
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-2">Завершення реєстрації</h2>
                    <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Розкажіть трохи про себе.</p>
                    {error && <p className="text-red-500 text-center mb-4 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        
                        <div>
                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Фото профілю (необов'язково)</label>
                            <div className="flex items-center space-x-4">
                                <img src={formData.avatarUrl || `https://i.pravatar.cc/150?u=${user.login}`} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover"/>
                                <button type="button" onClick={() => setIsUploaderOpen(true)} className="bg-gray-200 dark:bg-gray-600 font-semibold px-4 py-2 rounded-lg">Завантажити</button>
                            </div>
                        </div>

                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="* Ваше ім'я" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700" />
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Дата народження</label>
                            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700" />
                        </div>
                        <select name="location" value={formData.location} onChange={handleInputChange} required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <option value="">* Оберіть місто...</option>
                            {ukrainianCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                        
                        <div>
                            <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Хобі (до 5)</label>
                            <div className="flex flex-wrap gap-2">
                                {HOBBY_OPTIONS.map(hobby => (
                                    <button key={hobby} type="button" onClick={() => handleHobbyToggle(hobby)} className={`px-3 py-1 rounded-full text-sm ${formData.hobbies?.includes(hobby) ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                        {hobby}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea name="aboutMe" value={formData.aboutMe} onChange={handleInputChange} placeholder="Про себе" rows={3} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"></textarea>
                        <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                            <option value="">Сімейний стан</option>
                            {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>

                        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
                             <div className="flex items-center space-x-3">
                                <PhotographIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                <span className="font-medium text-gray-900 dark:text-white">Оформлення картки</span>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Колір фону</label>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {GRADIENT_PALETTE.map(gradient => (
                                        <button
                                            type="button"
                                            key={gradient.name}
                                            onClick={() => handleColorSelect(gradient.gradient)}
                                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 ${formData.profileBgColor === gradient.gradient ? 'ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700' : ''}`}
                                            style={{ background: gradient.gradient }}
                                            aria-label={`Select color ${gradient.name}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Емодзі-візерунок</label>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {EMOJI_OPTIONS.map(emoji => (
                                        <button
                                            type="button"
                                            key={emoji}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 ${formData.profileBgEmoji === emoji ? 'bg-purple-600 ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            aria-label={`Select emoji ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleEmojiSelect('')}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-sm font-bold hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-offset-gray-800 ${!formData.profileBgEmoji ? 'bg-purple-600 ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}
                                    >
                                        OFF
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-4">
                             <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-lg disabled:bg-gray-400">
                                {isLoading ? 'Збереження...' : 'Завершити'}
                             </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CompleteProfile;
