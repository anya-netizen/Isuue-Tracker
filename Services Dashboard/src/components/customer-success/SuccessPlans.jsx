import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPlans({ selectedPG, patients }) {
  const [selectedPlan, setSelectedPlan] = useState('current');

  const successPlans = {
    current: {
      name: 'Q3 2024 Growth Plan',
      period: 'Jul - Sep 2024',
      status: 'active',
      progress: 72,
      goals: [
        {
          name: 'Increase Billability Rate',
          target: 85,
          current: 72,
          unit: '%',
          status: 'on-track',
          deadline: 'Sep 30, 2024',
          owner: 'Billing Team'
        },
        {
          name: 'Reduce Processing Time',
          target: 48,
          current: 62,
          unit: 'hours',
          status: 'at-risk',
          deadline: 'Sep 15, 2024',
          owner: 'Operations'
        },
        {
          name: 'Grow Patient Volume',
          target: 150,
          current: 128,
          unit: 'patients',
          status: 'on-track',
          deadline: 'Sep 30, 2024',
          owner: 'Account Manager'
        },
        {
          name: 'Increase Monthly Revenue',
          target: 15000,
          current: 9865,
          unit: '$',
          status: 'on-track',
          deadline: 'Sep 30, 2024',
          owner: 'Revenue Team'
        }
      ],
      initiatives: [
        {
          name: 'Weekly Training Sessions',
          status: 'in-progress',
          progress: 75,
          description: 'Ongoing training to improve documentation quality'
        },
        {
          name: 'Process Optimization',
          status: 'in-progress',
          progress: 60,
          description: 'Streamline patient intake and processing workflows'
        },
        {
          name: 'Advanced Feature Adoption',
          status: 'planned',
          progress: 30,
          description: 'Increase usage of analytics and reporting tools'
        }
      ]
    },
    next: {
      name: 'Q4 2024 Excellence Plan',
      period: 'Oct - Dec 2024',
      status: 'planned',
      progress: 0,
      goals: [
        {
          name: 'Achieve 90% Billability',
          target: 90,
          current: 0,
          unit: '%',
          status: 'planned',
          deadline: 'Dec 31, 2024',
          owner: 'Billing Team'
        },
        {
          name: 'Expand Service Types',
          target: 4,
          current: 0,
          unit: 'services',
          status: 'planned',
          deadline: 'Nov 30, 2024',
          owner: 'Product Team'
        },
        {
          name: 'Double Patient Volume',
          target: 250,
          current: 0,
          unit: 'patients',
          status: 'planned',
          deadline: 'Dec 31, 2024',
          owner: 'Account Manager'
        }
      ],
      initiatives: [
        {
          name: 'Power User Certification',
          status: 'planned',
          progress: 0,
          description: 'Complete advanced certification program'
        },
        {
          name: 'API Integration',
          status: 'planned',
          progress: 0,
          description: 'Integrate with existing practice management system'
        }
      ]
    }
  };

  const plan = successPlans[selectedPlan];

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-50 border-green-200';
      case 'at-risk': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'behind': return 'text-red-600 bg-red-50 border-red-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'planned': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getGoalProgress = (goal) => {
    if (goal.unit === 'hours') {
      // For metrics where lower is better
      return Math.max(0, ((goal.current - goal.target) / goal.current) * 100);
    }
    return (goal.current / goal.target) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Plan Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={selectedPlan === 'current' ? 'default' : 'outline'}
            onClick={() => setSelectedPlan('current')}
          >
            Current Plan
          </Button>
          <Button
            variant={selectedPlan === 'next' ? 'default' : 'outline'}
            onClick={() => setSelectedPlan('next')}
          >
            Next Plan
          </Button>
        </div>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      {/* Plan Overview */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-sm text-slate-600 mt-1">{plan.period}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={plan.status === 'active' ? 'bg-green-600' : 'bg-blue-600'}>
                {plan.status.toUpperCase()}
              </Badge>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Overall Progress</span>
              <span className="text-2xl font-bold text-indigo-600">{plan.progress}%</span>
            </div>
            <Progress value={plan.progress} className="h-3" />
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{plan.goals.filter(g => g.status === 'completed').length} of {plan.goals.length} goals completed</span>
              <span>{plan.goals.filter(g => g.status === 'on-track' || g.status === 'completed').length} on track</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Success Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.goals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getStatusColor(goal.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{goal.name}</h4>
                      <Badge variant="outline" className="border-current">
                        {goal.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{goal.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{goal.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {goal.unit === '$' ? '$' : ''}{goal.current}{goal.unit !== '$' ? goal.unit : ''}
                    </div>
                    <div className="text-sm text-slate-600">
                      of {goal.unit === '$' ? '$' : ''}{goal.target}{goal.unit !== '$' ? goal.unit : ''}
                    </div>
                  </div>
                </div>

                <Progress value={getGoalProgress(goal)} className="mb-2" />

                <div className="flex items-center justify-between text-sm">
                  <span>{Math.round(getGoalProgress(goal))}% complete</span>
                  <span>
                    {goal.unit === '$' ? '$' : ''}
                    {Math.abs(goal.target - goal.current)}
                    {goal.unit !== '$' ? goal.unit : ''} remaining
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Strategic Initiatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-900">{initiative.name}</h4>
                      <Badge variant="outline">
                        {initiative.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{initiative.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{initiative.progress}%</div>
                  </div>
                </div>
                <Progress value={initiative.progress} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Goals On Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {plan.goals.filter(g => g.status === 'on-track' || g.status === 'completed').length}
            </div>
            <div className="text-sm text-green-700 mt-1">
              of {plan.goals.length} total goals
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">
              {plan.goals.filter(g => g.status === 'at-risk').length}
            </div>
            <div className="text-sm text-orange-700 mt-1">
              Needs attention
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Avg Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {Math.round(plan.goals.reduce((sum, g) => sum + getGoalProgress(g), 0) / plan.goals.length)}%
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Across all goals
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-900">Address at-risk goals</div>
                <div className="text-xs text-purple-700">Focus on reducing processing time to meet Q3 targets</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-900">Accelerate strategic initiatives</div>
                <div className="text-xs text-purple-700">Increase focus on process optimization and training</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-purple-900">Prepare for Q4 planning</div>
                <div className="text-xs text-purple-700">Begin outlining Q4 goals and resource requirements</div>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

