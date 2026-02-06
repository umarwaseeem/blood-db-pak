import { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../utils/translations';
import { Donor, BloodRequest } from '../types';

interface AppContextType {
  language: Language;
  toggleLanguage: () => void;
  currentUser: { type: 'donor'; data: Donor } | { type: 'request'; data: BloodRequest } | null;
  setCurrentUser: (user: { type: 'donor'; data: Donor } | { type: 'request'; data: BloodRequest } | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ur');
  const [currentUser, setCurrentUser] = useState<{ type: 'donor'; data: Donor } | { type: 'request'; data: BloodRequest } | null>(null);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ur' ? 'en' : 'ur');
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider value={{ language, toggleLanguage, currentUser, setCurrentUser, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
