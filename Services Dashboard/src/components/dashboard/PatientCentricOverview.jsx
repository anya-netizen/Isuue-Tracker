import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Heart,
  Activity,
  PieChart,
  Target,
  FileText,
  Trophy,
  Crown,
  Medal,
  Shield,
  Star,
  Check,
  User,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import PGNetworkVisualization from '@/components/pg/PGNetworkVisualization';

const PatientCentricOverview = ({ selectedPG, patients, documents, stats, onPatientSelect, onRefresh }) => {
  // Enhanced analytics focused on patient outcomes
  const patientAnalytics = useMemo(() => {
    if (!selectedPG || !patients.length) return null;

    const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
    
    // Patient Care Quality Metrics
    const chronicCarePatients = pgPatients.filter(p => 
      p.primaryDiagnosis?.includes('Diabetes') || 
      p.primaryDiagnosis?.includes('Hypertension') || 
      p.primaryDiagnosis?.includes('Heart') ||
      p.primaryDiagnosis?.includes('COPD')
    );

    const highRiskPatients = pgPatients.filter(p => 
      p.billability_status === 'pending_review' ||
      (p.cpt_charges && parseFloat(p.cpt_charges) < 1500)
    );

    // Revenue per patient by care complexity
    const avgRevenueByCareType = {
      chronic: chronicCarePatients.reduce((sum, p) => sum + (parseFloat(p.cpt_charges) || 0), 0) / (chronicCarePatients.length || 1),
      standard: pgPatients.filter(p => !chronicCarePatients.includes(p))
                         .reduce((sum, p) => sum + (parseFloat(p.cpt_charges) || 0), 0) / 
                         (pgPatients.filter(p => !chronicCarePatients.includes(p)).length || 1)
    };

    // Patient satisfaction proxy (based on billability success)
    const satisfactionScore = Math.round((stats.billablePatients / stats.totalPatients) * 100) || 0;
    
    // Care coordination efficiency
    const networkSize = selectedPG.hha_partnerships?.length || 0;
    const patientsPerHHA = networkSize > 0 ? stats.totalPatients / networkSize : 0;
    const coordinationScore = Math.min(Math.round(patientsPerHHA * 10), 100);

    return {
      chronicCarePatients: chronicCarePatients.length,
      chronicCarePercentage: Math.round((chronicCarePatients.length / pgPatients.length) * 100),
      highRiskPatients: highRiskPatients.length,
      avgRevenueByCareType,
      satisfactionScore,
      coordinationScore,
      networkSize,
      patientsPerHHA: Math.round(patientsPerHHA * 10) / 10
    };
  }, [selectedPG, patients, stats]);

  // Key Performance Indicators optimized for patient care
  const patientKPIs = [
    {
      title: "Client Satisfaction Score",
      value: `${patientAnalytics?.satisfactionScore || 0}%`,
      change: "+5.2%",
      trend: "up",
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      description: "Based on successful care outcomes and billability"
    },
    {
      title: "Services Efficiency", 
      value: `${patientAnalytics?.coordinationScore || 0}%`,
      change: "+3.1%",
      trend: "up",
      icon: Check,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${patientAnalytics?.patientsPerHHA || 0} patients per HHA partner`
    },
    {
      title: "Total Patient Count",
      value: stats?.totalPatients || 0,
      change: "+12%",
      trend: "up",
      icon: User,
      color: "text-blue-600", 
      bgColor: "bg-blue-50",
      description: "Total patients under care"
    },
    {
      title: "Agency Count",
      value: patientAnalytics?.networkSize || 0,
      change: "+2",
      trend: "up",
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Active HHA partnerships"
    }
  ];


  if (!selectedPG) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Patient-Centric Healthcare</h3>
        <p className="text-gray-500 mb-6">Select a Physician Group to view comprehensive patient care insights and recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {patientKPIs.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${kpi.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent className={`w-5 h-5 ${kpi.color}`} />
                        <h3 className="font-medium text-gray-900 text-sm">{kpi.title}</h3>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                        <Badge className={`text-xs ${
                          kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {kpi.change}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{kpi.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Network Mode Dashboard */}
      <div className="w-full">
        {/* Network Mode */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              Network Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="h-[600px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <PGNetworkVisualization
                selectedPG={selectedPG}
                patients={patients}
                onPatientSelect={onPatientSelect}
                onRefresh={onRefresh}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List and Physician Rankings */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Orders List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Orders Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-medium text-gray-700">Patient Name</th>
                      <th className="text-left py-3 font-medium text-gray-700">MRN</th>
                      <th className="text-left py-3 font-medium text-gray-700">Billing Provider</th>
                      <th className="text-left py-3 font-medium text-gray-700">Order Number</th>
                      <th className="text-left py-3 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 font-medium text-gray-700">TAT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">MAYER, PAMELA</td>
                      <td className="py-3 text-gray-600">33600210357401</td>
                      <td className="py-3 text-gray-600">Dr. JOSEPH A Spirito</td>
                      <td className="py-3 text-gray-600">12303725</td>
                      <td className="py-3">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Signed</Badge>
                      </td>
                      <td className="py-3 text-gray-600">(115 days)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">JOHNSON, ROBERT</td>
                      <td className="py-3 text-gray-600">33600210357402</td>
                      <td className="py-3 text-gray-600">Dr. Sarah Wilson</td>
                      <td className="py-3 text-gray-600">12303726</td>
                      <td className="py-3">
                        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
                      </td>
                      <td className="py-3 text-gray-600">(3 days)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-900">GARCIA, MARIA</td>
                      <td className="py-3 text-gray-600">33600210357403</td>
                      <td className="py-3 text-gray-600">Dr. Michael Brown</td>
                      <td className="py-3 text-gray-600">12303727</td>
                      <td className="py-3">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Signed</Badge>
                      </td>
                      <td className="py-3 text-gray-600">(87 days)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* View All Orders Button */}
              <div className="text-center pt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
                  View All Orders
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Physician Rankings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Physician Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ranking List */}
              <div className="space-y-3">
                {/* Rank 1 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Sarah Wilson</div>
                      <div className="text-sm text-gray-600">Internal Medicine</div>
                      <div className="text-xs text-gray-500">147 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.9</span>
                    </div>
                    <Badge className="bg-yellow-200 text-yellow-800">#1</Badge>
                  </div>
                </div>

                {/* Rank 2 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Michael Brown</div>
                      <div className="text-sm text-gray-600">Family Medicine</div>
                      <div className="text-xs text-gray-500">134 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.8</span>
                    </div>
                    <Badge className="bg-gray-200 text-gray-800">#2</Badge>
                  </div>
                </div>

                {/* Rank 3 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <Medal className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Jennifer Smith</div>
                      <div className="text-sm text-gray-600">Cardiology</div>
                      <div className="text-xs text-gray-500">128 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.7</span>
                    </div>
                    <Badge className="bg-orange-200 text-orange-800">#3</Badge>
                  </div>
                </div>

                {/* Rank 4 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. David Lee</div>
                      <div className="text-sm text-gray-600">Orthopedics</div>
                      <div className="text-xs text-gray-500">112 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.6</span>
                    </div>
                    <Badge className="bg-blue-200 text-blue-800">#4</Badge>
                  </div>
                </div>

                {/* Rank 5 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Emily Davis</div>
                      <div className="text-sm text-gray-600">Pediatrics</div>
                      <div className="text-xs text-gray-500">98 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.5</span>
                    </div>
                    <Badge className="bg-blue-200 text-blue-800">#5</Badge>
                  </div>
                </div>

                {/* Rank 6 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Dr. Jennifer Smith</div>
                      <div className="text-sm text-gray-600">Neurology</div>
                      <div className="text-xs text-gray-500">73 orders</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">4.4</span>
                    </div>
                    <Badge className="bg-blue-200 text-blue-800">#6</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default PatientCentricOverview;