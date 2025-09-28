import { motion } from 'motion/react';
import { Button } from './ui/button';
import { SparkyMascot } from './SparkyMascot';
import { LogOut, Settings, Trophy, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface WelcomeDashboardProps {
  onEnterApp: () => void;
}

export function WelcomeDashboard({ onEnterApp }: WelcomeDashboardProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header with user info and logout */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 right-6 flex justify-between items-center z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[var(--asu-maroon)] to-red-800 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">{user.firstName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm text-gray-400">Welcome back,</p>
            <p className="font-semibold text-[var(--asu-gold)]">{user.firstName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-[var(--asu-gold)] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Main Welcome Content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl">
          {/* Animated Mascot */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.3 
            }}
            className="mb-8 flex justify-center"
          >
            <SparkyMascot state="waving" />
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[var(--asu-gold)] to-yellow-300 bg-clip-text text-transparent">
                Hi {user.firstName}! 
              </span>
              <motion.span
                animate={{ rotate: [0, 20, -10, 0] }}
                transition={{ delay: 1, duration: 0.6 }}
                className="inline-block ml-2"
              >
                👋
              </motion.span>
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Welcome to ASU Crowd Tracker
            </p>
            <p className="text-gray-400">
              Track real-time crowd levels across campus locations
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <MapPin className="w-6 h-6 text-[var(--asu-gold)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">15</p>
              <p className="text-xs text-gray-400">Locations</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <Trophy className="w-6 h-6 text-[var(--asu-gold)] mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="w-6 h-6 bg-[var(--asu-gold)] rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-xs text-black font-bold">1</span>
              </div>
              <p className="text-2xl font-bold text-white">Bronze</p>
              <p className="text-xs text-gray-400">Level</p>
            </div>
          </motion.div>

          {/* Enter App Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onEnterApp}
              className="w-full max-w-xs h-14 bg-gradient-to-r from-[var(--asu-maroon)] to-red-800 hover:from-[var(--asu-maroon)]/90 hover:to-red-800/90 text-white rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 mx-auto"
            >
              <span className="flex items-center gap-3">
                <span>Explore Campus</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  →
                </motion.div>
              </span>
            </Button>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400 mb-2">✨ Pro Tips:</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="bg-[var(--asu-maroon)]/20 text-[var(--asu-gold)] px-3 py-1 rounded-full border border-[var(--asu-maroon)]/30">
                Check in to earn points
              </span>
              <span className="bg-[var(--asu-maroon)]/20 text-[var(--asu-gold)] px-3 py-1 rounded-full border border-[var(--asu-maroon)]/30">
                Help others with crowd reports
              </span>
              <span className="bg-[var(--asu-maroon)]/20 text-[var(--asu-gold)] px-3 py-1 rounded-full border border-[var(--asu-maroon)]/30">
                Unlock achievements
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-[var(--asu-gold)]/5 to-transparent rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-[var(--asu-maroon)]/5 to-transparent rounded-full"
        />
      </div>
    </div>
  );
}