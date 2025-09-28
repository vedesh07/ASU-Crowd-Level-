import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Location } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Sparkles, 
  Zap,
  ThumbsUp,
  Star,
  Trophy
} from 'lucide-react';

interface EnhancedVouchingModalProps {
  location: Location;
  onClose: () => void;
  onSubmit: (data: { crowdLevel: 'low' | 'medium' | 'high'; comment?: string }) => void;
}

export function EnhancedVouchingModal({ location, onClose, onSubmit }: EnhancedVouchingModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const crowdLevels = [
    {
      level: 'low' as const,
      label: 'Not Busy',
      description: 'Plenty of space available',
      emoji: '🟢',
      gradient: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      selectedGradient: 'from-emerald-500/40 to-emerald-600/20',
      selectedBorder: 'border-emerald-400',
      textColor: 'text-emerald-400'
    },
    {
      level: 'medium' as const,
      label: 'Somewhat Busy',
      description: 'Moderately crowded',
      emoji: '🟡',
      gradient: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      selectedGradient: 'from-amber-500/40 to-amber-600/20',
      selectedBorder: 'border-amber-400',
      textColor: 'text-amber-400'
    },
    {
      level: 'high' as const,
      label: 'Very Busy',
      description: 'Crowded, limited space',
      emoji: '🔴',
      gradient: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/30',
      selectedGradient: 'from-red-500/40 to-red-600/20',
      selectedBorder: 'border-red-400',
      textColor: 'text-red-400'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedLevel) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit({
      crowdLevel: selectedLevel,
      comment: comment.trim() || undefined
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowConfetti(true);
    
    // Auto close after success animation
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  if (isSubmitted) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-sm mx-auto glass border border-[var(--asu-gold)]/30 bg-gray-900/95">
          <DialogHeader className="sr-only">
            <DialogTitle>Vouch Submitted Successfully</DialogTitle>
            <DialogDescription>Your crowd level report has been submitted and points have been earned.</DialogDescription>
          </DialogHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-6 relative overflow-hidden"
          >
            {/* Confetti Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      scale: 0, 
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 200 - 100
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0.5],
                      y: [0, -50, 100],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute w-2 h-2 bg-[var(--asu-gold)] rounded-full"
                  />
                ))}
              </div>
            )}
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                Thanks for vouching! 🎉
              </h3>
              <p className="text-gray-300 mb-4">
                Your report helps fellow Sun Devils find the perfect spot on campus.
              </p>
              
              <div className="flex items-center justify-center gap-2 p-3 bg-[var(--asu-gold)]/10 rounded-lg border border-[var(--asu-gold)]/30">
                <Trophy className="w-5 h-5 text-[var(--asu-gold)]" />
                <span className="text-[var(--asu-gold)] font-medium">+10 Points Earned!</span>
              </div>
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto glass border border-gray-700/50 bg-gray-900/95">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-[var(--asu-gold)]" />
            </motion.div>
            Vouch for {location.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Help other students by reporting the current crowd level at this location.
          </DialogDescription>
        </DialogHeader>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <p className="text-sm text-gray-300 mb-4">
              How crowded is it right now? Your input helps other students! 🌟
            </p>
            
            <div className="space-y-3">
              {crowdLevels.map(({ level, label, description, emoji, gradient, border, selectedGradient, selectedBorder, textColor }, index) => (
                <motion.button
                  key={level}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedLevel(level)}
                  className={`
                    w-full p-4 border-2 rounded-xl text-left transition-all duration-300 glass
                    hover:scale-[1.02] active:scale-[0.98]
                    ${selectedLevel === level 
                      ? `${selectedGradient} ${selectedBorder} shadow-lg` 
                      : `${gradient} ${border} hover:border-[var(--asu-gold)]/50`
                    }
                  `}
                  style={{
                    boxShadow: selectedLevel === level ? '0 8px 32px rgba(255, 198, 39, 0.2)' : undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.span 
                        className="text-2xl"
                        animate={{ scale: selectedLevel === level ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {emoji}
                      </motion.span>
                      <div>
                        <p className={`font-semibold ${selectedLevel === level ? textColor : 'text-white'}`}>
                          {label}
                        </p>
                        <p className="text-xs text-gray-400">{description}</p>
                      </div>
                    </div>
                    <AnimatePresence>
                      {selectedLevel === level && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <CheckCircle className={`w-6 h-6 ${textColor}`} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-sm font-medium mb-3 block text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[var(--asu-gold)]" />
              Quick comment (optional)
            </label>
            <Textarea
              placeholder="e.g., 'No seats on first floor', 'Quiet upstairs', 'Long wait for equipment'"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={150}
              rows={3}
              className="glass border-gray-600/50 text-white placeholder-gray-400 focus:border-[var(--asu-gold)] resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">
                {comment.length}/150 characters
              </p>
              {comment.length > 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 text-xs text-[var(--asu-gold)]"
                >
                  <Star className="w-3 h-3" />
                  <span>Detailed feedback!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 pt-2"
          >
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 glass border-gray-600/50 text-gray-300 hover:border-gray-500 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedLevel || isSubmitting}
              className={`
                flex-1 bg-gradient-to-r from-[var(--asu-gold)] to-[var(--asu-gold)]/80 
                hover:from-[var(--asu-gold)]/90 hover:to-[var(--asu-gold)]/70 
                text-[var(--asu-maroon)] border-0 font-semibold
                ${!selectedLevel ? 'opacity-50' : 'hover:scale-[1.02] shadow-lg'}
                transition-all duration-300
              `}
              style={{
                boxShadow: selectedLevel ? '0 8px 32px rgba(255, 198, 39, 0.3)' : undefined
              }}
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-[var(--asu-maroon)] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Submitting...
                </motion.div>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-1" />
                  Submit Vouch
                  <ThumbsUp className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </motion.div>
          
          {selectedLevel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-[var(--asu-gold)]/10 rounded-lg border border-[var(--asu-gold)]/30 text-center"
            >
              <p className="text-sm text-[var(--asu-gold)]">
                ✨ Great choice! Your vouching helps the Sun Devil community.
              </p>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}