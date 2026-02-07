import { useMemo, useState, useEffect, useRef } from 'react';
import { Phone, MapPin, Droplets, AlertCircle, Clock, User, Share2, Check, MessageCircle, AlertTriangle } from 'lucide-react';

import { UrgencyLevel } from '../types';
import { useRequests } from '../hooks/useRequests';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import { getTimeAgo, formatDateTime } from '../utils/helpers';
import { generateShareableLink, copyToClipboard, scrollToElement } from '../utils/shareLink';
import LanguageToggle from './LanguageToggle';
import { RequestListSkeleton } from './RequestListSkeleton';


const urgencyColors: Record<UrgencyLevel, string> = {
  Normal: 'bg-blue-500',
  Urgent: 'bg-orange-500',
  Critical: 'bg-red-700',
};

const urgencyBorderColors: Record<UrgencyLevel, string> = {
  Normal: 'border-blue-500',
  Urgent: 'border-orange-500',
  Critical: 'border-red-700',
};

interface RequestListProps {
  targetId?: string | null;
  onTargetScrolled?: () => void;
}

export default function RequestList({ targetId, onTargetScrolled }: RequestListProps) {
  const { language } = useApp();
  const { data: requests = [], isLoading, error } = useRequests();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const hasScrolledRef = useRef(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'active') return -1;
        if (b.status === 'active') return 1;
      }

      const urgencyOrder = { Critical: 0, Urgent: 1, Normal: 2 };
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];

      if (urgencyDiff !== 0) return urgencyDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [requests]);

  // Handle scroll to target when deep link is detected
  useEffect(() => {
    if (targetId && !isLoading && requests.length > 0 && !hasScrolledRef.current) {
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(() => {
        const elementId = `request-${targetId}`;
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
  }, [targetId, isLoading, requests, onTargetScrolled]);

  // Check if target request exists when deep link is used
  const targetNotFound = targetId && !isLoading && requests.length > 0 && !requests.find(r => r.id === targetId);

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

  const handleShare = async (requestId: string) => {
    const link = generateShareableLink('request', requestId);
    const success = await copyToClipboard(link);

    if (success) {
      setCopiedId(requestId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-2xl font-bold">{t('bloodRequests')}</h1>
            <p className="text-red-100">
              {requests.length} {t('requestsAvailable')}
            </p>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 404 - Target request not found */}
        {targetNotFound && (
          <div className="text-center py-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t('requestNotFound')}</h3>
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
          <RequestListSkeleton />
        ) : error ? (

          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Droplets className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-500 text-lg">Failed to load requests</p>
            </div>
          </div>
        ) : sortedRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('noRequestsYet')}</p>
            </div>
          </div>
        ) : (
          sortedRequests.map((request) => (
            <div
              key={request.id}
              id={`request-${request.id}`}
              className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition border-l-8 ${urgencyBorderColors[request.urgency]
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-white px-5 py-3 rounded-full font-bold text-2xl ${request.status === 'active' ? 'bg-red-600' : 'bg-red-400'
                    }`}>
                    {request.bloodGroup}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm ${request.status === 'active' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {t('bloodGroupNeeded')}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm whitespace-nowrap">
                      <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className={request.status !== 'active' ? 'text-gray-400' : ''}>{getTimeAgo(request.createdAt, language)}</span>
                    </div>
                    {request.status !== 'active' && (
                      <div className="mt-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${request.status === 'fulfilled' ? 'bg-blue-500' :
                          request.status === 'deceased' ? 'bg-gray-500' :
                            'bg-orange-500'
                          }`}>
                          {t(request.status)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(request.id)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                    title={t('shareLink')}
                  >
                    {copiedId === request.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Share2 className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div
                    className={`${urgencyColors[request.urgency]} text-white px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-1 ${request.status !== 'active' ? 'opacity-50' : ''
                      }`}
                  >
                    {request.urgency === 'Critical' && <AlertCircle className="w-4 h-4" />}
                    <span>{t(request.urgency.toLowerCase() as any)}</span>
                  </div>
                </div>
              </div>

              {request.patientName && (
                <div className={`flex items-center mb-2 ${request.status === 'active' ? 'text-gray-700' : 'text-gray-400'}`}>
                  <User className={`w-5 h-5 mr-2 ${request.status === 'active' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className="font-semibold">{request.patientName}</span>
                </div>
              )}

              <div className={`flex items-start mb-3 ${request.status === 'active' ? 'text-gray-700' : 'text-gray-400'}`}>
                <MapPin className={`w-5 h-5 mr-2 flex-shrink-0 mt-0.5 ${request.status === 'active' ? 'text-gray-500' : 'text-gray-400'}`} />
                <span>{request.location}</span>
              </div>

              {request.notes && (
                <div className={`rounded-lg p-3 mb-3 ${request.status === 'active' ? 'bg-gray-50' : 'bg-gray-100'}`}>
                  <p className={`text-sm ${request.status === 'active' ? 'text-gray-700' : 'text-gray-400'}`}>{request.notes}</p>
                </div>
              )}

              <div className={`text-xs mb-3 ${request.status === 'active' ? 'text-gray-500' : 'text-gray-400'}`}>
                {formatDateTime(request.createdAt, language)}
              </div>

              {request.status === 'active' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCall(request.contactNumber)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 active:scale-98 transition shadow-md"
                  >
                    <Phone className="w-6 h-6" />
                    <span>{t('call')}</span>
                  </button>
                  <button
                    onClick={() => handleWhatsApp(request.contactNumber)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 active:scale-98 transition shadow-md"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span>{t('whatsapp')}</span>
                  </button>
                </div>
              ) : (
                <div className="w-full bg-gray-300 text-gray-600 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2">
                  <Phone className="w-6 h-6" />
                  <span>{t('call')} {request.contactNumber}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
