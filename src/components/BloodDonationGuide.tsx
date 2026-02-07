import { ChevronLeft, Heart, Info, CheckCircle2, Coffee, ShieldCheck } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface SectionProps {
    titleEn: string;
    titleUr: string;
    icon: any;
    items: { en: string; ur: string }[];
}

const InfoSection = ({ titleEn, titleUr, icon: Icon, items }: SectionProps) => {
    const { language } = useApp();
    const isUrdu = language === 'ur';

    return (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-50 p-3 rounded-2xl text-red-600">
                    <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                    {isUrdu ? titleUr : titleEn}
                </h2>
            </div>
            <ul className={`space-y-4 ${isUrdu ? 'text-right' : 'text-left'}`}>
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 text-green-500 flex-shrink-0 mt-1 ${isUrdu ? 'order-last' : ''}`} />
                        <span className="text-gray-700 leading-relaxed text-lg">
                            {isUrdu ? item.ur : item.en}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function BloodDonationGuide({ onBack }: { onBack: () => void }) {
    const { language } = useApp();
    const isUrdu = language === 'ur';

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="bg-white border-b sticky top-0 z-10 p-4 flex items-center">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
                    <ChevronLeft className={`w-6 h-6 text-gray-600 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
                <h1 className="text-xl font-bold text-gray-900 mx-2">
                    {isUrdu ? 'خون کا عطیہ: مکمل معلومات' : 'Blood Donation Guide'}
                </h1>
            </div>

            <div className="p-6 space-y-8 max-w-2xl mx-auto w-full pb-20">
                <InfoSection
                    titleEn="Why Give Blood?"
                    titleUr="خون کیوں دیں؟"
                    icon={Heart}
                    items={[
                        { en: "A single donation can save up to 3 lives.", ur: "ایک عطیہ 3 جانیں بچا سکتا ہے۔" },
                        { en: "Regular donation helps lower risk of heart attacks.", ur: "باقاعدگی سے عطیہ دل کے دورے کے خطرے کو کم کرتا ہے۔" },
                        { en: "It stimulates new red blood cell production.", ur: "یہ خون کے نئے سرخ خلیات کی پیداوار کو تیز کرتا ہے۔" },
                        { en: "Free health screening for you every time you donate.", ur: "ہر بار عطیہ دینے پر آپ کا مفت ہیلتھ چیک اپ ہوتا ہے۔" }
                    ]}
                />

                <InfoSection
                    titleEn="Who Can Donate?"
                    titleUr="کون عطیہ دے سکتا ہے؟"
                    icon={ShieldCheck}
                    items={[
                        { en: "Age: 17 to 65 years old.", ur: "عمر: 17 سے 65 سال کے درمیان۔" },
                        { en: "Weight: Minimum 50 kg.", ur: "وزن: کم از کم 50 کلوگرام۔" },
                        { en: "Health: Good overall health and feeling well.", ur: "صحت: مجموعی طور پر اچھی صحت اور تندرست محسوس کرنا۔" },
                        { en: "Frequency: Every 3-4 months.", ur: "تواتر: ہر 3 سے 4 ماہ بعد۔" }
                    ]}
                />

                <InfoSection
                    titleEn="Donation Tips"
                    titleUr="عطیہ دینے کے لیے مشورے"
                    icon={Coffee}
                    items={[
                        { en: "Drink plenty of water before and after donation.", ur: "عطیہ دینے سے پہلے اور بعد میں خوب پانی پیئیں۔" },
                        { en: "Eat a healthy meal 2-3 hours before donating.", ur: "عطیہ دینے سے 2-3 گھنٹے پہلے صحت بخش کھانا کھائیں۔" },
                        { en: "Avoid vigorous exercise on the day of donation.", ur: "عطیہ کے دن سخت ورزش سے پرہیز کریں۔" },
                        { en: "Rest for 10-15 minutes after the procedure.", ur: "عطیہ کے بعد 10 سے 15 منٹ تک آرام کریں۔" }
                    ]}
                />

                <div className="bg-red-600 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
                    <Info className="w-12 h-12 mx-auto" />
                    <h2 className="text-2xl font-bold">
                        {isUrdu ? 'تیار ہیں؟' : 'Ready to help?'}
                    </h2>
                    <p className="text-red-50 opacity-90 text-lg">
                        {isUrdu
                            ? 'آپ کے خون کا ایک قطرہ کسی کے لیے نئی زندگی ہو سکتا ہے۔'
                            : 'Your blood donation is the most precious gift one can give.'}
                    </p>
                    <button
                        onClick={onBack}
                        className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold text-lg active:scale-95 transition"
                    >
                        {isUrdu ? 'شروع کریں' : 'Get Started'}
                    </button>
                </div>
            </div>
        </div>
    );
}
