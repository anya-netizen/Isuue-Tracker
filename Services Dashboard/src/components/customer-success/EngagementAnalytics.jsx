import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  MousePointer,
  LogIn,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EngagementAnalytics({ customerHealth, selectedPG, patients, documents, timeRange }) {
  const pgPatients = patients?.filter(p => p.current_pg === selectedPG?.name) || [];
  const pgDocuments = documents?.filter(d => 
    pgPatients.some(p => p.id === d.patient_id)
  ) || [];

  const engagementMetrics = {
    activeUsers: Math.floor(pgPatients.length * 0.75),
    totalUsers: pgPatients.length,
    avgSessionDuration: '8.5',
    weeklyLogins: Math.floor(pgPatients.length * 2.3),
    documentsProcessed: customerHealth.recentDocuments,
    featuresUsed: 8,
    totalFeatures: 12,
    lastActivity: '2 hours ago'
  };

  const activityTimeline = [
    { time: '2 hours ago', action: 'Documents uploaded', user: 'Dr. Sarah Johnson', count: 5 },
    { time: '4 hours ago', action: 'Patient records reviewed', user: 'Admin Staff', count: 12 },
    { time: '6 hours ago', action: 'Reports generated', user: 'Dr. Michael Chen', count: 3 },
    { time: '8 hours ago', action: 'Claims submitted', user: 'Billing Team', count: 8 },
    { time: '1 day ago', action: 'Training session completed', user: 'Team', count: 1 }
  ];

  const featureAdoption = [
    { name: 'Patient Management', usage: 95, users: Math.floor(pgPatients.length * 0.95) },
    { name: 'Document Upload', usage: 88, users: Math.floor(pgPatients.length * 0.88) },
    { name: 'Billing Dashboard', usage: 72, users: Math.floor(pgPatients.length * 0.72) },
    { name: 'Reporting Tools', usage: 65, users: Math.floor(pgPatients.length * 0.65) },
    { name: 'Analytics', usage: 54, users: Math.floor(pgPatients.length * 0.54) },
    { name: 'Communication Hub', usage: 48, users: Math.floor(pgPatients.length * 0.48) }
  ];

  const getUsageColor = (usage) => {
    if (usage >= 80) return 'bg-green-500';
    if (usage >= 60) return 'bg-blue-500';
    if (usage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Engagement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {engagementMetrics.activeUsers}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              of {engagementMetrics.totalUsers} total users
            </div>
            <Progress value={(engagementMetrics.activeUsers / engagementMetrics.totalUsers) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {engagementMetrics.avgSessionDuration}m
            </div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +15% vs last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Weekly Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {engagementMetrics.weeklyLogins}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Average per user: {(engagementMetrics.weeklyLogins / engagementMetrics.totalUsers).toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {engagementMetrics.documentsProcessed}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              In {timeRange === '7d' ? 'last 7 days' : timeRange === '30d' ? 'last 30 days' : 'last 90 days'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Adoption */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-blue-600" />
            Feature Adoption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featureAdoption.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-900">{feature.name}</span>
                    <span className="text-xs text-slate-600 ml-2">({feature.users} users)</span>
                  </div>
                  <Badge variant="outline" className={feature.usage >= 80 ? 'border-green-600 text-green-600' : ''}>
                    {feature.usage}%
                  </Badge>
                </div>
                <div className="relative">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.usage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${getUsageColor(feature.usage)} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-blue-900">Overall Feature Adoption</div>
                <div className="text-xs text-blue-700 mt-1">
                  {engagementMetrics.featuresUsed} of {engagementMetrics.totalFeatures} features actively used
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((engagementMetrics.featuresUsed / engagementMetrics.totalFeatures) * 100)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityTimeline.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {activity.count}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900">{activity.action}</h4>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-slate-600">{activity.user}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View Full Activity Log →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900">Top Engagement Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">Daily patient reviews</span>
                <Badge className="bg-green-600">High Impact</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">Weekly billing cycles</span>
                <Badge className="bg-green-600">High Impact</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">Training programs</span>
                <Badge className="bg-blue-600">Medium Impact</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-orange-900">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-orange-800">Analytics adoption</span>
                <Badge variant="outline" className="border-orange-600 text-orange-600">Low</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-orange-800">Communication tools</span>
                <Badge variant="outline" className="border-orange-600 text-orange-600">Low</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-orange-800">Mobile app usage</span>
                <Badge variant="outline" className="border-red-600 text-red-600">Very Low</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

