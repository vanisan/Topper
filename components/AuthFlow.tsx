
import React, { useState, useEffect, useMemo } from 'react';
import CheckIcon from './icons/CheckIcon';

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

type RegisterResult = {
    success: boolean;
    error?: string;
    rateLimited?: boolean;
};

interface AuthFlowProps {
    onRegister: (data: Pick<RegistrationData, 'login' | 'password'>) => Promise<RegisterResult>;
    onLogin: (login: string, password: string) => Promise<{success: boolean, error?: string}>;
}

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
            setIsLoading(false); // Only set loading to false on error
        }
        // On success, we keep isLoading=true to prevent re-submission while the app transitions.
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
             <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Вхід</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={login} onChange={e => setLogin(e.target.value.toLowerCase())} placeholder="Логін" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400">{isLoading ? 'Вхід...' : 'Увійти'}</button>
                    <button type="button" onClick={onBack} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline mt-2">Назад</button>
                </form>
             </div>
        </div>
    );
};

const ValidationCriterion: React.FC<{ isValid: boolean; text: string; }> = ({ isValid, text }) => (
    <div className={`flex items-center transition-colors duration-300 ${isValid ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'}`}>
        <CheckIcon className="w-4 h-4 mr-2 flex-shrink-0" />
        <span>{text}</span>
    </div>
);

const RegisterForm: React.FC<{ onRegister: (data: Pick<RegistrationData, 'login' | 'password'>) => Promise<RegisterResult>; onBack: () => void; }> = ({ onRegister, onBack }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const validation = useMemo(() => {
        const length = password.length >= 8;
        const letter = /[A-Za-z]/.test(password);
        const number = /\d/.test(password);
        const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const match = password.length > 0 && password === passwordConfirm;
        const loginValid = login.trim().length > 2 && !login.includes('@') && !login.includes(' ');
        
        const isFormOk = length && letter && number && specialChar && match && loginValid;

        return { length, letter, number, specialChar, match, loginValid, isFormOk };
    }, [login, password, passwordConfirm]);


    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isRateLimited) {
            setIsRateLimited(false);
            setError('Тепер ви можете спробувати знову. Будь ласка, використайте складніший пароль.');
        }
    }, [cooldown, isRateLimited]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validation.isFormOk) {
            setError('Будь ласка, переконайтесь, що всі поля заповнені правильно.');
            return;
        }

        setIsLoading(true);
        const result = await onRegister({ login, password });
        if (!result.success) {
            setError(result.error || 'Помилка реєстрації.');
            setIsLoading(false);
            if (result.rateLimited) {
                setIsRateLimited(true);
                setCooldown(60);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-2">Реєстрація</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Крок 1 з 2: Створення акаунту</p>
                {isRateLimited && (
                    <div className="text-center mb-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200">
                        <p className="font-semibold">Форму тимчасово заблоковано</p>
                        <p className="text-sm mt-1">Спробуйте знову через: {cooldown} сек.</p>
                    </div>
                )}
                {error && !isRateLimited && <p className="text-red-500 text-center mb-4 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={login} disabled={isLoading || isRateLimited} onChange={e => setLogin(e.target.value.toLowerCase())} placeholder="* Придумайте логін (мін. 3 символи)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50" />
                    <div>
                        <input type="password" value={password} disabled={isLoading || isRateLimited} onChange={e => setPassword(e.target.value)} placeholder="* Створіть пароль (8+, a-z, 0-9, !@#)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50" />
                    </div>
                    <input type="password" value={passwordConfirm} disabled={isLoading || isRateLimited} onChange={e => setPasswordConfirm(e.target.value)} placeholder="* Підтвердьте пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50" />
                    
                    <div className="text-xs space-y-1 pt-1 pl-2">
                       <ValidationCriterion isValid={validation.length} text="Мінімум 8 символів" />
                       <ValidationCriterion isValid={validation.letter} text="Містить літеру" />
                       <ValidationCriterion isValid={validation.number} text="Містить цифру" />
                       <ValidationCriterion isValid={validation.specialChar} text="Містить спецсимвол (!@#...)" />
                       <ValidationCriterion isValid={validation.match} text="Паролі співпадають" />
                    </div>

                    <div className="pt-4 space-y-2">
                         <button type="submit" disabled={isLoading || isRateLimited || !validation.isFormOk} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {isLoading ? 'Перевірка...' : isRateLimited ? `Зачекайте (${cooldown})` : 'Далі'}
                         </button>
                         <button type="button" onClick={onBack} disabled={isLoading || isRateLimited} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                            Назад
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthFlow;
