import { useState } from 'react';
import { motion } from 'motion/react';
import { Location } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EnhancedLocationCardProps {
  location: Location;
  onClick: () => void;
}

const crowdColors = {
  low: { 
    bg: 'from-emerald-900/40 to-emerald-800/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: '0 0 20px rgba(16, 185, 129, 0.3)'
  },
  medium: { 
    bg: 'from-amber-900/40 to-amber-800/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: '0 0 20px rgba(245, 158, 11, 0.3)'
  },
  high: { 
    bg: 'from-red-900/40 to-red-800/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: '0 0 20px rgba(239, 68, 68, 0.3)'
  }
};

const getLocationImage = (location: Location) => {
  const imageMap: Record<string, string> = {
    '1': 'https://images.unsplash.com/photo-1544822688-c5f41d2c1972?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwaW50ZXJpb3IlMjBzdHVkeXxlbnwxfHx8fDE3NTkwMzQzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    '2': 'https://images.unsplash.com/photo-1744168222850-85b5e5e9aa24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYWZldGVyaWElMjBkaW5pbmd8ZW58MXx8fHwxNzU5MDM0MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    '3': 'https://images.unsplash.com/photo-1721394747060-7cfc57104f88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjBmaXRuZXNzJTIwY2VudGVyfGVufDF8fHx8MTc1ODk5MjMyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    '4': 'https://images.unsplash.com/photo-1758801305053-97e7e20fee3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWJyYXJ5JTIwc3R1ZHklMjByb29tJTIwbW9kZXJufGVufDF8fHx8MTc1OTAzNDMyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    '5': 'https://images.unsplash.com/photo-1680264370818-659352fa16f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwdW5pb24lMjBsb3VuZ2UlMjBtb2Rlcm58ZW58MXx8fHwxNzU5MDM0MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };
  return imageMap[location.id] || imageMap['1'];
};

export function EnhancedLocationCard({ location, onClick }: EnhancedLocationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const capacityPercentage = (location.currentCount / location.capacity) * 100;
  const crowdStyle = crowdColors[location.crowdLevel];
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer group"
      onClick={onClick}
    >
      <Card className={`
        overflow-hidden transition-all duration-500 glass
        border ${crowdStyle.border} hover:border-[var(--asu-gold)]/50
        bg-gradient-to-br ${crowdStyle.bg}
        hover:shadow-2xl
      `}
      style={{
        boxShadow: isHovered ? crowdStyle.glow : '0 4px 12px rgba(0,0,0,0.4)'
      }}>
        {/* Image Section */}
        <div className="relative h-32 overflow-hidden">
          <ImageWithFallback
            src={getLocationImage(location)}
            alt={location.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Live Indicator */}
          <div className="absolute top-3 left-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 px-2 py-1 glass rounded-full"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-white font-medium">LIVE</span>
            </motion.div>
          </div>
          
          {/* Crowd Level Indicator */}
          <div className="absolute top-3 right-3">
            <motion.div
              animate={{ 
                boxShadow: [`0 0 0 0 ${crowdStyle.text.replace('text-', '')}40`, `0 0 0 8px transparent`]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-6 h-6 rounded-full flex items-center justify-center glass ${crowdStyle.border}`}
            >
              <div className={`w-3 h-3 rounded-full ${crowdStyle.text.replace('text-', 'bg-')}`} />
            </motion.div>
          </div>
          
          {/* Quick Stats Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{location.currentCount}</span>
              </div>
              <Badge 
                className={`
                  ${crowdStyle.bg} ${crowdStyle.border} ${crowdStyle.text} 
                  backdrop-blur-sm border text-xs
                `}
              >
                {Math.round(capacityPercentage)}% Full
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-white group-hover:text-[var(--asu-gold)] transition-colors">
                {location.name}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-2">{location.description}</p>
            </div>
            <motion.div
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[var(--asu-gold)]" />
            </motion.div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Capacity</span>
              <span>{location.currentCount} / {location.capacity}</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-2 rounded-full transition-all duration-500 ${crowdStyle.text.replace('text-', 'bg-')}`}
                />
              </div>
              {capacityPercentage > 90 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 right-0"
                >
                  <Sparkles className="w-3 h-3 text-red-400" />
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Footer Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>2m ago</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <TrendingUp className="w-3 h-3" />
                <span>+12% today</span>
              </div>
            </div>
            
            <Button 
              size="sm"
              className="bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 text-white border-0 h-7 px-3"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Zap className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}