import { currentUser, badges } from '../data/mockData';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  Trophy, 
  Calendar,
  TrendingUp,
  Star,
  Target,
  MapPin
} from 'lucide-react';

export function Profile() {
  const earnedBadges = badges.filter(b => b.earned);
  const availableBadges = badges.filter(b => !b.earned);
  
  const nextLevelVouches = 50;
  const progressToNext = (currentUser.vouchCount / nextLevelVouches) * 100;
  
  const stats = [
    {
      icon: MessageSquare,
      label: 'Total Vouches',
      value: currentUser.vouchCount,
      color: 'text-[#8C1D40]'
    },
    {
      icon: ThumbsUp,
      label: 'Helpful Votes',
      value: currentUser.helpfulVouches,
      color: 'text-green-600'
    },
    {
      icon: Trophy,
      label: 'Badges Earned',
      value: earnedBadges.length,
      color: 'text-[#FFC627]'
    },
    {
      icon: TrendingUp,
      label: 'Accuracy Rate',
      value: '94%',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8C1D40] to-[#FFC627] px-4 py-6 text-white">
        <div className="max-w-md mx-auto text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white">
            <AvatarFallback className="bg-white text-[#8C1D40] text-2xl">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl mb-1">{currentUser.name}</h1>
          <p className="text-sm opacity-90">{currentUser.email}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Joined {currentUser.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="p-3 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Level Progress */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-[#8C1D40]" />
            <span>Level Progress</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Current Level: <strong>Campus Contributor</strong></span>
              <span>{currentUser.vouchCount}/{nextLevelVouches}</span>
            </div>
            
            <Progress value={progressToNext} className="h-3" />
            
            <p className="text-xs text-muted-foreground text-center">
              {nextLevelVouches - currentUser.vouchCount} more vouches to reach <strong>Campus Guardian</strong>
            </p>
          </div>
        </Card>

        {/* Earned Badges */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-[#FFC627]" />
            <span>Earned Badges</span>
            <Badge className="bg-[#FFC627] text-black ml-auto">
              {earnedBadges.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <div 
                key={badge.id}
                className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3 text-center"
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                {badge.earnedDate && (
                  <p className="text-xs text-yellow-600 mt-1">
                    {badge.earnedDate.toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Available Badges */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-gray-400" />
            <span>Badges to Earn</span>
          </div>
          
          <div className="space-y-3">
            {availableBadges.map((badge) => (
              <div 
                key={badge.id}
                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="text-2xl opacity-50">{badge.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#8C1D40]" />
            <span>Recent Activity</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Vouched at Hayden Library</span>
              <span className="text-xs text-muted-foreground ml-auto">2h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-muted-foreground">Vouched at Memorial Union</span>
              <span className="text-xs text-muted-foreground ml-auto">1d ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Earned "Campus Explorer" badge</span>
              <span className="text-xs text-muted-foreground ml-auto">3d ago</span>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-4 bg-gradient-to-r from-[#8C1D40]/5 to-[#FFC627]/5 border-[#8C1D40]/20">
          <div className="text-center">
            <h3 className="font-medium mb-2 text-[#8C1D40]">💡 Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Vouch consistently during peak hours to help fellow Sun Devils find the best spots and earn more badges!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}