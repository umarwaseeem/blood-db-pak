import { useState } from 'react';
import { Droplets, User, Phone, MapPin, FileText, AlertCircle, Check, Copy, ArrowLeft } from 'lucide-react';
import { BloodRequest, BloodGroup, UrgencyLevel } from '../types';
import { storage } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import { generateAccessCode } from '../utils/helpers';
import LanguageToggle from './LanguageToggle';

interface RequestFormProps {
  onSuccess: (request: BloodRequest) => void;
  onBack: () => void;
}

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const urgencyLevels: UrgencyLevel[] = ['Normal', 'Urgent', 'Critical'];

const urgencyColors = {
  Normal: 'bg-blue-500 hover:bg-blue-600',
  Urgent: 'bg-orange-500 hover:bg-orange-600',
  Critical: 'bg-red-700 hover:bg-red-800',
};

export default function RequestForm({ onSuccess, onBack }: RequestFormProps) {
  const { language, currentUser } = useApp();
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('Urgent');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codeCopied, setCodeCopied] = useState(false);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!contactNumber.trim()) newErrors.contactNumber = t('contactRequired');
    if (!location.trim()) newErrors.location = t('locationRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const accessCode = currentUser ? currentUser.data.accessCode : generateAccessCode();
    const request: BloodRequest = {
      id: Date.now().toString(),
      accessCode,
      bloodGroup,
      patientName: patientName.trim(),
      contactNumber: contactNumber.trim(),
      location: location.trim(),
      urgency,
      notes: notes.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    storage.saveRequest(request);
    setGeneratedCode(accessCode);
    setShowSuccess(true);

    setTimeout(() => {
      onSuccess(request);
    }, 5000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="bg-green-500 p-6 rounded-full">
              <Check className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('requestCreatedSuccess')}</h2>
          <p className="text-gray-600">{t('requestPosted')}</p>

          {!currentUser && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-sm text-gray-600 mb-2">{t('yourAccessCode')}</p>
              <div className="bg-red-50 border-2 border-red-600 rounded-lg p-4 mb-3">
                <p className="text-3xl font-mono font-bold text-red-600">{generatedCode}</p>
              </div>
              <button
                onClick={copyCode}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <Copy className="w-5 h-5" />
                <span>{codeCopied ? '✓ Copied' : 'Copy Code'}</span>
              </button>
              <p className="text-xs text-gray-500 mt-3">{t('saveThisCode')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white hover:text-red-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold">{t('requestBlood')}</h1>
        <p className="text-red-100">{t('createUrgentRequest')}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('requiredBloodGroup')} *
          </label>
          <div className="relative">
            <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none"
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('patientName')} ({t('optional')})
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={t('patientName')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('contactNumber')} *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.contactNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('enterPhone')}
            />
          </div>
          {errors.contactNumber && (
            <p className="text-red-600 text-sm mt-1">{errors.contactNumber}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('location')} *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('hospitalAddress')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t('urgencyLevel')} *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {urgencyLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setUrgency(level)}
                className={`py-4 px-3 rounded-xl font-bold text-white transition active:scale-95 ${
                  urgency === level
                    ? urgencyColors[level] + ' ring-4 ring-offset-2 ring-gray-400'
                    : urgencyColors[level] + ' opacity-50'
                }`}
              >
                {level === 'Critical' && <AlertCircle className="w-5 h-5 mx-auto mb-1" />}
                <div className="text-sm">{t(level.toLowerCase() as any)}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('additionalNotes')}
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={t('specificRequirements')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-red-700 active:scale-98 transition shadow-lg"
        >
          {t('createRequest')}
        </button>
      </form>
    </div>
  );
}
