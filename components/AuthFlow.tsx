
import React, { useState } from 'react';
import { ukrainianCities } from '../data/cities';
import ImageUploader from './ImageUploader';

export interface RegistrationData {
    login: string;
    password?: string;
    name?: string;
    age?: number;
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

const AuthFlow: React.FC<AuthFlowProps> = ({ onRegister, onLogin }) => {
    const [view, setView] = useState('welcome'); // 'welcome', 'register', 'login'

    if (view === 'register') {
        return <RegisterFlow onRegister={onRegister} onBack={() => setView('welcome')} />;
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
                    <input type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Логін" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400">{isLoading ? 'Вхід...' : 'Увійти'}</button>
                    <button type="button" onClick={onBack} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline mt-2">Назад</button>
                </form>
             </div>
        </div>
    );
};


const RegisterFlow: React.FC<{ onRegister: (data: RegistrationData) => Promise<{success: boolean, error?: string}>; onBack: () => void; }> = ({ onRegister, onBack }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationData>({
        login: '',
        password: '',
        name: '',
        age: undefined,
        location: '',
        hobbies: [],
        aboutMe: '',
        relationshipStatus: '',
        avatarUrl: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await onRegister(formData);
        if (!result.success) {
            setError(result.error || 'Помилка реєстрації. Можливо, такий логін вже існує.');
            setStep(1); // Go back to the first step on error
        }
        setIsLoading(false);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 data={formData} setData={setFormData} onNext={handleNext} error={error} onBack={onBack} />;
            case 2:
                return <Step2 data={formData} setData={setFormData} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Step3 data={formData} setData={setFormData} onNext={handleNext} onBack={handleBack} />;
            case 4:
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
                    <Step4 
                        data={formData} 
                        setData={setFormData} 
                        onSubmit={handleSubmit} 
                        onBack={handleBack} 
                        isLoading={isLoading}
                        onUploadClick={() => setIsUploaderOpen(true)}
                    />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
             <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-2">Реєстрація</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Крок {step} з 4</p>
                {renderStep()}
            </div>
        </div>
    );
};

// Step 1: Login & Password
const Step1 = ({ data, setData, onNext, error, onBack }: any) => {
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [localError, setLocalError] = useState('');

    const validateAndProceed = () => {
        if (!data.login.trim() || !data.password) {
            setLocalError('Логін та пароль не можуть бути порожніми.'); return;
        }
        if (data.login.includes('@') || data.login.includes(' ')) {
            setLocalError('Логін не повинен містити "@" або пробіли.'); return;
        }
        if (data.password !== passwordConfirm) {
            setLocalError('Паролі не співпадають.'); return;
        }
        if (data.password.length < 6) {
            setLocalError('Пароль має бути не менше 6 символів.'); return;
        }
        setLocalError('');
        onNext();
    }

    return (
         <form onSubmit={(e) => { e.preventDefault(); validateAndProceed(); }} className="space-y-4">
            {(error || localError) && <p className="text-red-500 text-center">{error || localError}</p>}
            <input type="text" value={data.login} onChange={e => setData({ ...data, login: e.target.value })} placeholder="Логін" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
            <input type="password" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} placeholder="Пароль (мін. 6 символів)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
            <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="Підтвердьте пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700">Далі</button>
            <button type="button" onClick={onBack} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline mt-2">Назад</button>
         </form>
    );
};

// Step 2: Basic Info
const Step2 = ({ data, setData, onNext, onBack }: any) => {
     const validateAndProceed = () => {
        if (!data.name.trim()) {
            alert('Ім\'я не може бути порожнім.'); return;
        }
        onNext();
    }
    return (
        <form onSubmit={(e) => { e.preventDefault(); validateAndProceed(); }} className="space-y-4">
            <input type="text" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Ім'я" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700" />
            <input type="number" value={data.age || ''} onChange={e => setData({ ...data, age: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="Вік (необов'язково)" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700" />
            <select value={data.location} onChange={e => setData({ ...data, location: e.target.value })} required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <option value="">Оберіть місто...</option>
                {ukrainianCities.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
            <div className="flex justify-between">
                <button type="button" onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg">Назад</button>
                <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg">Далі</button>
            </div>
        </form>
    );
};

const HOBBY_OPTIONS = ["Спорт", "Музика", "Мистецтво", "Ігри", "Подорожі", "Читання", "Кулінарія", "Кіно", "Технології", "Мода"];
const RELATIONSHIP_OPTIONS = ["Неодружений/Незаміжня", "У стосунках", "Одружений/Заміжня", "Все складно"];

// Step 3: Hobbies & Interests
const Step3 = ({ data, setData, onNext, onBack }: any) => {
    const handleHobbyToggle = (hobby: string) => {
        const hobbies = data.hobbies || [];
        if (hobbies.includes(hobby)) {
            setData({ ...data, hobbies: hobbies.filter((h: string) => h !== hobby) });
        } else if (hobbies.length < 5) {
            setData({ ...data, hobbies: [...hobbies, hobby] });
        } else {
            alert('Можна обрати не більше 5 хобі.');
        }
    };
    return (
        <div className="space-y-4">
            <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Хобі (до 5)</label>
                <div className="flex flex-wrap gap-2">
                    {HOBBY_OPTIONS.map(hobby => (
                        <button key={hobby} type="button" onClick={() => handleHobbyToggle(hobby)} className={`px-3 py-1 rounded-full text-sm ${data.hobbies?.includes(hobby) ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {hobby}
                        </button>
                    ))}
                </div>
            </div>
             <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg">Назад</button>
                <button type="button" onClick={onNext} className="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg">Далі</button>
            </div>
        </div>
    );
};

// Step 4: About me & Avatar
const Step4 = ({ data, setData, onSubmit, onBack, isLoading, onUploadClick }: any) => {
    return (
         <form onSubmit={onSubmit} className="space-y-4">
            <textarea value={data.aboutMe} onChange={e => setData({ ...data, aboutMe: e.target.value })} placeholder="Про себе (необов'язково)" rows={3} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700"></textarea>
            <select value={data.relationshipStatus} onChange={e => setData({ ...data, relationshipStatus: e.target.value })} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                <option value="">Сімейний стан (необов'язково)</option>
                {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
             <div>
                <label className="font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Фото профілю</label>
                <div className="flex items-center space-x-4">
                    <img src={data.avatarUrl || `https://i.pravatar.cc/150?u=${data.login}`} alt="Avatar preview" className="w-16 h-16 rounded-full object-cover"/>
                    <button type="button" onClick={onUploadClick} className="bg-gray-200 dark:bg-gray-600 font-semibold px-4 py-2 rounded-lg">Завантажити</button>
                </div>
             </div>
            <div className="flex justify-between pt-4">
                <button type="button" onClick={onBack} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-6 rounded-lg">Назад</button>
                <button type="submit" disabled={isLoading} className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg disabled:bg-gray-400">{isLoading ? 'Створення...' : 'Завершити'}</button>
            </div>
         </form>
    );
};

export default AuthFlow;
