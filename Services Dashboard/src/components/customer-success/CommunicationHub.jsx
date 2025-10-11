import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare,
  Phone,
  Mail,
  Video,
  Calendar,
  Send,
  Paperclip,
  User,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunicationHub({ selectedPG }) {
  const [newMessage, setNewMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState('messages');

  const communications = [
    {
      id: 1,
      type: 'call',
      subject: 'Weekly Check-in Call',
      date: '1 day ago',
      from: 'Sarah Johnson (CSM)',
      status: 'completed',
      summary: 'Discussed Q3 performance metrics and upcoming training opportunities. Action items: schedule training session, review billing optimization.'
    },
    {
      id: 2,
      type: 'email',
      subject: 'Monthly Performance Report',
      date: '3 days ago',
      from: 'Sarah Johnson (CSM)',
      status: 'read',
      summary: 'Your monthly performance report is ready. Key highlights: 75% billability rate, 15% revenue growth.'
    },
    {
      id: 3,
      type: 'message',
      subject: 'Quick question about billing',
      date: '5 days ago',
      from: 'You',
      status: 'replied',
      summary: 'Q: How do we handle CPT code 99490 for patients with multiple conditions? A: Great question! You can...'
    },
    {
      id: 4,
      type: 'meeting',
      subject: 'Quarterly Business Review',
      date: '2 weeks ago',
      from: 'Sarah Johnson (CSM)',
      status: 'completed',
      summary: 'Comprehensive review of Q2 performance. Set Q3 goals and identified growth opportunities.'
    },
    {
      id: 5,
      type: 'email',
      subject: 'New Feature Announcement',
      date: '3 weeks ago',
      from: 'Product Team',
      status: 'read',
      summary: 'Exciting new features are now available! Check out the enhanced reporting dashboard and mobile app updates.'
    }
  ];

  const upcomingMeetings = [
    {
      title: 'Monthly Performance Review',
      date: 'Tomorrow',
      time: '2:00 PM EST',
      duration: '30 min',
      attendees: ['You', 'Sarah Johnson'],
      type: 'video'
    },
    {
      title: 'Training: Advanced Analytics',
      date: 'In 3 days',
      time: '10:00 AM EST',
      duration: '1 hour',
      attendees: ['You', 'Training Team'],
      type: 'video'
    },
    {
      title: 'Weekly Check-in',
      date: 'Next week',
      time: '3:00 PM EST',
      duration: '30 min',
      attendees: ['You', 'Sarah Johnson'],
      type: 'phone'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Customer Success Manager',
      email: 'sarah.j@company.com',
      phone: '(555) 123-4567',
      available: true
    },
    {
      name: 'Mike Chen',
      role: 'Technical Support Lead',
      email: 'mike.c@company.com',
      phone: '(555) 234-5678',
      available: true
    },
    {
      name: 'Emma Davis',
      role: 'Training Specialist',
      email: 'emma.d@company.com',
      phone: '(555) 345-6789',
      available: false
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'call': return 'text-blue-600 bg-blue-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      case 'message': return 'text-green-600 bg-green-50';
      case 'meeting': return 'text-orange-600 bg-orange-50';
      case 'video': return 'text-orange-600 bg-orange-50';
      case 'phone': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-600">Completed</Badge>;
      case 'read': return <Badge variant="outline">Read</Badge>;
      case 'replied': return <Badge className="bg-blue-600">Replied</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Communication Channels */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeChannel === 'messages' ? 'default' : 'outline'}
          onClick={() => setActiveChannel('messages')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Messages
        </Button>
        <Button
          variant={activeChannel === 'meetings' ? 'default' : 'outline'}
          onClick={() => setActiveChannel('meetings')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Meetings
        </Button>
        <Button
          variant={activeChannel === 'team' ? 'default' : 'outline'}
          onClick={() => setActiveChannel('team')}
        >
          <User className="w-4 h-4 mr-2" />
          Your Team
        </Button>
      </div>

      {/* Quick Contact Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Your Customer Success Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                SJ
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Sarah Johnson</h4>
                <p className="text-sm text-slate-600">Customer Success Manager</p>
                <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    sarah.j@company.com
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    (555) 123-4567
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {activeChannel === 'messages' && (
        <>
          {/* New Message */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Send a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Subject" />
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                  <Button>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Communication History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.map((comm, index) => (
                  <motion.div
                    key={comm.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(comm.type)}`}>
                          {getTypeIcon(comm.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900">{comm.subject}</h4>
                            {getStatusBadge(comm.status)}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {comm.from}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {comm.date}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{comm.summary}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeChannel === 'meetings' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                Upcoming Meetings
              </CardTitle>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(meeting.type)}`}>
                        {getTypeIcon(meeting.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{meeting.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-slate-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {meeting.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meeting.time}
                          </span>
                          <Badge variant="outline">{meeting.duration}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {meeting.attendees.map((attendee, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button size="sm">
                      {meeting.type === 'video' ? 'Join Video' : 'Join Call'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeChannel === 'team' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Your Support Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {member.available && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{member.name}</h4>
                        <p className="text-sm text-slate-600">{member.role}</p>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2.3h</div>
            <div className="text-xs text-slate-600 mt-1">Average response</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">4.8/5</div>
            <div className="text-xs text-slate-600 mt-1">Communication rating</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">12</div>
            <div className="text-xs text-slate-600 mt-1">Touchpoints</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Next Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">1d</div>
            <div className="text-xs text-slate-600 mt-1">Tomorrow at 2 PM</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

