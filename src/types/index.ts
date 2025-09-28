export interface Location {
  id: string;
  name: string;
  type: 'library' | 'dining' | 'gym' | 'study' | 'other';
  crowdLevel: 'low' | 'medium' | 'high';
  currentCount: number;
  capacity: number;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface HistoricalData {
  hour: number;
  count: number;
  day: string;
}

export interface VouchData {
  id: string;
  locationId: string;
  userId: string;
  crowdLevel: 'low' | 'medium' | 'high';
  comment?: string;
  timestamp: Date;
  helpful: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  vouchCount: number;
  helpfulVouches: number;
  badges: Badge[];
  joinDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}