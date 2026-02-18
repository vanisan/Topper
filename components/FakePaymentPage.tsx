
import React, { useState, useEffect } from 'react';
import LockClosedIcon from './icons/LockClosedIcon';

interface FakePaymentPageProps {
    amount: number;
    onPaymentSuccess: (amount: number) => Promise<boolean>;
    onCancel: () => void;
    onPaymentComplete: () => void;
}

const FakePaymentPage: React.FC<FakePaymentPageProps> = ({ amount, onPaymentSuccess, onCancel, onPaymentComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [card, setCard] = useState('4242 4242 4242 4242');
    const [expiry, setExpiry] = useState('12/26');
    const [cvc, setCvc] = useState('123');
    
    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                onPaymentComplete();
            }, 2000); // Wait 2 seconds on success screen
            return () => clearTimeout(timer);
        }
    }, [isSuccess, onPaymentComplete]);

    const handlePayment = async () => {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const success = await onPaymentSuccess(amount);
        if (success) {
            setIsSuccess(true);
        } else {
            setIsLoading(false);
            alert("Оплата не вдалася. Спробуйте ще раз.");
        }
    };
    
    if (isSuccess) {
        return (
             <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Оплата успішна!</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Баланс буде оновлено за мить.</p>
            </div>
        )
    }

    return (
        <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-2 text-purple-600 dark:text-purple-300">Сторінка оплати</h2>
            <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Це імітація платіжної системи</p>

            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
                <div className="flex justify-between items-center text-gray-800 dark:text-gray-200">
                    <span className="font-medium">Сума до сплати</span>
                    <span className="text-3xl font-bold">{amount.toFixed(2)} грн</span>
                </div>
                
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Номер картки</label>
                        <input type="text" value={card} onChange={e => setCard(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-white dark:bg-gray-800" placeholder="0000 0000 0000 0000" />
                    </div>
                     <div className="flex space-x-4">
                        <div className="flex-1">
                             <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Термін дії</label>
                            <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-white dark:bg-gray-800" placeholder="MM/YY" />
                        </div>
                        <div className="flex-1">
                             <label className="text-sm font-medium text-gray-600 dark:text-gray-400">CVC</label>
                            <input type="text" value={cvc} onChange={e => setCvc(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-white dark:bg-gray-800" placeholder="123" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-3">
                 <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors shadow-lg disabled:bg-gray-400 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Обробка...</span>
                        </>
                    ) : `Сплатити ${amount.toFixed(2)} грн`}
                </button>
                <button onClick={onCancel} disabled={isLoading} className="w-full text-center text-gray-600 dark:text-gray-400 hover:underline disabled:opacity-50">
                    Скасувати
                </button>
            </div>
             <div className="mt-4 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                <LockClosedIcon className="w-4 h-4 mr-1" />
                <span>Безпечний платіж</span>
            </div>
        </div>
    );
}

export default FakePaymentPage;
