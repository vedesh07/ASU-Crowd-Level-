import { useState } from 'react';
import { Location, HistoricalData } from '../types';
import { locations, generateHistoricalData, mockVouches } from '../data/mockData';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { VouchingModal } from './VouchingModal';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LocationDetailsProps {
  locationId: string;
  onBack: () => void;
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

export function LocationDetails({ locationId, onBack }: LocationDetailsProps) {
  const [showVouchingModal, setShowVouchingModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Today');
  
  const location = locations.find(l => l.id === locationId);
  const historicalData = generateHistoricalData(locationId);
  const locationVouches = mockVouches.filter(v => v.locationId === locationId);
  
  if (!location) return null;
  
  const capacityPercentage = (location.currentCount / location.capacity) * 100;
  
  // Get today's data for the chart
  const todayData = historicalData
    .filter(d => d.day === 'Monday') // Using Monday as "today"
    .map(d => ({
      hour: `${d.hour}:00`,
      count: d.count
    }));

  const days = ['Today', 'Yesterday', 'This Week'];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="relative">
        <ImageWithFallback
          src={getLocationImage(location)}
          alt={location.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="absolute top-4 left-4 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1">{location.name}</h1>
              <p className="text-sm opacity-90">{location.description}</p>
            </div>
            <div className={`w-4 h-4 rounded-full ${crowdColors[location.crowdLevel]} shadow-lg`}></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full space-y-4">
        {/* Current Status */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#8C1D40]" />
              <span>Current Status</span>
            </div>
            <Badge 
              className={`${crowdBgColors[location.crowdLevel]} ${crowdTextColors[location.crowdLevel]} border-none`}
            >
              {location.crowdLevel.toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">People inside</span>
              <span>{location.currentCount} / {location.capacity}</span>
            </div>
            
            <div className="space-y-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${crowdColors[location.crowdLevel]}`}
                  style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>{Math.round(capacityPercentage)}% full</span>
                <span>{location.capacity}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Last updated 2 minutes ago</span>
            </div>
          </div>
        </Card>

        {/* Crowd Trends */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#8C1D40]" />
              <span>Crowd Trends</span>
            </div>
            <select 
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={todayData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(':')[0]}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} people`, 'Count']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8C1D40" 
                  strokeWidth={2}
                  dot={{ fill: '#8C1D40', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>📊 Peak hours: 2PM - 4PM • Quietest: 7AM - 9AM</p>
          </div>
        </Card>

        {/* Vouch Button */}
        <Button 
          onClick={() => setShowVouchingModal(true)}
          className="w-full bg-[#FFC627] hover:bg-[#FFC627]/90 text-black"
          size="lg"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Vouch Current Crowd Level
        </Button>

        {/* Recent Vouches */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-[#8C1D40]" />
            <span>Recent Student Reports</span>
          </div>
          
          <div className="space-y-3">
            {locationVouches.map((vouch) => (
              <div key={vouch.id} className="border-l-4 border-[#8C1D40] pl-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <Badge 
                    className={`${crowdBgColors[vouch.crowdLevel]} ${crowdTextColors[vouch.crowdLevel]} border-none text-xs`}
                  >
                    {vouch.crowdLevel.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - vouch.timestamp.getTime()) / (1000 * 60))}m ago
                  </span>
                </div>
                {vouch.comment && (
                  <p className="text-sm text-muted-foreground mb-2">"{vouch.comment}"</p>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ThumbsUp className="w-3 h-3" />
                  <span>{vouch.helpful} found this helpful</span>
                </div>
              </div>
            ))}
            
            {locationVouches.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <MessageSquare className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent reports</p>
                <p className="text-xs">Be the first to vouch for this location!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Location Info */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#8C1D40]" />
            <span>Location Details</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="capitalize">{location.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity</span>
              <span>{location.capacity} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span>Tempe Campus</span>
            </div>
          </div>
        </Card>
      </div>

      {showVouchingModal && (
        <VouchingModal
          location={location}
          onClose={() => setShowVouchingModal(false)}
          onSubmit={(data) => {
            console.log('Vouch submitted:', data);
            setShowVouchingModal(false);
          }}
        />
      )}
    </div>
  );
}