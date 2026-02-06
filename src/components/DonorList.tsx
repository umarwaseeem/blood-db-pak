import { useState, useMemo, useEffect, useRef } from 'react';
import { Phone, MapPin, User, Search, Clock, Loader2, Share2, Check, MessageCircle, AlertTriangle } from 'lucide-react';
import { BloodGroup } from '../types';
import { useDonors } from '../hooks/useDonors';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import { formatDateTime } from '../utils/helpers';
import { generateShareableLink, copyToClipboard, scrollToElement } from '../utils/shareLink';
import LanguageToggle from './LanguageToggle';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

interface DonorListProps {
  targetId?: string | null;
  onTargetScrolled?: () => void;
}

export default function DonorList({ targetId, onTargetScrolled }: DonorListProps) {
  const { language } = useApp();
  const { data: donors = [], isLoading, error } = useDonors();
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const hasScrolledRef = useRef(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const filteredDonors = useMemo(() => {
    let filtered = [...donors];

    if (selectedBloodGroup !== 'All') {
      filtered = filtered.filter((d) => d.bloodGroup === selectedBloodGroup);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.fullName.toLowerCase().includes(query) ||
          d.city.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [donors, selectedBloodGroup, searchQuery]);

  // Handle scroll to target when deep link is detected
  useEffect(() => {
    if (targetId && !isLoading && donors.length > 0 && !hasScrolledRef.current) {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        const elementId = `donor-${targetId}`;
        const scrolled = scrollToElement(elementId);

        if (scrolled) {
          hasScrolledRef.current = true;
          // Add highlight class
          const element = document.getElementById(elementId);
          if (element) {
            element.classList.add('highlight-target');
            // Remove class after animation
            setTimeout(() => {
              element.classList.remove('highlight-target');
              onTargetScrolled?.();
            }, 2500);
          }
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [targetId, isLoading, donors, onTargetScrolled]);

  // Check if target donor exists when deep link is used
  const targetNotFound = targetId && !isLoading && donors.length > 0 && !donors.find(d => d.id === targetId);

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string) => {
    // Convert Pakistani phone format to international format
    let formattedNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '92' + formattedNumber.substring(1);
    }
    window.open(`https://wa.me/${formattedNumber}`, '_blank');
  };

  const handleShare = async (donorId: string) => {
    const link = generateShareableLink('donor', donorId);
    const success = await copyToClipboard(link);

    if (success) {
      setCopiedId(donorId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-600 text-white p-6 shadow-lg sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t('bloodDonors')}</h1>
          <LanguageToggle />
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-300"
            dir={language === 'ur' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedBloodGroup('All')}
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${selectedBloodGroup === 'All'
              ? 'bg-white text-red-600'
              : 'bg-red-500 text-white hover:bg-red-400'
              }`}
          >
            {t('all')}
          </button>
          {bloodGroups.map((group) => (
            <button
              key={group}
              onClick={() => setSelectedBloodGroup(group)}
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${selectedBloodGroup === group
                ? 'bg-white text-red-600'
                : 'bg-red-500 text-white hover:bg-red-400'
                }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 404 - Target donor not found */}
        {targetNotFound && (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('donorNotFound')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('linkMayBeInvalid')}</p>
              <button
                onClick={() => {
                  onTargetScrolled?.();
                  window.history.replaceState({}, '', window.location.pathname);
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {t('goBack')}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Loader2 className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 text-lg">Loading donors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <User className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-500 text-lg">Failed to load donors</p>
            </div>
          </div>
        ) : filteredDonors.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {donors.length === 0 ? t('noDonorsYet') : t('noDonorsFound')}
              </p>
            </div>
          </div>
        ) : (
          filteredDonors.map((donor) => (
            <div
              key={donor.id}
              id={`donor-${donor.id}`}
              className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {donor.profilePicture ? (
                    <img
                      src={donor.profilePicture}
                      alt={donor.fullName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-red-600"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-600">
                      <User className="w-10 h-10 text-red-600" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{donor.fullName}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{donor.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShare(donor.id)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        title={t('shareLink')}
                      >
                        {copiedId === donor.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Share2 className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                        {donor.bloodGroup}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDateTime(donor.createdAt, language)}</span>
                  </div>

                  {donor.notes && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{donor.notes}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCall(donor.phoneNumber)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 active:scale-98 transition"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{t('call')}</span>
                    </button>
                    <button
                      onClick={() => handleWhatsApp(donor.phoneNumber)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 active:scale-98 transition"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{t('whatsapp')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
