import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target,
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity,
  DollarSign,
  MessageSquare,
  Calendar,
  Award,
  Clock,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Star,
  ThumbsUp,
  ThumbsDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import sub-components
import HealthScorePanel from './HealthScorePanel';
import EngagementAnalytics from './EngagementAnalytics';
import RevenueMetrics from './RevenueMetrics';
import SupportTracker from './SupportTracker';
import ChurnRiskAnalysis from './ChurnRiskAnalysis';
import OnboardingProgress from './OnboardingProgress';
import ProductAdoption from './ProductAdoption';
import AccountTimeline from './AccountTimeline';
import SuccessPlans from './SuccessPlans';
import CommunicationHub from './CommunicationHub';

export default function CustomerSuccessDashboard({ selectedPG, patients, documents }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [customerHealth, setCustomerHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedPG) {
      calculateCustomerHealth();
    }
  }, [selectedPG, patients, documents, timeRange]);

  const calculateCustomerHealth = () => {
    setLoading(true);
    
    // Filter data for selected PG
    const pgPatients = patients?.filter(p => p.current_pg === selectedPG?.name) || [];
    const pgDocuments = documents?.filter(d => 
      pgPatients.some(p => p.id === d.patient_id)
    ) || [];

    // Calculate health metrics
    const totalPatients = pgPatients.length;
    const billablePatients = pgPatients.filter(p => p.billability_status === 'billable').length;
    const processingPatients = pgPatients.filter(p => p.billability_status === 'processing' || p.billability_status === 'pending_review').length;
    const unbillablePatients = pgPatients.filter(p => p.billability_status === 'unbillable').length;
    
    const billabilityRate = totalPatients > 0 ? (billablePatients / totalPatients) * 100 : 0;
    const processingRate = totalPatients > 0 ? (processingPatients / totalPatients) * 100 : 0;
    
    // Calculate engagement score
    const recentDocuments = pgDocuments.filter(d => {
      const docDate = new Date(d.upload_date);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90));
      return docDate >= cutoffDate;
    }).length;
    
    const engagementScore = Math.min(100, (recentDocuments / Math.max(totalPatients, 1)) * 50);
    
    // Calculate revenue
    const totalRevenue = pgPatients
      .filter(p => p.billability_status === 'billable' && p.cpt_charges)
      .reduce((sum, p) => sum + parseFloat(p.cpt_charges || 0), 0);
    
    // Calculate overall health score (weighted average)
    const healthScore = Math.round(
      (billabilityRate * 0.4) + 
      (engagementScore * 0.3) + 
      (Math.min(100, (totalRevenue / 1000)) * 0.3)
    );

    // Determine health status
    let healthStatus = 'excellent';
    let healthColor = 'text-green-600';
    let healthBg = 'bg-green-50';
    
    if (healthScore < 40) {
      healthStatus = 'critical';
      healthColor = 'text-red-600';
      healthBg = 'bg-red-50';
    } else if (healthScore < 60) {
      healthStatus = 'needs-attention';
      healthColor = 'text-orange-600';
      healthBg = 'bg-orange-50';
    } else if (healthScore < 80) {
      healthStatus = 'good';
      healthColor = 'text-yellow-600';
      healthBg = 'bg-yellow-50';
    }

    setCustomerHealth({
      healthScore,
      healthStatus,
      healthColor,
      healthBg,
      billabilityRate: Math.round(billabilityRate),
      processingRate: Math.round(processingRate),
      engagementScore: Math.round(engagementScore),
      totalPatients,
      billablePatients,
      processingPatients,
      unbillablePatients,
      recentDocuments,
      totalRevenue: Math.round(totalRevenue),
      npsScore: 42, // Mock NPS
      csat: 4.2, // Mock CSAT
      supportTickets: Math.floor(totalPatients * 0.15),
      resolvedTickets: Math.floor(totalPatients * 0.12),
      avgResponseTime: '2.3',
      churnRisk: healthScore < 60 ? 'high' : healthScore < 80 ? 'medium' : 'low'
    });

    setLoading(false);
  };

  if (loading || !customerHealth) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Customer Success Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Success Dashboard</h2>
          <p className="text-slate-600">Comprehensive health and engagement metrics for {selectedPG?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      {/* Health Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Overall Health Score */}
        <Card className={`${customerHealth.healthBg} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Overall Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-4xl font-bold ${customerHealth.healthColor}`}>
                  {customerHealth.healthScore}
                </div>
                <Badge variant="outline" className={`mt-2 ${customerHealth.healthColor} border-current`}>
                  {customerHealth.healthStatus.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <Heart className={`w-12 h-12 ${customerHealth.healthColor}`} />
            </div>
            <Progress value={customerHealth.healthScore} className="mt-4" />
          </CardContent>
        </Card>

        {/* Billability Rate */}
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Billability Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-blue-600">
                  {customerHealth.billabilityRate}%
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+5.2%</span>
                </div>
              </div>
              <Target className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-xs text-slate-600 mt-4">
              {customerHealth.billablePatients} of {customerHealth.totalPatients} patients
            </div>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card className="bg-purple-50 border-2 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Engagement Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-purple-600">
                  {customerHealth.engagementScore}%
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600 font-medium">Active</span>
                </div>
              </div>
              <Zap className="w-12 h-12 text-purple-600" />
            </div>
            <div className="text-xs text-slate-600 mt-4">
              {customerHealth.recentDocuments} documents processed
            </div>
          </CardContent>
        </Card>

        {/* Revenue Metrics */}
        <Card className="bg-green-50 border-2 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-green-600">
                  ${(customerHealth.totalRevenue / 1000).toFixed(1)}k
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-green-600" />
            </div>
            <div className="text-xs text-slate-600 mt-4">
              From billable patients
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-600 flex items-center gap-2">
                <Star className="w-4 h-4" />
                NPS Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{customerHealth.npsScore}</div>
              <div className="text-xs text-slate-600 mt-1">Promoters: 58%</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-600 flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                CSAT Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{customerHealth.csat}/5.0</div>
              <div className="text-xs text-slate-600 mt-1">84% Satisfaction</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-600 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{customerHealth.supportTickets}</div>
              <div className="text-xs text-green-600 mt-1">
                {customerHealth.resolvedTickets} resolved
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-slate-600 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{customerHealth.avgResponseTime}h</div>
              <div className="text-xs text-green-600 mt-1">-18% from last month</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-slate-200">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 flex-wrap">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="health" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <Heart className="w-4 h-4 mr-2" />
                Health Score
              </TabsTrigger>
              <TabsTrigger 
                value="engagement" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <Activity className="w-4 h-4 mr-2" />
                Engagement
              </TabsTrigger>
              <TabsTrigger 
                value="revenue" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Support
              </TabsTrigger>
              <TabsTrigger 
                value="churn" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Churn Risk
              </TabsTrigger>
              <TabsTrigger 
                value="adoption" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <Target className="w-4 h-4 mr-2" />
                Product Adoption
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="data-[state=active]:bg-slate-100 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <HealthScorePanel 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="health" className="mt-0">
              <HealthScorePanel 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                timeRange={timeRange}
                detailedView={true}
              />
            </TabsContent>

            <TabsContent value="engagement" className="mt-0">
              <EngagementAnalytics 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                documents={documents}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="revenue" className="mt-0">
              <RevenueMetrics 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <SupportTracker 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="churn" className="mt-0">
              <ChurnRiskAnalysis 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="adoption" className="mt-0">
              <ProductAdoption 
                customerHealth={customerHealth}
                selectedPG={selectedPG}
                patients={patients}
                documents={documents}
                timeRange={timeRange}
              />
            </TabsContent>

            <TabsContent value="timeline" className="mt-0">
              <AccountTimeline 
                selectedPG={selectedPG}
                patients={patients}
                documents={documents}
                timeRange={timeRange}
              />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}

