
import React, { useState, useMemo } from 'react';
import { ukrainianCities } from '../data/cities';
import ImageUploader from './ImageUploader';
import UserIcon from './icons/UserIcon';
import CameraIcon from './icons/CameraIcon';


export interface RegistrationData {
    login: string;
    password?: string;
    name: string;
    age: number;
    location?: string;
    hobbies?: string[];
    aboutMe?: string;
    relationshipStatus?: string;
    avatarUrl?: string;
}

interface AuthFlowProps {
    onRegister: (data: RegistrationData) => Promise<{success: boolean, error?: string}>;
    onLogin: (login: string, password: string) => Promise<{success: boolean, error?: string}>;
}

const HOBBY_OPTIONS = ["Спорт", "Музика", "Мистецтво", "Ігри", "Подорожі", "Читання", "Кулінарія", "Кіно", "Технології", "Мода"];
const RELATIONSHIP_OPTIONS = ["Неодружений/Незаміжня", "У стосунках", "Одружений/Заміжня", "Все складно"];

const AuthFlow: React.FC<AuthFlowProps> = ({ onRegister, onLogin }) => {
    const [view, setView] = useState('welcome'); // 'welcome', 'register', 'login'

    if (view === 'register') {
        return <RegisterForm onRegister={onRegister} onBack={() => setView('welcome')} />;
    }
    
    if (view === 'login') {
        return <LoginForm onLogin={onLogin} onBack={() => setView('welcome')} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-purple-600 dark:text-purple-400">Topper</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Піднімайся в таблиці лідерів свого міста.</p>
            </div>
            <div className="mt-12 space-y-4 w-full max-w-xs">
                <button 
                    onClick={() => setView('register')}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg"
                >
                    Зареєструватися
                </button>
                <button 
                    onClick={() => setView('login')}
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                    Увійти
                </button>
            </div>
        </div>
    );
};

const LoginForm: React.FC<{ onLogin: (login: string, password: string) => Promise<{success: boolean, error?: string}>; onBack: () => void; }> = ({ onLogin, onBack }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await onLogin(login, password);
        if (!result.success) {
            setError(result.error || 'Не вдалося увійти.');
        }
        setIsLoading(false);
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
             <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Вхід</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" value={login} onChange={e => setLogin(e.target.value)} placeholder="Email (Логін)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400">{isLoading ? 'Вхід...' : 'Увійти'}</button>
                    <button type="button" onClick={onBack} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline mt-2">Назад</button>
                </form>
             </div>
        </div>
    );
};


const RegisterForm: React.FC<{ onRegister: (data: RegistrationData) => Promise<{success: boolean, error?: string}>; onBack: () => void; }> = ({ onRegister, onBack }) => {
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<RegistrationData> & { passwordConfirm?: string }>({
        login: '',
        password: '',
        passwordConfirm: '',
        name: '',
        age: undefined,
        location: '',
        hobbies: [],
        aboutMe: '',
        relationshipStatus: '',
        avatarUrl: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) || undefined : value }));
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

    const isStepValid = useMemo(() => {
        switch (step) {
            case 1: 
                return formData.name && formData.name.length > 1 && 
                       formData.age && formData.age >= 18 &&
                       formData.login && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login) &&
                       formData.password && formData.password.length >= 6 &&
                       formData.password === formData.passwordConfirm;
            case 2: return !!formData.location; // Must select a city
            case 3: return true;
            case 4: return true;
            default: return false;
        }
    }, [step, formData]);

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        if (isStepValid) {
            setError('');
            setIsLoading(true);
            const result = await onRegister(formData as RegistrationData);
            if (!result.success) {
                setError(result.error || 'Помилка реєстрації.');
                setStep(1); 
            }
            setIsLoading(false);
        }
    };
    
    const totalSteps = 4;
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
             {isUploaderOpen && (
                <ImageUploader
                    onClose={() => setIsUploaderOpen(false)}
                    onCropComplete={(croppedImage) => {
                        setFormData(prev => ({ ...prev, avatarUrl: croppedImage }));
                        setIsUploaderOpen(false);
                    }}
                />
            )}
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                         <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Реєстрація</h2>
                         <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Крок {step} з {totalSteps}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, transition: 'width 0.3s' }}></div>
                    </div>
                </div>
                {error && <p className="text-red-500 text-center mb-4 text-sm">{error}</p>}

                {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Avatar preview" className="w-20 h-20 rounded-full object-cover" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <UserIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                    </div>
                                )}
                                <button type="button" onClick={() => setIsUploaderOpen(true)} className="absolute -bottom-1 -right-1 bg-purple-600 text-white p-1.5 rounded-full hover:bg-purple-700">
                                    <CameraIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-grow space-y-4">
                               <input type="text" name="name" placeholder="Ім'я" value={formData.name || ''} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                                <input type="number" name="age" placeholder="Вік (18+)" value={formData.age || ''} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                            </div>
                        </div>
                         <hr className="border-gray-200 dark:border-gray-600"/>
                        <input type="email" name="login" placeholder="Email (це буде ваш логін)" value={formData.login} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                        <input type="password" name="password" placeholder="Пароль (мін. 6 символів)" value={formData.password} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                        <input type="password" name="passwordConfirm" placeholder="Підтвердьте пароль" value={formData.passwordConfirm} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <select name="location" value={formData.location} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none">
                            <option value="" disabled>Оберіть місто</option>
                            {ukrainianCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>
                )}
                {step === 3 && (
                    <div>
                         <p className="mb-3 text-center text-gray-600 dark:text-gray-300">Оберіть до 5 хобі (необов'язково) ({formData.hobbies?.length || 0}/5)</p>
                         <div className="flex flex-wrap gap-2 justify-center">
                            {HOBBY_OPTIONS.map(hobby => (
                                <button key={hobby} onClick={() => handleHobbyToggle(hobby)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${formData.hobbies?.includes(hobby) ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                                    {hobby}
                                </button>
                            ))}
                         </div>
                    </div>
                )}
                 {step === 4 && (
                    <div className="space-y-4">
                        <textarea name="aboutMe" placeholder="Про себе (необов'язково, мін. 50 симв. для рейтингу)" value={formData.aboutMe} onChange={handleInputChange} rows={4} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none"></textarea>
                        <select name="relationshipStatus" value={formData.relationshipStatus} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none">
                            <option value="">Сімейний стан (необов'язково)</option>
                            {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                )}

                <div className="flex justify-between mt-8">
                    <button onClick={step === 1 ? onBack : prevStep} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                        {step === 1 ? 'Скасувати' : 'Назад'}
                    </button>
                    {step < totalSteps && (
                        <button onClick={nextStep} disabled={!isStepValid} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-500">
                            Далі
                        </button>
                    )}
                     {step === totalSteps && (
                        <button onClick={handleSubmit} disabled={!isStepValid || isLoading} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-500">
                           {isLoading ? 'Реєстрація...' : 'Завершити'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthFlow;