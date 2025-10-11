
import React, { useState, useEffect } from 'react';
import { Patient, Document } from '@/api/entities';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Search, User, FileText, CheckCircle, AlertTriangle, Clock, Calendar, Hospital, Home, CircleDollarSign, CalendarCheck, ShieldCheck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import PatientTimelineViewer from '@/components/dashboard/PatientTimelineViewer';

const validationStatusStyles = {
  validated: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  flagged: "bg-orange-100 text-orange-700",
};

const billabilityStatusStyles = {
  billable: "bg-blue-100 text-blue-700",
  unbillable: "bg-red-100 text-red-700",
  pending_review: "bg-gray-100 text-gray-700",
};

const PatientTimeline = ({ patient, docs }) => {
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateTimeline = async () => {
      if (!patient) {
        setLoading(false);
        return;
      }
      
      const events = [];
      const admissionDate = new Date(patient.admission_date);

      // 1. Admission Event
      events.push({
        id: `admission-${patient.id}`,
        type: 'admission',
        title: 'Patient Admitted',
        description: `Admitted to ${patient.current_pg}`,
        date: admissionDate,
        icon: Hospital,
        status: 'completed'
      });

      // 2. Document Events
      docs.forEach(doc => {
        events.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: `${doc.document_type.toUpperCase()} Received`,
          description: doc.title,
          date: new Date(doc.date_received),
          icon: FileText,
          status: 'completed',
          metadata: { docType: doc.document_type }
        });
      });

      // 3. Critical Document Milestones
      const requiredDocs = ['soc', 'f2f', '485', 'orders'];
      const today = new Date();
      const daysSinceAdmission = Math.floor((today - admissionDate) / (1000 * 60 * 60 * 24));
      
      requiredDocs.forEach((docType, index) => {
        const hasDoc = docs.some(doc => doc.document_type.toLowerCase() === docType);
        const expectedDays = (index + 1) * 7; // Weekly milestones
        const expectedDate = new Date(admissionDate);
        expectedDate.setDate(expectedDate.getDate() + expectedDays);
        
        if (!hasDoc && daysSinceAdmission > expectedDays) {
          events.push({
            id: `missing-${docType}`,
            type: 'alert',
            title: `Missing ${docType.toUpperCase()} Document`,
            description: `Required document overdue by ${daysSinceAdmission - expectedDays} days`,
            date: expectedDate,
            icon: AlertTriangle,
            status: 'overdue'
          });
        }
      });

      // 4. Validation Events
      const validationDate = patient.updated_date ? new Date(patient.updated_date) : new Date(patient.created_date || admissionDate);
      if (patient.validation_status === 'validated') {
        events.push({
          id: `validation-${patient.id}`,
          type: 'validation',
          title: 'Patient Validated',
          description: 'All documents verified and patient approved for care',
          date: validationDate,
          icon: ShieldCheck,
          status: 'completed'
        });
      } else if (patient.validation_status === 'flagged') {
        events.push({
          id: `flagged-${patient.id}`,
          type: 'alert',
          title: 'Patient Flagged',
          description: 'Validation issues detected - manual review required',
          date: validationDate,
          icon: AlertTriangle,
          status: 'attention'
        });
      }

      // 5. HHA Assignment
      if (patient.assigned_hha) {
        events.push({
          id: `hha-assignment-${patient.id}`,
          type: 'assignment',
          title: 'HHA Assigned',
          description: `Assigned to ${patient.assigned_hha}`,
          date: new Date(patient.created_date || admissionDate), // Fallback date
          icon: Home,
          status: 'completed'
        });
      }

      // 6. Billability Events
      const billabilityDate = patient.updated_date ? new Date(patient.updated_date) : new Date(patient.created_date || admissionDate);
      if (patient.billability_status === 'billable') {
        events.push({
          id: `billable-${patient.id}`,
          type: 'billable',
          title: 'Episode Billable',
          description: 'All requirements met - episode ready for billing',
          date: billabilityDate,
          icon: CircleDollarSign,
          status: 'completed'
        });
      } else if (patient.billability_status === 'unbillable') {
        events.push({
          id: `unbillable-${patient.id}`,
          type: 'alert',
          title: 'Episode Unbillable',
          description: `Missing documents: ${patient.missing_documents?.join(', ') || 'Various'}`,
          date: billabilityDate,
          icon: XCircle,
          status: 'blocked'
        });
      }

      // 7. Care Progression Milestones
      const carePhases = [
        { name: 'Initial Assessment Due', days: 3, icon: CalendarCheck },
        { name: 'Care Plan Review Due', days: 14, icon: CalendarCheck },
        { name: 'Mid-Episode Review Due', days: 30, icon: CalendarCheck },
        { name: 'Recertification Due', days: 60, icon: CalendarCheck }
      ];

      carePhases.forEach(phase => {
        const phaseDate = new Date(admissionDate);
        phaseDate.setDate(phaseDate.getDate() + phase.days);
        
        if (daysSinceAdmission >= phase.days - 7) { // Start showing a week before or when due
          events.push({
            id: `phase-${phase.name.replace(/\s+/g, '-').toLowerCase()}`,
            type: 'milestone',
            title: phase.name,
            description: `${phase.days} days since admission - target date: ${format(phaseDate, 'MMM d, yyyy')}`,
            date: phaseDate,
            icon: phase.icon,
            status: daysSinceAdmission > phase.days ? 'overdue' : (daysSinceAdmission >= phase.days - 7 ? 'attention' : 'completed')
          });
        }
      });

      // Sort events by date
      events.sort((a, b) => a.date.getTime() - b.date.getTime());
      setTimelineEvents(events);
      setLoading(false);
    };

    generateTimeline();
  }, [patient, docs]);

  const getStatusClasses = (status) => {
    switch (status) {
      case 'completed': return { bg: 'bg-green-500', text: 'text-green-500' };
      case 'attention': return { bg: 'bg-yellow-500', text: 'text-yellow-500' };
      case 'overdue': return { bg: 'bg-red-500', text: 'text-red-500' };
      case 'blocked': return { bg: 'bg-red-500', text: 'text-red-500' };
      default: return { bg: 'bg-gray-400', text: 'text-gray-400' };
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-slate-500">Loading complete timeline...</div>;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-slate-800">Complete Patient Timeline</h4>
        <Badge variant="outline" className="text-xs">
          {timelineEvents.length} events
        </Badge>
      </div>
      
      <div className="max-h-96 overflow-y-auto pr-4 -mr-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {timelineEvents.map((event, eventIdx) => {
              const statusClasses = getStatusClasses(event.status);
              const Icon = event.icon; // Icon is now a React component
              return (
                <li key={event.id}>
                  <div className="relative pb-8">
                    {eventIdx !== timelineEvents.length - 1 ? (
                      <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                    ) : null}
                    <motion.div
                      className="relative flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: eventIdx * 0.05 }}
                    >
                      <div className="flex-shrink-0">
                        <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-slate-50 ${statusClasses.bg}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <p className="font-medium text-slate-900">{event.title}</p>
                          <time dateTime={event.date.toISOString()} className="whitespace-nowrap text-slate-500">
                            {format(event.date, "MMM d")}
                          </time>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                      </div>
                    </motion.div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        {timelineEvents.length === 0 && (
          <div className="text-slate-500 italic py-4 pl-4">
            No timeline events available for this patient.
          </div>
        )}
      </div>
    </div>
  );
};


export default function PatientManagementPage() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDocs, setPatientDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      const data = await Patient.list('-admission_date');
      setPatients(data);
      setFilteredPatients(data);
      setLoading(false);
    };
    loadPatients();
  }, []);

  useEffect(() => {
    const results = patients.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(results);
  }, [searchTerm, patients]);

  const handleSelectPatient = async (patient) => {
    if (selectedPatient && selectedPatient.id === patient.id) {
      setSelectedPatient(null);
      setPatientDocs([]); // Clear docs when collapsing
      return;
    }
    setSelectedPatient(patient);
    const docs = await Document.filter({ patient_id: patient.patient_id }, "-date_received");
    setPatientDocs(docs);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Patient Management</h1>
      <p className="text-slate-600 mb-8">Search, view, and manage all patient records.</p>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search by patient name or ID..."
          className="pl-10"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Admission Date</TableHead>
              <TableHead>Days in System</TableHead>
              <TableHead>Validation</TableHead>
              <TableHead>Billability</TableHead>
              <TableHead>Care Progress</TableHead>
              <TableHead>Physician Group</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-6 text-slate-500">Loading patients...</TableCell></TableRow>
            ) : (
              filteredPatients.map(patient => {
                const daysSinceAdmission = Math.floor((new Date() - new Date(patient.admission_date)) / (1000 * 60 * 60 * 24));
                return (
                  <React.Fragment key={patient.id}>
                    <TableRow 
                      className="cursor-pointer hover:bg-slate-50" 
                      onClick={() => handleSelectPatient(patient)}
                    >
                      <TableCell>
                        <div className="font-medium text-slate-800">{patient.name}</div>
                        <div className="text-sm text-slate-500">{patient.patient_id}</div>
                      </TableCell>
                      <TableCell>{format(new Date(patient.admission_date), 'PPP')}</TableCell>
                      <TableCell>
                        <Badge variant={daysSinceAdmission > 45 ? "destructive" : daysSinceAdmission > 30 ? "secondary" : "outline"}>
                          {daysSinceAdmission} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={validationStatusStyles[patient.validation_status]}>
                          {patient.validation_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={billabilityStatusStyles[patient.billability_status]}>
                          {patient.billability_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full 
                            ${patient.billability_status === 'billable' ? 'bg-green-500' : 
                              patient.validation_status === 'validated' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs text-slate-500">
                            {patient.billability_status === 'billable' ? 'Complete' : 
                             patient.validation_status === 'validated' ? 'In Progress' : 'Needs Attention'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{patient.current_pg}</TableCell>
                    </TableRow>
                    <AnimatePresence>
                      {selectedPatient && selectedPatient.id === patient.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-slate-50 p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                  <h3 className="font-semibold text-lg text-slate-800 mb-3">{selectedPatient.name}</h3>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>DOB:</strong> {format(new Date(selectedPatient.date_of_birth), 'PPP')}</p>
                                    <p><strong>Email:</strong> {selectedPatient.email}</p>
                                    <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                                    <p><strong>HHA:</strong> {selectedPatient.assigned_hha}</p>
                                    <p><strong>Days in System:</strong> {Math.floor((new Date() - new Date(selectedPatient.admission_date)) / (1000 * 60 * 60 * 24))} days</p>
                                    {selectedPatient.missing_documents && selectedPatient.missing_documents.length > 0 && (
                                      <div>
                                        <strong>Missing Documents:</strong>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {selectedPatient.missing_documents.map(doc => (
                                            <Badge key={doc} variant="destructive" className="text-xs">
                                              {doc.toUpperCase()}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <PatientTimelineViewer 
                                    patientId={selectedPatient.patient_id} 
                                    onDocumentMissing={(patient, step) => {
                                      console.log('Missing document for step:', step.name, 'Patient:', patient.name);
                                      // Handle missing document resolution here
                                    }} 
                                  />
                                </div>
                              </div>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
