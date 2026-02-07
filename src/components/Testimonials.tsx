import { useQuery } from '@tanstack/react-query';
import { Quote, User, MessageSquarePlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { Skeleton } from './ui/Skeleton';

interface Testimonial {
    id: string;
    full_name: string;
    message: string;
    image_url: string | null;
    created_at: string;
}

export default function Testimonials({ onAddStory }: { onAddStory: () => void }) {
    const { language } = useApp();
    const isUrdu = language === 'ur';

    const { data: testimonials = [], isLoading } = useQuery({
        queryKey: ['testimonials'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('testimonials')
                .select('*')
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Testimonial[];
        }
    });

    return (
        <div className="py-12 px-6">
            <div className="flex flex-col items-center mb-8 text-center space-y-2">
                <div className="bg-red-50 p-3 rounded-2xl">
                    <Quote className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">
                    {isUrdu ? 'جان بچانے والی کہانیاں' : 'Life-Saving Stories'}
                </h2>
                <p className="text-gray-500">
                    {isUrdu ? 'ہمارے ہیروز سے سنیں' : 'Hear from our community heroes'}
                </p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="min-w-[300px] bg-white rounded-3xl p-6 shadow-md">
                            <div className="flex items-center gap-4 mb-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ))
                ) : testimonials.length === 0 ? (
                    <div className="w-full bg-white rounded-3xl p-10 border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="text-gray-300">
                            <User className="w-16 h-16" />
                        </div>
                        <p className="text-gray-500 font-medium italic">
                            {isUrdu ? 'پہلی کہانی آپ کی ہو سکتی ہے!' : 'The first story could be yours!'}
                        </p>
                    </div>
                ) : (
                    testimonials.map((t) => (
                        <div key={t.id} className="min-w-[300px] max-w-[350px] bg-white rounded-3xl p-6 shadow-lg snap-center border border-gray-50 flex flex-col">
                            <div className="flex items-center gap-4 mb-4">
                                {t.image_url ? (
                                    <img src={t.image_url} className="w-14 h-14 rounded-full object-cover border-2 border-red-500 shadow-sm" alt={t.full_name} />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-500">
                                        <User className="w-8 h-8 text-red-400" />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight">{t.full_name}</h4>
                                    <div className="flex text-yellow-500 mt-1">
                                        {[1, 2, 3, 4, 5].map(s => <span key={s} className="text-xs">★</span>)}
                                    </div>
                                </div>
                            </div>
                            <p className={`text-gray-700 leading-relaxed italic ${isUrdu ? 'text-right' : 'text-left'}`}>
                                "{t.message}"
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-center mt-4">
                <button
                    onClick={onAddStory}
                    className="flex items-center space-x-2 bg-white border-2 border-red-600 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-50 transition shadow-sm active:scale-95"
                >
                    <MessageSquarePlus className="w-5 h-5" />
                    <span>{isUrdu ? 'اپنی کہانی لکھیں' : 'Share Your Story'}</span>
                </button>
            </div>
        </div>
    );
}
