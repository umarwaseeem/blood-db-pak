import { useState, useEffect } from 'react';
import { Phone, MapPin, Droplets, AlertCircle, Clock, User } from 'lucide-react';
import { BloodRequest, UrgencyLevel } from '../types';
import { storage } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import { getTimeAgo, formatDateTime } from '../utils/helpers';
import LanguageToggle from './LanguageToggle';

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

export default function RequestList() {
  const { language } = useApp();
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const loadedRequests = storage.getRequests();

    const sortedRequests = loadedRequests.sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === 'active') return -1;
        if (b.status === 'active') return 1;
      }

      const urgencyOrder = { Critical: 0, Urgent: 1, Normal: 2 };
      const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];

      if (urgencyDiff !== 0) return urgencyDiff;

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setRequests(sortedRequests);
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
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
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <Droplets className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">{t('noRequestsYet')}</p>
            </div>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition border-l-8 ${
                urgencyBorderColors[request.urgency]
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-white px-5 py-3 rounded-full font-bold text-2xl ${
                    request.status === 'active' ? 'bg-red-600' : 'bg-red-400'
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
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${
                          request.status === 'fulfilled' ? 'bg-blue-500' :
                          request.status === 'deceased' ? 'bg-gray-500' :
                          'bg-orange-500'
                        }`}>
                          {t(request.status)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`${urgencyColors[request.urgency]} text-white px-4 py-2 rounded-full font-bold text-sm flex items-center space-x-1 ${
                    request.status !== 'active' ? 'opacity-50' : ''
                  }`}
                >
                  {request.urgency === 'Critical' && <AlertCircle className="w-4 h-4" />}
                  <span>{t(request.urgency.toLowerCase() as any)}</span>
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
                <button
                  onClick={() => handleCall(request.contactNumber)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 active:scale-98 transition shadow-md"
                >
                  <Phone className="w-6 h-6" />
                  <span>{t('call')} {request.contactNumber}</span>
                </button>
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
