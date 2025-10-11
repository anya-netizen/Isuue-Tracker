import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap, Save, FileText, Activity, ShieldQuestion } from 'lucide-react';
import { UserActivity, ActionItem } from '@/api/entities';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResolutionCenter({ patient, stage, isOpen, onClose }) {
  const [resolutionStep, setResolutionStep] = useState('initial'); // 'initial', 'auto', 'manual'
  const [isResolving, setIsResolving] = useState(false);
  const [manualNotes, setManualNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState('');

  const handleAutoFetch = async () => {
    setResolutionStep('auto');
    setIsResolving(true);
    setResolutionStatus('Attempting to fetch document from EHR...');

    // Simulate API call to EHR
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.5; // Simulate success/failure

    if (success) {
      setResolutionStatus('Success! Document found and attached to patient timeline.');
      await awardPoints('auto_resolution_success', 50);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      setResolutionStatus('Auto-fetch failed. Document not found in EHR. Please try manual resolution.');
      setIsResolving(false);
    }
  };

  const handleManualResolve = () => {
    setResolutionStep('manual');
    setResolutionStatus('');
  };

  const handleLogManualAttempt = async () => {
    if (!manualNotes.trim()) return;

    setIsResolving(true);
    setResolutionStatus('Logging manual resolution attempt...');
    
    await ActionItem.create({
      title: `Manual Resolution for ${stage.name} - ${patient.name}`,
      description: manualNotes,
      status: 'in_progress',
      priority: 'high',
      patient_id: patient.patient_id,
      assigned_to: 'admin@docalliance.com' // Should be dynamic
    });

    await awardPoints('manual_resolution_log', 15);
    setResolutionStatus('Manual attempt logged. Task created in Resolution Center.');

    setTimeout(() => {
      handleClose();
    }, 2000);
  };
  
  const awardPoints = async (activityType, points) => {
    try {
      await UserActivity.create({
        user_email: 'admin@docalliance.com', // Should be dynamic
        activity_type: 'document_resolution',
        points_earned: points,
        patient_id: patient.patient_id,
        description: `Resolved ${stage.name} for ${patient.name} via ${activityType}`
      });
    } catch(e) {
      console.error("Failed to award points:", e);
    }
  };

  const handleClose = () => {
    setResolutionStep('initial');
    setIsResolving(false);
    setManualNotes('');
    setResolutionStatus('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldQuestion className="w-6 h-6 text-red-500" />
                  Resolve Missing Document
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-6">
                <Card className="mb-6 bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <p className="font-semibold text-red-800">Patient: {patient?.name}</p>
                    <p className="text-sm text-red-700">Missing Document: <span className="font-bold">{stage?.name}</span></p>
                  </CardContent>
                </Card>

                {resolutionStep === 'initial' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-500" />
                          Automated
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Attempt to automatically fetch the missing document from the integrated EHR system.</p>
                        <Button className="w-full" onClick={handleAutoFetch}>Fetch from EHR</Button>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-orange-500" />
                          Manual
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">Log a manual communication attempt (e.g., call, email) to resolve the missing document.</p>
                        <Button variant="outline" className="w-full" onClick={handleManualResolve}>Log Manual Attempt</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {(resolutionStep === 'auto' || resolutionStep === 'manual') && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {isResolving && (
                      <div className="flex items-center justify-center gap-3 my-4 p-4 bg-gray-100 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <p className="text-sm font-medium">{resolutionStatus}</p>
                      </div>
                    )}

                    {!isResolving && resolutionStatus && (
                       <p className="text-sm text-center my-4 p-4 bg-yellow-100 rounded-lg text-yellow-800">{resolutionStatus}</p>
                    )}

                    {resolutionStep === 'manual' && !isResolving && (
                      <div className="space-y-4">
                        <h3 className="font-semibold">Log Communication</h3>
                        <Textarea 
                          placeholder="e.g., 'Called PG office, spoke to Jane. She will fax over the SOC document by EOD.'"
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                        />
                        <Button 
                          onClick={handleLogManualAttempt} 
                          disabled={!manualNotes.trim()}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Log and Create Task
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}