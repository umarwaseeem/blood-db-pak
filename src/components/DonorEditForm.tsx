import { useState, useRef } from 'react';
import { Camera, User, Phone, MapPin, FileText, Check, ArrowLeft } from 'lucide-react';
import { Donor, BloodGroup } from '../types';
import { useUpdateDonor } from '../hooks/useDonors';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import LanguageToggle from './LanguageToggle';

interface DonorEditFormProps {
  donor: Donor;
  onSuccess: (donor: Donor) => void;
  onCancel: () => void;
}

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorEditForm({ donor, onSuccess, onCancel }: DonorEditFormProps) {
  const { language } = useApp();
  const updateDonorMutation = useUpdateDonor();
  const [profilePicture, setProfilePicture] = useState<string>(donor.profilePicture || '');
  const [fullName, setFullName] = useState(donor.fullName);
  const [phoneNumber, setPhoneNumber] = useState(donor.phoneNumber);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(donor.bloodGroup);
  const [city, setCity] = useState(donor.city);
  const [notes, setNotes] = useState(donor.notes || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = t('nameRequired');
    if (!phoneNumber.trim()) newErrors.phoneNumber = t('phoneRequired');
    if (!city.trim()) newErrors.city = t('cityRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const updates = {
      profilePicture: profilePicture || undefined,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      bloodGroup,
      city: city.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      const updatedDonor = await updateDonorMutation.mutateAsync({
        accessCode: donor.accessCode,
        updates,
      });
      setShowSuccess(true);

      setTimeout(() => {
        onSuccess(updatedDonor);
      }, 1500);
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' });
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-500 p-6 rounded-full">
              <Check className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{t('profileUpdated')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-red-600 text-white p-6 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={onCancel}
            className="flex items-center space-x-2 text-white hover:text-red-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('back')}</span>
          </button>
          <LanguageToggle />
        </div>
        <h1 className="text-2xl font-bold">{t('editDonorProfile')}</h1>
        <p className="text-red-100">{t('fillDetails')}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-red-600"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700"
          >
            <Camera className="w-5 h-5" />
            <span>{t('uploadPhoto')}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('fullName')} *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('enterFullName')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('phoneNumber')} *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('enterPhone')}
            />
          </div>
          {errors.phoneNumber && <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('bloodGroup')} *
          </label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
            className="w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('cityArea')} *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 ${errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('enterCity')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t('additionalNotes')} ({t('optional')})
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder={t('anyAdditionalInfo')}
              dir={language === 'ur' ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-5 rounded-xl text-xl font-bold hover:bg-red-700 active:scale-98 transition shadow-lg"
        >
          {t('saveChanges')}
        </button>
      </form>
    </div>
  );
}
