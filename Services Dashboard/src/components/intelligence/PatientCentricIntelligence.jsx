import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Heart,
  DollarSign,
  Target,
  Lightbulb,
  Search,
  Filter,
  Star,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientCentricIntelligence = ({ pgs, patients }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [performanceFilter, setPerformanceFilter] = useState('all');
  const [selectedPatientProfile, setSelectedPatientProfile] = useState('all');

  // Calculate comprehensive PG intelligence metrics
  const pgIntelligence = useMemo(() => {
    return pgs.map(pg => {
      const pgPatients = patients.filter(p => p.current_pg === pg.name);
      
      // Performance Metrics
      const totalPatients = pgPatients.length;
      const billablePatients = pgPatients.filter(p => p.billability_status === 'billable').length;
      const pendingPatients = pgPatients.filter(p => p.billability_status === 'pending_review' || p.billability_status === 'pending').length;
      const unbillablePatients = pgPatients.filter(p => p.billability_status === 'unbillable').length;
      
      // Revenue Analysis
      const totalRevenue = pgPatients.reduce((sum, p) => sum + (parseFloat(p.cpt_charges) || 0), 0);
      const avgRevenuePerPatient = totalPatients > 0 ? totalRevenue / totalPatients : 0;
      
      // Care Quality Indicators
      const chronicCarePatients = pgPatients.filter(p => 
        p.primaryDiagnosis?.includes('Diabetes') || 
        p.primaryDiagnosis?.includes('Hypertension') || 
        p.primaryDiagnosis?.includes('Heart') ||
        p.primaryDiagnosis?.includes('COPD')
      ).length;
      
      // Network Efficiency
      const networkSize = pg.hha_partnerships?.length || 0;
      const patientsPerHHA = networkSize > 0 ? totalPatients / networkSize : 0;
      
      // Performance Score Calculation (0-100)
      const billabilityScore = totalPatients > 0 ? (billablePatients / totalPatients) * 100 : 0;
      const revenueScore = Math.min((avgRevenuePerPatient / 2500) * 100, 100); // $2500 as benchmark
      const networkEfficiencyScore = Math.min((patientsPerHHA / 10) * 100, 100); // 10 patients per HHA as optimal
      const overallScore = (billabilityScore + revenueScore + networkEfficiencyScore) / 3;
      
      // Risk Assessment
      const riskFactors = [];
      if (billabilityScore < 60) riskFactors.push('Low Billability Rate');
      if (pendingPatients > totalPatients * 0.3) riskFactors.push('High Pending Reviews');
      if (avgRevenuePerPatient < 1500) riskFactors.push('Below Average Revenue');
      if (networkSize < 2) riskFactors.push('Limited Network Coverage');
      if (totalPatients < 5) riskFactors.push('Low Patient Volume');
      
      // Recommendations
      const recommendations = [];
      if (billabilityScore < 70) {
        recommendations.push({
          type: 'billing',
          priority: 'high',
          action: 'Improve Documentation Process',
          impact: 'Increase billable rate by 15-20%'
        });
      }
      if (networkSize < 3) {
        recommendations.push({
          type: 'network',
          priority: 'medium',
          action: 'Expand HHA Partnerships',
          impact: 'Increase patient capacity and service coverage'
        });
      }
      if (avgRevenuePerPatient < 2000) {
        recommendations.push({
          type: 'revenue',
          priority: 'high',
          action: 'Optimize Care Plans',
          impact: 'Increase revenue per patient by $300-500'
        });
      }
      
      // Success Indicators
      const successFactors = [];
      if (billabilityScore >= 80) successFactors.push('Excellent Billability');
      if (avgRevenuePerPatient >= 2200) successFactors.push('High Revenue Per Patient');
      if (networkSize >= 4) successFactors.push('Strong Network Coverage');
      if (totalPatients >= 15) successFactors.push('Good Patient Volume');
      
      return {
        ...pg,
        metrics: {
          totalPatients,
          billablePatients,
          pendingPatients,
          unbillablePatients,
          totalRevenue,
          avgRevenuePerPatient,
          chronicCarePatients,
          networkSize,
          patientsPerHHA,
          billabilityScore,
          revenueScore,
          networkEfficiencyScore,
          overallScore
        },
        riskFactors,
        recommendations,
        successFactors,
        attentionLevel: overallScore < 50 ? 'critical' : overallScore < 70 ? 'needs-attention' : 'performing-well'
      };
    }).sort((a, b) => {
      // Sort by attention needed (worst performing first for action items)
      if (performanceFilter === 'needs-attention') {
        return a.metrics.overallScore - b.metrics.overallScore;
      }
      // Sort by best performing first for success stories
      return b.metrics.overallScore - a.metrics.overallScore;
    });
  }, [pgs, patients, performanceFilter]);

  // Filter PGs based on search and performance filter
  const filteredPGs = useMemo(() => {
    let filtered = pgIntelligence;
    
    if (searchTerm) {
      filtered = filtered.filter(pg => 
        pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pg.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pg.state?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (performanceFilter !== 'all') {
      filtered = filtered.filter(pg => pg.attentionLevel === performanceFilter);
    }
    
    return filtered;
  }, [pgIntelligence, searchTerm, performanceFilter]);

  // Patient Matching Intelligence
  const patientMatchingProfiles = [
    {
      id: 'chronic-care',
      name: 'Chronic Care Management',
      description: 'Diabetes, Hypertension, COPD, Heart Conditions',
      idealPGCriteria: ['High chronic care volume', 'Specialized network', 'Good billability'],
      icon: Heart
    },
    {
      id: 'post-acute',
      name: 'Post-Acute Recovery', 
      description: 'Surgical recovery, Rehabilitation, Wound care',
      idealPGCriteria: ['Fast processing', 'Skilled nursing network', 'High revenue per patient'],
      icon: Activity
    },
    {
      id: 'high-complexity',
      name: 'High-Complexity Cases',
      description: 'Multiple conditions, Complex medication management',
      idealPGCriteria: ['Large network', 'High success rate', 'Specialized care'],
      icon: AlertCircle
    }
  ];

  const getRecommendedPGsForProfile = (profileId) => {
    return filteredPGs.filter(pg => {
      switch (profileId) {
        case 'chronic-care':
          return pg.metrics.chronicCarePatients >= 3 && pg.metrics.billabilityScore >= 70;
        case 'post-acute':
          return pg.metrics.avgRevenuePerPatient >= 2000 && pg.metrics.overallScore >= 70;
        case 'high-complexity':
          return pg.metrics.networkSize >= 3 && pg.metrics.overallScore >= 75;
        default:
          return true;
      }
    }).slice(0, 3);
  };

  const getAttentionLevelColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'needs-attention': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'performing-well': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'billing': return DollarSign;
      case 'network': return Users;
      case 'revenue': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const PGIntelligenceCard = ({ pg, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
        pg.attentionLevel === 'critical' ? 'border-l-red-500' :
        pg.attentionLevel === 'needs-attention' ? 'border-l-yellow-500' :
        'border-l-green-500'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {pg.name}
                {pg.attentionLevel === 'performing-well' && (
                  <Award className="w-5 h-5 text-yellow-500" />
                )}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{pg.city}, {pg.state}</p>
            </div>
            <Badge className={getAttentionLevelColor(pg.attentionLevel)}>
              {pg.attentionLevel === 'critical' ? 'Critical' :
               pg.attentionLevel === 'needs-attention' ? 'Needs Attention' :
               'Performing Well'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Performance Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Performance</span>
              <span className="text-sm font-bold">{Math.round(pg.metrics.overallScore)}%</span>
            </div>
            <Progress 
              value={pg.metrics.overallScore} 
              className={`h-2 ${
                pg.metrics.overallScore >= 70 ? 'bg-green-100' :
                pg.metrics.overallScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
              }`}
            />
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Patients</span>
                <span className="font-semibold">{pg.metrics.totalPatients}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Billable Rate</span>
                <span className={`font-semibold ${
                  pg.metrics.billabilityScore >= 80 ? 'text-green-600' :
                  pg.metrics.billabilityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {Math.round(pg.metrics.billabilityScore)}%
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Network Size</span>
                <span className="font-semibold">{pg.metrics.networkSize} HHAs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Revenue</span>
                <span className="font-semibold">${Math.round(pg.metrics.avgRevenuePerPatient)}</span>
              </div>
            </div>
          </div>

          {/* Success Factors */}
          {pg.successFactors.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                Success Factors
              </h5>
              <div className="flex flex-wrap gap-1">
                {pg.successFactors.map((factor, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Risk Factors */}
          {pg.riskFactors.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Risk Factors
              </h5>
              <div className="flex flex-wrap gap-1">
                {pg.riskFactors.map((factor, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Top Recommendations */}
          {pg.recommendations.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                Priority Actions
              </h5>
              <div className="space-y-2">
                {pg.recommendations.slice(0, 2).map((rec, i) => {
                  const IconComponent = getRecommendationIcon(rec.type);
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <IconComponent className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-blue-900">{rec.action}</p>
                        <p className="text-xs text-blue-700">{rec.impact}</p>
                      </div>
                      <Badge className={`text-xs ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Intelligence Summary */}
      <div className="grid lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-700">
                  {pgIntelligence.filter(pg => pg.attentionLevel === 'critical').length}
                </div>
                <div className="text-sm text-red-600">Critical Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-700">
                  {pgIntelligence.filter(pg => pg.attentionLevel === 'needs-attention').length}
                </div>
                <div className="text-sm text-yellow-600">Needs Attention</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {pgIntelligence.filter(pg => pg.attentionLevel === 'performing-well').length}
                </div>
                <div className="text-sm text-green-600">Performing Well</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  {pgIntelligence.reduce((sum, pg) => sum + pg.recommendations.length, 0)}
                </div>
                <div className="text-sm text-blue-600">Action Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs defaultValue="intelligence" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="intelligence">
                <BarChart3 className="w-4 h-4 mr-2" />
                PG Intelligence Center
              </TabsTrigger>
              <TabsTrigger value="patient-matching">
                <Users className="w-4 h-4 mr-2" />
                Patient Matching Engine
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="intelligence" className="space-y-4 mt-0">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search PGs by name, city, or state..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Performance Levels</SelectItem>
                    <SelectItem value="critical">Critical Attention</SelectItem>
                    <SelectItem value="needs-attention">Needs Attention</SelectItem>
                    <SelectItem value="performing-well">Performing Well</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PG Intelligence Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredPGs.map((pg, index) => (
                    <PGIntelligenceCard key={pg.name} pg={pg} index={index} />
                  ))}
                </AnimatePresence>
              </div>

              {filteredPGs.length === 0 && (
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No PGs Match Your Criteria</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="patient-matching" className="space-y-6 mt-0">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Intelligent Patient Matching</h3>
                <p className="text-gray-600">Find the best PG matches based on patient care profiles and needs</p>
              </div>

              <div className="space-y-6">
                {patientMatchingProfiles.map((profile) => {
                  const IconComponent = profile.icon;
                  const recommendedPGs = getRecommendedPGsForProfile(profile.id);
                  
                  return (
                    <Card key={profile.id} className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{profile.name}</CardTitle>
                            <p className="text-sm text-gray-600">{profile.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-800 mb-2">Ideal PG Criteria:</h5>
                          <div className="flex flex-wrap gap-2">
                            {profile.idealPGCriteria.map((criteria, i) => (
                              <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {criteria}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            Top Recommended PGs ({recommendedPGs.length})
                          </h5>
                          
                          {recommendedPGs.length > 0 ? (
                            <div className="grid md:grid-cols-3 gap-4">
                              {recommendedPGs.map((pg, i) => (
                                <div key={pg.name} className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                  <div className="flex items-start justify-between mb-2">
                                    <h6 className="font-medium text-green-900 text-sm">{pg.name}</h6>
                                    <Badge className="bg-green-200 text-green-800 text-xs">
                                      #{i + 1}
                                    </Badge>
                                  </div>
                                  <div className="space-y-1 text-xs text-green-700">
                                    <div className="flex justify-between">
                                      <span>Performance:</span>
                                      <span className="font-semibold">{Math.round(pg.metrics.overallScore)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Patients:</span>
                                      <span className="font-semibold">{pg.metrics.totalPatients}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Network:</span>
                                      <span className="font-semibold">{pg.metrics.networkSize} HHAs</span>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline" className="w-full mt-2 bg-white/50 hover:bg-white">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Assign Patient
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                No PGs currently meet the criteria for this patient profile. Consider expanding network partnerships or improving performance metrics.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PatientCentricIntelligence;