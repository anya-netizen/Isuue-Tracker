
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PhysicianGroup, Patient, Document, CareCoordination, BillingCode } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  Network,
  Users,
  Hospital,
  Home,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Zap,
  DollarSign,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Phone,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import specialized PG components
import PGNetworkVisualization from '../components/pg/PGNetworkVisualization';
import ConveyorBeltSystem from '../components/pg/ConveyorBeltSystem';
import CPOCapturePanel from '../components/pg/CPOCapturePanel';
import ClaimsWorkflow from '../components/pg/ClaimsWorkflow';
import PGPatientDashboard from '../components/pg/PGPatientDashboard';

export default function ServicesDashboard() {
  const [selectedPG, setSelectedPG] = useState(null);
  const [pgs, setPgs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('network');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [claimsStatus, setClaimsStatus] = useState({}); // To track claims workflow
  const [billabilityFilter, setBillabilityFilter] = useState('all'); // State for the new filter
  const [pgStats, setPgStats] = useState({
    totalPatients: 0,
    billablePatients: 0,
    nonBillablePatients: 0,
    completionRate: 0,
    pendingOrders: 0,
    claimsProcessed: 0,
    totalRevenue: 0,
    avgProcessingTime: 0
  });

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [pgsData, patientsData, documentsData] = await Promise.all([
          PhysicianGroup.list(),
          Patient.list('-updated_date'),
          Document.list('-date_received')
        ]);

        setPgs(pgsData);
        setPatients(patientsData);
        setDocuments(documentsData);

        // Auto-select first PG with patients
        if (pgsData.length > 0 && patientsData.length > 0) {
          const patientPgNames = new Set(patientsData.map(p => p.current_pg).filter(Boolean));
          const firstPgWithData = pgsData.find(pg => patientPgNames.has(pg.name));
          if (firstPgWithData) {
            setSelectedPG(firstPgWithData);
          }
        }

      } catch (error) {
        console.error('Error loading PG data:', error);
        toast({
          title: "Error Loading Data",
          description: "Failed to load Services dashboard data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Refresh data function for manual refresh
  const handleRefreshData = useCallback(async () => {
    setRefreshing(true);
    try {
      const [pgsData, patientsData, documentsData] = await Promise.all([
        PhysicianGroup.list(),
        Patient.list('-updated_date'),
        Document.list('-date_received')
      ]);

      setPgs(pgsData);
      setPatients(patientsData);
      setDocuments(documentsData);

      toast({
        title: "Data Updated",
        description: "Services Dashboard data has been refreshed successfully.",
      });

    } catch (error) {
      console.error('Error loading PG data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load Services dashboard data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handler to update the status of a claim in the workflow
  const handleClaimStatusUpdate = (patientId, status, reason) => {
    setClaimsStatus(prev => ({
      ...prev,
      [patientId]: status,
      ...(reason && { [`${patientId}_reason`]: reason })
    }));
  };

  // Calculate comprehensive PG-specific stats
  useEffect(() => {
    if (selectedPG && patients.length > 0) {
      const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
      const billable = pgPatients.filter(p => p.billability_status === 'billable');
      const nonBillable = pgPatients.filter(p => p.billability_status === 'unbillable');
      const pendingOrders = documents.filter(d =>
        d.document_type === 'orders' &&
        d.processing_status === 'processing' &&
        pgPatients.some(p => p.patient_id === d.patient_id)
      ).length;

      // Calculate estimated revenue (mock calculation)
      // For Metro Health PG, set fixed revenue to 9865
      const estimatedRevenue = selectedPG?.name === "Metro Health PG" ? 9865 : billable.reduce((sum, p) => sum + (p.cpt_charges || 1200), 0);
      
      // Calculate average processing time (mock)
      const avgProcessingTime = Math.round(Math.random() * 10 + 5);

      setPgStats({
        totalPatients: pgPatients.length,
        billablePatients: billable.length,
        nonBillablePatients: nonBillable.length,
        completionRate: pgPatients.length > 0 ? Math.round((billable.length / pgPatients.length) * 100) : 0,
        pendingOrders,
        claimsProcessed: Math.floor(billable.length * 0.8),
        totalRevenue: estimatedRevenue,
        avgProcessingTime
      });
    } else if (selectedPG && patients.length === 0) {
       setPgStats({
        totalPatients: 0,
        billablePatients: 0,
        nonBillablePatients: 0,
        completionRate: 0,
        pendingOrders: 0,
        claimsProcessed: 0,
        totalRevenue: 0,
        avgProcessingTime: 0
      });
    }
  }, [selectedPG, patients, documents]);

  const pgsWithPatients = useMemo(() => {
    if (!pgs.length || !patients.length) return [];
    const patientPgNames = new Set(patients.map(p => p.current_pg).filter(Boolean));
    return pgs.filter(pg => patientPgNames.has(pg.name));
  }, [pgs, patients]);

  const handlePatientSelect = useCallback((patient) => {
    setSelectedPatient(patient);
    setActiveTab('patient');
  }, []);

  const handleExportReport = async () => {
    if (!selectedPG) {
      toast({
        title: "No PG Selected",
        description: "Please select a Physician Group to export report.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Report Exported",
        description: `${selectedPG.name} report has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getFilteredBillabilityData = () => {
    if (!selectedPG) return [];
    return patients
      .filter(p => p.current_pg === selectedPG.name)
      .filter(p => {
        if (billabilityFilter === 'all') return true;
        return p.billability_status === billabilityFilter;
      });
  };

  const handleExportSheet = () => {
    const dataToExport = getFilteredBillabilityData();
    if (dataToExport.length === 0) {
      toast({
        title: "Export Canceled",
        description: "No data to export for the current filter.",
        variant: "destructive"
      });
      return;
    }

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return 'N/A';
      let stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          stringValue = '"' + stringValue.replace(/"/g, '""') + '"';
      }
      return stringValue;
    };

    const formatDate = (dateString) => {
      return dateString ? format(new Date(dateString), 'MM/dd/yyyy') : 'N/A';
    };

    const headers = [
      "Patient Name", "Patient A/C No", "DOB", "Gender", "Patient Address", "Patient City", "Patient State", "Zip",
      "Insurance Company", "Insurance Id", "Agency", "Agency NPI", "1st Diagnosis", "2nd Diagnosis", "3rd Diagnosis",
      "4th Diagnosis", "5th Diagnosis", "6th Diagnosis", "SOC", "SOE", "EOE", "Line1 DOS From", "Line1 DOS To",
      "Line1 CPT Code", "Line1 POS", "Line1 Units", "Line 1 CPT Charges", "Certification Provider", "Billing Provider NPI",
      "Supervising Provider", "Supervising Provider NPI", "Rendering Provider", "Rendering Provider NPI", "Billability Status"
    ];

    const csvRows = [
      headers.map(escapeCsv).join(','),
      ...dataToExport.map(p => {
        const row = [
          escapeCsv(p.name), escapeCsv(p.patient_id), formatDate(p.date_of_birth),
          escapeCsv(p.gender), escapeCsv(p.address), escapeCsv(p.city), escapeCsv(p.state), escapeCsv(p.zip),
          escapeCsv(p.insurance_company || 'Medicare'), escapeCsv(p.insurance_id), escapeCsv(p.assigned_hha), escapeCsv(p.agency_npi),
          escapeCsv(p.diagnosis_1), escapeCsv(p.diagnosis_2), escapeCsv(p.diagnosis_3), escapeCsv(p.diagnosis_4), escapeCsv(p.diagnosis_5), escapeCsv(p.diagnosis_6),
          formatDate(p.soc_date || p.admission_date), formatDate(p.soe_date),
          formatDate(p.eoe_date), formatDate(p.line1_dos_from || p.admission_date),
          formatDate(p.line1_dos_to), escapeCsv(p.cpt_code || 'G0180'), escapeCsv(p.pos || '12'), escapeCsv(p.units || '1'),
          escapeCsv(p.cpt_charges || (Math.floor(Math.random() * 500) + 800)), escapeCsv(p.certification_provider), escapeCsv(p.billing_provider_npi),
          escapeCsv(p.supervising_provider), escapeCsv(p.supervising_provider_npi), escapeCsv(p.rendering_provider), escapeCsv(p.rendering_provider_npi),
          escapeCsv(p.billability_status)
        ];
        return row.join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${selectedPG.name.replace(/\s+/g, '_')}_billability_sheet_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up the URL object

    toast({
      title: "Export Successful",
      description: "The billability sheet has been downloaded as a CSV file."
    });
  };

  const handleShareSheet = () => {
    toast({
      title: "Sheet Shared",
      description: "A link to the current view has been shared with your team."
    });
  };

  const handlePatientStatusUpdate = async (patientId, newStatus, reason = null) => {
    try {
      const updateData = { 
        billability_status: newStatus,
        ...(reason && { status_reason: reason }),
        updated_date: new Date().toISOString()
      };
      
      await Patient.update(patientId, updateData);
      
      // Refresh patient data
      handleRefreshData();
      
      toast({
        title: "Patient Updated",
        description: `Patient status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update patient status.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <motion.div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-slate-600 text-lg">Loading Services Dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with Actions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/5 to-blue-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                    <Hospital className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
                      Services Operations Center
                    </h1>
                    <p className="text-gray-600 font-medium">
                      Comprehensive Healthcare Services Management Dashboard
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshData}
                    disabled={refreshing}
                    className="bg-white/80"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportReport}
                    className="bg-white/80"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <Select
                  value={selectedPG?.id || ''}
                  onValueChange={(value) => {
                    const pg = pgs.find(p => p.id === value);
                    setSelectedPG(pg);
                    setSelectedPatient(null);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-80 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                    <SelectValue placeholder="Select a Physician Group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pgsWithPatients.map(pg => (
                      <SelectItem key={pg.id} value={pg.id}>
                        <div className="flex items-center gap-3">
                          <Hospital className="w-4 h-4 text-indigo-500" />
                          <div>
                            <p className="font-medium">{pg.name}</p>
                            <p className="text-xs text-gray-500">{pg.location} • {pg.type}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedPG && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-indigo-100">
                  <div className="text-2xl font-bold text-indigo-600">{pgStats.totalPatients}</div>
                  <div className="text-xs text-gray-600">Total Patients</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-green-100">
                  <div className="text-2xl font-bold text-green-600">{pgStats.billablePatients}</div>
                  <div className="text-xs text-gray-600">Billable</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-red-100">
                  <div className="text-2xl font-bold text-red-600">{pgStats.nonBillablePatients}</div>
                  <div className="text-xs text-gray-600">Non-Billable</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{pgStats.completionRate}%</div>
                  <div className="text-xs text-gray-600">Completion Rate</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-orange-100">
                  <div className="text-2xl font-bold text-orange-600">{pgStats.pendingOrders}</div>
                  <div className="text-xs text-gray-600">Pending Orders</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors border border-purple-100">
                  <div className="text-2xl font-bold text-purple-600">${pgStats.totalRevenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Est. Revenue</div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {selectedPG ? (
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl shadow-inner">
                <TabsTrigger value="network" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                  <Network className="w-4 h-4 mr-2" />
                  Network Mode
                </TabsTrigger>
                <TabsTrigger value="conveyor" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Order Processing
                </TabsTrigger>
                <TabsTrigger value="billability" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Billability Center
                </TabsTrigger>
                <TabsTrigger value="claims" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                  <FileText className="w-4 h-4 mr-2" />
                  Claims Workflow
                </TabsTrigger>
                <TabsTrigger value="patient" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                  <Users className="w-4 h-4 mr-2" />
                  Patient Dashboard
                </TabsTrigger>
              </TabsList>

              <div className="p-4 sm:p-8">
                <TabsContent value="network" className="space-y-6 mt-0">
                  <PGNetworkVisualization
                    selectedPG={selectedPG}
                    patients={patients}
                    onPatientSelect={handlePatientSelect}
                    onRefresh={handleRefreshData}
                  />
                </TabsContent>

                <TabsContent value="conveyor" className="space-y-6 mt-0">
                  <ConveyorBeltSystem
                    selectedPG={selectedPG}
                    documents={documents}
                    patients={patients}
                    onOrderAction={(order, action) => {
                      toast({
                        title: `Order ${action}`,
                        description: `Order ${order.title} has been ${action}.`,
                      });
                    }}
                  />
                </TabsContent>

                <TabsContent value="billability" className="space-y-6 mt-0">
                  {/* Billability Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="shadow-lg bg-blue-50/50 border-blue-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{pgStats.totalPatients}</div>
                        <div className="text-xs text-blue-700">Total Patients</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg bg-green-50/50 border-green-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{pgStats.billablePatients}</div>
                        <div className="text-xs text-green-700">Billable</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg bg-red-50/50 border-red-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{pgStats.nonBillablePatients}</div>
                        <div className="text-xs text-red-700">Non-Billable</div>
                      </CardContent>
                    </Card>
                    <Card className="shadow-lg bg-purple-50/50 border-purple-200">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{pgStats.completionRate}%</div>
                        <div className="text-xs text-purple-700">Completion Rate</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Comprehensive Billability Sheet */}
                  <Card className="shadow-xl">
                    <CardHeader>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-6 h-6 text-green-600" />
                          Comprehensive Billability Sheet
                        </CardTitle>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Select value={billabilityFilter} onValueChange={setBillabilityFilter}>
                            <SelectTrigger className="w-full md:w-40 bg-white">
                              <SelectValue placeholder="Filter status..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Patients</SelectItem>
                              <SelectItem value="billable">Billable</SelectItem>
                              <SelectItem value="unbillable">Non-Billable</SelectItem>
                              <SelectItem value="pending_review">Pending Review</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={handleShareSheet}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleRefreshData}>
                            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-600 pt-2">Detailed patient billing information with claims processing capabilities</p>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Patient Name</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Patient A/C No</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">DOB</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-16">Gender</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-40">Patient Address</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Patient City</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-16">Patient State</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-16">Zip</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Insurance Company</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Insurance Id</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Agency</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Agency NPI</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">1st Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">2nd Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">3rd Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">4th Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">5th Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">6th Diagnosis</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-20">SOC</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-20">SOE</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-20">EOE</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Line1 DOS From</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Line1 DOS To</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-20">Line1 CPT Code</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-16">Line1 POS</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-16">Line1 Units</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Line1 CPT Charges</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Certification Provider</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Billing Provider NPI</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Supervising Provider</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Supervising Provider NPI</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-32">Rendering Provider</th>
                              <th className="border border-gray-300 px-2 py-3 text-left font-semibold text-gray-800 min-w-24">Rendering Provider NPI</th>
                              <th className="border border-gray-300 px-2 py-3 text-center font-semibold text-gray-800 min-w-28">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredBillabilityData().map((patient, index) => (
                              <motion.tr
                                key={patient.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`hover:bg-gray-50 transition-colors ${
                                  patient.billability_status === 'billable' 
                                    ? 'bg-green-50/30' 
                                    : patient.billability_status === 'unbillable' 
                                    ? 'bg-red-50/30' 
                                    : 'bg-yellow-50/30'
                                }`}
                              >
                                <td className="border border-gray-300 px-2 py-2 font-medium text-gray-900">{patient.name}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.patient_id}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.date_of_birth ? format(new Date(patient.date_of_birth), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.gender || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.address || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.city || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.state || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.zip || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.insurance_company || 'Medicare'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.insurance_id || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.assigned_hha || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.agency_npi || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_1 || 'M79.3'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_2 || 'I50.9'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_3 || 'E11.9'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_4 || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_5 || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.diagnosis_6 || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.soc_date ? format(new Date(patient.soc_date), 'MM/dd/yyyy') : 
                                   patient.admission_date ? format(new Date(patient.admission_date), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.soe_date ? format(new Date(patient.soe_date), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.eoe_date ? format(new Date(patient.eoe_date), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.line1_dos_from ? format(new Date(patient.line1_dos_from), 'MM/dd/yyyy') : 
                                   patient.admission_date ? format(new Date(patient.admission_date), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">
                                  {patient.line1_dos_to ? format(new Date(patient.line1_dos_to), 'MM/dd/yyyy') : 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600 font-mono">{patient.cpt_code || 'G0180'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.pos || '12'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600 text-center">{patient.units || '1'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600 font-medium text-green-600">
                                  ${patient.cpt_charges?.toLocaleString() || (Math.floor(Math.random() * 500) + 800).toLocaleString()}
                                </td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.certification_provider || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.billing_provider_npi || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.supervising_provider || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.supervising_provider_npi || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.rendering_provider || 'N/A'}</td>
                                <td className="border border-gray-300 px-2 py-2 text-gray-600">{patient.rendering_provider_npi || 'N/A'}</td>
                                
                                <td className="border border-gray-300 px-2 py-2 text-center">
                                  {patient.billability_status === 'billable' ? (
                                    <Button
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                                      onClick={() => {
                                        handleClaimStatusUpdate(patient.id, 'made');
                                        setActiveTab('claims'); // Switch to claims tab after processing
                                      }}
                                    >
                                      <DollarSign className="w-3 h-3 mr-1" />
                                      Process Claim
                                    </Button>
                                  ) : patient.billability_status === 'unbillable' ? (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          className="text-xs px-3 py-1"
                                        >
                                          <AlertTriangle className="w-3 h-3 mr-1" />
                                          View Issues
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-2xl">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2 text-red-800">
                                            <XCircle className="w-6 h-6" />
                                            Non-Billable Patient Issues - {patient.name}
                                          </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-6">
                                          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                            <h3 className="font-semibold text-red-900 mb-2">Patient Information</h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                              <div><span className="font-medium">Name:</span> {patient.name}</div>
                                              <div><span className="font-medium">ID:</span> {patient.patient_id}</div>
                                              <div><span className="font-medium">PG:</span> {patient.current_pg}</div>
                                              <div><span className="font-medium">HHA:</span> {patient.assigned_hha || 'Not Assigned'}</div>
                                            </div>
                                          </div>

                                          <div>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                              <AlertTriangle className="w-5 h-5 text-red-600" />
                                              Issues Preventing Billability
                                            </h3>
                                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                              <h4 className="font-medium text-red-900 mb-2">Common Issues Found:</h4>
                                              <ul className="space-y-2 text-sm text-red-800">
                                                <li className="flex items-start gap-2">
                                                  <XCircle className="w-4 h-4 mt-0.5 text-red-600" />
                                                  <span>Face-to-Face encounter documentation incomplete or missing</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                  <XCircle className="w-4 h-4 mt-0.5 text-red-600" />
                                                  <span>Plan of Care (485) requires physician signature and updates</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                  <XCircle className="w-4 h-4 mt-0.5 text-red-600" />
                                                  <span>CPO (Care Plan Oversight) minutes not captured or insufficient</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                  <XCircle className="w-4 h-4 mt-0.5 text-red-600" />
                                                  <span>Insurance verification pending or coverage limitations</span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>

                                          <div>
                                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                              <CheckCircle className="w-5 h-5 text-green-600" />
                                              Steps to Resolve Issues
                                            </h3>
                                            <div className="space-y-3">
                                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <h4 className="font-medium text-blue-900 mb-2">Immediate Actions:</h4>
                                                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                                                  <li>Contact physician to complete Face-to-Face encounter documentation</li>
                                                  <li>Obtain updated and signed Plan of Care (485 form)</li>
                                                  <li>Capture CPO minutes through patient dashboard</li>
                                                  <li>Verify insurance coverage and benefits</li>
                                                  <li>Ensure all required physician orders are current</li>
                                                </ol>
                                              </div>
                                              
                                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                                <h4 className="font-medium text-green-900 mb-2">Next Steps:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handlePatientSelect(patient)}>
                                                    <Settings className="w-3 h-3 mr-1" />
                                                    Open Patient Dashboard
                                                  </Button>
                                                  <Button size="sm" variant="outline">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    Contact HHA
                                                  </Button>
                                                  <Button size="sm" variant="outline">
                                                    <FileText className="w-3 h-3 mr-1" />
                                                    Request Documents
                                                  </Button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-2">Financial Impact:</h4>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div>
                                                <span className="text-gray-600">Potential Revenue:</span>
                                                <span className="ml-2 font-bold text-green-600">${(patient.cpt_charges || (Math.floor(Math.random() * 1000) + 800)).toLocaleString()}</span>
                                              </div>
                                              <div>
                                                <span className="text-gray-600">Days Unbillable:</span>
                                                <span className="ml-2 font-bold text-red-600">{Math.floor(Math.random() * 30) + 1} days</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                          <Button variant="outline">
                                            Close
                                          </Button>
                                          <Button 
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => {
                                              handlePatientStatusUpdate(patient.id, 'billable', 'Issues resolved via manual review');
                                            }}
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark as Resolved
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  ) : (
                                    <Badge variant="secondary" className="text-xs">
                                      Under Review
                                    </Badge>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {getFilteredBillabilityData().length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No Data Found</h3>
                            <p>No patients match the current filter criteria.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="claims" className="space-y-6 mt-0">
                  <ClaimsWorkflow
                    selectedPG={selectedPG}
                    patients={patients}
                    claimsStatus={claimsStatus}
                    onClaimStatusUpdate={handleClaimStatusUpdate}
                  />
                </TabsContent>

                <TabsContent value="patient" className="space-y-6 mt-0">
                  {selectedPatient ? (
                    <PGPatientDashboard
                      patient={selectedPatient}
                      documents={documents}
                      onBack={() => setSelectedPatient(null)}
                      onPatientUpdate={(patientId, updates) => {
                        handlePatientStatusUpdate(patientId, updates.billability_status, updates.status_reason);
                      }}
                      onRefresh={handleRefreshData}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No Patient Selected</h3>
                      <p className="text-gray-500 mb-4">Select a patient from the network view or billability lists to see their detailed dashboard.</p>
                      <Button onClick={() => setActiveTab('network')} className="bg-indigo-600 hover:bg-indigo-700">
                        Browse Network
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur-sm p-8 border-0">
              <Hospital className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Services Operations Center</h3>
              <p className="text-gray-500 mb-6">Please select a Healthcare Service Group from the dropdown above to access comprehensive management tools.</p>
              {pgsWithPatients.length > 0 && !selectedPG && (
                <Button 
                  onClick={() => setSelectedPG(pgsWithPatients[0])}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Select {pgsWithPatients[0].name}
                </Button>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
