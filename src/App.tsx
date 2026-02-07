import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useApp } from './contexts/AppContext';
import { useDeepLink } from './hooks/useDeepLink';
import LandingScreen from './components/LandingScreen';
import AccessCodeLogin from './components/AccessCodeLogin';
import UserDashboard from './components/UserDashboard';
import DonorForm from './components/DonorForm';
import DonorEditForm from './components/DonorEditForm';
import DonorList from './components/DonorList';
import RequestForm from './components/RequestForm';
import RequestList from './components/RequestList';
import BottomNav from './components/BottomNav';
import LegalPages from './components/LegalPages';
import EligibilityQuiz from './components/EligibilityQuiz';
import BloodDonationGuide from './components/BloodDonationGuide';
import TestimonialsPage from './components/TestimonialsPage';



type NavItem = 'home' | 'donors' | 'requests';

function App() {
  const { currentUser, setCurrentUser } = useApp();
  const { targetType, targetId, isDeepLink, clearTarget } = useDeepLink();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle deep link navigation on mount
  useEffect(() => {
    if (isDeepLink && targetType && targetId) {
      if (targetType === 'donor') {
        navigate('/donors');
      } else if (targetType === 'request') {
        navigate('/requests');
      }
    }
  }, [isDeepLink, targetType, targetId, navigate]);

  const handleLoginWithCode = () => {
    navigate('/login');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleNavigation = (item: NavItem) => {
    switch (item) {
      case 'home':
        navigate(currentUser ? '/dashboard' : '/');
        break;
      case 'donors':
        navigate('/donors');
        break;
      case 'requests':
        navigate('/requests');
        break;
    }
  };

  const getActiveNavItem = (): NavItem => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return 'home';
    if (path.startsWith('/donors') || path.startsWith('/donor')) return 'donors';
    if (path.startsWith('/requests') || path.startsWith('/request')) return 'requests';
    return 'home';
  };

  const showBottomNav = !['/', '/login', '/donor/register', '/donor/edit', '/request/create', '/privacy', '/terms', '/quiz', '/guide', '/stories'].includes(location.pathname);



  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Routes>
        <Route path="/" element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingScreen
              onSelectDonor={() => navigate('/donor/register')}
              onSelectRequest={() => navigate('/request/create')}
              onLoginWithCode={handleLoginWithCode}
              onViewDonors={() => navigate('/donors')}
              onViewRequests={() => navigate('/requests')}
              onShowPrivacy={() => navigate('/privacy')}
              onShowTerms={() => navigate('/terms')}
              onShowQuiz={() => navigate('/quiz')}
              onShowGuide={() => navigate('/guide')}
              onShowStories={() => navigate('/stories')}
            />


          )
        } />

        <Route path="/login" element={
          <AccessCodeLogin onBack={handleBackToLanding} />
        } />

        <Route path="/dashboard" element={
          currentUser ? (
            <UserDashboard
              onEditProfile={() => navigate('/donor/edit')}
              onCreateNewRequest={() => navigate('/request/create')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/donor/register" element={
          <DonorForm onSuccess={() => navigate('/donors')} onBack={handleBackToLanding} />
        } />

        <Route path="/donor/edit" element={
          currentUser && currentUser.type === 'donor' ? (
            <DonorEditForm
              donor={currentUser.data}
              onSuccess={(donor: any) => {
                setCurrentUser({ type: 'donor', data: donor });
                navigate('/dashboard');
              }}
              onCancel={() => navigate('/dashboard')}
            />
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/donors" element={
          <DonorList
            targetId={isDeepLink && targetType === 'donor' ? targetId : null}
            onTargetScrolled={clearTarget}
          />
        } />

        <Route path="/request/create" element={
          <RequestForm
            onSuccess={() => navigate('/requests')}
            onBack={() => navigate(currentUser ? '/dashboard' : '/')}
          />
        } />

        <Route path="/requests" element={
          <RequestList
            targetId={isDeepLink && targetType === 'request' ? targetId : null}
            onTargetScrolled={clearTarget}
          />
        } />

        <Route path="/privacy" element={
          <LegalPages type="privacy" onBack={handleBackToLanding} />
        } />

        <Route path="/terms" element={
          <LegalPages type="terms" onBack={handleBackToLanding} />
        } />

        <Route path="/quiz" element={
          <EligibilityQuiz onBack={handleBackToLanding} />
        } />

        <Route path="/guide" element={
          <BloodDonationGuide onBack={handleBackToLanding} />
        } />

        <Route path="/stories" element={
          <TestimonialsPage onBack={handleBackToLanding} />
        } />


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showBottomNav && (
        <BottomNav active={getActiveNavItem()} onNavigate={handleNavigation} />
      )}
    </div>
  );
}

export default App;
