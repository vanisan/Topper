
import React, { useState } from 'react';

export interface RegistrationData {
    login: string;
    password?: string;
}

interface AuthFlowProps {
    onRegister: (data: RegistrationData) => Promise<{success: boolean, error?: string}>;
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
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== passwordConfirm) {
            setError('Паролі не співпадають.');
            return;
        }
        if (password.length < 6) {
            setError('Пароль має бути не менше 6 символів.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(login)) {
            setError('Будь ласка, введіть дійсну адресу електронної пошти.');
            return;
        }

        setIsLoading(true);
        const result = await onRegister({ login, password });
        if (!result.success) {
            setError(result.error || 'Помилка реєстрації.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-3xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">Реєстрація</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" value={login} onChange={e => setLogin(e.target.value)} placeholder="Email (Логін)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль (мін. 6 символів)" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <input type="password" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} placeholder="Підтвердьте пароль" required className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-purple-500 outline-none" />
                    <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400">{isLoading ? 'Реєстрація...' : 'Зареєструватися'}</button>
                    <button type="button" onClick={onBack} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline mt-2">Назад</button>
                </form>
            </div>
        </div>
    );
};


export default AuthFlow;
