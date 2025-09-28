import { useState } from 'react';
import { locations } from '../data/mockData';
import { LocationCard } from './LocationCard';
import { LocationDetails } from './LocationDetails';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, MapPin, List, Filter } from 'lucide-react';
import { Badge } from './ui/badge';

interface DashboardProps {
  onLocationSelect: (locationId: string) => void;
}

export function Dashboard({ onLocationSelect }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filterLevel, setFilterLevel] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLevel === 'all' || location.crowdLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8C1D40] to-[#FFC627] px-4 py-6 text-white">
        <div className="max-w-md mx-auto">
          <h1 className="mb-2">ASU Campus Crowds</h1>
          <p className="text-sm opacity-90">Find the perfect spot to study, eat, or workout</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="bg-[#8C1D40] hover:bg-[#8C1D40]/90"
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="bg-[#8C1D40] hover:bg-[#8C1D40]/90"
              >
                <MapPin className="w-4 h-4 mr-1" />
                Map
              </Button>
            </div>
            
            <div className="flex gap-1">
              {['all', 'low', 'medium', 'high'].map((level) => (
                <Badge
                  key={level}
                  variant={filterLevel === level ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs ${
                    filterLevel === level 
                      ? 'bg-[#8C1D40] hover:bg-[#8C1D40]/90' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setFilterLevel(level as any)}
                >
                  {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-sm">Low</span>
              </div>
              <p className="text-xs text-gray-600">
                {locations.filter(l => l.crowdLevel === 'low').length} spots
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                <span className="text-sm">Medium</span>
              </div>
              <p className="text-xs text-gray-600">
                {locations.filter(l => l.crowdLevel === 'medium').length} spots
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                <span className="text-sm">High</span>
              </div>
              <p className="text-xs text-gray-600">
                {locations.filter(l => l.crowdLevel === 'high').length} spots
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' ? (
          <div className="p-4 max-w-md mx-auto">
            <div className="space-y-4">
              {filteredLocations.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onClick={() => onLocationSelect(location.id)}
                />
              ))}
            </div>
            
            {filteredLocations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No locations found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Map view coming soon!</p>
              <p className="text-sm">Interactive campus map with live crowd data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}