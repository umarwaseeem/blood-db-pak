import { useState, useEffect } from 'react';
import { Phone, MapPin, User, Search, Clock } from 'lucide-react';
import { Donor, BloodGroup } from '../types';
import { storage } from '../utils/storage';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';
import { formatDateTime } from '../utils/helpers';
import LanguageToggle from './LanguageToggle';

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorList() {
  const { language } = useApp();
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  useEffect(() => {
    loadDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, selectedBloodGroup, searchQuery]);

  const loadDonors = () => {
    const loadedDonors = storage.getDonors();
    setDonors(loadedDonors);
  };

  const filterDonors = () => {
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

    setFilteredDonors(filtered);
  };

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
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
            className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
              selectedBloodGroup === 'All'
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
              className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedBloodGroup === group
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
        {filteredDonors.length === 0 ? (
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
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      {donor.bloodGroup}
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatDateTime(donor.createdAt, language)}</span>
                  </div>

                  {donor.notes && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{donor.notes}</p>
                  )}

                  <button
                    onClick={() => handleCall(donor.phoneNumber)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 active:scale-98 transition"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{t('call')} {donor.phoneNumber}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
