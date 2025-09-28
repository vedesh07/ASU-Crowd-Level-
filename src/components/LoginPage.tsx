import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SparkyMascot } from './SparkyMascot';
import { Mail, ArrowRight, Shield } from 'lucide-react';

interface LoginPageProps {
  onEmailSubmit: (email: string) => void;
  isLoading: boolean;
}

export function LoginPage({ onEmailSubmit, isLoading }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (emailValue: string) => {
    // Accept any input - no validation in demo mode
    setEmailError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always proceed regardless of input
    onEmailSubmit(email || 'demo@asu.edu');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FFC627%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Mascot positioned in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative -top-16 left-32 scale-75 opacity-20">
          <SparkyMascot state="welcoming" />
        </div>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10">
          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-[var(--asu-maroon)] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
              <Shield className="w-4 h-4" />
              <span>Secure ASU Login</span>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 mt-4"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--asu-gold)] to-yellow-300 bg-clip-text text-transparent">
              Welcome to ASU Crowd Tracker
            </h1>
            <p className="text-gray-300 mt-2">
              Enter your ASU email to get started
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-200">
                ASU Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="your.name@asu.edu"
                  className={`
                    pl-12 h-12 bg-white/5 border-white/20 rounded-xl text-white placeholder-gray-400
                    focus:border-[var(--asu-gold)] focus:ring-2 focus:ring-[var(--asu-gold)]/20
                    transition-all duration-300
                    ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
                  `}
                  disabled={isLoading}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-red-400 text-sm"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[var(--asu-maroon)] to-red-800 hover:from-[var(--asu-maroon)]/90 hover:to-red-800/90 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Send OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </motion.form>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center space-y-2"
          >
            <p className="text-xs text-gray-400">
              🔒 We'll send a secure verification code to your ASU email
            </p>
            <div className="bg-[var(--asu-gold)]/10 border border-[var(--asu-gold)]/30 rounded-lg p-3">
              <p className="text-xs text-[var(--asu-gold)]">
                💡 <strong>Demo Mode:</strong> Enter anything and click to proceed!
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-[var(--asu-gold)] to-yellow-300 rounded-full opacity-20"
        />
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -2, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-[var(--asu-maroon)] to-red-800 rounded-full opacity-15"
        />
      </motion.div>
    </div>
  );
}