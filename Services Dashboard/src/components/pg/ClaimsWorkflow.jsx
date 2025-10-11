
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, FileText, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function ClaimsWorkflow({ selectedPG, patients, claimsStatus, onClaimStatusUpdate }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [claimDialog, setClaimDialog] = useState(false);
  const [claimReason, setClaimReason] = useState('');

  const claimsData = useMemo(() => {
    if (!selectedPG || !patients.length) return { billable: [], processed: [], notClaimed: [] };

    const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
    const billablePatients = pgPatients.filter(p => p.billability_status === 'billable');
    
    // Simulate some processed claims
    const processed = billablePatients.filter(p => claimsStatus[p.id] === 'made');
    const notClaimed = billablePatients.filter(p => claimsStatus[p.id] === 'not-made');
    const readyToClaim = billablePatients.filter(p => !claimsStatus[p.id]);

    return { billable: readyToClaim, processed, notClaimed };
  }, [selectedPG, patients, claimsStatus]);

  const handleClaimStatus = (patient, status) => {
    if (status === 'made') {
      onClaimStatusUpdate(patient.id, 'made');
      setClaimDialog(false);
    } else {
      setSelectedPatient(patient);
      setClaimDialog(true);
    }
  };

  const handleNotClaimedSubmit = () => {
    if (selectedPatient && claimReason.trim()) {
      onClaimStatusUpdate(selectedPatient.id, 'not-made', claimReason);
      setClaimDialog(false);
      setClaimReason('');
      setSelectedPatient(null);
    }
  };

  const PatientClaimCard = ({ patient, status, showActions = true }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'ready': return 'border-blue-200 bg-blue-50';
        case 'made': return 'border-green-200 bg-green-50';
        case 'not-made': return 'border-red-200 bg-red-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    };

    const getStatusIcon = () => {
      switch (status) {
        case 'made': return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'not-made': return <XCircle className="w-5 h-5 text-red-600" />;
        default: return <DollarSign className="w-5 h-5 text-blue-600" />;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg border-2 ${getStatusColor()} shadow-sm`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {patient.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{patient.name}</p>
              <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={`${
              status === 'made' ? 'bg-green-100 text-green-700' :
              status === 'not-made' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {status === 'made' ? 'Claimed' : status === 'not-made' ? 'Not Claimed' : 'Ready'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="text-gray-600">PG:</span>
            <span className="ml-2 font-medium">{patient.current_pg}</span>
          </div>
          <div>
            <span className="text-gray-600">HHA:</span>
            <span className="ml-2 font-medium">{patient.assigned_hha}</span>
          </div>
          <div>
            <span className="text-gray-600">Admission:</span>
            <span className="ml-2 font-medium">
              {patient.admission_date ? format(new Date(patient.admission_date), 'MMM d, yyyy') : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Estimated:</span>
            <span className="ml-2 font-medium text-green-600">
              ${Math.floor(Math.random() * 2000) + 1000}
            </span>
          </div>
        </div>

        {status === 'not-made' && claimsStatus[`${patient.id}_reason`] && (
          <div className="mb-3 p-3 bg-red-100 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Reason for not claiming:</span>
            </div>
            <p className="text-sm text-red-700">{claimsStatus[`${patient.id}_reason`]}</p>
          </div>
        )}

        {showActions && status === 'ready' && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              size="sm"
              onClick={() => handleClaimStatus(patient, 'made')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Claims Made
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleClaimStatus(patient, 'not-made')}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Claims Not Made
            </Button>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Claims Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <FileText className="w-5 h-5" />
              Ready to Claim
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {claimsData.billable.length}
              </div>
              <p className="text-sm text-blue-700">Billable patients awaiting claim processing</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-green-200 bg-green-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Claims Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {claimsData.processed.length}
              </div>
              <p className="text-sm text-green-700">Successfully submitted claims</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-red-200 bg-red-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              Claims Not Made
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {claimsData.notClaimed.length}
              </div>
              <p className="text-sm text-red-700">Claims not processed with reasons</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims Processing Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ready to Claim */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <DollarSign className="w-5 h-5" />
              Billable Patients ({claimsData.billable.length})
            </CardTitle>
            <p className="text-sm text-gray-600">Review and process claims for billable patients</p>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {claimsData.billable.map(patient => (
                <PatientClaimCard
                  key={patient.id}
                  patient={patient}
                  status="ready"
                />
              ))}
            </AnimatePresence>
            {claimsData.billable.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No billable patients ready for claims</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claims Made */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              Claims Sheet ({claimsData.processed.length})
            </CardTitle>
            <p className="text-sm text-gray-600">Successfully processed claims</p>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {claimsData.processed.map(patient => (
                <PatientClaimCard
                  key={patient.id}
                  patient={patient}
                  status="made"
                  showActions={false}
                />
              ))}
            </AnimatePresence>
            {claimsData.processed.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No claims processed yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claims Not Made */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              Not Claimed ({claimsData.notClaimed.length})
            </CardTitle>
            <p className="text-sm text-gray-600">Claims not processed with documented reasons</p>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {claimsData.notClaimed.map(patient => (
                <PatientClaimCard
                  key={patient.id}
                  patient={patient}
                  status="not-made"
                  showActions={false}
                />
              ))}
            </AnimatePresence>
            {claimsData.notClaimed.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <XCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No unclaimed patients</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Claims Not Made Reason Dialog */}
      <Dialog open={claimDialog} onOpenChange={setClaimDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Claim Not Made - Specify Reason
            </DialogTitle>
            <p className="text-gray-600">
              Please provide the reason why the claim was not made for {selectedPatient?.name}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for not claiming</Label>
              <Textarea
                id="reason"
                placeholder="Enter detailed reason why this claim could not be processed..."
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setClaimDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleNotClaimedSubmit}
                disabled={!claimReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Reason
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
