import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  CheckCircle,
  Circle,
  Activity,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  MessageSquare,
  Calendar,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductAdoption({ customerHealth, selectedPG, patients, documents, timeRange }) {
  const pgPatients = patients?.filter(p => p.current_pg === selectedPG?.name) || [];
  const pgDocuments = documents?.filter(d => 
    pgPatients.some(p => p.id === d.patient_id)
  ) || [];

  const features = [
    {
      name: 'Patient Management',
      category: 'Core',
      adopted: true,
      usage: 95,
      users: Math.floor(pgPatients.length * 0.95),
      frequency: 'Daily',
      value: 'high',
      lastUsed: '1 hour ago'
    },
    {
      name: 'Document Upload & Processing',
      category: 'Core',
      adopted: true,
      usage: 88,
      users: Math.floor(pgPatients.length * 0.88),
      frequency: 'Daily',
      value: 'high',
      lastUsed: '2 hours ago'
    },
    {
      name: 'Billing Dashboard',
      category: 'Core',
      adopted: true,
      usage: 72,
      users: Math.floor(pgPatients.length * 0.72),
      frequency: 'Weekly',
      value: 'high',
      lastUsed: '1 day ago'
    },
    {
      name: 'Reporting & Analytics',
      category: 'Advanced',
      adopted: true,
      usage: 65,
      users: Math.floor(pgPatients.length * 0.65),
      frequency: 'Weekly',
      value: 'medium',
      lastUsed: '2 days ago'
    },
    {
      name: 'Care Coordination Tools',
      category: 'Advanced',
      adopted: false,
      usage: 54,
      users: Math.floor(pgPatients.length * 0.54),
      frequency: 'Monthly',
      value: 'medium',
      lastUsed: '3 days ago'
    },
    {
      name: 'Communication Hub',
      category: 'Advanced',
      adopted: false,
      usage: 48,
      users: Math.floor(pgPatients.length * 0.48),
      frequency: 'Monthly',
      value: 'medium',
      lastUsed: '5 days ago'
    },
    {
      name: 'Mobile App',
      category: 'Advanced',
      adopted: false,
      usage: 32,
      users: Math.floor(pgPatients.length * 0.32),
      frequency: 'Rarely',
      value: 'low',
      lastUsed: '2 weeks ago'
    },
    {
      name: 'API Integration',
      category: 'Advanced',
      adopted: false,
      usage: 15,
      users: Math.floor(pgPatients.length * 0.15),
      frequency: 'Never',
      value: 'low',
      lastUsed: 'Never'
    }
  ];

  const adoptionMilestones = [
    {
      name: 'Onboarding Complete',
      completed: true,
      date: '3 months ago',
      icon: CheckCircle
    },
    {
      name: 'Core Features Adopted',
      completed: true,
      date: '2 months ago',
      icon: CheckCircle
    },
    {
      name: 'Advanced Features Explored',
      completed: true,
      date: '1 month ago',
      icon: CheckCircle
    },
    {
      name: 'Full Platform Adoption',
      completed: false,
      date: 'In progress',
      icon: Circle
    },
    {
      name: 'Power User Status',
      completed: false,
      date: 'Target: 2 months',
      icon: Circle
    }
  ];

  const adoptionScore = features.reduce((sum, f) => sum + f.usage, 0) / features.length;
  const coreAdoption = features.filter(f => f.category === 'Core').reduce((sum, f) => sum + f.usage, 0) / features.filter(f => f.category === 'Core').length;
  const advancedAdoption = features.filter(f => f.category === 'Advanced').reduce((sum, f) => sum + f.usage, 0) / features.filter(f => f.category === 'Advanced').length;

  const getUsageColor = (usage) => {
    if (usage >= 80) return 'bg-green-500';
    if (usage >= 60) return 'bg-blue-500';
    if (usage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getValueColor = (value) => {
    switch (value) {
      case 'high': return 'bg-green-600';
      case 'medium': return 'bg-blue-600';
      case 'low': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Adoption Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Overall Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(adoptionScore)}%
            </div>
            <div className="text-xs text-slate-600 mt-2">
              {features.filter(f => f.adopted).length} of {features.length} features
            </div>
            <Progress value={adoptionScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Core Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round(coreAdoption)}%
            </div>
            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Excellent adoption
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Advanced Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(advancedAdoption)}%
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Growth opportunity
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {Math.floor(pgPatients.length * 0.85)}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              85% of total users
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adoption Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Adoption Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
            
            <div className="space-y-6">
              {adoptionMilestones.map((milestone, index) => (
                <motion.div
                  key={milestone.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-500' : 'bg-slate-300'
                  }`}>
                    <milestone.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${milestone.completed ? 'text-slate-900' : 'text-slate-600'}`}>
                        {milestone.name}
                      </h4>
                      <Badge variant={milestone.completed ? 'default' : 'outline'}>
                        {milestone.date}
                      </Badge>
                    </div>
                    {!milestone.completed && index === adoptionMilestones.findIndex(m => !m.completed) && (
                      <p className="text-sm text-slate-600 mt-1">
                        Current focus: Increase adoption of advanced features
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Adoption Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Feature Usage Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {feature.adopted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{feature.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{feature.category}</Badge>
                        <Badge className={`${getValueColor(feature.value)} text-xs`}>
                          {feature.value} value
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{feature.usage}%</div>
                    <div className="text-xs text-slate-600">{feature.users} users</div>
                  </div>
                </div>

                <Progress value={feature.usage} className="h-2 mb-2" />
                
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Frequency: {feature.frequency}</span>
                  <span>Last used: {feature.lastUsed}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adoption Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">High patient management usage</div>
                  <div className="text-xs text-green-700">95% of team actively using daily</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Strong document processing</div>
                  <div className="text-xs text-green-700">88% adoption with regular usage</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Billing dashboard engagement</div>
                  <div className="text-xs text-green-700">Weekly reviews by 72% of users</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Increase communication hub usage</div>
                  <div className="text-xs text-blue-700">Only 48% adoption - provide training</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Promote mobile app</div>
                  <div className="text-xs text-blue-700">32% usage - highlight benefits</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Enable API integration</div>
                  <div className="text-xs text-blue-700">15% adoption - technical support needed</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Projected Impact */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Projected Impact of Full Adoption
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">+25%</div>
              <div className="text-sm text-slate-600 mt-1">Efficiency Gain</div>
              <div className="text-xs text-slate-500 mt-1">With full platform use</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+${((customerHealth.totalRevenue * 0.35) / 1000).toFixed(1)}k</div>
              <div className="text-sm text-slate-600 mt-1">Revenue Increase</div>
              <div className="text-xs text-slate-500 mt-1">From optimization</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">-40%</div>
              <div className="text-sm text-slate-600 mt-1">Support Tickets</div>
              <div className="text-xs text-slate-500 mt-1">Reduced by self-service</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

