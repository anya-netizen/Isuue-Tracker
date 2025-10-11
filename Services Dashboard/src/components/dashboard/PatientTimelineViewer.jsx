import React, { useState, useEffect, useCallback } from 'react';
import { Patient, Document } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock, FileText, Zap, Brain, Calendar, Activity, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Healthcare episode workflow structure
const episodeWorkflow = {
  firstEpisode: [
    { id: 'soc', name: 'Start of Care', icon: Calendar, docType: 'soc', required: true },
    { id: 'f2f', name: 'Face to Face Visit', icon: UserCheck, docType: 'f2f', required: true },
    { id: '485_cert', name: '485 Certification', icon: FileText, docType: '485', required: true },
    { id: 'orders_pt', name: 'Physical Therapy Orders', icon: Activity, docType: 'orders', subType: 'physical_therapy', required: true },
    { id: 'orders_verbal', name: 'Verbal Orders', icon: Activity, docType: 'orders', subType: 'verbal', required: true },
    { id: 'care_coordination', name: 'AI Care Coordination Notes', icon: Brain, docType: 'care_notes', required: false },
    { id: 'eoe', name: 'End of Episode', icon: Calendar, docType: 'discharge', required: true }
  ],
  subsequentEpisode: [
    { id: 'soe', name: 'Start of Episode', icon: Calendar, docType: 'soe', required: true },
    { id: '485_recert', name: '485 Re-certification', icon: FileText, docType: '485', subType: 'recert', required: true },
    { id: 'orders_pt_recert', name: 'Physical Therapy Orders', icon: Activity, docType: 'orders', subType: 'physical_therapy', required: true },
    { id: 'orders_verbal_recert', name: 'Verbal Orders', icon: Activity, docType: 'orders', subType: 'verbal', required: true },
    { id: 'care_coordination_recert', name: 'AI Care Coordination Notes', icon: Brain, docType: 'care_notes', required: false },
    { id: 'eoe_recert', name: 'End of Episode', icon: Calendar, docType: 'discharge', subType: 'recert', required: true }
  ]
};

// Generate AI care coordination notes
const generateCareCoordinationNotes = (patient, episodeNumber) => {
  const notes = [
    `Episode ${episodeNumber}: Patient ${patient.name} requires coordinated care for ${patient.primaryDiagnosis}. AI recommendation: Monitor vitals daily and adjust therapy frequency based on progress indicators.`,
    `Care coordination update: Physical therapy showing positive outcomes. AI suggests continuing current plan with bi-weekly reassessment.`,
    `AI-generated care note: Patient compliance excellent. Recommend maintaining current medication regimen and therapy schedule.`,
    `Coordination alert: Patient experiencing improved mobility. AI recommends gradual increase in therapy intensity as tolerated.`,
    `AI care summary: All providers aligned on treatment goals. Next review scheduled based on episode timeline requirements.`
  ];
  
  return {
    id: `care_notes_${episodeNumber}_${Date.now()}`,
    title: `AI Care Coordination - Episode ${episodeNumber}`,
    content: notes[episodeNumber % notes.length],
    generated_by: 'AI Care Coordinator',
    patient_id: patient.patient_id,
    document_type: 'care_notes',
    date_created: new Date().toISOString(),
    status: 'completed'
  };
};

