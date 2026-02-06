import { Languages } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useApp();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition"
    >
      <Languages className="w-5 h-5 text-red-600" />
      <span className="font-semibold text-gray-900">
        {language === 'ur' ? 'EN' : 'اردو'}
      </span>
    </button>
  );
}
