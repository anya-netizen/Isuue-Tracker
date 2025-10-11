import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  CheckCircle,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Award,
  Video,
  Phone,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountTimeline({ selectedPG, patients, documents, timeRange }) {
  const timelineEvents = [
    {
      date: '2 hours ago',
      type: 'document',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      title: 'Documents Processed',
      description: '5 patient documents uploaded and processed successfully',
      importance: 'normal'
    },
    {
      date: '1 day ago',
      type: 'communication',
      icon: Phone,
      color: 'text-purple-600 bg-purple-50',
      title: 'Weekly Check-in Call',
      description: 'Discussed Q3 performance and upcoming training opportunities',
      importance: 'high'
    },
    {
      date: '3 days ago',
      type: 'milestone',
      icon: Award,
      color: 'text-green-600 bg-green-50',
      title: 'Billing Milestone Achieved',
      description: 'Reached 75% billability rate - highest to date',
      importance: 'high'
    },
    {
      date: '5 days ago',
      type: 'support',
      icon: MessageSquare,
      color: 'text-orange-600 bg-orange-50',
      title: 'Support Ticket Resolved',
      description: 'Document upload issue resolved within 2 hours',
      importance: 'normal'
    },
    {
      date: '1 week ago',
      type: 'training',
      icon: Video,
      color: 'text-indigo-600 bg-indigo-50',
      title: 'Training Session Completed',
      description: 'Advanced reporting features training with 90% score',
      importance: 'normal'
    },
    {
      date: '2 weeks ago',
      type: 'meeting',
      icon: Users,
      color: 'text-teal-600 bg-teal-50',
      title: 'Quarterly Business Review',
      description: 'Reviewed performance metrics and set Q4 goals',
      importance: 'high'
    },
    {
      date: '3 weeks ago',
      type: 'alert',
      icon: AlertCircle,
      color: 'text-red-600 bg-red-50',
      title: 'Processing Delay Alert',
      description: 'Identified and resolved patient processing bottleneck',
      importance: 'high'
    },
    {
      date: '1 month ago',
      type: 'achievement',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      title: 'Revenue Growth',
      description: '15% increase in monthly revenue compared to previous month',
      importance: 'high'
    },
    {
      date: '1.5 months ago',
      type: 'document',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      title: 'Batch Upload Completed',
      description: '50+ historical patient records uploaded',
      importance: 'normal'
    },
    {
      date: '2 months ago',
      type: 'milestone',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
      title: 'Onboarding Completed',
      description: 'Successfully completed all advanced training modules',
      importance: 'high'
    },
    {
      date: '2.5 months ago',
      type: 'communication',
      icon: Mail,
      color: 'text-purple-600 bg-purple-50',
      title: 'Welcome Email Sent',
      description: 'Introduction to dedicated Customer Success Manager',
      importance: 'normal'
    },
    {
      date: '3 months ago',
      type: 'milestone',
      icon: Award,
      color: 'text-green-600 bg-green-50',
      title: 'Account Activated',
      description: 'Successfully onboarded with initial configuration complete',
      importance: 'high'
    }
  ];

  const upcomingEvents = [
    {
      date: 'Tomorrow',
      title: 'Monthly Performance Review',
      description: 'Review billing metrics and optimization opportunities',
      type: 'meeting'
    },
    {
      date: 'In 3 days',
      title: 'Training: API Integration',
      description: 'Learn to integrate with external systems',
      type: 'training'
    },
    {
      date: 'Next week',
      title: 'Weekly Check-in Call',
      description: 'Regular touchpoint with Success Manager',
      type: 'communication'
    },
    {
      date: 'In 2 weeks',
      title: 'Product Update Webinar',
      description: 'Learn about new platform features',
      type: 'training'
    }
  ];

  const getImportanceBadge = (importance) => {
    if (importance === 'high') {
      return <Badge className="bg-red-600">Important</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Timeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{timelineEvents.length}</div>
            <div className="text-xs text-slate-600 mt-1">In account history</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {timelineEvents.filter(e => e.type === 'milestone').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">Achievements</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {timelineEvents.filter(e => e.type === 'communication' || e.type === 'meeting').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">Touchpoints</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Support Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {timelineEvents.filter(e => e.type === 'support' || e.type === 'alert').length}
            </div>
            <div className="text-xs text-slate-600 mt-1">All resolved</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 bg-white rounded-lg"
              >
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-900">{event.title}</h4>
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Account History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-4"
                >
                  {/* Icon */}
                  <div className={`z-10 w-12 h-12 rounded-full flex items-center justify-center ${event.color}`}>
                    <event.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{event.title}</h4>
                          {getImportanceBadge(event.importance)}
                        </div>
                        <p className="text-sm text-slate-600">{event.description}</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{event.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900">Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {timelineEvents
                .filter(e => e.type === 'milestone' || e.type === 'achievement')
                .slice(0, 3)
                .map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-green-900">{event.title}</div>
                      <div className="text-xs text-green-700">{event.date}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-purple-900">Recent Communications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {timelineEvents
                .filter(e => e.type === 'communication' || e.type === 'meeting')
                .slice(0, 3)
                .map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-purple-900">{event.title}</div>
                      <div className="text-xs text-purple-700">{event.date}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900">Training & Support</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {timelineEvents
                .filter(e => e.type === 'training' || e.type === 'support')
                .slice(0, 3)
                .map((event, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Video className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-900">{event.title}</div>
                      <div className="text-xs text-blue-700">{event.date}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

