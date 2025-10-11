import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Patient, Document, ActionItem } from '@/api/entities';
import { Check, Flag, Users, AlertTriangle, Clock, Zap, ArrowRight, Home, Hospital, FileText, CircleDollarSign, Search, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const MedicalJourneyMap = () => {
  const [patients, setPatients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('overview');
  const [tasksCreated, setTasksCreated] = useState([]);
  const [resolving, setResolving] = useState(false);
  
  // Use refs to prevent unnecessary re-renders
  const intervalRef = useRef(null);
  const lastLoadTime = useRef(Date.now());

  const daysSinceAdmission = useCallback((admissionDate) => {
    if (!admissionDate) return 0;
    return Math.floor((new Date() - new Date(admissionDate)) / (1000 * 60 * 60 * 24));
  }, []);

  const loadData = useCallback(async (isInitial = false) => {
    // Don't show loading spinner for background refreshes
    if (isInitial) {
      setInitialLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [patientData, documentData] = await Promise.all([
        Patient.list('-admission_date', 200),
        Document.list('-date_received', 500)
      ]);
      
      // Only update if data actually changed to prevent unnecessary re-renders
      setPatients(prevPatients => {
        const isDifferent = JSON.stringify(prevPatients) !== JSON.stringify(patientData);
        return isDifferent ? patientData : prevPatients;
      });
      
      setDocuments(prevDocuments => {
        const isDifferent = JSON.stringify(prevDocuments) !== JSON.stringify(documentData);
        return isDifferent ? documentData : prevDocuments;
      });

      lastLoadTime.current = Date.now();
    } catch (error) {
      console.error('Error loading journey data:', error);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        // Add small delay to prevent flicker
        setTimeout(() => setRefreshing(false), 100);
      }
    }
  }, []);

  useEffect(() => {
    loadData(true);

    // Set up interval for background refreshes
    intervalRef.current = setInterval(() => {
      // Only refresh if component is still mounted and enough time has passed
      if (Date.now() - lastLoadTime.current > 25000) {
        loadData(false);
      }
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadData]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  const getPatientDocuments = useCallback((patientId) => {
    return documents.filter(doc => doc.patient_id === patientId);
  }, [documents]);

  const hasDocument = useCallback((patientId, docType) => {
    return documents.some(doc => doc.patient_id === patientId && doc.document_type === docType);
  }, [documents]);

  const getPatientJourneyData = useCallback((patient) => {
    if (!patient) return null;

    const patientDocs = getPatientDocuments(patient.patient_id);
    const admissionDays = daysSinceAdmission(patient.admission_date);

    const stages = [
      {
        id: 'admission',
        name: 'Admission',
        icon: Hospital,
        status: 'completed',
        date: patient.admission_date,
        description: `Admitted to ${patient.current_pg}`,
        color: 'green'
      },
      {
        id: 'soc',
        name: 'SOC',
        icon: FileText,
        status: hasDocument(patient.patient_id, 'soc') ? 'completed' : 'missing',
        date: patientDocs.find(d => d.document_type === 'soc')?.date_received,
        description: 'Start of Care documentation',
        color: hasDocument(patient.patient_id, 'soc') ? 'green' : 'red',
        isOverdue: !hasDocument(patient.patient_id, 'soc') && admissionDays > 7
      },
      {
        id: 'f2f',
        name: 'F2F Encounter',
        icon: Users,
        status: hasDocument(patient.patient_id, 'f2f') ? 'completed' : 'missing',
        date: patientDocs.find(d => d.document_type === 'f2f')?.date_received,
        description: 'Face-to-Face encounter with physician',
        color: hasDocument(patient.patient_id, 'f2f') ? 'green' : 'red',
        isOverdue: !hasDocument(patient.patient_id, 'f2f') && admissionDays > 14
      },
      {
        id: 'plan',
        name: '485 Plan',
        icon: FileText,
        status: hasDocument(patient.patient_id, '485') ? 'completed' : 'missing',
        date: patientDocs.find(d => d.document_type === '485')?.date_received,
        description: 'Plan of Care (CMS-485)',
        color: hasDocument(patient.patient_id, '485') ? 'green' : 'red',
        isOverdue: !hasDocument(patient.patient_id, '485') && admissionDays > 21
      },
      {
        id: 'orders',
        name: 'Orders',
        icon: FileText,
        status: hasDocument(patient.patient_id, 'orders') ? 'completed' : 'missing',
        date: patientDocs.find(d => d.document_type === 'orders')?.date_received,
        description: 'Physician orders',
        color: hasDocument(patient.patient_id, 'orders') ? 'green' : 'red',
        isOverdue: !hasDocument(patient.patient_id, 'orders') && admissionDays > 28
      },
      {
        id: 'validation',
        name: 'Validation',
        icon: Check,
        status: patient.validation_status === 'validated' ? 'completed' : 'pending',
        date: patient.validation_status === 'validated' ? patient.updated_date : null,
        description: 'Patient validation complete',
        color: patient.validation_status === 'validated' ? 'green' : 'yellow'
      },
      {
        id: 'billable',
        name: 'Billable',
        icon: CircleDollarSign,
        status: patient.billability_status === 'billable' ? 'completed' : 'pending',
        date: patient.billability_status === 'billable' ? patient.updated_date : null,
        description: 'Ready for billing',
        color: patient.billability_status === 'billable' ? 'green' : 'gray'
      }
    ];

    return {
      patient,
      stages,
      completedStages: stages.filter(s => s.status === 'completed').length,
      totalStages: stages.length,
      progressPercentage: Math.round((stages.filter(s => s.status === 'completed').length / stages.length) * 100),
      overdueStages: stages.filter(s => s.isOverdue).length
    };
  }, [hasDocument, getPatientDocuments, daysSinceAdmission]);

  const journeyAnalysis = useMemo(() => {
    if (initialLoading || patients.length === 0) return { stages: [], totalPatients: 0 };

    const stages = [
      { id: 'admission', name: 'Admission', icon: Hospital, position: { top: '10%', left: '10%' } },
      { id: 'soc', name: 'SOC', icon: FileText, position: { top: '35%', left: '25%' } },
      { id: 'f2f', name: 'F2F', icon: Users, position: { top: '60%', left: '40%' } },
      { id: 'plan', name: '485 Plan', icon: FileText, position: { top: '10%', left: '55%' } },
      { id: 'orders', name: 'Orders', icon: FileText, position: { top: '35%', left: '70%' } },
      { id: 'validation', name: 'Validation', icon: Check, position: { top: '60%', left: '85%' } },
      { id: 'billable', name: 'Billable', icon: CircleDollarSign, position: { top: '35%', left: '95%' } }
    ];

    const stageAnalysis = stages.map(stage => {
      let patientsInStage = [], roadblockPatients = [], isRoadblock = false, roadblockReason = '';
      
      switch (stage.id) {
        case 'admission': patientsInStage = patients.filter(p => p.admission_date && !hasDocument(p.patient_id, 'soc')); break;
        case 'soc': patientsInStage = patients.filter(p => hasDocument(p.patient_id, 'soc') && !hasDocument(p.patient_id, 'f2f')); break;
        case 'f2f':
          patientsInStage = patients.filter(p => hasDocument(p.patient_id, 'f2f') && !hasDocument(p.patient_id, '485'));
          roadblockPatients = patients.filter(p => hasDocument(p.patient_id, 'soc') && !hasDocument(p.patient_id, 'f2f') && daysSinceAdmission(p.admission_date) > 14);
          if (roadblockPatients.length > 0) { isRoadblock = true; roadblockReason = `Missing F2F (>14 days)`; }
          break;
        case 'plan':
          patientsInStage = patients.filter(p => hasDocument(p.patient_id, '485') && !hasDocument(p.patient_id, 'orders'));
          roadblockPatients = patients.filter(p => hasDocument(p.patient_id, 'f2f') && !hasDocument(p.patient_id, '485') && daysSinceAdmission(p.admission_date) > 21);
          if (roadblockPatients.length > 0) { isRoadblock = true; roadblockReason = `Missing 485 Plan (>21 days)`; }
          break;
        case 'orders':
          patientsInStage = patients.filter(p => hasDocument(p.patient_id, 'orders') && p.validation_status !== 'validated');
          roadblockPatients = patients.filter(p => hasDocument(p.patient_id, '485') && !hasDocument(p.patient_id, 'orders') && daysSinceAdmission(p.admission_date) > 28);
          if (roadblockPatients.length > 0) { isRoadblock = true; roadblockReason = `Missing Orders (>28 days)`; }
          break;
        case 'validation':
          patientsInStage = patients.filter(p => p.validation_status === 'validated' && p.billability_status === 'pending_review');
          roadblockPatients = patients.filter(p => p.validation_status === 'pending' && hasDocument(p.patient_id, 'orders') && daysSinceAdmission(p.admission_date) > 5);
          if (roadblockPatients.length > 0) { isRoadblock = true; roadblockReason = `Pending validation > 5 days`; }
          break;
        case 'billable': patientsInStage = patients.filter(p => p.billability_status === 'billable'); break;
      }
      return { ...stage, patients: patientsInStage, roadblockPatients, count: patientsInStage.length, roadblockCount: roadblockPatients.length, isRoadblock, roadblockReason };
    });

    return { stages: stageAnalysis, totalPatients: patients.length };
  }, [patients, initialLoading, daysSinceAdmission, hasDocument]);

  const handleCreateTask = async (patient, reason) => {
    setTasksCreated(prev => [...prev, patient.id]);
    try {
      await ActionItem.create({
        title: `Resolve ${reason} for ${patient.name}`,
        description: `Action required: ${reason} for patient ${patient.name} (ID: ${patient.patient_id}). Admitted on ${patient.admission_date}.`,
        priority: 'high',
        status: 'open',
        patient_id: patient.patient_id,
        assigned_to: 'admin@docalliance.com',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Error creating action item:', error);
      setTasksCreated(prev => prev.filter(id => id !== patient.id));
    }
  };

  const handleAutoResolve = async (stage) => {
    setResolving(true);
    const patientsToResolve = stage.roadblockPatients.filter(p => !tasksCreated.includes(p.id)).slice(0, 5);
    await Promise.all(patientsToResolve.map(p => handleCreateTask(p, stage.name)));
    setResolving(false);
  };

  const completionRate = journeyAnalysis.totalPatients > 0 
    ? Math.round((journeyAnalysis.stages.find(s => s.id === 'billable')?.count || 0) / journeyAnalysis.totalPatients * 100)
    : 0;

  const patientJourneyData = selectedPatient ? getPatientJourneyData(selectedPatient) : null;

  // Show initial loading only on first load
  if (initialLoading) return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Initializing patient journey map...</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm relative">
      {/* Subtle refresh indicator */}
      {refreshing && (
        <div className="absolute top-2 right-2 z-10">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-slate-900">
          <Zap className="w-6 h-6 text-blue-600" />
          Live Patient Journey Map
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <p className="text-slate-500">
            {viewMode === 'individual' && selectedPatient 
              ? `Tracking: ${selectedPatient.name} (${selectedPatient.patient_id})`
              : `Real-time tracking of ${journeyAnalysis.totalPatients} active patients • ${completionRate}% billable rate`
            }
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview Mode</SelectItem>
                  <SelectItem value="individual">Individual Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {viewMode === 'individual' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>
                <Select value={selectedPatient?.id || ''} onValueChange={(value) => {
                  const patient = patients.find(p => p.id === value);
                  setSelectedPatient(patient);
                }}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Select a patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPatients.slice(0, 50).map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{patient.name} - {patient.patient_id}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {viewMode === 'individual' && patientJourneyData ? (
            // Individual Patient Journey View
            <motion.div
              key="individual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Patient Info Header */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{patientJourneyData.patient.name}</h3>
                    <p className="text-gray-600 mt-1">
                      ID: {patientJourneyData.patient.patient_id} • 
                      Admitted: {format(new Date(patientJourneyData.patient.admission_date), 'MMM d, yyyy')} • 
                      {daysSinceAdmission(patientJourneyData.patient.admission_date)} days in system
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {patientJourneyData.patient.current_pg} → {patientJourneyData.patient.assigned_hha}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {patientJourneyData.progressPercentage}%
                    </div>
                    <p className="text-sm text-gray-600">Complete</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${patientJourneyData.progressPercentage}%` }}
                      ></div>
                    </div>
                    {patientJourneyData.overdueStages > 0 && (
                      <Badge className="bg-red-100 text-red-700 mt-2">
                        {patientJourneyData.overdueStages} Overdue
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Individual Journey Pipeline */}
              <div className="relative">
                <div className="flex justify-between items-center mb-6">
                  {patientJourneyData.stages.map((stage, index) => (
                    <div key={stage.id} className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3 ${
                          stage.status === 'completed' 
                            ? 'bg-green-100 border-green-500' 
                            : stage.isOverdue
                            ? 'bg-red-100 border-red-500 animate-pulse'
                            : stage.status === 'pending'
                            ? 'bg-yellow-100 border-yellow-500'
                            : 'bg-gray-100 border-gray-300'
                        }`}
                      >
                        <stage.icon className={`w-7 h-7 ${
                          stage.status === 'completed' 
                            ? 'text-green-600' 
                            : stage.isOverdue
                            ? 'text-red-600'
                            : stage.status === 'pending'
                            ? 'text-yellow-600'
                            : 'text-gray-400'
                        }`} />
                        {stage.status === 'completed' && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {stage.isOverdue && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </motion.div>
                      
                      <div className="text-center max-w-20">
                        <p className={`text-xs font-semibold ${
                          stage.status === 'completed' ? 'text-green-700' :
                          stage.isOverdue ? 'text-red-700' : 
                          stage.status === 'pending' ? 'text-yellow-700' : 'text-gray-500'
                        }`}>
                          {stage.name}
                        </p>
                        {stage.date && (
                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(stage.date), 'MMM d')}
                          </p>
                        )}
                      </div>

                      {index < patientJourneyData.stages.length - 1 && (
                        <div className="absolute top-8 w-full flex justify-center" style={{ left: `${index * (100 / (patientJourneyData.stages.length - 1))}%`, width: `${100 / (patientJourneyData.stages.length - 1)}%` }}>
                          <div className={`h-0.5 w-full ${
                            patientJourneyData.stages[index + 1].status === 'completed' 
                              ? 'bg-green-400' 
                              : 'bg-gray-300'
                          }`}></div>
                          {patientJourneyData.stages[index + 1].status === 'completed' && (
                            <motion.div
                              className="absolute top-0 left-0 h-0.5 bg-green-400"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Stage Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patientJourneyData.stages.map(stage => (
                  <motion.div
                    key={stage.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`p-4 rounded-lg border-2 ${
                      stage.status === 'completed' 
                        ? 'bg-green-50 border-green-200' 
                        : stage.isOverdue
                        ? 'bg-red-50 border-red-200'
                        : stage.status === 'pending'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <stage.icon className={`w-5 h-5 ${
                        stage.status === 'completed' ? 'text-green-600' :
                        stage.isOverdue ? 'text-red-600' :
                        stage.status === 'pending' ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-semibold text-gray-900">{stage.name}</h4>
                      <Badge className={`text-xs ${
                        stage.status === 'completed' ? 'bg-green-100 text-green-700' :
                        stage.isOverdue ? 'bg-red-100 text-red-700' :
                        stage.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {stage.isOverdue ? 'Overdue' : stage.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                    {stage.date && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(stage.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                    {stage.isOverdue && (
                      <Button
                        size="sm"
                        className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleCreateTask(patientJourneyData.patient, `${stage.name} overdue`)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Create Task
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Overview Mode - Existing aggregate view
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="relative h-96"
            >
              {/* Road SVG background */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path
                  d="M 120 40 C 250 40, 200 120, 350 120 C 500 120, 550 40, 680 40 C 810 40, 780 180, 950 180 C 1120 180, 1150 120, 1300 120"
                  stroke="#e2e8f0"
                  strokeWidth="40"
                  fill="none"
                  strokeLinecap="round"
                />
                 <path
                  d="M 120 40 C 250 40, 200 120, 350 120 C 500 120, 550 40, 680 40 C 810 40, 780 180, 950 180 C 1120 180, 1150 120, 1300 120"
                  stroke="#f8fafc"
                  strokeWidth="36"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 120 40 C 250 40, 200 120, 350 120 C 500 120, 550 40, 680 40 C 810 40, 780 180, 950 180 C 1120 180, 1150 120, 1300 120"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="5, 5"
                />
              </svg>
              
              {/* Start and End flags */}
              <div className="absolute" style={{ top: 'calc(10% - 20px)', left: '2%' }}>
                 <div className="text-center">
                    <Flag className="w-8 h-8 text-green-600"/>
                    <p className="text-xs font-semibold">Start</p>
                 </div>
              </div>
               <div className="absolute" style={{ top: 'calc(35% - 20px)', left: 'calc(95% + 50px)' }}>
                 <div className="text-center">
                    <Check className="w-8 h-8 text-blue-600"/>
                    <p className="text-xs font-semibold">Finish</p>
                 </div>
              </div>

              {/* Milestones */}
              {journeyAnalysis.stages.map(stage => {
                const Icon = stage.icon;
                return (
                <div key={stage.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={stage.position}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="cursor-pointer group"
                    onClick={() => setSelectedMilestone(stage)}
                  >
                    {stage.isRoadblock ? (
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-red-100 border-2 border-red-500 flex flex-col items-center justify-center shadow-lg animate-pulse">
                          <AlertTriangle className="w-6 h-6 text-red-500 mb-1" />
                        </div>
                         <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            {stage.roadblockCount}
                         </Badge>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-300 flex flex-col items-center justify-center shadow-md group-hover:border-blue-500 transition-colors">
                          <Icon className="w-7 h-7 text-slate-600 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          {stage.count}
                        </Badge>
                      </div>
                    )}
                    <div className="text-center mt-2 w-24">
                      <p className={`text-xs font-semibold ${stage.isRoadblock ? 'text-red-600' : 'text-slate-600'}`}>{stage.name}</p>
                    </div>
                  </motion.div>
                </div>
              )})}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
       <Dialog open={!!selectedMilestone} onOpenChange={() => { setSelectedMilestone(null); setTasksCreated([]); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              {selectedMilestone?.isRoadblock ? <AlertTriangle className="text-red-500"/> : <Users />}
              {selectedMilestone?.name} Stage Overview
            </DialogTitle>
            <DialogDescription>
              {selectedMilestone?.isRoadblock 
                ? `${selectedMilestone?.roadblockCount || 0} patients require attention.`
                : `${selectedMilestone?.count || 0} patients are currently at this stage.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedMilestone?.isRoadblock && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
                <h3 className="font-semibold text-red-800">Roadblock: {selectedMilestone.roadblockReason}</h3>
                <Button
                    onClick={() => handleAutoResolve(selectedMilestone)}
                    disabled={resolving || (selectedMilestone.roadblockPatients?.filter(p => !tasksCreated.includes(p.id)).length || 0) === 0}
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                >
                    <Zap className="w-4 h-4 mr-2" />
                    {resolving ? 'Creating Tasks...' : `Auto-Resolve Top 5`}
                </Button>
            </div>
          )}

          <div className="max-h-[50vh] overflow-y-auto pr-2">
            <h4 className="font-semibold mb-3">
              {selectedMilestone?.isRoadblock ? 'Patients Needing Action' : 'Patients in Stage'}
            </h4>
            <div className="space-y-2">
              {selectedMilestone && (selectedMilestone.isRoadblock ? selectedMilestone.roadblockPatients || [] : selectedMilestone.patients || []).map(patient => (
                <div key={patient.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{patient.name}</p>
                    <p className="text-sm text-slate-500">
                      ID: {patient.patient_id} • {daysSinceAdmission(patient.admission_date)} days in system
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setViewMode('individual');
                        setSelectedMilestone(null);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Journey
                    </Button>
                    {selectedMilestone.isRoadblock && (
                      <Button
                        size="sm"
                        variant={tasksCreated.includes(patient.id) ? "secondary" : "outline"}
                        onClick={() => handleCreateTask(patient, selectedMilestone.roadblockReason)}
                        disabled={tasksCreated.includes(patient.id)}
                      >
                        {tasksCreated.includes(patient.id) ? <Check className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                        {tasksCreated.includes(patient.id) ? 'Tasked' : 'Create Task'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MedicalJourneyMap;