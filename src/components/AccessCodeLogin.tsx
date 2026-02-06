import { useState } from 'react';
import { Key, AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getDonorByCode } from '../services/donorService';
import { getRequestByCode } from '../services/requestService';
import { getTranslation } from '../utils/translations';
import LanguageToggle from './LanguageToggle';

interface AccessCodeLoginProps {
  onBack: () => void;
}

export default function AccessCodeLogin({ onBack }: AccessCodeLoginProps) {
  const { language, setCurrentUser } = useApp();
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const code = accessCode.trim().toUpperCase();

    if (!code) {
      setError(t('invalidCode'));
      return;
    }

    setIsLoading(true);
    try {
      const donor = await getDonorByCode(code);
      if (donor) {
        setCurrentUser({ type: 'donor', data: donor });
        return;
      }

      const request = await getRequestByCode(code);
      if (request) {
        setCurrentUser({ type: 'request', data: request });
        return;
      }

      setError(t('invalidCode'));
    } catch (err) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatAccessCode = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAccessCode(e.target.value);
    setAccessCode(formatted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col">
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={onBack}
            className="text-white hover:text-red-100"
          >
            ← {t('back')}
          </button>
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold">{t('accessCode')}</h1>
        <p className="text-red-100">{t('enterAccessCode')}</p>
      </div>

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <Key className="w-12 h-12 text-red-600" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('accessCode')}
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={handleChange}
                  maxLength={9}
                  className={`w-full px-4 py-4 text-lg text-center font-mono border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder={t('enterCodePlaceholder')}
                />
                {error && (
                  <div className="flex items-center mt-2 text-red-600">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-red-700 active:scale-98 transition shadow-lg"
              >
                {t('accessMyInfo')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
