import { Location, HistoricalData, VouchData, User, Badge } from '../types';

export const locations: Location[] = [
  {
    id: '1',
    name: 'Hayden Library',
    type: 'library',
    crowdLevel: 'high',
    currentCount: 847,
    capacity: 1200,
    description: 'Main campus library with study spaces and research materials',
    image: 'library interior study',
    coordinates: { lat: 33.4255, lng: -111.9400 }
  },
  {
    id: '2',
    name: 'Memorial Union Dining',
    type: 'dining',
    crowdLevel: 'medium',
    currentCount: 324,
    capacity: 500,
    description: 'Central dining hall with multiple food options',
    image: 'modern cafeteria dining',
    coordinates: { lat: 33.4242, lng: -111.9410 }
  },
  {
    id: '3',
    name: 'Sun Devil Fitness Complex',
    type: 'gym',
    crowdLevel: 'low',
    currentCount: 89,
    capacity: 400,
    description: 'State-of-the-art fitness center with cardio and weight equipment',
    image: 'modern gym fitness center',
    coordinates: { lat: 33.4268, lng: -111.9425 }
  },
  {
    id: '4',
    name: 'Noble Library Study Rooms',
    type: 'study',
    crowdLevel: 'medium',
    currentCount: 67,
    capacity: 120,
    description: 'Quiet study rooms and collaborative spaces',
    image: 'library study room modern',
    coordinates: { lat: 33.4240, lng: -111.9380 }
  },
  {
    id: '5',
    name: 'Tempe Student Union',
    type: 'other',
    crowdLevel: 'low',
    currentCount: 156,
    capacity: 800,
    description: 'Student activities center with lounges and meeting spaces',
    image: 'student union lounge modern',
    coordinates: { lat: 33.4220, lng: -111.9395 }
  }
];

export const generateHistoricalData = (locationId: string): HistoricalData[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const data: HistoricalData[] = [];
  
  days.forEach(day => {
    for (let hour = 7; hour <= 22; hour++) {
      let baseCount = 0;
      const location = locations.find(l => l.id === locationId);
      
      // Different patterns for different location types
      if (location?.type === 'library') {
        baseCount = hour < 12 ? 200 + hour * 30 : 
                   hour < 18 ? 500 + (hour - 12) * 40 :
                   600 - (hour - 18) * 50;
      } else if (location?.type === 'dining') {
        baseCount = hour === 12 || hour === 13 ? 400 + Math.random() * 100 :
                   hour === 18 || hour === 19 ? 350 + Math.random() * 100 :
                   100 + Math.random() * 150;
      } else if (location?.type === 'gym') {
        baseCount = hour >= 16 && hour <= 20 ? 200 + Math.random() * 150 :
                   hour >= 7 && hour <= 10 ? 150 + Math.random() * 100 :
                   50 + Math.random() * 80;
      } else {
        baseCount = 100 + Math.random() * 200;
      }
      
      // Weekend modifier
      if (day === 'Saturday' || day === 'Sunday') {
        baseCount *= 0.6;
      }
      
      data.push({
        hour,
        count: Math.round(baseCount),
        day
      });
    }
  });
  
  return data;
};

export const mockVouches: VouchData[] = [
  {
    id: '1',
    locationId: '1',
    userId: 'user1',
    crowdLevel: 'high',
    comment: 'Packed! No seats available on the main floor.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    helpful: 12
  },
  {
    id: '2',
    locationId: '1',
    userId: 'user2',
    crowdLevel: 'high',
    comment: 'Try the upper floors for quieter spots.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    helpful: 8
  },
  {
    id: '3',
    locationId: '2',
    userId: 'user3',
    crowdLevel: 'medium',
    comment: 'Short lines, good selection available.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    helpful: 5
  }
];

export const badges: Badge[] = [
  {
    id: '1',
    name: 'First Vouch',
    description: 'Made your first crowd report',
    icon: '🎯',
    earned: true,
    earnedDate: new Date('2024-08-15')
  },
  {
    id: '2',
    name: 'Helpful Scout',
    description: 'Received 10+ helpful votes',
    icon: '⭐',
    earned: true,
    earnedDate: new Date('2024-09-01')
  },
  {
    id: '3',
    name: 'Campus Explorer',
    description: 'Vouched at 5+ different locations',
    icon: '🗺️',
    earned: true,
    earnedDate: new Date('2024-09-10')
  },
  {
    id: '4',
    name: 'Consistency King',
    description: 'Vouch daily for a week',
    icon: '👑',
    earned: false
  },
  {
    id: '5',
    name: 'Night Owl',
    description: 'Vouch after 9 PM',
    icon: '🦉',
    earned: false
  }
];

export const currentUser: User = {
  id: 'user1',
  name: 'Sarah Martinez',
  email: 'smartinez@asu.edu',
  vouchCount: 47,
  helpfulVouches: 23,
  badges: badges,
  joinDate: new Date('2024-08-01')
};