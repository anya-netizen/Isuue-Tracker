import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Video, 
  User, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  Search,
  Filter,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunicationTab({ selectedPG, patients }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [notification, setNotification] = useState(null);

  // Communication personas data
  const communicationPersonas = [
    {
      id: 'sarah-johnson',
      name: 'Dr. Sarah Johnson',
      title: 'Chief Executive Officer',
      role: 'Executive',
      avatar: 'SJ',
      email: 'sarah.johnson@healthcare.com',
      phone: '+1 (555) 123-4567',
      lastContact: '1 day ago',
      totalCalls: 12,
      totalEmails: 28,
      relationshipStrength: 'Very Strong',
      closenessScore: 85,
      preferredMethod: 'email',
      availability: '9 AM - 5 PM EST',
      timezone: 'EST',
      notes: 'Prefers detailed emails with data. Responds quickly to strategic discussions.',
      color: 'blue'
    },
    {
      id: 'michael-chen',
      name: 'Dr. Michael Chen',
      title: 'Chief Medical Officer',
      role: 'Executive',
      avatar: 'MC',
      email: 'michael.chen@healthcare.com',
      phone: '+1 (555) 123-4568',
      lastContact: '2 days ago',
      totalCalls: 8,
      totalEmails: 15,
      relationshipStrength: 'Strong',
      closenessScore: 78,
      preferredMethod: 'call',
      availability: '8 AM - 6 PM EST',
      timezone: 'EST',
      notes: 'Prefers phone calls for urgent matters. Very responsive to clinical updates.',
      color: 'green'
    },
    {
      id: 'patricia-williams',
      name: 'Dr. Patricia Williams',
      title: 'Chief Financial Officer',
      role: 'Executive',
      avatar: 'PW',
      email: 'patricia.williams@healthcare.com',
      phone: '+1 (555) 123-4569',
      lastContact: '3 days ago',
      totalCalls: 6,
      totalEmails: 22,
      relationshipStrength: 'Good',
      closenessScore: 72,
      preferredMethod: 'email',
      availability: '10 AM - 4 PM EST',
      timezone: 'EST',
      notes: 'Prefers formal communication. Always includes financial context in discussions.',
      color: 'purple'
    },
    {
      id: 'emily-rodriguez',
      name: 'Dr. Emily Rodriguez',
      title: 'Cardiology Director',
      role: 'Director',
      avatar: 'ER',
      email: 'emily.rodriguez@healthcare.com',
      phone: '+1 (555) 123-4570',
      lastContact: '4 days ago',
      totalCalls: 4,
      totalEmails: 18,
      relationshipStrength: 'Good',
      closenessScore: 68,
      preferredMethod: 'message',
      availability: '7 AM - 3 PM EST',
      timezone: 'EST',
      notes: 'Very active on messaging platforms. Quick to respond to clinical questions.',
      color: 'orange'
    },
    {
      id: 'james-wilson',
      name: 'Dr. James Wilson',
      title: 'Orthopedics Director',
      role: 'Director',
      avatar: 'JW',
      email: 'james.wilson@healthcare.com',
      phone: '+1 (555) 123-4571',
      lastContact: '1 week ago',
      totalCalls: 3,
      totalEmails: 12,
      relationshipStrength: 'Fair',
      closenessScore: 55,
      preferredMethod: 'call',
      availability: '9 AM - 5 PM EST',
      timezone: 'EST',
      notes: 'Prefers scheduled calls. Less responsive to unscheduled communications.',
      color: 'orange'
    },
    {
      id: 'robert-martinez',
      name: 'Robert Martinez',
      title: 'Operations Manager',
      role: 'Manager',
      avatar: 'RM',
      email: 'robert.martinez@healthcare.com',
      phone: '+1 (555) 123-4572',
      lastContact: '2 days ago',
      totalCalls: 7,
      totalEmails: 25,
      relationshipStrength: 'Strong',
      closenessScore: 80,
      preferredMethod: 'message',
      availability: '8 AM - 6 PM EST',
      timezone: 'EST',
      notes: 'Very responsive to operational updates. Prefers quick messaging for urgent items.',
      color: 'teal'
    }
  ];

  // Filter personas based on search and role
  const filteredPersonas = communicationPersonas.filter(persona => {
    const matchesSearch = persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         persona.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || persona.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Auto-clear notification after 2 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
  };

  // Contact functionality
  const contactVia = (method, persona) => {
    switch(method) {
      case 'call':
        window.open(`tel:${persona.phone}`);
        showNotification(`Calling ${persona.name}...`);
        break;
      case 'email':
        window.open(`mailto:${persona.email}`);
        showNotification(`Opening email to ${persona.name}...`);
        break;
      case 'message':
        showNotification(`Opening messaging app to contact ${persona.name}...`);
        break;
      case 'meet':
        window.open('https://meet.google.com/new', '_blank');
        showNotification(`Starting a Meet with ${persona.name}...`);
        break;
      case 'video':
        showNotification(`Starting video call with ${persona.name}...`);
        break;
      default:
        console.log('Unknown contact method:', method);
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Executive': return 'bg-purple-100 text-purple-800';
      case 'Director': return 'bg-orange-100 text-orange-800';
      case 'Manager': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelationshipColor = (strength) => {
    switch(strength) {
      case 'Very Strong': return 'text-green-600';
      case 'Strong': return 'text-blue-600';
      case 'Good': return 'text-yellow-600';
      case 'Fair': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Hub</h2>
          <p className="text-gray-600">Connect with key stakeholders and team members</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">
              {communicationPersonas.length} Contacts
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="Executive">Executive</option>
                <option value="Director">Director</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Total Contacts</p>
                <p className="text-2xl font-bold text-blue-800">{communicationPersonas.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Active This Week</p>
                <p className="text-2xl font-bold text-green-800">
                  {communicationPersonas.filter(p => p.lastContact.includes('day')).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Strong Relationships</p>
                <p className="text-2xl font-bold text-purple-800">
                  {communicationPersonas.filter(p => p.relationshipStrength === 'Very Strong' || p.relationshipStrength === 'Strong').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-orange-800">2.4 hrs</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personas Grid - Simple Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersonas.map((persona, index) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="shadow-lg border-0 bg-white/90 backdrop-blur-xl hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedPersona(persona)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-${persona.color}-600 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {persona.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{persona.name}</h3>
                    <p className="text-sm text-gray-600">{persona.title}</p>
                    <Badge className={`mt-2 ${getRoleColor(persona.role)}`}>
                      {persona.role}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Relationship</span>
                    <span className={`font-medium ${getRelationshipColor(persona.relationshipStrength)}`}>
                      {persona.relationshipStrength}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Last Contact</span>
                    <span className="font-medium text-gray-900">{persona.lastContact}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredPersonas.length === 0 && (
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Contacts Found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Persona Detail Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-${selectedPersona.color}-600 rounded-full flex items-center justify-center text-white font-bold text-xl`}>
                    {selectedPersona.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedPersona.name}</h2>
                    <p className="text-gray-600">{selectedPersona.title}</p>
                    <Badge className={`mt-2 ${getRoleColor(selectedPersona.role)}`}>
                      {selectedPersona.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedPersona(null)}
                  className="text-gray-400 hover:text-gray-600"
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedPersona.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{selectedPersona.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Availability</p>
                        <p className="font-medium text-gray-900">{selectedPersona.availability} ({selectedPersona.timezone})</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Relationship Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Relationship Strength</span>
                      <span className={`font-medium ${getRelationshipColor(selectedPersona.relationshipStrength)}`}>
                        {selectedPersona.relationshipStrength}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Closeness Score</span>
                      <span className="font-medium text-gray-900">{selectedPersona.closenessScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Contact</span>
                      <span className="font-medium text-gray-900">{selectedPersona.lastContact}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Preferred Method</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedPersona.preferredMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedPersona.totalCalls}</div>
                  <div className="text-sm text-blue-600">Total Calls</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedPersona.totalEmails}</div>
                  <div className="text-sm text-green-600">Total Emails</div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Communication Notes</h3>
                <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">{selectedPersona.notes}</p>
              </div>

              {/* Communication Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => contactVia('call', selectedPersona)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  <Phone className="w-5 h-5" />
                  Call
                </Button>
                <Button
                  onClick={() => contactVia('email', selectedPersona)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </Button>
                <Button
                  onClick={() => contactVia('message', selectedPersona)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white h-12"
                >
                  <MessageSquare className="w-5 h-5" />
                  Message
                </Button>
                <Button
                  onClick={() => contactVia('meet', selectedPersona)}
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white h-12"
                >
                  <Video className="w-5 h-5" />
                  Meet
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 font-medium">{notification}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}