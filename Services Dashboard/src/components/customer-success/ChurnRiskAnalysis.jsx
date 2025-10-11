import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  AlertCircle,
  TrendingDown,
  Shield,
  Users,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChurnRiskAnalysis({ customerHealth, selectedPG, patients, timeRange }) {
  const pgPatients = patients?.filter(p => p.current_pg === selectedPG?.name) || [];

  const churnData = {
    riskLevel: customerHealth.churnRisk,
    riskScore: customerHealth.healthScore < 60 ? 75 : customerHealth.healthScore < 80 ? 45 : 20,
    atRiskPatients: Math.floor(pgPatients.length * (customerHealth.healthScore < 60 ? 0.3 : customerHealth.healthScore < 80 ? 0.15 : 0.05)),
    revenueAtRisk: Math.round(customerHealth.totalRevenue * (customerHealth.healthScore < 60 ? 0.3 : customerHealth.healthScore < 80 ? 0.15 : 0.05)),
    predictedChurnRate: customerHealth.healthScore < 60 ? 25 : customerHealth.healthScore < 80 ? 12 : 5,
    daysToChurn: customerHealth.healthScore < 60 ? 30 : customerHealth.healthScore < 80 ? 60 : 90
  };

  const riskFactors = [
    {
      name: 'Low Engagement',
      severity: customerHealth.engagementScore < 50 ? 'high' : customerHealth.engagementScore < 70 ? 'medium' : 'low',
      impact: customerHealth.engagementScore < 50 ? 85 : customerHealth.engagementScore < 70 ? 45 : 20,
      description: 'Reduced system usage and document processing',
      recommendation: 'Schedule engagement call and provide training'
    },
    {
      name: 'Billing Issues',
      severity: customerHealth.unbillablePatients > 5 ? 'high' : customerHealth.unbillablePatients > 2 ? 'medium' : 'low',
      impact: customerHealth.unbillablePatients > 5 ? 75 : customerHealth.unbillablePatients > 2 ? 40 : 15,
      description: 'Increasing unbillable patient rate',
      recommendation: 'Review documentation quality and provide support'
    },
    {
      name: 'Support Satisfaction',
      severity: parseFloat(customerHealth.avgResponseTime) > 4 ? 'high' : parseFloat(customerHealth.avgResponseTime) > 2 ? 'medium' : 'low',
      impact: parseFloat(customerHealth.avgResponseTime) > 4 ? 65 : parseFloat(customerHealth.avgResponseTime) > 2 ? 35 : 10,
      description: 'Slow support response times',
      recommendation: 'Prioritize support tickets and assign dedicated CSM'
    },
    {
      name: 'Revenue Decline',
      severity: customerHealth.billabilityRate < 60 ? 'high' : customerHealth.billabilityRate < 75 ? 'medium' : 'low',
      impact: customerHealth.billabilityRate < 60 ? 90 : customerHealth.billabilityRate < 75 ? 50 : 25,
      description: 'Decreasing revenue generation',
      recommendation: 'Analyze revenue trends and optimize patient mix'
    }
  ];

  const retentionStrategies = [
    {
      strategy: 'Proactive Check-ins',
      effectiveness: 85,
      timeframe: 'Weekly',
      status: 'active'
    },
    {
      strategy: 'Dedicated Success Manager',
      effectiveness: 78,
      timeframe: 'Ongoing',
      status: 'active'
    },
    {
      strategy: 'Training & Onboarding',
      effectiveness: 72,
      timeframe: 'Monthly',
      status: 'recommended'
    },
    {
      strategy: 'Performance Reviews',
      effectiveness: 68,
      timeframe: 'Quarterly',
      status: 'active'
    }
  ];

  const getRiskColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-600';
      case 'recommended': return 'bg-blue-600';
      case 'planned': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Churn Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={`${getRiskColor(churnData.riskLevel)} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {churnData.riskLevel.toUpperCase()}
            </div>
            <div className="text-xs mt-2">
              Risk Score: {churnData.riskScore}%
            </div>
            <Progress value={churnData.riskScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-2 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              At-Risk Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {churnData.atRiskPatients}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              {Math.round((churnData.atRiskPatients / pgPatients.length) * 100)}% of total patients
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-2 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue at Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${(churnData.revenueAtRisk / 1000).toFixed(1)}k
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Potential monthly loss
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-2 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time to Act
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {churnData.daysToChurn}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Days until predicted churn
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Churn Risk Factors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getRiskColor(factor.severity)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{factor.name}</h4>
                      <Badge variant="outline" className="border-current">
                        {factor.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-90">{factor.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{factor.impact}%</div>
                    <div className="text-xs">Impact</div>
                  </div>
                </div>
                
                <Progress value={factor.impact} className="mb-3" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="italic opacity-75">💡 {factor.recommendation}</span>
                  <Button variant="ghost" size="sm">
                    Take Action <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Immediate Action Required</h4>
                <p className="text-sm text-red-700">
                  {riskFactors.filter(f => f.severity === 'high').length} high-severity risk factors detected
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                Create Action Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Retention Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Retention Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.strategy}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {strategy.status === 'active' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900">{strategy.strategy}</h4>
                      <p className="text-xs text-slate-600">Frequency: {strategy.timeframe}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-slate-900">{strategy.effectiveness}%</div>
                      <div className="text-xs text-slate-600">Effectiveness</div>
                    </div>
                    <Badge className={getStatusColor(strategy.status)}>
                      {strategy.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={strategy.effectiveness} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Churn Prevention Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Quick Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Schedule weekly check-in call</div>
                  <div className="text-xs text-green-700">Improve communication and build rapport</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Provide targeted training</div>
                  <div className="text-xs text-green-700">Address knowledge gaps and boost confidence</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Optimize support response</div>
                  <div className="text-xs text-green-700">Prioritize tickets and reduce wait times</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Long-term Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Implement success plan</div>
                  <div className="text-xs text-blue-700">Create detailed roadmap with milestones</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Quarterly business reviews</div>
                  <div className="text-xs text-blue-700">Review performance and align on goals</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Build executive relationships</div>
                  <div className="text-xs text-blue-700">Engage stakeholders at all levels</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Predicted Impact */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-purple-600" />
            Predicted Impact of Interventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">-{Math.round(churnData.riskScore * 0.6)}%</div>
              <div className="text-sm text-slate-600 mt-1">Risk Reduction</div>
              <div className="text-xs text-slate-500 mt-1">With immediate actions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">+${(churnData.revenueAtRisk * 0.7 / 1000).toFixed(1)}k</div>
              <div className="text-sm text-slate-600 mt-1">Revenue Saved</div>
              <div className="text-xs text-slate-500 mt-1">Retained revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">+{Math.round(churnData.daysToChurn * 2)}</div>
              <div className="text-sm text-slate-600 mt-1">Extended Timeline</div>
              <div className="text-xs text-slate-500 mt-1">Additional days gained</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

