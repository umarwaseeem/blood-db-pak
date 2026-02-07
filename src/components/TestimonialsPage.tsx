import { ChevronLeft, Quote } from 'lucide-react';

import { useApp } from '../contexts/AppContext';
import Testimonials from './Testimonials';
import { useState } from 'react';
import TestimonialForm from './TestimonialForm';

export default function TestimonialsPage({ onBack }: { onBack: () => void }) {
    const { language } = useApp();
    const isUrdu = language === 'ur';
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="bg-white border-b sticky top-0 z-10 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft className={`w-6 h-6 text-gray-600 ${isUrdu ? 'rotate-180' : ''}`} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 mx-2">
                        {isUrdu ? 'کامیابی کی کہانیاں' : 'Success Stories'}
                    </h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition"
                >
                    {isUrdu ? 'کہانی لکھیں' : 'Share Story'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-6 max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2 mb-8">
                        <div className="flex justify-center">
                            <div className="bg-red-50 p-4 rounded-full">
                                <Quote className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <p className="text-gray-600 text-lg">
                            {isUrdu
                                ? 'ان بہادر ڈونرز اور سائلین کی کہانیاں جنہوں نے اس پلیٹ فارم کے ذریعے ایک دوسرے کی مدد کی۔'
                                : 'Life-saving stories from donors and requesters who connected through this platform.'}
                        </p>
                    </div>

                    <Testimonials onAddStory={() => setShowForm(true)} />
                </div>
            </div>

            {showForm && (
                <TestimonialForm
                    onSuccess={() => setShowForm(false)}
                    onCancel={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
