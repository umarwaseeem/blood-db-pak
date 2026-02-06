import { Heart, Droplets, Key, Languages, Users, List } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

interface LandingScreenProps {
  onSelectDonor: () => void;
  onSelectRequest: () => void;
  onLoginWithCode: () => void;
  onViewDonors: () => void;
  onViewRequests: () => void;
}

export default function LandingScreen({ onSelectDonor, onSelectRequest, onLoginWithCode, onViewDonors, onViewRequests }: LandingScreenProps) {
  const { language, toggleLanguage } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition"
          >
            <Languages className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-gray-900">
              {language === 'ur' ? 'EN' : 'اردو'}
            </span>
          </button>
        </div>

        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="bg-red-600 p-4 rounded-full">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{t('appName')}</h1>
          <p className="text-lg text-gray-600">{t('tagline')}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={onSelectDonor}
            className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl p-8 shadow-lg transform transition hover:scale-105 active:scale-95"
          >
            <div className="flex flex-col items-center space-y-3">
              <Heart className="w-16 h-16" />
              <span className="text-2xl font-bold">{t('iAmDonor')}</span>
              <span className="text-red-100">{t('iAmDonorDesc')}</span>
            </div>
          </button>

          <button
            onClick={onSelectRequest}
            className="w-full bg-white hover:bg-gray-50 text-red-600 border-4 border-red-600 rounded-2xl p-8 shadow-lg transform transition hover:scale-105 active:scale-95"
          >
            <div className="flex flex-col items-center space-y-3">
              <Droplets className="w-16 h-16" />
              <span className="text-2xl font-bold">{t('iNeedBlood')}</span>
              <span className="text-gray-600">{t('iNeedBloodDesc')}</span>
            </div>
          </button>

          <button
            onClick={onLoginWithCode}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl p-4 shadow transform transition hover:scale-105 active:scale-95"
          >
            <div className="flex items-center justify-center space-x-3">
              <Key className="w-6 h-6" />
              <span className="font-semibold">{t('loginWithCode')}</span>
            </div>
          </button>
        </div>

        <div className="border-t border-gray-300 pt-6 mt-6">
          <p className="text-center text-gray-600 mb-4 font-semibold">{t('browseWithoutAccount')}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onViewDonors}
              className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 rounded-xl p-4 shadow transform transition hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-center space-y-2">
                <Users className="w-8 h-8" />
                <span className="font-semibold text-sm">{t('viewDonors')}</span>
              </div>
            </button>

            <button
              onClick={onViewRequests}
              className="bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 rounded-xl p-4 shadow transform transition hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-center space-y-2">
                <List className="w-8 h-8" />
                <span className="font-semibold text-sm">{t('viewRequests')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
