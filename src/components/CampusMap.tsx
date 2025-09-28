import { useState } from 'react';
import { motion } from 'motion/react';
import campusMapImage from 'figma:asset/aeae37892b69c23b88fc4d71ab88915ba9670b63.png';
import { locations } from '../data/mockData';
import { Location } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Users, Clock, Zap } from 'lucide-react';

interface CampusMapProps {
  onLocationSelect: (locationId: string) => void;
}

interface MapMarker {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  location: Location;
}

// Map coordinates for ASU campus locations based on the provided map
const mapMarkers: MapMarker[] = [
  { id: '1', x: 45, y: 65, location: locations[0] }, // Hayden Library area
  { id: '2', x: 38, y: 55, location: locations[1] }, // Memorial Union area  
  { id: '3', x: 25, y: 45, location: locations[2] }, // Sun Devil Fitness area
  { id: '4', x: 52, y: 58, location: locations[3] }, // Noble Library area
  { id: '5', x: 42, y: 72, location: locations[4] }, // Student Union area
];

const crowdColors = {
  low: '#10b981',   // emerald-500
  medium: '#f59e0b', // amber-500
  high: '#ef4444'    // red-500
};

export function CampusMap({ onLocationSelect }: CampusMapProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarkerId(marker.id);
    onLocationSelect(marker.location.id);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Map */}
      <div className="relative w-full h-full">
        <img
          src={campusMapImage}
          alt="ASU Tempe Campus Map"
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        
        {/* Interactive Markers */}
        {mapMarkers.map((marker) => {
          const isSelected = selectedMarkerId === marker.id;
          const isHovered = hoveredMarkerId === marker.id;
          const crowdColor = crowdColors[marker.location.crowdLevel];
          
          return (
            <motion.div
              key={marker.id}
              className="absolute cursor-pointer"
              style={{
                left: `${marker.x}%`,
                top: `${marker.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: parseFloat(marker.id) * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredMarkerId(marker.id)}
              onMouseLeave={() => setHoveredMarkerId(null)}
              onClick={() => handleMarkerClick(marker)}
            >
              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: crowdColor }}
                animate={{
                  scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Main marker */}
              <motion.div
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  glass border-2 interactive
                  ${isSelected ? 'border-[var(--asu-gold)]' : 'border-white/30'}
                `}
                style={{
                  backgroundColor: crowdColor,
                  boxShadow: isHovered ? `0 8px 32px ${crowdColor}40` : '0 4px 12px rgba(0,0,0,0.4)'
                }}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  y: isHovered ? -4 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <Users className="w-6 h-6 text-white drop-shadow-sm" />
                
                {/* Crowd level indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: crowdColor }}>
                    {marker.location.currentCount > 500 ? '!' : 
                     marker.location.currentCount > 200 ? '●' : '○'}
                  </span>
                </div>
              </motion.div>
              
              {/* Hover card */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: -20, scale: 1 }}
                  className="absolute left-1/2 transform -translate-x-1/2 z-10"
                >
                  <Card className="p-3 glass border border-white/20 min-w-[200px]">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">{marker.location.name}</h4>
                        <Badge 
                          className="text-xs"
                          style={{
                            backgroundColor: `${crowdColor}20`,
                            color: crowdColor,
                            border: `1px solid ${crowdColor}40`
                          }}
                        >
                          {marker.location.crowdLevel.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{marker.location.currentCount} people</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4" />
                        <span>Updated 2m ago</span>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(marker);
                        }}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          );
        })}
        
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-4 left-4"
        >
          <Card className="p-3 glass border border-white/20">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Crowd Levels
            </h4>
            <div className="space-y-1">
              {Object.entries(crowdColors).map(([level, color]) => (
                <div key={level} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-300 capitalize">{level}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
        
        {/* Campus info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="absolute top-4 right-4"
        >
          <Card className="p-3 glass border border-white/20">
            <h4 className="font-medium text-[var(--asu-gold)] mb-1">ASU Tempe</h4>
            <p className="text-sm text-gray-300">Real-time campus data</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Live</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}