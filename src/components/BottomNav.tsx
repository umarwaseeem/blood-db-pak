import { Home, Users, Droplets } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getTranslation } from '../utils/translations';

type NavItem = 'home' | 'donors' | 'requests';

interface BottomNavProps {
  active: NavItem;
  onNavigate: (item: NavItem) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const { language } = useApp();
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(language, key);

  const navItems = [
    { id: 'home' as NavItem, icon: Home, label: t('home') },
    { id: 'donors' as NavItem, icon: Users, label: t('donors') },
    { id: 'requests' as NavItem, icon: Droplets, label: t('requests') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 px-6 py-2 rounded-lg transition ${
                isActive
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-7 h-7 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span className={`text-xs font-semibold ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
