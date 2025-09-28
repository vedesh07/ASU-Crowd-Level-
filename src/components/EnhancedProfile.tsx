import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { currentUser, badges } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { 
  User, 
  MessageSquare, 
  ThumbsUp, 
  Trophy, 
  Calendar,
  TrendingUp,
  Star,
  Target,
  MapPin,
  Zap,
  Crown,
  Sparkles,
  Award,
  Activity,
  Users,
  LogOut
} from 'lucide-react';

export function EnhancedProfile() {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'badges' | 'activity'>('overview');
  const [sparkleAnimation, setSparkleAnimation] = useState(false);
  
  const earnedBadges = badges.filter(b => b.earned);
  const availableBadges = badges.filter(b => !b.earned);
  
  const nextLevelVouches = 50;
  const progressToNext = (currentUser.vouchCount / nextLevelVouches) * 100;
  
  const stats = [
    {
      icon: MessageSquare,
      label: 'Total Vouches',
      value: currentUser.vouchCount,
      color: 'text-[var(--asu-maroon)]',
      gradient: 'from-[var(--asu-maroon)]/20 to-[var(--asu-maroon)]/5'
    },
    {
      icon: ThumbsUp,
      label: 'Helpful Votes',
      value: currentUser.helpfulVouches,
      color: 'text-emerald-400',
      gradient: 'from-emerald-500/20 to-emerald-500/5'
    },
    {
      icon: Trophy,
      label: 'Badges Earned',
      value: earnedBadges.length,
      color: 'text-[var(--asu-gold)]',
      gradient: 'from-[var(--asu-gold)]/20 to-[var(--asu-gold)]/5'
    },
    {
      icon: Target,
      label: 'Accuracy Rate',
      value: '94%',
      color: 'text-blue-400',
      gradient: 'from-blue-500/20 to-blue-500/5'
    }
  ];

  const recentActivity = [
    { icon: MessageSquare, label: 'Vouched at Hayden Library', time: '2h ago', color: 'text-emerald-400' },
    { icon: ThumbsUp, label: 'Received 5 helpful votes', time: '4h ago', color: 'text-blue-400' },
    { icon: Trophy, label: 'Earned "Campus Explorer" badge', time: '1d ago', color: 'text-[var(--asu-gold)]' },
    { icon: MessageSquare, label: 'Vouched at Memorial Union', time: '2d ago', color: 'text-amber-400' },
    { icon: Star, label: 'Reached 40 total vouches', time: '3d ago', color: 'text-purple-400' }
  ];

  useEffect(() => {
    setSparkleAnimation(true);
    const timer = setTimeout(() => setSparkleAnimation(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--asu-maroon)] via-[var(--asu-dark)] to-[var(--asu-maroon)]" />
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-[var(--asu-gold)]/10 via-transparent to-[var(--asu-gold)]/5" />
        
        <div className="relative px-4 py-8 text-white">
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative mb-4"
            >
              <Avatar className="w-24 h-24 mx-auto border-4 border-[var(--asu-gold)] shadow-2xl">
                <AvatarFallback className="bg-[var(--asu-gold)] text-[var(--asu-maroon)] text-2xl font-bold">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'AS'}
                </AvatarFallback>
              </Avatar>
              
              {/* Level Crown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-2 -right-2"
              >
                <div className="w-8 h-8 bg-[var(--asu-gold)] rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-4 h-4 text-[var(--asu-maroon)]" />
                </div>
              </motion.div>
              
              {sparkleAnimation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -left-1"
                >
                  <Sparkles className="w-6 h-6 text-[var(--asu-gold)] animate-sparkle" />
                </motion.div>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-xl font-bold mb-1">{user ? `${user.firstName} ${user.lastName}` : 'ASU Student'}</h1>
              <p className="text-sm opacity-90 mb-2">{user?.email || currentUser.email}</p>
              
              <Badge className="bg-[var(--asu-gold)]/20 text-[var(--asu-gold)] border border-[var(--asu-gold)]/30 mb-3">
                Campus Contributor Level 3
              </Badge>
              
              <div className="flex items-center justify-center gap-2 text-sm mb-4">
                <Calendar className="w-4 h-4" />
                <span>Joined {currentUser.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 border-b border-gray-700/50 px-4 py-3"
      >
        <div className="max-w-md mx-auto">
          <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'badges', label: 'Badges', icon: Trophy },
              { id: 'activity', label: 'Activity', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedTab === id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTab(id as any)}
                className={`
                  flex-1 transition-all duration-300
                  ${selectedTab === id 
                    ? 'bg-[var(--asu-maroon)] text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-auto p-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <Card className={`
                      p-4 text-center glass border-gray-700/50 
                      bg-gradient-to-br ${stat.gradient}
                      hover:shadow-xl transition-all duration-300
                    `}>
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Level Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="glass border-gray-700/50 bg-gray-800/30">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-[var(--asu-gold)]" />
                      <span className="font-medium text-white">Level Progress</span>
                      <Badge className="bg-[var(--asu-gold)]/20 text-[var(--asu-gold)] border border-[var(--asu-gold)]/30 ml-auto">
                        Level 3
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Campus Contributor → <strong className="text-[var(--asu-gold)]">Campus Guardian</strong></span>
                        <span>{currentUser.vouchCount}/{nextLevelVouches}</span>
                      </div>
                      
                      <div className="relative">
                        <Progress value={progressToNext} className="h-3" />
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.8 }}
                          className="absolute -top-1 right-0"
                        >
                          <Sparkles className="w-4 h-4 text-[var(--asu-gold)]" />
                        </motion.div>
                      </div>
                      
                      <p className="text-xs text-gray-400 text-center">
                        {nextLevelVouches - currentUser.vouchCount} more vouches to unlock exclusive rewards! 🎯
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="glass border-gray-700/50 bg-gradient-to-r from-[var(--asu-maroon)]/10 to-[var(--asu-gold)]/5">
                  <div className="p-4">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-[var(--asu-gold)]" />
                      This Week's Impact
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">12</div>
                        <div className="text-xs text-gray-400">Vouches</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">89</div>
                        <div className="text-xs text-gray-400">Students Helped</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">4.8</div>
                        <div className="text-xs text-gray-400">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {selectedTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Earned Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass border-gray-700/50 bg-gray-800/30">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-[var(--asu-gold)]" />
                      <span className="font-medium text-white">Earned Badges</span>
                      <Badge className="bg-[var(--asu-gold)]/20 text-[var(--asu-gold)] border border-[var(--asu-gold)]/30 ml-auto">
                        {earnedBadges.length}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {earnedBadges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          className="glass rounded-lg p-3 text-center border border-[var(--asu-gold)]/30 bg-gradient-to-br from-[var(--asu-gold)]/20 to-[var(--asu-gold)]/5"
                        >
                          <div className="text-2xl mb-2">{badge.icon}</div>
                          <p className="text-xs font-medium text-[var(--asu-gold)] mb-1">{badge.name}</p>
                          <p className="text-xs text-gray-400 leading-tight">{badge.description}</p>
                          {badge.earnedDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              {badge.earnedDate.toLocaleDateString()}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Available Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-gray-700/50 bg-gray-800/30">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-white">Badges to Earn</span>
                    </div>
                    
                    <div className="space-y-3">
                      {availableBadges.map((badge, index) => (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-3 glass rounded-lg border border-gray-700/50 bg-gray-800/50"
                        >
                          <div className="text-2xl opacity-50">{badge.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-300">{badge.name}</p>
                            <p className="text-xs text-gray-500">{badge.description}</p>
                          </div>
                          <div className="w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-600 rounded-full opacity-50" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}

          {selectedTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass border-gray-700/50 bg-gray-800/30">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-[var(--asu-gold)]" />
                      <span className="font-medium text-white">Recent Activity</span>
                    </div>
                    
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center glass border border-gray-600/50`}>
                            <activity.icon className={`w-4 h-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-300">{activity.label}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Achievement Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass border-gray-700/50 bg-gray-800/30">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-5 h-5 text-[var(--asu-gold)]" />
                      <span className="font-medium text-white">Achievement Timeline</span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-[var(--asu-gold)] rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Earned "Campus Explorer" Badge</p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Reached 40 Total Vouches</p>
                          <p className="text-xs text-gray-400">1 week ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-white">Joined Crowd@ASU</p>
                          <p className="text-xs text-gray-400">2 months ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Motivational Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <Card className="glass border border-[var(--asu-gold)]/30 bg-gradient-to-r from-[var(--asu-maroon)]/10 to-[var(--asu-gold)]/5">
            <div className="p-4 text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-12 h-12 mx-auto mb-3 bg-[var(--asu-gold)] rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-[var(--asu-maroon)]" />
              </motion.div>
              <h3 className="font-medium mb-2 text-[var(--asu-gold)]">Keep Going, Sun Devil! 🔱</h3>
              <p className="text-sm text-gray-300">
                Your contributions make ASU a better place for everyone. Every vouch helps fellow students navigate campus efficiently!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}