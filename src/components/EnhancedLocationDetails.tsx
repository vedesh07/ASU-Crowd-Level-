import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Location, HistoricalData } from '../types';
import { locations, generateHistoricalData, mockVouches } from '../data/mockData';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { EnhancedVouchingModal } from './EnhancedVouchingModal';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  ThumbsUp,
  MapPin,
  Calendar,
  Zap,
  Target,
  Sparkles,
  Activity,
  Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EnhancedLocationDetailsProps {
  locationId: string;
  onBack: () => void;
}

const crowdColors = {
  low: { 
    bg: 'from-emerald-900/40 to-emerald-800/20',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    fill: '#10b981',
    glow: '0 0 20px rgba(16, 185, 129, 0.3)'
  },
  medium: { 
    bg: 'from-amber-900/40 to-amber-800/20',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    fill: '#f59e0b',
    glow: '0 0 20px rgba(245, 158, 11, 0.3)'
  },
  high: { 
    bg: 'from-red-900/40 to-red-800/20',
    border: 'border-red-500/30',
    text: 'text-red-400',
    fill: '#ef4444',
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

export function EnhancedLocationDetails({ locationId, onBack }: EnhancedLocationDetailsProps) {
  const [showVouchingModal, setShowVouchingModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Today');
  const [sparkleAnimation, setSparkleAnimation] = useState(false);
  
  const location = locations.find(l => l.id === locationId);
  const historicalData = generateHistoricalData(locationId);
  const locationVouches = mockVouches.filter(v => v.locationId === locationId);
  
  if (!location) return null;
  
  const capacityPercentage = (location.currentCount / location.capacity) * 100;
  const crowdStyle = crowdColors[location.crowdLevel];
  
  // Get today's data for the chart
  const todayData = historicalData
    .filter(d => d.day === 'Monday') // Using Monday as "today"
    .map(d => ({
      hour: `${d.hour}:00`,
      hourNum: d.hour,
      count: d.count
    }));

  const days = ['Today', 'Yesterday', 'This Week'];

  useEffect(() => {
    // Trigger sparkle animation on mount
    setSparkleAnimation(true);
    const timer = setTimeout(() => setSparkleAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={getLocationImage(location)}
          alt={location.name}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="glass border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </motion.div>
        
        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 right-4"
        >
          <div className="flex items-center gap-1 px-3 py-1 glass rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-white font-medium">LIVE DATA</span>
          </div>
        </motion.div>
        
        {/* Header Content */}
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-end justify-between"
          >
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{location.name}</h1>
              <p className="text-sm text-gray-200 opacity-90">{location.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-[var(--asu-gold)]" />
                <span className="text-sm text-gray-300">Tempe Campus</span>
              </div>
            </div>
            
            <motion.div
              animate={{ scale: sparkleAnimation ? [1, 1.2, 1] : 1 }}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center glass
                border-2 ${crowdStyle.border}
                bg-gradient-to-br ${crowdStyle.bg}
              `}
              style={{ boxShadow: crowdStyle.glow }}
            >
              <div className="text-center">
                <div className={`text-xl font-bold ${crowdStyle.text}`}>
                  {Math.round(capacityPercentage)}%
                </div>
                <div className="text-xs text-gray-300">Full</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full space-y-4">
        {/* Real-time Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`
            glass border ${crowdStyle.border} 
            bg-gradient-to-br ${crowdStyle.bg}
            hover:shadow-2xl transition-all duration-500
          `}
          style={{ boxShadow: crowdStyle.glow }}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--asu-gold)]" />
                  <span className="font-medium text-white">Real-time Status</span>
                </div>
                <Badge 
                  className={`
                    ${crowdStyle.bg} ${crowdStyle.border} ${crowdStyle.text} 
                    backdrop-blur-sm border animate-pulse
                  `}
                >
                  {location.crowdLevel.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{location.currentCount}</div>
                  <div className="text-sm text-gray-400">People Inside</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{location.capacity}</div>
                  <div className="text-sm text-gray-400">Max Capacity</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Occupancy Level</span>
                  <span>{Math.round(capacityPercentage)}%</span>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-3 rounded-full transition-all duration-500"
                      style={{ backgroundColor: crowdStyle.fill }}
                    />
                  </div>
                  {capacityPercentage > 90 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 right-0"
                    >
                      <Sparkles className="w-4 h-4 text-red-400 animate-sparkle" />
                    </motion.div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Updated 2 minutes ago</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <Zap className="w-3 h-3" />
                  <span>Live WiFi Data</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Crowd Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass border border-gray-700/50 bg-gray-800/30">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[var(--asu-gold)]" />
                  <span className="font-medium text-white">Crowd Trends</span>
                </div>
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="text-sm glass border border-gray-600 rounded px-2 py-1 text-white bg-gray-800/50"
                >
                  {days.map((day) => (
                    <option key={day} value={day} className="bg-gray-800">{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={todayData}>
                    <defs>
                      <linearGradient id="crowdGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={crowdStyle.fill} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={crowdStyle.fill} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 12, fill: '#9CA3AF' }}
                      tickFormatter={(value) => value.split(':')[0]}
                      stroke="#6B7280"
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#9CA3AF' }} 
                      stroke="#6B7280"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: number) => [`${value} people`, 'Count']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area
                      type="monotone" 
                      dataKey="count" 
                      stroke={crowdStyle.fill}
                      strokeWidth={3}
                      fill="url(#crowdGradient)"
                      dot={{ fill: crowdStyle.fill, strokeWidth: 2, r: 4 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Target className="w-4 h-4 text-[var(--asu-gold)]" />
                  <span>Peak hours: 2PM - 4PM • Quietest: 7AM - 9AM</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Vouch Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={() => setShowVouchingModal(true)}
            className="w-full bg-gradient-to-r from-[var(--asu-gold)] to-[var(--asu-gold)]/80 hover:from-[var(--asu-gold)]/90 hover:to-[var(--asu-gold)]/70 text-[var(--asu-maroon)] border-0 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            style={{ boxShadow: '0 8px 32px rgba(255, 198, 39, 0.3)' }}
          >
            <motion.div
              animate={{ rotate: sparkleAnimation ? [0, 360] : 0 }}
              transition={{ duration: 0.5 }}
              className="mr-2"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
            Vouch Current Crowd Level
            <Zap className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>

        {/* Student Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass border border-gray-700/50 bg-gray-800/30">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-[var(--asu-gold)]" />
                <span className="font-medium text-white">Student Reports</span>
                <Badge className="bg-[var(--asu-maroon)]/20 text-[var(--asu-maroon)] border border-[var(--asu-maroon)]/30">
                  {locationVouches.length} Recent
                </Badge>
              </div>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {locationVouches.map((vouch, index) => (
                    <motion.div
                      key={vouch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-4 border-[var(--asu-gold)] pl-4 py-3 bg-gray-800/50 rounded-r-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge 
                          className={`
                            ${crowdColors[vouch.crowdLevel].bg} 
                            ${crowdColors[vouch.crowdLevel].border} 
                            ${crowdColors[vouch.crowdLevel].text} 
                            border text-xs
                          `}
                        >
                          {vouch.crowdLevel.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {Math.floor((Date.now() - vouch.timestamp.getTime()) / (1000 * 60))}m ago
                        </span>
                      </div>
                      {vouch.comment && (
                        <p className="text-sm text-gray-300 mb-2 italic">"{vouch.comment}"</p>
                      )}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{vouch.helpful} helpful</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[var(--asu-gold)]">
                          <Star className="w-3 h-3" />
                          <span>Verified Student</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {locationVouches.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 text-gray-500"
                  >
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm">No recent reports</p>
                    <p className="text-xs">Be the first to vouch for this location!</p>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Location Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass border border-gray-700/50 bg-gray-800/30">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[var(--asu-gold)]" />
                <span className="font-medium text-white">Location Details</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-white capitalize">{location.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white">{location.capacity} people</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Campus</span>
                    <span className="text-white">Tempe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Zone</span>
                    <span className="text-white">Academic Core</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <AnimatePresence>
        {showVouchingModal && (
          <EnhancedVouchingModal
            location={location}
            onClose={() => setShowVouchingModal(false)}
            onSubmit={(data) => {
              console.log('Vouch submitted:', data);
              setShowVouchingModal(false);
              setSparkleAnimation(true);
              setTimeout(() => setSparkleAnimation(false), 2000);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}