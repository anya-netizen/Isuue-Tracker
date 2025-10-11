import React, { useState, useMemo } from 'react';
import { CareCoordination, Document } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  FileText, 
  Clock, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Hospital,
  Home,
  DollarSign,
  Download,
  Upload,
  Settings,
  Phone,
  Mail,
  Edit,
  Eye,
  Search,
  Filter,
  FolderOpen,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

import CPOCapturePanel from './CPOCapturePanel';
import PatientTimelineViewer from '@/components/dashboard/PatientTimelineViewer';

export default function PGPatientDashboard({ patient, documents, onBack, onPatientUpdate, onRefresh }) {
  const [showCPOCapture, setShowCPOCapture] = useState(false);
  const [cpoMinutesCaptured, setCpoMinutesCaptured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllDocuments, setShowAllDocuments] = useState(false);
  const [documentSearchTerm, setDocumentSearchTerm] = useState('');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [selectedEpisode, setSelectedEpisode] = useState('all');

  const patientDocuments = useMemo(() => {
    return documents.filter(doc => doc.patient_id === patient.patient_id);
  }, [documents, patient.patient_id]);

  // Group documents by episodes
  const documentsByEpisode = useMemo(() => {
    const episodes = {};
    const episodelessDocs = [];

    patientDocuments.forEach(doc => {
      if (doc.episode_date) {
        const episodeKey = format(new Date(doc.episode_date), 'yyyy-MM');
        const episodeName = format(new Date(doc.episode_date), 'MMMM yyyy');
        
        if (!episodes[episodeKey]) {
          episodes[episodeKey] = {
            key: episodeKey,
            name: episodeName,
            date: doc.episode_date,
            documents: []
          };
        }
        episodes[episodeKey].documents.push(doc);
      } else {
        episodelessDocs.push(doc);
      }
    });

    // Sort episodes by date (newest first)
    const sortedEpisodes = Object.values(episodes).sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    // Add episodeless documents as a separate category if they exist
    if (episodelessDocs.length > 0) {
      sortedEpisodes.push({
        key: 'no-episode',
        name: 'No Episode Assigned',
        date: null,
        documents: episodelessDocs
      });
    }

    return sortedEpisodes;
  }, [patientDocuments]);

  // Filter documents for "View All" dialog
  const filteredDocuments = useMemo(() => {
    let filtered = patientDocuments;

    // Apply search filter
    if (documentSearchTerm) {
      const term = documentSearchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        doc.document_type.toLowerCase().includes(term) ||
        doc.physician?.toLowerCase().includes(term)
      );
    }

    // Apply document type filter
    if (documentFilter !== 'all') {
      filtered = filtered.filter(doc => doc.document_type === documentFilter);
    }

    // Apply episode filter
    if (selectedEpisode !== 'all') {
      if (selectedEpisode === 'no-episode') {
        filtered = filtered.filter(doc => !doc.episode_date);
      } else {
        filtered = filtered.filter(doc => {
          if (!doc.episode_date) return false;
          const docEpisodeKey = format(new Date(doc.episode_date), 'yyyy-MM');
          return docEpisodeKey === selectedEpisode;
        });
      }
    }

    return filtered.sort((a, b) => new Date(b.date_received) - new Date(a.date_received));
  }, [patientDocuments, documentSearchTerm, documentFilter, selectedEpisode]);

  const timelineData = useMemo(() => {
    const stages = [
      {
        id: 'admission',
        name: 'Patient Admission',
        icon: Hospital,
        date: patient.admission_date,
        status: 'completed',
        description: `Successfully admitted to ${patient.current_pg}`,
        details: `Admission Date: ${format(new Date(patient.admission_date), 'PPP')}`
      },
      {
        id: 'soc',
        name: 'Start of Care (SOC)',
        icon: FileText,
        document: patientDocuments.find(d => d.document_type === 'soc'),
        status: patientDocuments.find(d => d.document_type === 'soc') ? 'completed' : 'pending',
        description: 'Initial assessment and care plan establishment',
        details: 'Required within 48 hours of admission'
      },
      {
        id: 'f2f',
        name: 'Face-to-Face Encounter',
        icon: User,
        document: patientDocuments.find(d => d.document_type === 'f2f'),
        status: patientDocuments.find(d => d.document_type === 'f2f') ? 'completed' : 'pending',
        description: 'Physician face-to-face encounter documentation',
        details: 'Must occur within 90 days before or 30 days after SOC'
      },
      {
        id: '485',
        name: 'Plan of Care (CMS-485)',
        icon: FileText,
        document: patientDocuments.find(d => d.document_type === '485'),
        status: patientDocuments.find(d => d.document_type === '485') ? 'completed' : 'pending',
        description: 'Comprehensive plan of care documentation',
        details: 'Required for all home health episodes'
      },
      {
        id: 'orders',
        name: 'Physician Orders',
        icon: FileText,
        document: patientDocuments.find(d => d.document_type === 'orders'),
        status: patientDocuments.find(d => d.document_type === 'orders') ? 'completed' : 'pending',
        description: 'All necessary physician orders and prescriptions',
        details: 'Updated orders required for care modifications'
      }
    ];

    const completedStages = stages.filter(s => s.status === 'completed').length;
    const progress = Math.round((completedStages / stages.length) * 100);

    return { stages, progress, completedStages, totalStages: stages.length };
  }, [patient, patientDocuments]);

  const handleCPOCapture = async () => {
    setLoading(true);
    try {
      // Create care coordination record
      await CareCoordination.create({
        patient_id: patient.patient_id,
        cpo_minutes: 15, 
        coordination_notes: `Auto-captured CPO minutes for ${patient.name}. Patient documentation review completed, care coordination activities documented. Patient transitioned to billable status.`,
        generated_by: 'manual',
        billing_codes: ['G0180', 'G0181'],
        session_date: new Date().toISOString().split('T')[0],
        is_billable: true
      });

      // Update patient status to billable
      if (onPatientUpdate) {
        onPatientUpdate(patient.id, {
          billability_status: 'billable',
          status_reason: 'CPO minutes captured and documentation completed'
        });
      }

      setCpoMinutesCaptured(true);
      setShowCPOCapture(false);

      toast({
        title: "CPO Minutes Captured Successfully",
        description: `${patient.name} is now billable with completed care coordination.`,
      });

      // Refresh data
      if (onRefresh) {
        setTimeout(() => {
          onRefresh();
        }, 1000);
      }

    } catch (error) {
      console.error('Error capturing CPO minutes:', error);
      toast({
        title: "Error Capturing CPO",
        description: "Failed to capture CPO minutes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    setLoading(true);
    try {
      switch(action) {
        case 'view_documents':
          setShowAllDocuments(true);
          break;
        case 'generate_report':
          toast({
            title: "Generating Report",
            description: `Creating comprehensive billing report for ${patient.name}`,
          });
          break;
        case 'schedule_followup':
          toast({
            title: "Scheduling Follow-up",
            description: `Opening scheduling interface for ${patient.name}`,
          });
          break;
        case 'contact_hha':
          toast({
            title: "Contacting HHA",
            description: `Initiating contact with ${patient.assigned_hha}`,
          });
          break;
        case 'update_status':
          toast({
            title: "Status Update",
            description: `Opening status update form for ${patient.name}`,
          });
          break;
        default:
          break;
      }
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform the requested action.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const getBillabilityStatusColor = () => {
    switch(patient.billability_status) {
      case 'billable': return 'bg-green-100 text-green-700 border-green-200';
      case 'unbillable': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getEstimatedRevenue = () => {
    return patient.billability_status === 'billable' ? 1200 : 600;
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      'soc': 'bg-blue-100 text-blue-700',
      'f2f': 'bg-green-100 text-green-700',
      '485': 'bg-purple-100 text-purple-700',
      'orders': 'bg-orange-100 text-orange-700',
      'referral': 'bg-indigo-100 text-indigo-700',
      'discharge': 'bg-red-100 text-red-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="hover:bg-slate-100">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to PG Dashboard
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('update_status')}
            disabled={loading}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update Status
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleQuickAction('generate_report')}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Patient Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {patient.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                  patient.billability_status === 'billable' ? 'bg-green-500' :
                  patient.billability_status === 'unbillable' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{patient.name}</h1>
                <p className="text-gray-600 text-lg mb-3">Patient ID: {patient.patient_id}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">PG:</span>
                    <span>{patient.current_pg}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">HHA:</span>
                    <span>{patient.assigned_hha}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Admitted:</span>
                    <span>{format(new Date(patient.admission_date), 'MMM d, yyyy')}</span>
                  </div>
                  {patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                  {patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span className="text-indigo-600">{patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Est. Revenue:</span>
                    <span className="font-bold text-green-600">${getEstimatedRevenue()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-4">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {timelineData.progress}%
                </div>
                <p className="text-gray-600 mb-4">Documentation Complete</p>
                <div className="w-32 bg-gray-200 rounded-full h-3 mb-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${timelineData.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {timelineData.completedStages} of {timelineData.totalStages} stages complete
                </p>
              </div>
              <Badge className={`px-4 py-2 font-semibold ${getBillabilityStatusColor()}`}>
                {patient.billability_status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Patient Timeline */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Patient Care Timeline
              </CardTitle>
              <p className="text-sm text-gray-600">
                Comprehensive view of patient's medical journey and documentation milestones
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {timelineData.stages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-4"
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-3 flex items-center justify-center shadow-lg ${
                    stage.status === 'completed' 
                      ? 'bg-green-100 border-green-500 shadow-green-200' 
                      : 'bg-gray-100 border-gray-300 shadow-gray-200'
                  }`}>
                    <stage.icon className={`w-6 h-6 ${
                      stage.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{stage.name}</h3>
                      <Badge className={`${
                        stage.status === 'completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {stage.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-2">{stage.description}</p>
                    <p className="text-sm text-gray-500 mb-3">{stage.details}</p>
                    
                    {stage.document && (
                      <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <p className="font-medium text-blue-900">{stage.document.title}</p>
                          <Badge className={`${
                            stage.document.processing_status === 'validated'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {stage.document.processing_status}
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-700">
                          Received: {format(new Date(stage.document.date_received), 'MMM d, yyyy h:mm a')}
                        </p>
                        {stage.document.physician && (
                          <p className="text-sm text-blue-600 mt-1">
                            Physician: {stage.document.physician}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {stage.date && !stage.document && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                        {format(new Date(stage.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    )}
                  </div>
                  
                  {/* Enhanced timeline connector */}
                  {index < timelineData.stages.length - 1 && (
                    <div className={`absolute left-6 top-12 w-0.5 h-16 ${
                      stage.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                    }`}></div>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Side Panel */}
        <div className="space-y-6">
          {/* CPO Capture Panel */}
          <Card className={`shadow-lg border-2 ${
            patient.billability_status === 'billable' 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${
                patient.billability_status === 'billable' ? 'text-green-800' : 'text-orange-800'
              }`}>
                <Clock className="w-5 h-5" />
                {patient.billability_status === 'billable' ? 'CPO Complete' : 'CPO Minutes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!cpoMinutesCaptured && patient.billability_status !== 'billable' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
                    <p className="text-sm text-orange-700 font-medium">Minutes Pending Capture</p>
                  </div>
                  <Button 
                    onClick={() => setShowCPOCapture(true)}
                    className="w-full bg-orange-600 hover:bg-orange-700 shadow-lg"
                    disabled={loading}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {loading ? 'Capturing...' : 'Auto-Capture CPO Minutes'}
                  </Button>
                  <div className="text-xs text-orange-600 text-center bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    This will update the patient's billability status and generate care coordination documentation
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <p className="text-green-800 font-semibold text-lg">CPO Complete!</p>
                    <p className="text-sm text-green-600 mt-1">Patient is ready for billing</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      <strong>Revenue Potential:</strong> ${getEstimatedRevenue()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Documents Summary with Episode Classification */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Documents ({patientDocuments.length})
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowAllDocuments(true)}
                  disabled={loading}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <p className="text-sm text-gray-600">Episode-wise document classification</p>
            </CardHeader>
            <CardContent className="space-y-4 max-h-80 overflow-y-auto">
              <AnimatePresence>
                {documentsByEpisode.map(episode => (
                  <motion.div 
                    key={episode.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-3 bg-gradient-to-r from-gray-50 to-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-blue-500" />
                        <h4 className="font-semibold text-gray-900">{episode.name}</h4>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {episode.documents.length} docs
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {episode.documents.slice(0, 3).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-white rounded border border-gray-100 hover:shadow-sm transition-all">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 truncate">{doc.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-xs ${getDocumentTypeColor(doc.document_type)}`}>
                                {doc.document_type.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(new Date(doc.date_received), 'MMM d')}
                              </span>
                            </div>
                          </div>
                          <Badge className={`text-xs ${
                            doc.processing_status === 'validated' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {doc.processing_status}
                          </Badge>
                        </div>
                      ))}
                      
                      {episode.documents.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedEpisode(episode.key);
                            setShowAllDocuments(true);
                          }}
                        >
                          View {episode.documents.length - 3} more documents
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {documentsByEpisode.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No documents found</p>
                  <p className="text-xs">Documents will appear here as they're processed</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-blue-50"
                onClick={() => setShowAllDocuments(true)}
                disabled={loading}
              >
                <FolderOpen className="w-4 h-4 mr-3 text-blue-500" />
                View All Documents
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-green-50"
                onClick={() => handleQuickAction('generate_report')}
                disabled={loading}
              >
                <DollarSign className="w-4 h-4 mr-3 text-green-500" />
                Generate Billing Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-purple-50"
                onClick={() => handleQuickAction('schedule_followup')}
                disabled={loading}
              >
                <Calendar className="w-4 h-4 mr-3 text-purple-500" />
                Schedule Follow-up
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-orange-50"
                onClick={() => handleQuickAction('contact_hha')}
                disabled={loading}
              >
                <Home className="w-4 h-4 mr-3 text-orange-500" />
                Contact HHA
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start hover:bg-indigo-50"
                onClick={() => handleQuickAction('update_status')}
                disabled={loading}
              >
                <Settings className="w-4 h-4 mr-3 text-indigo-500" />
                Update Patient Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comprehensive Documents Dialog */}
      <Dialog open={showAllDocuments} onOpenChange={setShowAllDocuments}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              All Documents for {patient.name}
            </DialogTitle>
            <p className="text-gray-600">
              Comprehensive document management with episode classification and advanced filtering
            </p>
          </DialogHeader>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Care Timeline</TabsTrigger>
              <TabsTrigger value="episodes">Episode View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <PatientTimelineViewer 
                patientId={patient.patient_id} 
                onDocumentMissing={(patient, step) => {
                  console.log('Missing document for step:', step.name, 'Patient:', patient.name);
                  toast({
                    title: "Missing Document",
                    description: `${step.name} is required for ${patient.name}. Please upload or resolve this document.`,
                    variant: "destructive"
                  });
                }} 
              />
            </TabsContent>

            <TabsContent value="episodes" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={documentSearchTerm}
                    onChange={(e) => setDocumentSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={documentFilter} onValueChange={setDocumentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="soc">Start of Care</SelectItem>
                    <SelectItem value="f2f">Face-to-Face</SelectItem>
                    <SelectItem value="485">Plan of Care</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="discharge">Discharge</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedEpisode} onValueChange={setSelectedEpisode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Episode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Episodes</SelectItem>
                    {documentsByEpisode.map(episode => (
                      <SelectItem key={episode.key} value={episode.key}>
                        {episode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-4">
                {documentsByEpisode
                  .filter(episode => selectedEpisode === 'all' || episode.key === selectedEpisode)
                  .map(episode => (
                  <div key={episode.key} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Layers className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-lg text-gray-900">{episode.name}</h3>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        {episode.documents.filter(doc => {
                          const matchesSearch = !documentSearchTerm || 
                            doc.title.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
                            doc.document_type.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
                            doc.physician?.toLowerCase().includes(documentSearchTerm.toLowerCase());
                          const matchesType = documentFilter === 'all' || doc.document_type === documentFilter;
                          return matchesSearch && matchesType;
                        }).length} documents
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {episode.documents
                        .filter(doc => {
                          const matchesSearch = !documentSearchTerm || 
                            doc.title.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
                            doc.document_type.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
                            doc.physician?.toLowerCase().includes(documentSearchTerm.toLowerCase());
                          const matchesType = documentFilter === 'all' || doc.document_type === documentFilter;
                          return matchesSearch && matchesType;
                        })
                        .map(doc => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{doc.title}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {doc.physician && `Dr. ${doc.physician} • `}
                                {format(new Date(doc.date_received), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <Badge className={`text-xs ${
                              doc.processing_status === 'validated' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {doc.processing_status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Badge className={`text-xs ${getDocumentTypeColor(doc.document_type)}`}>
                              {doc.document_type.toUpperCase()}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative lg:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search documents..."
                    value={documentSearchTerm}
                    onChange={(e) => setDocumentSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={documentFilter} onValueChange={setDocumentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="soc">Start of Care</SelectItem>
                    <SelectItem value="f2f">Face-to-Face</SelectItem>
                    <SelectItem value="485">Plan of Care</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="discharge">Discharge</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedEpisode} onValueChange={setSelectedEpisode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Episode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Episodes</SelectItem>
                    {documentsByEpisode.map(episode => (
                      <SelectItem key={episode.key} value={episode.key}>
                        {episode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {filteredDocuments.map(doc => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{doc.title}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>Type: {doc.document_type.toUpperCase()}</span>
                            {doc.physician && <span>Dr. {doc.physician}</span>}
                            <span>{format(new Date(doc.date_received), 'MMM d, yyyy')}</span>
                            {doc.episode_date && (
                              <span>Episode: {format(new Date(doc.episode_date), 'MMM yyyy')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`text-xs ${getDocumentTypeColor(doc.document_type)}`}>
                          {doc.document_type.toUpperCase()}
                        </Badge>
                        <Badge className={`text-xs ${
                          doc.processing_status === 'validated' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {doc.processing_status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {filteredDocuments.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Documents Found</h3>
                      <p>No documents match your current filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              <strong>Total:</strong> {filteredDocuments.length} documents across {documentsByEpisode.length} episodes
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAllDocuments(false)}>
                Close
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced CPO Capture Dialog */}
      <Dialog open={showCPOCapture} onOpenChange={setShowCPOCapture}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-600" />
              Auto-Capture CPO Minutes
            </DialogTitle>
          </DialogHeader>
          
          <CPOCapturePanel 
            patient={patient}
            onCapture={handleCPOCapture}
            onCancel={() => setShowCPOCapture(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}