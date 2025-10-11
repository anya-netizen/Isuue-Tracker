import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  Circle,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  Award,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function OnboardingProgress({ selectedPG, patients, timeRange }) {
  const onboardingPhases = [
    {
      phase: 'Initial Setup',
      status: 'completed',
      progress: 100,
      daysToComplete: 3,
      completedDate: '3 months ago',
      tasks: [
        { name: 'Account creation', completed: true },
        { name: 'System configuration', completed: true },
        { name: 'User provisioning', completed: true },
        { name: 'Integration setup', completed: true }
      ]
    },
    {
      phase: 'Core Training',
      status: 'completed',
      progress: 100,
      daysToComplete: 5,
      completedDate: '2.5 months ago',
      tasks: [
        { name: 'Platform overview training', completed: true },
        { name: 'Patient management training', completed: true },
        { name: 'Document upload training', completed: true },
        { name: 'Billing dashboard training', completed: true }
      ]
    },
    {
      phase: 'Advanced Features',
      status: 'completed',
      progress: 100,
      daysToComplete: 7,
      completedDate: '2 months ago',
      tasks: [
        { name: 'Reporting & analytics training', completed: true },
        { name: 'Care coordination tools', completed: true },
        { name: 'Communication hub setup', completed: true },
        { name: 'Advanced workflows', completed: true }
      ]
    },
    {
      phase: 'Optimization',
      status: 'in-progress',
      progress: 65,
      daysToComplete: null,
      completedDate: 'In progress',
      tasks: [
        { name: 'Workflow optimization', completed: true },
        { name: 'Performance review', completed: true },
        { name: 'Best practices implementation', completed: false },
        { name: 'Advanced integrations', completed: false }
      ]
    },
    {
      phase: 'Mastery',
      status: 'pending',
      progress: 0,
      daysToComplete: null,
      completedDate: 'Not started',
      tasks: [
        { name: 'Power user certification', completed: false },
        { name: 'Custom automation setup', completed: false },
        { name: 'Full platform mastery', completed: false },
        { name: 'Become product advocate', completed: false }
      ]
    }
  ];

  const trainingModules = [
    { name: 'Platform Basics', completed: true, duration: '45 min', score: 95 },
    { name: 'Patient Management', completed: true, duration: '1 hour', score: 92 },
    { name: 'Document Processing', completed: true, duration: '50 min', score: 88 },
    { name: 'Billing & Revenue', completed: true, duration: '1.5 hours', score: 90 },
    { name: 'Reporting & Analytics', completed: true, duration: '1 hour', score: 85 },
    { name: 'Advanced Workflows', completed: false, duration: '2 hours', score: null },
    { name: 'API & Integrations', completed: false, duration: '1.5 hours', score: null }
  ];

  const overallProgress = onboardingPhases.reduce((sum, phase) => sum + phase.progress, 0) / onboardingPhases.length;
  const completedPhases = onboardingPhases.filter(p => p.status === 'completed').length;
  const completedTraining = trainingModules.filter(m => m.completed).length;
  const avgScore = trainingModules.filter(m => m.score).reduce((sum, m) => sum + m.score, 0) / completedTraining;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Onboarding Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {Math.round(overallProgress)}%
            </div>
            <div className="text-xs text-slate-600 mt-2">
              {completedPhases} of {onboardingPhases.length} phases
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completed Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedPhases}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Out of {onboardingPhases.length} total
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Training Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {completedTraining}/{trainingModules.length}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Training modules
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Avg Training Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {Math.round(avgScore)}%
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Excellent performance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Phases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Onboarding Phases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {onboardingPhases.map((phase, index) => (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getStatusColor(phase.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {phase.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : phase.status === 'in-progress' ? (
                      <Clock className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400" />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{phase.phase}</h4>
                      <p className="text-sm opacity-75">
                        {phase.status === 'completed' && `Completed ${phase.completedDate} (${phase.daysToComplete} days)`}
                        {phase.status === 'in-progress' && 'Currently in progress'}
                        {phase.status === 'pending' && 'Not yet started'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-current">
                    {phase.progress}%
                  </Badge>
                </div>

                <Progress value={phase.progress} className="mb-3" />

                <div className="grid grid-cols-2 gap-2">
                  {phase.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center gap-2 text-sm">
                      {task.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                      <span className={task.completed ? '' : 'text-slate-500'}>{task.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-600" />
            Training Modules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trainingModules.map((module, index) => (
              <motion.div
                key={module.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg ${module.completed ? 'bg-green-50' : 'bg-slate-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-400" />
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{module.name}</h4>
                      <p className="text-xs text-slate-600">Duration: {module.duration}</p>
                    </div>
                  </div>
                  {module.score ? (
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">{module.score}%</div>
                      <div className="text-xs text-slate-600">Score</div>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      Start Module
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900">Complete Best Practices Implementation</div>
                <div className="text-xs text-blue-700">Part of ongoing optimization phase</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900">Setup Advanced Integrations</div>
                <div className="text-xs text-blue-700">Unlock additional platform capabilities</div>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900">Begin Power User Certification</div>
                <div className="text-xs text-blue-700">Advance to mastery phase</div>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

