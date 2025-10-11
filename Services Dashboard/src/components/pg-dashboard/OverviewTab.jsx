import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  MapPin,
  BarChart3, 
  FileText, 
  Trophy,
  Crown,
  Medal,
  Award,
  Heart,
  Check,
  User,
  Building
} from 'lucide-react';
import MapboxMap from './MapboxMap';

export default function OverviewTab({ selectedPG, patients, documents, stats }) {
  // Network structure data - PG at center, HHAs around it
  const networkData = {
    center: {
      id: 'pg',
      name: selectedPG?.name || 'Test PG',
      type: 'physician_group',
      patients: stats?.totalPatients || 125
    },
    hhas: [
      { id: 'hha1', name: 'Comfort Care Home Health', patients: 23 },
      { id: 'hha2', name: 'Mercy Home Services', patients: 18 },
      { id: 'hha3', name: 'Angel Care Network', patients: 31 },
      { id: 'hha4', name: 'Healing Hands Agency', patients: 15 },
      { id: 'hha5', name: 'Grace Home Healthcare', patients: 27 },
      { id: 'hha6', name: 'Sunrise Care Services', patients: 19 }
    ]
  };

  const billabilityData = [
    { name: 'Billable', value: stats?.billablePatients || 98, color: '#10b981' },
    { name: 'Non-Billable', value: (stats?.totalPatients || 125) - (stats?.billablePatients || 98), color: '#ef4444' },
    { name: 'Pending', value: Math.floor((stats?.totalPatients || 125) * 0.1), color: '#f59e0b' },
  ];

  // Physician rankings based on orders signed
  const physicianRankings = [
    { rank: 1, name: 'Dr. Sarah Wilson', ordersSigned: 147, specialty: 'Internal Medicine', rating: 4.9, icon: Crown },
    { rank: 2, name: 'Dr. Michael Brown', ordersSigned: 132, specialty: 'Family Medicine', rating: 4.8, icon: Trophy },
    { rank: 3, name: 'Dr. Robert Johnson', ordersSigned: 118, specialty: 'Cardiology', rating: 4.7, icon: Medal },
    { rank: 4, name: 'Dr. Maria Garcia', ordersSigned: 95, specialty: 'Geriatrics', rating: 4.6, icon: Award },
    { rank: 5, name: 'Dr. David Lee', ordersSigned: 87, specialty: 'Pulmonology', rating: 4.5, icon: Award },
    { rank: 6, name: 'Dr. Jennifer Smith', ordersSigned: 73, specialty: 'Endocrinology', rating: 4.4, icon: Award }
  ];

  // Orders list data
  const ordersList = [
    {
      patientName: 'MAYER, PAMELA',
      mrn: '33600210357401',
      billingProvider: 'Dr. JOSEPH A Spirito',
      orderNumber: '12303725',
      sentForSignature: 'Jun 16, 2025',
      signedByPhysician: 'May 31, 2025',
      orderStatus: 'Signed',
      tat: '115 days',
      cpo: '0 min'
    },
    {
      patientName: 'JOHNSON, ROBERT',
      mrn: '33600210357402',
      billingProvider: 'Dr. Sarah Wilson',
      orderNumber: '12303726',
      sentForSignature: 'Jun 15, 2025',
      signedByPhysician: 'May 30, 2025',
      orderStatus: 'Signed',
      tat: '116 days',
      cpo: '0 min'
    },
    {
      patientName: 'GARCIA, MARIA',
      mrn: '33600210357403',
      billingProvider: 'Dr. Michael Brown',
      orderNumber: '12303727',
      sentForSignature: 'Jun 14, 2025',
      signedByPhysician: 'Pending',
      orderStatus: 'Pending',
      tat: '117 days',
      cpo: '0 min'
    }
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Award;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-slate-400';
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'Signed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">Client Satisfaction Score</p>
                  <p className="text-3xl font-bold text-pink-800">92%</p>
                  <p className="text-pink-600 text-xs">+5% from last month</p>
                </div>
                <div className="p-3 bg-pink-500 rounded-full">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Services Efficiency</p>
                  <p className="text-3xl font-bold text-green-800">87%</p>
                  <p className="text-green-600 text-xs">+3% from last month</p>
                </div>
                <div className="p-3 bg-green-500 rounded-full">
                  <Check className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Patient Count</p>
                  <p className="text-3xl font-bold text-blue-800">{stats?.totalPatients || 125}</p>
                  <p className="text-blue-600 text-xs">+12% from last month</p>
                </div>
                <div className="p-3 bg-blue-500 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Agency Count</p>
                  <p className="text-3xl font-bold text-purple-800">24</p>
                  <p className="text-purple-600 text-xs">Active agencies</p>
                </div>
                <div className="p-3 bg-purple-500 rounded-full">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Map */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Network Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full">
                <MapboxMap networkData={networkData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billability Status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Billability Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Billable Patients</span>
                  <span className="font-bold text-green-600">{billabilityData[0].value}</span>
                </div>
                <div className="flex justify-between">
                  <span>Non-Billable</span>
                  <span className="font-bold text-red-600">{billabilityData[1].value}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending</span>
                  <span className="font-bold text-yellow-600">{billabilityData[2].value}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Orders List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Billing Provider</TableHead>
                      <TableHead>Order Number</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>TAT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersList.map((order, index) => (
                      <TableRow key={order.orderNumber} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{order.patientName}</TableCell>
                        <TableCell className="text-sm text-slate-600">{order.mrn}</TableCell>
                        <TableCell className="text-sm text-slate-600">{order.billingProvider}</TableCell>
                        <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">({order.tat})</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Orders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Physician Rankings */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-indigo-600" />
                Physician Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {physicianRankings.map((physician, index) => {
                const IconComponent = getRankIcon(physician.rank);
                return (
                  <div key={physician.name} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                    <div className={`flex-shrink-0 ${getRankColor(physician.rank)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{physician.name}</p>
                      <p className="text-xs text-slate-600">{physician.specialty}</p>
                      <p className="text-xs text-slate-500">{physician.ordersSigned} orders • ⭐ {physician.rating}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        #{physician.rank}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              
              <Button variant="outline" className="w-full mt-4">
                View All Physicians
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}