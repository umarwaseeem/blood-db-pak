import { useState, useEffect } from 'react';
import { useApp } from './contexts/AppContext';
import LandingScreen from './components/LandingScreen';
import AccessCodeLogin from './components/AccessCodeLogin';
import UserDashboard from './components/UserDashboard';
import DonorForm from './components/DonorForm';
import DonorEditForm from './components/DonorEditForm';
import DonorList from './components/DonorList';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import BottomNav from './components/BottomNav';

type Screen = 'landing' | 'accessCodeLogin' | 'dashboard' | 'donorForm' | 'donorEdit' | 'donorList' | 'requestForm' | 'requestList';
type NavItem = 'home' | 'donors' | 'requests';

function App() {
  const { currentUser, setCurrentUser } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  useEffect(() => {
    if (currentUser) {
      setCurrentScreen('dashboard');
    } else {
      if (currentScreen === 'dashboard' || currentScreen === 'donorEdit') {
        setCurrentScreen('landing');
      }
    }
  }, [currentUser]);

  const handleDonorSelect = () => {
    setCurrentScreen('donorForm');
  };

  const handleRequestSelect = () => {
    setCurrentScreen('requestForm');
  };

  const handleLoginWithCode = () => {
    setCurrentScreen('accessCodeLogin');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleDonorSuccess = () => {
    setCurrentScreen('donorList');
  };

  const handleRequestSuccess = () => {
    setCurrentScreen('requestList');
  };

  const handleEditProfile = () => {
    setCurrentScreen('donorEdit');
  };

  const handleEditCancel = () => {
    setCurrentScreen('dashboard');
  };

  const handleEditSuccess = (donor: any) => {
    if (currentUser && currentUser.type === 'donor') {
      setCurrentUser({ type: 'donor', data: donor });
    }
    setCurrentScreen('dashboard');
  };

  const handleCreateNewRequest = () => {
    setCurrentScreen('requestForm');
  };

  const handleRequestFormBack = () => {
    if (currentUser) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('landing');
    }
  };

  const handleNavigation = (item: NavItem) => {
    if (currentUser) {
      if (item === 'home') {
        setCurrentScreen('dashboard');
      } else if (item === 'donors') {
        setCurrentScreen('donorList');
      } else if (item === 'requests') {
        setCurrentScreen('requestList');
      }
    } else {
      switch (item) {
        case 'home':
          setCurrentScreen('landing');
          break;
        case 'donors':
          setCurrentScreen('donorList');
          break;
        case 'requests':
          setCurrentScreen('requestList');
          break;
      }
    }
  };

  const getActiveNavItem = (): NavItem => {
    if (currentScreen === 'dashboard') return 'home';
    if (currentScreen === 'donorList' || currentScreen === 'donorForm' || currentScreen === 'donorEdit') return 'donors';
    if (currentScreen === 'requestList' || currentScreen === 'requestForm') return 'requests';
    return 'home';
  };

  const showBottomNav = currentScreen !== 'landing' && currentScreen !== 'accessCodeLogin' && currentScreen !== 'donorForm' && currentScreen !== 'donorEdit' && currentScreen !== 'requestForm';

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'landing' && (
        <LandingScreen
          onSelectDonor={handleDonorSelect}
          onSelectRequest={handleRequestSelect}
          onLoginWithCode={handleLoginWithCode}
          onViewDonors={() => handleNavigation('donors')}
          onViewRequests={() => handleNavigation('requests')}
        />
      )}

      {currentScreen === 'accessCodeLogin' && (
        <AccessCodeLogin onBack={handleBackToLanding} />
      )}

      {currentScreen === 'dashboard' && (
        <UserDashboard
          onEditProfile={handleEditProfile}
          onCreateNewRequest={handleCreateNewRequest}
        />
      )}

      {currentScreen === 'donorForm' && <DonorForm onSuccess={handleDonorSuccess} onBack={handleBackToLanding} />}

      {currentScreen === 'donorEdit' && currentUser && currentUser.type === 'donor' && (
        <DonorEditForm
          donor={currentUser.data}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}

      {currentScreen === 'donorList' && <DonorList />}

      {currentScreen === 'requestForm' && <RequestForm onSuccess={handleRequestSuccess} onBack={handleRequestFormBack} />}

      {currentScreen === 'requestList' && <RequestList />}

      {showBottomNav && (
        <BottomNav active={getActiveNavItem()} onNavigate={handleNavigation} />
      )}
    </div>
  );
}

export default App;
