import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, AlertCircle, RefreshCcw } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

type Question = {
    id: string;
    en: string;
    ur: string;
    type: 'boolean' | 'number';
    min?: number;
    condition?: (val: any) => boolean;
    failMsgEn: string;
    failMsgUr: string;
};

const questions: Question[] = [
    {
        id: 'age',
        en: 'What is your age?',
        ur: 'آپ کی عمر کیا ہے؟',
        type: 'number',
        min: 17,
        condition: (val) => val >= 17 && val <= 65,
        failMsgEn: 'You must be between 17 and 65 years old to donate blood.',
        failMsgUr: 'خون کا عطیہ دینے کے لیے آپ کی عمر 17 سے 65 سال کے درمیان ہونی چاہیے۔',
    },
    {
        id: 'weight',
        en: 'What is your weight (in kg)?',
        ur: 'آپ کا وزن کتنا ہے (کلوگرام میں)؟',
        type: 'number',
        min: 45,
        condition: (val) => val >= 50,
        failMsgEn: 'You must weigh at least 50 kg to donate blood.',
        failMsgUr: 'خون کا عطیہ دینے کے لیے آپ کا وزن کم از کم 50 کلو ہونا چاہیے۔',
    },
    {
        id: 'lastDonation',
        en: 'Did you donate blood in the last 3 months?',
        ur: 'کیا آپ نے گزشتہ 3 ماہ میں خون کا عطیہ دیا ہے؟',
        type: 'boolean',
        condition: (val) => val === false,
        failMsgEn: 'You must wait at least 3 months between donations.',
        failMsgUr: 'عطیات کے درمیان آپ کو کم از کم 3 ماہ انتظار کرنا چاہیے۔',
    },
    {
        id: 'health',
        en: 'Are you currently feeling unwell or on antibiotics?',
        ur: 'کیا آپ اس وقت طبیعت ناساز محسوس کر رہے ہیں یا اینٹی بائیوٹکس لے رہے ہیں؟',
        type: 'boolean',
        condition: (val) => val === false,
        failMsgEn: 'You should be in good health and not on antibiotics to donate.',
        failMsgUr: 'عطیہ دینے کے لیے آپ کو اچھی صحت میں ہونا چاہیے اور اینٹی بائیوٹکس پر نہیں ہونا چاہیے۔',
    },
];

interface EligibilityQuizProps {
    onBack: () => void;
}

export default function EligibilityQuiz({ onBack }: EligibilityQuizProps) {
    const { language } = useApp();
    const isUrdu = language === 'ur';
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [result, setResult] = useState<{ eligible: boolean; message: string } | null>(null);

    const handleAnswer = (val: any) => {
        const q = questions[currentStep];
        const newAnswers = { ...answers, [q.id]: val };
        setAnswers(newAnswers);

        if (!q.condition!(val)) {
            setResult({
                eligible: false,
                message: isUrdu ? q.failMsgUr : q.failMsgEn,
            });
            return;
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setResult({
                eligible: true,
                message: isUrdu
                    ? 'مبارک ہو! آپ خون کا عطیہ دینے کے اہل لگتے ہیں۔ براہ کرم عطیہ سنٹر میں اپنی جانچ کرائیں۔'
                    : 'Congratulations! You seem eligible to donate blood. Please visit a donation center for final screening.',
            });
        }
    };

    const reset = () => {
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
    };

    if (result) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl text-center space-y-6">
                    <div className="flex justify-center">
                        {result.eligible ? (
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle2 className="w-16 h-16 text-green-600" />
                            </div>
                        ) : (
                            <div className="bg-red-100 p-4 rounded-full">
                                <XCircle className="w-16 h-16 text-red-600" />
                            </div>
                        )}
                    </div>

                    <h2 className={`text-2xl font-bold ${result.eligible ? 'text-green-700' : 'text-red-700'}`}>
                        {result.eligible
                            ? (isUrdu ? 'آپ اہل ہیں!' : 'You Are Eligible!')
                            : (isUrdu ? 'آپ فی الحال نااہل ہیں' : 'You Are Currently Ineligible')}
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed">
                        {result.message}
                    </p>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={reset}
                            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 rounded-2xl font-bold transition"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            <span>{isUrdu ? 'دوبارہ شروع کریں' : 'Start Again'}</span>
                        </button>
                        <button
                            onClick={onBack}
                            className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold transition shadow-lg"
                        >
                            {isUrdu ? 'واپس جائیں' : 'Go Back'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const q = questions[currentStep];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="bg-white border-b p-4 flex items-center justify-between">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ChevronLeft className={`w-6 h-6 text-gray-600 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
                <span className="font-bold text-gray-400">
                    {currentStep + 1} / {questions.length}
                </span>
            </div>

            <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
                <div className="bg-white rounded-3xl p-8 shadow-xl space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-50 p-3 rounded-2xl">
                                <AlertCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 text-center leading-tight">
                            {isUrdu ? q.ur : q.en}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {q.type === 'boolean' ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleAnswer(true)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 py-6 rounded-2xl font-bold text-xl transition border-2 border-red-100"
                                >
                                    {isUrdu ? 'ہاں' : 'Yes'}
                                </button>
                                <button
                                    onClick={() => handleAnswer(false)}
                                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 py-6 rounded-2xl font-bold text-xl transition border-2 border-gray-100"
                                >
                                    {isUrdu ? 'نہیں' : 'No'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <input
                                    type="number"
                                    placeholder={isUrdu ? 'یہاں لکھیں...' : 'Enter here...'}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-6 text-center text-3xl font-bold focus:border-red-500 focus:outline-none focus:bg-white transition"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = parseInt((e.target as HTMLInputElement).value);
                                            if (!isNaN(val)) handleAnswer(val);
                                        }
                                    }}
                                    autoFocus
                                />
                                <button
                                    onClick={(e) => {
                                        const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                        const val = parseInt(input.value);
                                        if (!isNaN(val)) handleAnswer(val);
                                    }}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg transition"
                                >
                                    <span>{isUrdu ? 'اگلا' : 'Next'}</span>
                                    <ChevronRight className={`w-5 h-5 ${isUrdu ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
