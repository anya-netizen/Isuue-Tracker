import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Hospital, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  FileText, 
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Heart,
  MessageSquare,
  Star,
  Activity,
  Network,
  MessageCircle,
  Map
} from 'lucide-react';

// Import data and tab components
import { physicianGroups, patients as mockPatients, documents as mockDocuments } from '@/data/mockData';
import { enhancedPhysicianGroups } from '@/data/enhancedPGData';
import PatientCentricOverview from '../components/dashboard/PatientCentricOverview';
import ServicesTab from '../components/pg-dashboard/ServicesTab';
import CustomerSuccessTab from '../components/pg-dashboard/CustomerSuccessTab';
import CommunicationTab from '../components/pg-dashboard/CommunicationTab';
import DocumentationTab from '../components/dashboard/DocumentationTab';
import InteractiveUSMapEnhanced from '../components/map/InteractiveUSMapEnhancedSimple';
import PGNetworkVisualization from '../components/pg/PGNetworkVisualization';

export default function PGDashboardNew() {
  const [selectedPG, setSelectedPG] = useState(null);
  const [pgs, setPgs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [tutorialData, setTutorialData] = useState(null);

  // Listen for navigation events from the map
  useEffect(() => {
    const handleNavigateToServices = (event) => {
      const detail = event.detail || {};
      console.log('Navigation event received:', detail);

      if (detail.pgName || detail.pgId) {
        const matchById = detail.pgId ? pgs.find((pg) => pg.id === detail.pgId) : null;
        const matchByName = detail.pgName ? pgs.find((pg) => pg.name === detail.pgName) : null;
        const pgMatch = matchById || matchByName;
        if (pgMatch) {
          setSelectedPG(pgMatch);
        }
      }

      setActiveTab('services');
      if (Object.keys(detail).length) {
        setTutorialData(detail);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('navigateToServices', handleNavigateToServices);
    
    return () => {
      window.removeEventListener('navigateToServices', handleNavigateToServices);
    };
  }, [pgs]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load actual data from mockData.js and enhanced data
        const combinedPGs = [...physicianGroups, ...enhancedPhysicianGroups];
        setPgs(combinedPGs);
        setPatients(mockPatients);
        setDocuments(mockDocuments);

        let initialSelection = null;
        const storedPgName = sessionStorage.getItem('servicesDashboardSelectedPG');
        const storedContextRaw = sessionStorage.getItem('servicesDashboardContext');

        if (storedPgName) {
          initialSelection = combinedPGs.find(pg => pg.name === storedPgName || pg.id === storedPgName) || null;
        }

        if (!initialSelection && combinedPGs.length > 0 && mockPatients.length > 0) {
          const patientPgNames = new Set(mockPatients.map(p => p.current_pg).filter(Boolean));
          initialSelection = combinedPGs.find(pg => patientPgNames.has(pg.name)) || combinedPGs[0];
        }

        if (!initialSelection && combinedPGs.length > 0) {
          initialSelection = combinedPGs[0];
        }

        if (initialSelection) {
          setSelectedPG(initialSelection);
        }

        if (storedContextRaw) {
          try {
            const parsed = JSON.parse(storedContextRaw);
            setActiveTab('services');
            setTutorialData(parsed);
          } catch (error) {
            console.warn('Failed to parse services dashboard context', error);
          }
        }

        if (storedPgName) {
          sessionStorage.removeItem('servicesDashboardSelectedPG');
        }
        if (storedContextRaw) {
          sessionStorage.removeItem('servicesDashboardContext');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getPGStats = () => {
    if (!selectedPG || !patients.length) return {};
    
    // Filter patients for the selected PG
    const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
    
    // Calculate real stats from patient data
    const billablePatients = pgPatients.filter(p => p.billability_status === 'billable').length;
    // For Metro Health PG, set fixed revenue to 9865
    const totalRevenue = selectedPG?.name === "Metro Health PG" ? 9865 : pgPatients
      .filter(p => p.billability_status === 'billable' && p.cpt_charges)
      .reduce((sum, p) => sum + parseFloat(p.cpt_charges || 0), 0);
    
    const completedPatients = pgPatients.filter(p => 
      p.billability_status === 'billable' || p.billability_status === 'unbillable'
    ).length;
    const completionRate = pgPatients.length > 0 ? Math.round((completedPatients / pgPatients.length) * 100) : 0;
    
    const recentDocuments = documents.filter(d => 
      pgPatients.some(p => p.id === d.patient_id)
    ).length;
    
    return {
      totalPatients: pgPatients.length,
      billablePatients,
      completionRate,
      recentDocuments,
      totalRevenue: Math.round(totalRevenue)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading PG Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPG) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Hospital className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Physician Group Selected</h3>
            <p className="text-gray-500">Please select a Physician Group to view the dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getPGStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* PG Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/5 to-blue-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Hospital className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{selectedPG.name}</h1>
                    <p className="text-slate-600 text-lg">{selectedPG.type || 'Physician Group'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{selectedPG.address}, {selectedPG.city}, {selectedPG.state} {selectedPG.zip}</span>
                    </div>
                    {selectedPG.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span>{selectedPG.phone}</span>
                      </div>
                    )}
                    {selectedPG.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span>{selectedPG.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      NPI: {selectedPG.npi}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedPG.specialties?.join(', ') || 'General Practice'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                {/* PG Selection Dropdown */}
                <div className="w-80 mb-4">
                  <Select 
                    value={selectedPG?.name || ''} 
                    onValueChange={(value) => {
                      const selectedPGObj = pgs.find(pg => pg.name === value);
                      setSelectedPG(selectedPGObj);
                    }}
                  >
                    <SelectTrigger className="w-full bg-white/90 border-2 border-indigo-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                      <SelectValue placeholder="Select Physician Group" />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border border-indigo-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {pgs.map((pg) => {
                        const pgPatients = patients.filter(p => p.current_pg === pg.name);
                        return (
                          <SelectItem key={pg.name} value={pg.name} className="hover:bg-indigo-50 rounded-lg mx-1 my-1">
                            <div className="flex flex-col gap-1 py-1">
                              <span className="font-medium text-slate-900">{pg.name}</span>
                              <span className="text-xs text-slate-500">
                                {pgPatients.length} patients • {pg.city}, {pg.state}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalPatients}</div>
                    <div className="text-xs text-blue-700">Total Patients</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
                    <div className="text-xs text-green-700">Success Rate</div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="bg-white/80">
                  <Activity className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Notification Banner */}
        {tutorialData && (
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    {tutorialData.attentionLevel === 'critical' ? '🚨' : 
                     tutorialData.attentionLevel === 'needs-attention' ? '⚠️' : '📊'}
                  </div>
                  <div>
                    <p className="font-semibold">Action Mode Activated</p>
                    <p className="text-sm opacity-90">
                      Navigate to Services tab for guided actions on {tutorialData.pgName}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20"
                  onClick={() => setTutorialData(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Tabs */}
        <div>
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-200">
                                <TabsList className="grid w-full grid-cols-6 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="overview" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services" 
                    className={`data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4 relative ${tutorialData ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Services
                    {tutorialData && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
                        <div className="absolute inset-0 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="customer-success" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Customer Success
                  </TabsTrigger>
                  <TabsTrigger 
                    value="communication" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Communication
                  </TabsTrigger>
                  <TabsTrigger 
                    value="map" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Network Map
                  </TabsTrigger>
                  <TabsTrigger 
                    value="documentation" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 py-4"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  <PatientCentricOverview 
                    selectedPG={selectedPG} 
                    patients={patients} 
                    documents={documents}
                    stats={stats}
                    onPatientSelect={(patient) => {
                      console.log('Patient selected:', patient);
                      // Navigate to Services tab and select patient
                      setActiveTab('services');
                      // Store patient data for Services tab
                      sessionStorage.setItem('selectedPatientFromNetwork', JSON.stringify(patient));
                      // Scroll to top for better UX
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onRefresh={() => {
                      console.log('Refreshing data...');
                      // Handle refresh if needed
                    }}
                  />
                </TabsContent>

                <TabsContent value="services" className="space-y-6 mt-0">
                  <ServicesTab 
                    selectedPG={selectedPG}
                    patients={patients}
                    pgs={pgs}
                    tutorialData={tutorialData}
                    onTutorialComplete={() => setTutorialData(null)}
                  />
                </TabsContent>

                <TabsContent value="customer-success" className="space-y-6 mt-0">
                  <CustomerSuccessTab 
                    selectedPG={selectedPG}
                    patients={patients}
                    documents={documents}
                  />
                </TabsContent>

                <TabsContent value="communication" className="space-y-6 mt-0">
                  <CommunicationTab 
                    selectedPG={selectedPG}
                    patients={patients}
                  />
                </TabsContent>

                                <TabsContent value="map" className="mt-0 p-0 -m-6">
                  <div className="h-[calc(100vh-200px)]">
                    <InteractiveUSMapEnhanced 
                      pgs={enhancedPhysicianGroups} 
                      patients={mockPatients}
                      onPGSelect={(pg) => {
                        setSelectedPG(pg);
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-6 mt-0">
                  <DocumentationTab 
                    selectedPG={selectedPG}
                    patients={patients}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}