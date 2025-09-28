import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { locations } from '../data/mockData';
import { CampusMap } from './CampusMap';
import { EnhancedLocationCard } from './EnhancedLocationCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Search, 
  MapPin, 
  List, 
  Filter, 
  Zap, 
  TrendingUp,
  Users,
  Clock,
  Sparkles
} from 'lucide-react';

interface EnhancedDashboardProps {
  onLocationSelect: (locationId: string) => void;
}

export function EnhancedDashboard({ onLocationSelect }: EnhancedDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterLevel, setFilterLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour < 12) setTimeOfDay('Morning');
      else if (hour < 17) setTimeOfDay('Afternoon');
      else setTimeOfDay('Evening');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || location.crowdLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const crowdStats = {
    low: locations.filter(l => l.crowdLevel === 'low').length,
    medium: locations.filter(l => l.crowdLevel === 'medium').length,
    high: locations.filter(l => l.crowdLevel === 'high').length,
    total: locations.length
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--asu-maroon)] via-[var(--asu-dark)] to-[var(--asu-maroon)] opacity-90" />
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-[var(--asu-gold)]/10 via-transparent to-[var(--asu-gold)]/5" />
        
        <div className="relative px-4 py-6 text-white">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="w-12 h-12 bg-[var(--asu-gold)] rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--asu-maroon)]" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Crowd@ASU</h1>
                <p className="text-sm opacity-90">Smart Campus Navigation</p>
              </div>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm opacity-80"
            >
              Good {timeOfDay}! Find the perfect spot on campus with real-time crowd data.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search and Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-4 py-4"
      >
        <div className="max-w-md mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search campus locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass border-gray-600/50 text-white placeholder-gray-400 focus:border-[var(--asu-gold)] transition-all duration-300"
            />
            {searchTerm && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <button
                  onClick={() => setSearchTerm('')}
                  className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white hover:bg-gray-500 transition-colors"
                >
                  ×
                </button>
              </motion.div>
            )}
          </div>
          
          {/* View Mode and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={`
                  transition-all duration-300 hover-lift
                  ${viewMode === 'map' 
                    ? 'bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 shadow-lg' 
                    : 'glass border-gray-600/50 text-gray-300 hover:border-[var(--asu-gold)]'
                  }
                `}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Map
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`
                  transition-all duration-300 hover-lift
                  ${viewMode === 'list' 
                    ? 'bg-[var(--asu-maroon)] hover:bg-[var(--asu-maroon)]/90 shadow-lg' 
                    : 'glass border-gray-600/50 text-gray-300 hover:border-[var(--asu-gold)]'
                  }
                `}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
            </div>
            
            <div className="flex gap-1">
              {['all', 'low', 'medium', 'high'].map((level) => (
                <Badge
                  key={level}
                  variant={filterLevel === level ? 'default' : 'outline'}
                  className={`
                    cursor-pointer text-xs transition-all duration-300 hover-lift
                    ${filterLevel === level 
                      ? 'bg-[var(--asu-gold)] text-[var(--asu-maroon)] shadow-md' 
                      : 'glass border-gray-600/50 text-gray-300 hover:border-[var(--asu-gold)]'
                    }
                  `}
                  onClick={() => setFilterLevel(level as any)}
                >
                  {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Live Stats Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 px-4 py-3 border-b border-gray-700/30"
      >
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-3 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass rounded-lg p-2 border border-green-500/30"
            >
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                <span className="text-xs text-green-400">Low</span>
              </div>
              <p className="text-sm font-bold text-white">{crowdStats.low}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass rounded-lg p-2 border border-yellow-500/30"
            >
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse" />
                <span className="text-xs text-yellow-400">Medium</span>
              </div>
              <p className="text-sm font-bold text-white">{crowdStats.medium}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass rounded-lg p-2 border border-red-500/30"
            >
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse" />
                <span className="text-xs text-red-400">High</span>
              </div>
              <p className="text-sm font-bold text-white">{crowdStats.high}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="glass rounded-lg p-2 border border-[var(--asu-gold)]/30"
            >
              <div className="flex items-center justify-center mb-1">
                <Zap className="w-3 h-3 text-[var(--asu-gold)] mr-1" />
                <span className="text-xs text-[var(--asu-gold)]">Live</span>
              </div>
              <p className="text-sm font-bold text-white">{crowdStats.total}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CampusMap onLocationSelect={onLocationSelect} />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-auto p-4"
            >
              <div className="max-w-md mx-auto">
                <div className="grid gap-4">
                  {filteredLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <EnhancedLocationCard
                        location={location}
                        onClick={() => onLocationSelect(location.id)}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {filteredLocations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No locations found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}