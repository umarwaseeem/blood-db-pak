import { Heart, Droplets, Key, Languages, Users, List } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

interface LandingScreenProps {
  onSelectDonor: () => void;
  onSelectRequest: () => void;
  onLoginWithCode: () => void;
  onViewDonors: () => void;
  onViewRequests: () => void;
  onShowPrivacy: () => void;
  onShowTerms: () => void;
}

export default function LandingScreen({
  onSelectDonor,
  onSelectRequest,
  onLoginWithCode,
  onViewDonors,
  onViewRequests,
  onShowPrivacy,
  onShowTerms
}: LandingScreenProps) {
  const { language, toggleLanguage } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-[#F8F9FA] flex flex-col items-center justify-center p-6 pb-12">
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

        <div className="text-center space-y-3 pt-2">
          <div className="flex justify-center">
            <div className="bg-red-600 p-4 rounded-full">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">{t('appName')}</h1>
          <p className="text-lg text-gray-600">{t('tagline')}</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onSelectDonor}
              className="bg-red-600 hover:bg-red-700 text-white rounded-2xl p-5 shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-center space-y-2 text-center">
                <Heart className="w-10 h-10" />
                <span className="text-xl font-bold leading-tight">{t('iAmDonor')}</span>
                <span className="text-red-100 text-xs">{t('iAmDonorDesc')}</span>
              </div>
            </button>

            <button
              onClick={onSelectRequest}
              className="bg-white hover:bg-gray-50 text-red-600 border-4 border-red-600 rounded-2xl p-5 shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              <div className="flex flex-col items-center space-y-2 text-center">
                <Droplets className="w-10 h-10" />
                <span className="text-xl font-bold leading-tight">{t('iNeedBlood')}</span>
                <span className="text-gray-600 text-xs">{t('iNeedBloodDesc')}</span>
              </div>
            </button>
          </div>

          <button
            onClick={onLoginWithCode}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl p-3 shadow-sm transform transition hover:scale-102 active:scale-98"
          >
            <div className="flex items-center justify-center space-x-2">
              <Key className="w-5 h-5" />
              <span className="font-semibold text-sm">{t('loginWithCode')}</span>
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

        {/* Footer Links */}
        <div className="pt-8 pb-4 flex flex-col items-center space-y-4">
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <button onClick={onShowPrivacy} className="hover:text-red-600 hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={onShowTerms} className="hover:text-red-600 hover:underline">Terms of Service</button>
          </div>
          <a
            href="https://github.com/umarwaseeem/blood-db-pak"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium border border-gray-200 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>Contribute on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}


