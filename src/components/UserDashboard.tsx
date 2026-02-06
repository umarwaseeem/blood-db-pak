import { useState, useEffect } from 'react';
import { User, Phone, MapPin, Droplets, Trash2, AlertCircle, Check, LogOut, Edit, Plus, Copy } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';
import { formatDateTime } from '../utils/helpers';
import { RequestStatus, BloodRequest } from '../types';
import LanguageToggle from './LanguageToggle';

interface UserDashboardProps {
  onEditProfile?: () => void;
  onCreateNewRequest?: () => void;
}

export default function UserDashboard({ onEditProfile, onCreateNewRequest }: UserDashboardProps) {
  const { language, currentUser, logout } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [userRequests, setUserRequests] = useState<BloodRequest[]>([]);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  useEffect(() => {
    if (currentUser && currentUser.type === 'request') {
      const requests = storage.getRequestsByCode(currentUser.data.accessCode);
      setUserRequests(requests);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const handleDelete = () => {
    if (currentUser.type === 'donor') {
      storage.deleteDonor(currentUser.data.accessCode);
    } else {
      storage.deleteRequest(currentUser.data.accessCode);
    }
    setDeleted(true);
    setTimeout(() => {
      logout();
    }, 1500);
  };

  const handleStatusUpdate = (requestId: string, status: RequestStatus) => {
    if (currentUser.type === 'request') {
      storage.updateRequestStatus(requestId, status);
      const updatedRequests = storage.getRequestsByCode(currentUser.data.accessCode);
      setUserRequests(updatedRequests);
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    storage.deleteRequestById(requestId);
    const updatedRequests = storage.getRequestsByCode(currentUser.data.accessCode);
    setUserRequests(updatedRequests);

    if (updatedRequests.length === 0) {
      logout();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.data.accessCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (deleted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-500 p-6 rounded-full">
              <Check className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('profileDeleted')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{t('myDashboard')}</h1>
            <p className="text-red-100">
              {currentUser.type === 'donor' ? t('myDonorProfile') : t('myBloodRequest')}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <LanguageToggle />
            <button
              onClick={logout}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>

        <div className="bg-red-500 rounded-lg p-4">
          <div className="text-xs text-red-100 mb-1">{t('yourAccessCode')}</div>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-mono font-bold">{currentUser.data.accessCode}</div>
            <button
              onClick={copyCode}
              className="bg-red-700 hover:bg-red-800 px-3 py-2 rounded-lg flex items-center space-x-1 text-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{codeCopied ? '✓' : ''}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {currentUser.type === 'donor' ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              {currentUser.data.profilePicture ? (
                <img
                  src={currentUser.data.profilePicture}
                  alt={currentUser.data.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-red-600"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-600">
                  <User className="w-12 h-12 text-red-600" />
                </div>
              )}
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-900">{currentUser.data.fullName}</h2>
                <div className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-lg inline-block mt-2">
                  {currentUser.data.bloodGroup}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-lg">{currentUser.data.phoneNumber}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-lg">{currentUser.data.city}</span>
              </div>

              {currentUser.data.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{currentUser.data.notes}</p>
                </div>
              )}

              <div className="text-sm text-gray-500 pt-2">
                {t('registeredOn')}: {formatDateTime(currentUser.data.createdAt, language)}
              </div>
            </div>
          </div>
        ) : (
          <>
            {userRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-600 text-white px-5 py-3 rounded-full font-bold text-2xl">
                      {request.bloodGroup}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('bloodGroupNeeded')}</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold text-white inline-block mt-1 ${
                        request.status === 'active' ? 'bg-green-500' :
                        request.status === 'fulfilled' ? 'bg-blue-500' :
                        request.status === 'deceased' ? 'bg-gray-500' :
                        'bg-orange-500'
                      }`}>
                        {t(request.status)}
                      </div>
                    </div>
                  </div>

                  <div className={`px-4 py-2 rounded-full font-bold text-sm text-white ${
                    request.urgency === 'Critical' ? 'bg-red-700' :
                    request.urgency === 'Urgent' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}>
                    {request.urgency === 'Critical' && <AlertCircle className="w-4 h-4 inline mr-1" />}
                    {t(request.urgency.toLowerCase() as any)}
                  </div>
                </div>

                <div className="space-y-4">
                  {request.patientName && (
                    <div className="flex items-center text-gray-700">
                      <User className="w-5 h-5 mr-3 text-gray-500" />
                      <span className="text-lg">{request.patientName}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="text-lg">{request.contactNumber}</span>
                  </div>

                  <div className="flex items-start text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <span className="text-lg">{request.location}</span>
                  </div>

                  {request.notes && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{request.notes}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 pt-2">
                    {t('postedOn')}: {formatDateTime(request.createdAt, language)}
                  </div>
                </div>

                {request.status === 'active' && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t('updateStatus')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'fulfilled')}
                        className="py-3 px-3 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white text-sm"
                      >
                        {t('fulfilled')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'notNeeded')}
                        className="py-3 px-3 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 text-white text-sm"
                      >
                        {t('notNeeded')}
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(request.id, 'deceased')}
                        className="py-3 px-3 rounded-xl font-semibold bg-gray-500 hover:bg-gray-600 text-white text-sm"
                      >
                        {t('deceased')}
                      </button>
                    </div>
                  </div>
                )}

                {request.status !== 'active' && (
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    className="w-full mt-4 bg-red-100 text-red-600 hover:bg-red-200 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('deleteThisRequest')}</span>
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        {currentUser.type === 'donor' && onEditProfile && (
          <button
            onClick={onEditProfile}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <Edit className="w-5 h-5" />
            <span>{t('editProfile')}</span>
          </button>
        )}

        {currentUser.type === 'request' && onCreateNewRequest && (
          <button
            onClick={onCreateNewRequest}
            className="w-full bg-green-600 text-white hover:bg-green-700 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>{t('createNewRequest')}</span>
          </button>
        )}

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-red-100 text-red-600 hover:bg-red-200 py-4 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>{t('deleteProfile')}</span>
          </button>
        ) : (
          <div className="bg-red-50 rounded-xl p-6 space-y-4">
            <p className="text-red-900 font-semibold text-center">{t('confirmDelete')}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold"
              >
                {t('yes')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-xl font-bold"
              >
                {t('no')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
