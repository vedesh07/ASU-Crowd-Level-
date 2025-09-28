import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { SparkyMascot } from './SparkyMascot';
import { ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onBack: () => void;
  onResendOTP: () => void;
  isLoading: boolean;
  error?: string;
}

export function OTPVerification({ 
  email, 
  onVerify, 
  onBack, 
  onResendOTP, 
  isLoading,
  error 
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && !isLoading) {
      onVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    const newOtp = [...otp];
    for (let i = 0; i < digits.length; i++) {
      newOtp[i] = digits[i];
    }
    setOtp(newOtp);

    // Focus the next empty input or last input
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if complete
    if (digits.length === 6) {
      onVerify(digits);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setOtp(['', '', '', '', '', '']);
    onResendOTP();
    inputRefs.current[0]?.focus();
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FFC627%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Animated Mascot */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative -top-16 left-32 scale-75 opacity-25">
          <SparkyMascot state={isComplete ? "celebrating" : "delivering"} />
        </div>
      </div>

      {/* Main OTP Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-white/10">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-[var(--asu-gold)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 mt-4"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-[var(--asu-gold)] to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-300 text-sm">
              We sent a 6-digit code to
            </p>
            <p className="text-[var(--asu-gold)] font-medium">
              {email}
            </p>
          </motion.div>

          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  className={`
                    w-12 h-12 text-center text-xl font-bold rounded-xl
                    bg-white/5 border-2 border-white/20 text-white
                    focus:border-[var(--asu-gold)] focus:ring-2 focus:ring-[var(--asu-gold)]/20 focus:outline-none
                    transition-all duration-300
                    ${digit ? 'border-[var(--asu-gold)] bg-[var(--asu-gold)]/10' : ''}
                    ${error ? 'border-red-400 bg-red-400/10' : ''}
                  `}
                  disabled={isLoading}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                />
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                
              </motion.div>
            )}

            {/* Auto-submit indicator */}
            {isComplete && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 text-[var(--asu-gold)] text-sm">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[var(--asu-gold)]/30 border-t-[var(--asu-gold)] rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Code entered!</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Manual verify button */}
            {isComplete && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={() => onVerify('123456')}
                  className="w-full h-12 bg-gradient-to-r from-[var(--asu-maroon)] to-red-800 hover:from-[var(--asu-maroon)]/90 hover:to-red-800/90 text-white rounded-xl font-semibold shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Verify & Login</span>
                  </div>
                </Button>
              </motion.div>
            )}

            {/* Resend OTP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center space-y-3"
            >
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend code in {timeLeft} seconds
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-[var(--asu-gold)] hover:text-yellow-300 text-sm font-medium transition-colors flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Resend OTP</span>
                </button>
              )}
              
              <div className="bg-[var(--asu-gold)]/10 border border-[var(--asu-gold)]/30 rounded-lg p-3 max-w-xs mx-auto">
                <p className="text-xs text-[var(--asu-gold)]">
                  💡 <strong>Demo:</strong> Enter anything and click "Verify & Login" to continue
                </p>
              </div>
            </motion.div>
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