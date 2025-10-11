import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  User,
  Calendar,
  Tag,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SupportTracker({ customerHealth, selectedPG, timeRange }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const supportMetrics = {
    totalTickets: customerHealth.supportTickets,
    openTickets: customerHealth.supportTickets - customerHealth.resolvedTickets,
    resolvedTickets: customerHealth.resolvedTickets,
    avgResponseTime: parseFloat(customerHealth.avgResponseTime),
    avgResolutionTime: parseFloat(customerHealth.avgResponseTime) * 2.5,
    satisfactionScore: 4.3,
    firstContactResolution: 68
  };

  const tickets = [
    {
      id: 'TKT-1245',
      subject: 'Patient billing discrepancy',
      category: 'Billing',
      priority: 'high',
      status: 'open',
      assignee: 'Sarah Johnson',
      created: '2 hours ago',
      lastUpdate: '30 min ago'
    },
    {
      id: 'TKT-1244',
      subject: 'Document upload error',
      category: 'Technical',
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Mike Chen',
      created: '5 hours ago',
      lastUpdate: '1 hour ago'
    },
    {
      id: 'TKT-1243',
      subject: 'Training on new features',
      category: 'Training',
      priority: 'low',
      status: 'resolved',
      assignee: 'Emma Davis',
      created: '1 day ago',
      lastUpdate: '6 hours ago'
    },
    {
      id: 'TKT-1242',
      subject: 'Patient data sync issue',
      category: 'Technical',
      priority: 'high',
      status: 'resolved',
      assignee: 'Sarah Johnson',
      created: '2 days ago',
      lastUpdate: '1 day ago'
    },
    {
      id: 'TKT-1241',
      subject: 'Report generation question',
      category: 'General',
      priority: 'low',
      status: 'resolved',
      assignee: 'Mike Chen',
      created: '3 days ago',
      lastUpdate: '2 days ago'
    }
  ];

  const categoryBreakdown = [
    { name: 'Technical', count: 8, percentage: 35, color: 'bg-red-500' },
    { name: 'Billing', count: 6, percentage: 26, color: 'bg-orange-500' },
    { name: 'Training', count: 5, percentage: 22, color: 'bg-blue-500' },
    { name: 'General', count: 4, percentage: 17, color: 'bg-purple-500' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-600 text-red-600 bg-red-50';
      case 'medium': return 'border-orange-600 text-orange-600 bg-orange-50';
      case 'low': return 'border-blue-600 text-blue-600 bg-blue-50';
      default: return 'border-gray-600 text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'border-red-600 text-red-600 bg-red-50';
      case 'in-progress': return 'border-orange-600 text-orange-600 bg-orange-50';
      case 'resolved': return 'border-green-600 text-green-600 bg-green-50';
      default: return 'border-gray-600 text-gray-600 bg-gray-50';
    }
  };

  const filteredTickets = selectedCategory === 'all' 
    ? tickets 
    : tickets.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Support Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Total Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {supportMetrics.totalTickets}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {supportMetrics.openTickets} open, {supportMetrics.resolvedTickets} resolved
            </div>
            <Progress 
              value={(supportMetrics.resolvedTickets / supportMetrics.totalTickets) * 100} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {Math.round((supportMetrics.resolvedTickets / supportMetrics.totalTickets) * 100)}%
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="w-3 h-3" />
              +5% vs last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {supportMetrics.avgResponseTime}h
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingDown className="w-3 h-3" />
              -18% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              CSAT Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {supportMetrics.satisfactionScore}/5
            </div>
            <div className="text-xs text-slate-600 mt-1">
              {Math.round(supportMetrics.satisfactionScore * 20)}% satisfaction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            Ticket Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryBreakdown.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{category.name}</span>
                    <Badge variant="outline">{category.count} tickets</Badge>
                  </div>
                  <span className="text-sm text-slate-600">{category.percentage}%</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${category.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`h-full ${category.color} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Recent Support Tickets
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket, index) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <TableCell className="font-medium">{ticket.id}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium text-slate-900">{ticket.subject}</div>
                        <div className="text-xs text-slate-500">Updated {ticket.lastUpdate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{ticket.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{ticket.created}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Support Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-green-900">Performance Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">First contact resolution</span>
                <Badge className="bg-green-600">{supportMetrics.firstContactResolution}%</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">Average resolution time</span>
                <Badge className="bg-green-600">{supportMetrics.avgResolutionTime}h</Badge>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-sm text-green-800">Customer satisfaction</span>
                <Badge className="bg-green-600">{supportMetrics.satisfactionScore}/5</Badge>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-blue-900">Improvement Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Reduce technical tickets</div>
                  <div className="text-xs text-blue-700">Improve documentation and training</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Faster response times</div>
                  <div className="text-xs text-blue-700">Optimize support workflow</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-blue-900">Proactive support</div>
                  <div className="text-xs text-blue-700">Identify issues before customers report</div>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

