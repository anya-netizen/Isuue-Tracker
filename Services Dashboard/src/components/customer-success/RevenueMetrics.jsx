import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Users,
  FileText,
  CreditCard,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function RevenueMetrics({ customerHealth, selectedPG, patients, timeRange }) {
  const pgPatients = patients?.filter(p => p.current_pg === selectedPG?.name) || [];
  
  const revenueData = {
    current: customerHealth.totalRevenue,
    previous: Math.round(customerHealth.totalRevenue * 0.89),
    target: Math.round(customerHealth.totalRevenue * 1.15),
    arr: Math.round(customerHealth.totalRevenue * 12),
    mrr: Math.round(customerHealth.totalRevenue),
    arpu: pgPatients.length > 0 ? Math.round(customerHealth.totalRevenue / pgPatients.length) : 0,
    ltv: Math.round(customerHealth.totalRevenue * 24),
    churnImpact: Math.round(customerHealth.totalRevenue * 0.08)
  };

  const growth = ((revenueData.current - revenueData.previous) / revenueData.previous * 100).toFixed(1);
  const targetProgress = (revenueData.current / revenueData.target) * 100;

  const revenueBreakdown = [
    { source: 'Chronic Care Management', amount: Math.round(revenueData.current * 0.45), percentage: 45, color: 'bg-blue-500' },
    { source: 'Remote Patient Monitoring', amount: Math.round(revenueData.current * 0.25), percentage: 25, color: 'bg-purple-500' },
    { source: 'Behavioral Health', amount: Math.round(revenueData.current * 0.18), percentage: 18, color: 'bg-green-500' },
    { source: 'Principal Care', amount: Math.round(revenueData.current * 0.12), percentage: 12, color: 'bg-orange-500' }
  ];

  const monthlyTrend = [
    { month: 'Jan', revenue: Math.round(revenueData.current * 0.75) },
    { month: 'Feb', revenue: Math.round(revenueData.current * 0.82) },
    { month: 'Mar', revenue: Math.round(revenueData.current * 0.88) },
    { month: 'Apr', revenue: Math.round(revenueData.current * 0.95) },
    { month: 'May', revenue: Math.round(revenueData.current * 0.92) },
    { month: 'Jun', revenue: revenueData.current }
  ];

  const maxRevenue = Math.max(...monthlyTrend.map(m => m.revenue));

  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              ${(revenueData.current / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center gap-1 mt-2">
              {parseFloat(growth) > 0 ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+{growth}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-600 font-medium">{growth}%</span>
                </>
              )}
              <span className="text-xs text-slate-600 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              ARR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              ${(revenueData.arr / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Annual Run Rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
              <Users className="w-4 h-4" />
              ARPU
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              ${revenueData.arpu}
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Avg Revenue Per User
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Lifetime Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">
              ${(revenueData.ltv / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-slate-600 mt-2">
              Customer LTV
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Target Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Revenue Target Progress
            </CardTitle>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {timeRange === '7d' ? 'Weekly' : timeRange === '30d' ? 'Monthly' : 'Quarterly'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">Current: ${(revenueData.current / 1000).toFixed(1)}k</div>
                <div className="text-sm text-slate-600">Target: ${(revenueData.target / 1000).toFixed(1)}k</div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {targetProgress.toFixed(0)}%
              </div>
            </div>
            <Progress value={targetProgress} className="h-3" />
            <div className="text-sm text-slate-600">
              ${((revenueData.target - revenueData.current) / 1000).toFixed(1)}k remaining to reach target
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Revenue Breakdown by Service Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueBreakdown.map((item, index) => (
              <motion.div
                key={item.source}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{item.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">${(item.amount / 1000).toFixed(1)}k</span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-xs text-blue-800 font-medium">Top Performer</div>
              <div className="text-sm font-bold text-blue-900 mt-1">Chronic Care Mgmt</div>
              <div className="text-xs text-blue-700">${(revenueBreakdown[0].amount / 1000).toFixed(1)}k revenue</div>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-xs text-orange-800 font-medium">Growth Opportunity</div>
              <div className="text-sm font-bold text-orange-900 mt-1">Principal Care</div>
              <div className="text-xs text-orange-700">+25% potential increase</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Revenue Trend (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyTrend.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.revenue / maxRevenue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg relative group">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(month.revenue / 1000).toFixed(1)}k
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex items-center justify-between px-2">
              {monthlyTrend.map((month) => (
                <span key={month.month} className="text-xs text-slate-600">{month.month}</span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+33%</div>
                <div className="text-xs text-slate-600">6-month growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${(revenueData.current / 1000).toFixed(1)}k</div>
                <div className="text-xs text-slate-600">Current month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">${((revenueData.current * 1.1) / 1000).toFixed(1)}k</div>
                <div className="text-xs text-slate-600">Projected next month</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Revenue Drivers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Increased patient enrollment</div>
                  <div className="text-xs text-green-700">+{customerHealth.billablePatients} billable patients</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Higher billability rate</div>
                  <div className="text-xs text-green-700">{customerHealth.billabilityRate}% conversion rate</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-900">Optimized service mix</div>
                  <div className="text-xs text-green-700">Focus on high-value care types</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Optimization Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Expand Principal Care</div>
                  <div className="text-xs text-blue-700">+${((revenueData.current * 0.25) / 1000).toFixed(1)}k potential</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Reduce processing delays</div>
                  <div className="text-xs text-blue-700">Unlock {customerHealth.processingPatients} patients</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Improve documentation quality</div>
                  <div className="text-xs text-blue-700">Increase reimbursement rates</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

