import React, { useState, useEffect } from 'react';
import { UserActivity, User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Zap, Target, Award, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const achievements = [
  { id: 'first_resolution', name: 'First Resolver', icon: '🎯', description: 'Resolved your first missing document', points: 10 },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Resolved 5 documents in one day', points: 50 },
  { id: 'validation_master', name: 'Validation Master', icon: '✅', description: 'Validated 50 patients', points: 100 },
  { id: 'perfect_week', name: 'Perfect Week', icon: '⭐', description: 'Achieved 100% billability for a week', points: 200 },
  { id: 'team_player', name: 'Team Player', icon: '🤝', description: 'Helped resolve 100+ missing documents', points: 300 },
  { id: 'efficiency_expert', name: 'Efficiency Expert', icon: '🚀', description: 'Maintained 95%+ resolution rate', points: 500 }
];

export default function GamificationLayer() {
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    level: 1,
    rank: 0,
    achievements: [],
    weeklyProgress: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Load user activities
      const activities = await UserActivity.filter({ user_email: user.email });
      
      // Calculate user stats
      const totalPoints = activities.reduce((sum, activity) => sum + activity.points_earned, 0);
      const level = Math.floor(totalPoints / 100) + 1;
      const weeklyProgress = (totalPoints % 100);
      
      // Get unique achievements
      const userAchievements = [...new Set(activities
        .filter(a => a.achievement_unlocked)
        .map(a => a.achievement_unlocked))];
      
      setUserStats({
        totalPoints,
        level,
        achievements: userAchievements,
        weeklyProgress,
        rank: 0 // Will be calculated from leaderboard
      });

      // Generate leaderboard (in a real app, this would be a proper query)
      const allActivities = await UserActivity.list('-points_earned');
      const leaderboardData = {};
      
      for (const activity of allActivities) {
        if (!leaderboardData[activity.user_email]) {
          leaderboardData[activity.user_email] = {
            email: activity.user_email,
            totalPoints: 0,
            achievements: 0
          };
        }
        leaderboardData[activity.user_email].totalPoints += activity.points_earned;
        if (activity.achievement_unlocked) {
          leaderboardData[activity.user_email].achievements++;
        }
      }
      
      const sortedLeaderboard = Object.values(leaderboardData)
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10);
      
      setLeaderboard(sortedLeaderboard);
      
      // Update user rank
      const userRank = sortedLeaderboard.findIndex(entry => entry.email === user.email) + 1;
      setUserStats(prev => ({ ...prev, rank: userRank }));
      
    } catch (error) {
      console.error('Error loading gamification data:', error);
    }
    setLoading(false);
  };

  const getAchievementInfo = (achievementId) => {
    return achievements.find(a => a.id === achievementId);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm font-medium">Total Points</span>
          </div>
          <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Level</span>
          </div>
          <div className="text-2xl font-bold">{userStats.level}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Rank</span>
          </div>
          <div className="text-2xl font-bold">{getRankIcon(userStats.rank)}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">Achievements</span>
          </div>
          <div className="text-2xl font-bold">{userStats.achievements.length}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress & Achievements */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Progress & Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Level Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Level {userStats.level} Progress
                </span>
                <span className="text-sm text-gray-500">
                  {userStats.weeklyProgress}/100 XP
                </span>
              </div>
              <Progress value={userStats.weeklyProgress} className="h-3" />
              <p className="text-xs text-gray-500 mt-1">
                {100 - userStats.weeklyProgress} XP to next level
              </p>
            </div>

            {/* Achievements */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Achievements</h4>
              <div className="space-y-3">
                {userStats.achievements.length > 0 ? (
                  userStats.achievements.slice(0, 3).map(achievementId => {
                    const achievement = getAchievementInfo(achievementId);
                    return achievement ? (
                      <motion.div
                        key={achievementId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h5 className="font-medium text-yellow-800">{achievement.name}</h5>
                          <p className="text-xs text-yellow-600">{achievement.description}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          +{achievement.points} XP
                        </Badge>
                      </motion.div>
                    ) : null;
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No achievements yet</p>
                    <p className="text-xs">Complete tasks to unlock achievements!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Available Achievements */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Available Achievements</h4>
              <div className="grid grid-cols-2 gap-2">
                {achievements
                  .filter(a => !userStats.achievements.includes(a.id))
                  .slice(0, 4)
                  .map(achievement => (
                    <div
                      key={achievement.id}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-center"
                    >
                      <div className="text-lg mb-1">{achievement.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{achievement.name}</div>
                      <div className="text-xs text-gray-500">+{achievement.points} XP</div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-green-50">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              Leaderboard
            </CardTitle>
            <p className="text-sm text-gray-600">Top performers this month</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.email}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    entry.email === currentUser?.email
                      ? 'bg-blue-50 border-2 border-blue-200 scale-105'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {entry.email === currentUser?.email ? 'You' : entry.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.achievements} achievements
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {entry.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {userStats.rank > 10 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                      #{userStats.rank}
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">Your Rank</div>
                      <div className="text-xs text-blue-700">Keep going!</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-900">
                      {userStats.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-700">points</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}