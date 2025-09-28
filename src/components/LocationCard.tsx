import { Location } from '../types';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Users, MapPin, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LocationCardProps {
  location: Location;
  onClick: () => void;
}

const crowdColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500', 
  high: 'bg-red-500'
};

const crowdTextColors = {
  low: 'text-green-700',
  medium: 'text-yellow-700',
  high: 'text-red-700'
};

const crowdBgColors = {
  low: 'bg-green-50',
  medium: 'bg-yellow-50',
  high: 'bg-red-50'
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

export function LocationCard({ location, onClick }: LocationCardProps) {
  const capacityPercentage = (location.currentCount / location.capacity) * 100;
  
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="relative">
        <ImageWithFallback
          src={getLocationImage(location)}
          alt={location.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-3 right-3">
          <div className={`w-4 h-4 rounded-full ${crowdColors[location.crowdLevel]} shadow-lg`}></div>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{location.name}</h3>
            <p className="text-sm text-muted-foreground">{location.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{location.currentCount}</span>
          </div>
          
          <Badge 
            className={`${crowdBgColors[location.crowdLevel]} ${crowdTextColors[location.crowdLevel]} border-none`}
          >
            {location.crowdLevel.toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacity</span>
            <span>{Math.round(capacityPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${crowdColors[location.crowdLevel]}`}
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Updated 2 min ago</span>
        </div>
      </div>
    </Card>
  );
}