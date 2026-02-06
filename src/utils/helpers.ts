import { Language } from './translations';

export const generateAccessCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 8; i++) {
    if (i === 4) {
      code += '-';
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

export const formatDateTime = (dateString: string, lang: Language = 'en'): string => {
  const date = new Date(dateString);

  const months = {
    ur: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  const day = date.getDate();
  const month = months[lang][date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? (lang === 'ur' ? 'شام' : 'PM') : (lang === 'ur' ? 'صبح' : 'AM');
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

  if (lang === 'ur') {
    return `${day} ${month} ${year} - ${displayHours}:${displayMinutes} ${ampm}`;
  }

  return `${day} ${month} ${year} - ${displayHours}:${displayMinutes} ${ampm}`;
};

export const getTimeAgo = (dateString: string, lang: Language = 'en'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (lang === 'ur') {
    if (diffMins < 1) return 'ابھی';
    if (diffMins < 60) return `${diffMins} منٹ پہلے`;
    if (diffHours < 24) return `${diffHours} گھنٹے پہلے`;
    return `${diffDays} دن پہلے`;
  }

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};
