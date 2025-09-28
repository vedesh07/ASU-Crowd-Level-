import { useState } from 'react';
import { Location } from '../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Users, MessageSquare, CheckCircle } from 'lucide-react';

interface VouchingModalProps {
  location: Location;
  onClose: () => void;
  onSubmit: (data: { crowdLevel: 'low' | 'medium' | 'high'; comment?: string }) => void;
}

export function VouchingModal({ location, onClose, onSubmit }: VouchingModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<'low' | 'medium' | 'high' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const crowdLevels = [
    {
      level: 'low' as const,
      label: 'Low',
      description: 'Plenty of space available',
      color: 'bg-green-50 border-green-200 text-green-700',
      selectedColor: 'bg-green-100 border-green-400'
    },
    {
      level: 'medium' as const,
      label: 'Medium',
      description: 'Moderately busy',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      selectedColor: 'bg-yellow-100 border-yellow-400'
    },
    {
      level: 'high' as const,
      label: 'High',
      description: 'Very crowded, limited space',
      color: 'bg-red-50 border-red-200 text-red-700',
      selectedColor: 'bg-red-100 border-red-400'
    }
  ];

  const handleSubmit = async () => {
    if (!selectedLevel) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      crowdLevel: selectedLevel,
      comment: comment.trim() || undefined
    });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto close after success animation
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg mb-2">Thanks for vouching!</h3>
            <p className="text-sm text-muted-foreground">
              Your report helps other Sun Devils find the perfect spot.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#8C1D40]" />
            Vouch for {location.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              How crowded is it right now?
            </p>
            
            <div className="space-y-2">
              {crowdLevels.map(({ level, label, description, color, selectedColor }) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    selectedLevel === level ? selectedColor : color
                  } hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-xs opacity-80">{description}</p>
                    </div>
                    {selectedLevel === level && (
                      <CheckCircle className="w-5 h-5" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              Quick comment (optional)
            </label>
            <Textarea
              placeholder="e.g., 'No seats on first floor' or 'Quiet upstairs'"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={150}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {comment.length}/150 characters
            </p>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedLevel || isSubmitting}
              className="flex-1 bg-[#8C1D40] hover:bg-[#8C1D40]/90"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Submit Vouch
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}