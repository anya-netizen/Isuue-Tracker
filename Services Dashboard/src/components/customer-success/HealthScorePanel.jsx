import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Target,
  Users,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthScorePanel({ customerHealth, selectedPG, patients, timeRange, detailedView = false }) {
  const healthComponents = [
    {
      name: 'Billability Performance',
      score: customerHealth.billabilityRate,
      weight: 40,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Patient billability rate and revenue generation',
      details: `${customerHealth.billablePatients} billable patients out of ${customerHealth.totalPatients}`
    },
    {
      name: 'Engagement Level',
      score: customerHealth.engagementScore,
      weight: 30,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Document processing and system usage frequency',
      details: `${customerHealth.recentDocuments} documents processed in ${timeRange}`
    },
    {
      name: 'Revenue Growth',
      score: Math.min(100, (customerHealth.totalRevenue / 100)),
      weight: 30,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Total revenue generated and growth trends',
      details: `$${(customerHealth.totalRevenue / 1000).toFixed(1)}k in total revenue`
    }
  ];

  const riskFactors = [
    {
      name: 'Processing Delays',
      level: customerHealth.processingRate > 30 ? 'high' : customerHealth.processingRate > 15 ? 'medium' : 'low',
      value: `${customerHealth.processingPatients} patients`,
      icon: Clock,
      recommendation: 'Review processing workflow and address bottlenecks'
    },
    {
      name: 'Unbillable Rate',
      level: customerHealth.unbillablePatients > 5 ? 'high' : customerHealth.unbillablePatients > 2 ? 'medium' : 'low',
      value: `${customerHealth.unbillablePatients} patients`,
      icon: AlertTriangle,
      recommendation: 'Analyze unbillable cases and provide additional training'
    },
    {
      name: 'Support Response',
      level: parseFloat(customerHealth.avgResponseTime) > 4 ? 'high' : parseFloat(customerHealth.avgResponseTime) > 2 ? 'medium' : 'low',
      value: `${customerHealth.avgResponseTime}h avg`,
      icon: Users,
      recommendation: 'Optimize support workflows to improve response times'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Health Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {healthComponents.map((component, index) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`${component.bgColor} border-2`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {component.name}
                  </CardTitle>
                  <component.icon className={`w-5 h-5 ${component.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div className={`text-4xl font-bold ${component.color}`}>
                      {Math.round(component.score)}%
                    </div>
                    <Badge variant="outline" className={`${component.color} border-current`}>
                      Weight: {component.weight}%
                    </Badge>
                  </div>
                  
                  <Progress value={component.score} className="h-2" />
                  
                  <div className="text-xs text-slate-600">
                    <p className="font-medium">{component.description}</p>
                    <p className="mt-1 text-slate-500">{component.details}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contribution to health:</span>
                    <span className={`font-bold ${component.color}`}>
                      {Math.round((component.score * component.weight) / 100)} pts
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk Factors Analysis */}
      {detailedView && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Risk Factors & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <motion.div
                  key={risk.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${getLevelColor(risk.level)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <risk.icon className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{risk.name}</h4>
                          <Badge variant="outline" className="border-current">
                            {risk.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{risk.value}</p>
                        <p className="text-xs opacity-75 italic">{risk.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Health Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Health Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mock trend visualization */}
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 68, 72, 75, 71, 76, customerHealth.healthScore].map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(score / 100) * 100}%` }}
                  />
                  <span className="text-xs text-slate-600">{score}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>7 periods ago</span>
              <span>Current</span>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+8</div>
                <div className="text-xs text-slate-600">Points gained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12.3%</div>
                <div className="text-xs text-slate-600">Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">6/7</div>
                <div className="text-xs text-slate-600">Positive periods</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900">Improve Billability Rate</h4>
                <p className="text-sm text-blue-700">Focus on converting {customerHealth.processingPatients} processing patients to billable status</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900">Increase Engagement</h4>
                <p className="text-sm text-purple-700">Schedule training sessions to boost document processing efficiency</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900">Optimize Revenue</h4>
                <p className="text-sm text-green-700">Review high-value care types and ensure proper coding</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

