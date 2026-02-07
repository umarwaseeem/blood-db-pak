import { useState, useRef } from 'react';
import { Camera, X, Send, Loader2 } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';

interface TestimonialFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function TestimonialForm({ onSuccess, onCancel }: TestimonialFormProps) {
    const { language } = useApp();
    const isUrdu = language === 'ur';
    const [fullName, setFullName] = useState('');
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !message) return;

        setIsSubmitting(true);
        try {
            let imageUrl = null;

            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `testimonial-images/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('testimonials')
                    .upload(filePath, image);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('testimonials')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            const { error } = await (supabase.from('testimonials') as any).insert({
                full_name: fullName,
                message,
                image_url: imageUrl,
            });


            if (error) throw error;
            onSuccess();
        } catch (err) {
            console.error('Error submitting testimonial:', err);
            alert(isUrdu ? 'جمع کرانے میں غلطی ہوئی۔ براہ کرم دوبارہ کوشش کریں۔' : 'Error submitting. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isUrdu ? 'اپنی کہانی شیئر کریں' : 'Share Your Story'}
                    </h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:border-red-400 transition"
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <>
                                        <Camera className="w-8 h-8 text-gray-400" />
                                        <span className="text-[10px] text-gray-400 mt-1">{isUrdu ? 'فوٹو' : 'Photo'}</span>
                                    </>
                                )}
                            </div>
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-md"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {isUrdu ? 'آپ کا نام' : 'Your Name'}
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={isUrdu ? 'اپنا نام لکھیں' : 'Enter your name'}
                                className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                                dir={isUrdu ? 'rtl' : 'ltr'}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {isUrdu ? 'آپ کی کہانی' : 'Your Story'}
                            </label>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={isUrdu ? 'اپنی کہانی یہاں لکھیں...' : 'Write your life-saving story...'}
                                rows={4}
                                className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                                dir={isUrdu ? 'rtl' : 'ltr'}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg transition active:scale-95"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>{isUrdu ? 'جمع کرائیں' : 'Submit Story'}</span>
                                </>
                            )}
                        </button>
                        <p className="text-[10px] text-gray-400 text-center mt-3">
                            {isUrdu
                                ? '* آپ کی کہانی منظوری کے بعد عوامی طور پر دکھائی جائے گی۔'
                                : '* Your story will be visible publicly after approval.'}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
