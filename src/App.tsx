import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { OTPVerification } from './components/OTPVerification';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { EnhancedDashboard } from './components/EnhancedDashboard';
import { EnhancedLocationDetails } from './components/EnhancedLocationDetails';
import { EnhancedProfile } from './components/EnhancedProfile';
import { Button } from './components/ui/button';
import { Home, User } from 'lucide-react';

type View = 'dashboard' | 'location' | 'profile';
type AuthStep = 'login' | 'otp' | 'welcome' | 'app';

function AppContent() {
  const { user, login, verifyOTP, resendOTP, isLoading, error } = useAuth();
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const handleEmailSubmit = async (email: string) => {
    try {
      await login(email);
      setPendingEmail(email);
      setAuthStep('otp');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      await verifyOTP(otp);
      setAuthStep('welcome');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP();
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleEnterApp = () => {
    setAuthStep('app');
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocationId(locationId);
    setCurrentView('location');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedLocationId(null);
  };

  // If user is authenticated but hasn't completed the welcome flow
  if (user && authStep !== 'app') {
    return <WelcomeDashboard onEnterApp={handleEnterApp} />;
  }

  // Main app content after authentication
  if (user && authStep === 'app') {
    const renderContent = () => {
      switch (currentView) {
        case 'dashboard':
          return <EnhancedDashboard onLocationSelect={handleLocationSelect} />;
        case 'location':
          return selectedLocationId ? (
            <EnhancedLocationDetails 
              locationId={selectedLocationId} 
              onBack={handleBackToDashboard}
            />
          ) : (
            <EnhancedDashboard onLocationSelect={handleLocationSelect} />
          );
        case 'profile':
          return <EnhancedProfile />;
        default:
          return <EnhancedDashboard onLocationSelect={handleLocationSelect} />;
      }
    };

    return (
      <div className="h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Floating Navigation Buttons - Top Right */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed top-6 right-6 z-50 flex gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className={`
                w-12 h-12 rounded-full p-0 transition-all duration-300 relative overflow-hidden glass
                ${currentView === 'dashboard' 
                  ? 'bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-[var(--asu-gold)] hover:bg-gray-800/50'
                }
              `}
            >
              <Home className="w-5 h-5" />
              {currentView === 'dashboard' && (
                <motion.div
                  layoutId="floatingIndicator"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--asu-gold)] rounded-full shadow-lg"
                />
              )}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setCurrentView('profile')}
              className={`
                w-12 h-12 rounded-full p-0 transition-all duration-300 relative overflow-hidden glass
                ${currentView === 'profile' 
                  ? 'bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-[var(--asu-gold)] hover:bg-gray-800/50'
                }
              `}
            >
              <User className="w-5 h-5" />
              {currentView === 'profile' && (
                <motion.div
                  layoutId="floatingIndicator"
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--asu-gold)] rounded-full shadow-lg"
                />
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Content Area - Full Width */}
        <div className="h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (selectedLocationId || '')}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Authentication flow
  return (
    <AnimatePresence mode="wait">
      {authStep === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage 
            onEmailSubmit={handleEmailSubmit}
            isLoading={isLoading}
          />
        </motion.div>
      )}
      
      {authStep === 'otp' && (
        <motion.div
          key="otp"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
        >
          <OTPVerification
            email={pendingEmail}
            onVerify={handleOTPVerify}
            onBack={() => setAuthStep('login')}
            onResendOTP={handleResendOTP}
            isLoading={isLoading}
            error={error}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}