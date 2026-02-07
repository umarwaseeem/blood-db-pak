import { ChevronLeft, ShieldCheck, FileText, Mail } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface LegalPageProps {
    onBack: () => void;
    type: 'terms' | 'privacy';
}

export default function LegalPages({ onBack, type }: LegalPageProps) {
    const { language } = useApp();
    const isPrivacy = type === 'privacy';
    const isUrdu = language === 'ur';

    return (
        <div className={`min-h-screen bg-[#F8F9FA] flex flex-col ${isUrdu ? 'rtl' : 'ltr'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10 p-4 flex items-center">
                <button
                    onClick={onBack}
                    className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isUrdu ? 'ml-2' : 'mr-2'}`}
                >
                    <ChevronLeft className={`w-6 h-6 text-gray-600 ${isUrdu ? 'rotate-180' : ''}`} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">
                    {isPrivacy
                        ? (isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy')
                        : (isUrdu ? 'شرائط و ضوابط' : 'Terms of Service')}
                </h1>
            </div>

            <div className="flex-1 p-6 max-w-2xl mx-auto space-y-8 pb-20">
                <div className="flex justify-center">
                    {isPrivacy ? (
                        <ShieldCheck className="w-16 h-16 text-red-600" />
                    ) : (
                        <FileText className="w-16 h-16 text-red-600" />
                    )}
                </div>

                {isPrivacy ? (
                    <div className={`prose prose-red max-w-none space-y-6 text-gray-700 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '1. ہم کون سا ڈیٹا جمع کرتے ہیں' : '1. Data We Collect'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'بلڈ ڈونرز پاکستان وہ معلومات جمع کرتا ہے جو آپ ڈونر کے طور پر رجسٹر ہوتے وقت یا خون کی درخواست بناتے وقت فراہم کرتے ہیں۔ اس میں شامل ہے:'
                                    : 'Blood Donors Pakistan collects information that you choose to provide when registering as a donor or creating a blood request. This includes:'}
                            </p>
                            <ul className={`list-disc ${isUrdu ? 'pr-5' : 'pl-5'} mt-2 space-y-2 text-lg`}>
                                <li><strong>{isUrdu ? 'ڈونر کی معلومات:' : 'Donor Information:'}</strong> {isUrdu ? 'نام، فون نمبر، بلڈ گروپ، شہر، اور اختیاری پروفائل تصویر۔' : 'Name, phone number, blood group, city, and optional profile picture.'}</li>
                                <li><strong>{isUrdu ? 'درخواست کی معلومات:' : 'Request Information:'}</strong> {isUrdu ? 'مریض کا نام، رابطہ نمبر، ہسپتال/مقام، بلڈ گروپ، اور فوری ضرورت کی سطح۔' : 'Patient name, contact number, hospital/location, blood group, and urgency.'}</li>
                                <li><strong>{isUrdu ? 'سیکیورٹی ڈیٹا:' : 'Security Data:'}</strong> {isUrdu ? 'منفرد رسائی کوڈز جو آپ کے ریکارڈ کے انتظام کے لیے استعمال ہوتے ہیں۔' : 'Unique access codes used to manage your records.'}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '2. ہم آپ کا ڈیٹا کیسے استعمال کرتے ہیں' : '2. How We Use Your Data'}
                            </h2>
                            <p className="mt-2 text-red-700 font-bold text-lg">
                                {isUrdu
                                    ? 'نوٹ: یہ ایک عوامی پلیٹ فارم ہے جس کا مقصد ڈونرز کو ضرورت مندوں سے جوڑنا ہے۔'
                                    : 'Note: This is a public platform intended to connect donors with those in need.'}
                            </p>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'آپ کا نام، بلڈ گروپ، شہر، اور رابطہ نمبر پلیٹ فارم پر واضح طور پر درج کیا جائے گا تاکہ متعلقہ افراد آپ سے فون یا واٹس ایپ کے ذریعے رابطہ کر سکیں۔'
                                    : 'Your name, blood group, city, and contact number will be visibly listed on the platform so that relevant parties can contact you via phone or WhatsApp.'}
                            </p>
                        </section>

                        <section className="bg-red-50 p-4 rounded-2xl border border-red-100">
                            <h2 className="text-xl font-bold text-red-900 flex items-center gap-2 mb-2">
                                <Mail className="w-5 h-5" />
                                {isUrdu ? 'رسائی کوڈ کھو گیا ہے؟' : 'Lost Access Code?'}
                            </h2>
                            <p className="text-red-800 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'اگر آپ اپنا رسائی کوڈ کھو چکے ہیں اور اپنا ڈیٹا حذف کرنا چاہتے ہیں تو ہم سے رابطہ کریں:'
                                    : 'If you have lost your access code and want to delete your data, contact us at:'}
                            </p>
                            <a href="mailto:umar.waseem@gmail.com" className="block font-bold text-red-600 my-1 text-xl hover:underline">
                                umar.waseem@gmail.com
                            </a>
                            <p className="text-red-700 text-sm mt-2 italic">
                                {isUrdu
                                    ? 'براہ کرم اپنا وہ فون نمبر، نام اور حذف کرنے کی وجہ فراہم کریں جس کے ساتھ آپ نے ڈیٹا درج کیا تھا تاکہ ہم اسے آسانی سے حذف کر سکیں۔'
                                    : 'Note: You must provide the phone number, name, and details you used when entering data, along with a reason for deletion.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '3. ڈیٹا کو برقرار رکھنا' : '3. Data Retention'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'ہم آپ کا ڈیٹا اس وقت تک رکھتے ہیں جب تک آپ کی پروفائل یا درخواست فعال رہتی ہے۔ آپ اپنے رسائی کوڈ کا استعمال کرتے ہوئے کسی بھی وقت اپنی معلومات حذف کر سکتے ہیں۔'
                                    : 'We retain your data as long as your profile or request remains active. You can delete your information at any time using your access code.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '4. تیسرے فریق' : '4. Third Parties'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'ہم ڈیٹا بیس کے انتظام اور محفوظ اسٹوریج کے لیے Supabase کا استعمال کرتے ہیں۔ ہم آپ کا ذاتی ڈیٹا مشتہرین کو فروخت نہیں کرتے ہیں۔'
                                    : 'We use Supabase for database management and secure storage. We do not sell your personal data to advertisers.'}
                            </p>
                        </section>
                    </div>
                ) : (
                    <div className={`prose prose-red max-w-none space-y-6 text-gray-700 ${isUrdu ? 'text-right' : 'text-left'}`}>
                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '1. شرائط کی قبولیت' : '1. Acceptance of Terms'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'بلڈ ڈونرز پاکستان استعمال کر کے، آپ ان شرائط سے اتفاق کرتے ہیں۔ یہ پلیٹ فارم ایک غیر منافع بخش ٹول ہے جو پورے پاکستان میں خون کے عطیہ کی سہولت کے لیے ڈیزائن کیا گیا ہے۔'
                                    : 'By using Blood Donors Pakistan, you agree to these terms. This platform is a non-profit tool designed to facilitate blood donation across Pakistan.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '2. صارف کی ذمہ داری' : '2. User Responsibility'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'آپ اپنی فراہم کردہ معلومات کی درستگی کے ذمہ دار ہیں۔ آپ اس بات سے اتفاق کرتے ہیں کہ غلط درخواستیں پوسٹ نہیں کریں گے یا ڈونرز/سائلین کو ہراساں نہیں کریں گے۔'
                                    : 'You are responsible for the accuracy of the information you provide. You agree not to post false requests or engage in harassment of donors/requesters.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '3. کوئی طبی مشورہ نہیں' : '3. No Medical Advice'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'یہ ایپ صرف ایک کنکشن پلیٹ فارم ہے۔ ہم ڈونرز کی طبی تاریخ یا درخواستوں کی قانونی حیثیت کی تصدیق نہیں کرتے ہیں۔ صارفین کو خون کے عطیہ سے پہلے معیاری طبی طریقہ کار اور حفاظتی چیک پر عمل کرنا چاہیے۔'
                                    : 'This app is a connection platform only. We do not verify the medical history of donors or the legitimacy of requests. Users must follow standard medical procedures and safety checks before any blood donation.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '4. ذمہ داری کی حد' : '4. Limitation of Liability'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'بلڈ ڈونرز پاکستان اور اس کے تخلیق کار صارفین کے درمیان بات چیت یا طبی طریقہ کار کے نتائج سے پیدا ہونے والے کسی بھی مسئلے کے ذمہ دار نہیں ہیں۔'
                                    : 'Blood Donors Pakistan and its creators are not liable for any issues arising from interactions between users or the outcomes of medical procedures.'}
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
                                {isUrdu ? '5. شرائط میں اپ ڈیٹس' : '5. Updates to Terms'}
                            </h2>
                            <p className="mt-2 text-lg leading-relaxed">
                                {isUrdu
                                    ? 'ہم کبھی کبھار ان شرائط کو اپ ڈیٹ کر سکتے ہیں۔ پلیٹ فارم کا مسلسل استعمال نئی شرائط کی قبولیت کا مطلب ہے۔'
                                    : 'We may update these terms occasionally. Continued use of the platform implies acceptance of new terms.'}
                            </p>
                        </section>
                    </div>
                )}

                <div className="text-center pt-8">
                    <button
                        onClick={onBack}
                        className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform text-xl"
                    >
                        {isUrdu ? 'میں سمجھ گیا' : 'I Understand'}
                    </button>
                </div>
            </div>
        </div>
    );
}