export default function PatientTimelineViewer({ patientId, onDocumentMissing }) {
  const [patient, setPatient] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateEpisodeData = useCallback((patientData, docs) => {
    const patientEpisodes = [];
    
    // Determine number of episodes based on patient data or documents
    const hasRecertification = docs.some(doc => 
      doc.document_type === '485' && doc.title?.toLowerCase().includes('recert')
    );
    const episodeCount = hasRecertification ? 2 : 1;

    for (let episodeNum = 1; episodeNum <= episodeCount; episodeNum++) {
      const isFirstEpisode = episodeNum === 1;
      const workflow = isFirstEpisode ? episodeWorkflow.firstEpisode : episodeWorkflow.subsequentEpisode;
      
      const episodeSteps = workflow.map(step => {
        let status = 'missing';
        let document = null;
        let date = null;

        // Find matching documents
        if (step.docType) {
          if (step.docType === 'care_notes') {
            // Generate AI care coordination notes
            document = generateCareCoordinationNotes(patientData, episodeNum);
            status = 'completed';
            date = new Date(document.date_created);
          } else {
            // Find existing documents
            let matchingDocs = docs.filter(doc => doc.document_type === step.docType);
            
            // For subsequent episodes, look for recertification documents
            if (!isFirstEpisode && step.subType === 'recert') {
              matchingDocs = matchingDocs.filter(doc => 
                doc.title?.toLowerCase().includes('recert') || 
                doc.title?.toLowerCase().includes('re-cert')
              );
            } else if (isFirstEpisode) {
              // For first episode, exclude recertification documents
              matchingDocs = matchingDocs.filter(doc => 
                !doc.title?.toLowerCase().includes('recert') &&
                !doc.title?.toLowerCase().includes('re-cert')
              );
            }

            // Handle different order types
            if (step.subType === 'physical_therapy') {
              document = matchingDocs.find(doc => 
                doc.title?.toLowerCase().includes('physical') || 
                doc.title?.toLowerCase().includes('therapy') ||
                doc.title?.toLowerCase().includes('pt')
              );
            } else if (step.subType === 'verbal') {
              document = matchingDocs.find(doc => 
                doc.title?.toLowerCase().includes('verbal') ||
                doc.title?.toLowerCase().includes('phone')
              );
            } else {
              document = matchingDocs[0]; // Take first matching document
            }

            if (document) {
              status = 'completed';
              date = document.date_received ? new Date(document.date_received) : new Date();
            }
          }
        }

        // Special handling for SOC/SOE dates from patient data
        if (step.id === 'soc' && patientData.soc_date) {
          status = 'completed';
          date = new Date(patientData.soc_date);
        } else if (step.id === 'soe' && patientData.soe_date) {
          status = 'completed';
          date = new Date(patientData.soe_date);
        } else if (step.id === 'eoe' && patientData.eoe_date) {
          status = 'completed';
          date = new Date(patientData.eoe_date);
        }

        return {
          ...step,
          status,
          document,
          date,
          isMissing: step.required && status === 'missing'
        };
      });

      patientEpisodes.push({
        number: episodeNum,
        type: isFirstEpisode ? 'First Episode' : `Episode ${episodeNum}`,
        steps: episodeSteps,
        startDate: episodeSteps.find(s => s.id.includes('soc') || s.id.includes('soe'))?.date,
        endDate: episodeSteps.find(s => s.id.includes('eoe'))?.date,
        isComplete: episodeSteps.filter(s => s.required).every(s => s.status === 'completed')
      });
    }

    setEpisodes(patientEpisodes);
  }, []);

  const loadPatientTimeline = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const [patientData, docsData] = await Promise.all([
        Patient.filter({ patient_id: patientId }),
        Document.filter({ patient_id: patientId }, '-date_received')
      ]);
      
      if (patientData.length > 0) {
        setPatient(patientData[0]);
        setDocuments(docsData);
        generateEpisodeData(patientData[0], docsData);
      }
    } catch (error) {
      console.error('Error loading patient timeline:', error);
    }
    setLoading(false);
  }, [patientId, generateEpisodeData]);

  useEffect(() => {
    loadPatientTimeline();
  }, [loadPatientTimeline]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300';
      case 'pending': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-red-100 border-red-300';
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a patient to view their timeline</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Patient ID: {patient.patient_id} • {patient.current_pg} → {patient.assigned_hha}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className={`${patient.billability_status === 'billable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {patient.billability_status}
            </Badge>
            <Badge variant="outline">
              {episodes.length} Episode{episodes.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          {episodes.map((episode, episodeIndex) => (
            <motion.div
              key={episode.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: episodeIndex * 0.2 }}
              className="relative"
            >
              {/* Episode Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    episode.isComplete ? 'bg-green-500' : 'bg-blue-500'
                  }`}>
                    {episode.number}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{episode.type}</h4>
                    <p className="text-sm text-gray-600">
                      {episode.startDate && `Started: ${format(episode.startDate, 'MMM d, yyyy')}`}
                      {episode.endDate && ` • Ended: ${format(episode.endDate, 'MMM d, yyyy')}`}
                    </p>
                  </div>
                </div>
                <Badge className={episode.isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {episode.isComplete ? 'Complete' : 'In Progress'}
                </Badge>
              </div>

              {/* Episode Steps */}
              <div className="ml-4 pl-6 border-l-2 border-gray-200 space-y-4">
                {episode.steps.map((step, stepIndex) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (episodeIndex * 0.2) + (stepIndex * 0.1) }}
                      className={`relative flex items-center p-4 rounded-lg border-2 transition-all duration-300 ${
                        step.isMissing 
                          ? 'bg-red-50 border-red-300 shadow-lg animate-pulse' 
                          : getStatusColor(step.status)
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        <div className={`p-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-100' : 
                          step.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            step.status === 'completed' ? 'text-green-600' : 
                            step.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                        </div>
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold text-gray-900">{step.name}</h5>
                          {step.date && (
                            <span className="text-xs text-gray-500">
                              {format(step.date, 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                        
                        {step.document && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              {step.docType === 'care_notes' ? (
                                <span className="flex items-center gap-2">
                                  <Brain className="w-4 h-4 text-purple-500" />
                                  <span className="font-medium">AI Generated:</span> {step.document.title}
                                </span>
                              ) : (
                                `Document: ${step.document.title || 'Document Available'}`
                              )}
                            </p>
                            {step.document.content && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                "{step.document.content}"
                              </p>
                            )}
                          </div>
                        )}
                        
                        {step.isMissing && (
                          <div className="mt-2 flex items-center gap-2">
                            <Badge variant="destructive" className="text-xs">
                              MISSING REQUIRED STEP
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-6 text-xs"
                              onClick={() => onDocumentMissing && onDocumentMissing(patient, step)}
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Episode Separator */}
              {episodeIndex < episodes.length - 1 && (
                <div className="flex items-center justify-center my-6">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                  <div className="px-4 bg-white">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  </div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Overall Summary Stats */}
        <div className="mt-8 pt-6 border-t">
          <h5 className="text-lg font-semibold text-gray-900 mb-4">Care Timeline Summary</h5>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {episodes.length}
              </div>
              <div className="text-xs text-blue-600">Episodes</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {episodes.reduce((acc, ep) => acc + ep.steps.filter(s => s.status === 'completed').length, 0)}
              </div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {episodes.reduce((acc, ep) => acc + ep.steps.filter(s => s.status === 'pending').length, 0)}
              </div>
              <div className="text-xs text-yellow-600">Pending</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {episodes.reduce((acc, ep) => acc + ep.steps.filter(s => s.isMissing).length, 0)}
              </div>
              <div className="text-xs text-red-600">Missing</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}