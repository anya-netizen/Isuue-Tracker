import React, { useState, useEffect, useCallback } from 'react';
import { CareCoordination, Patient, BillingCode } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, FileText, Sparkles, Save, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CPOCareCoordination({ patientId }) {
  const [careCoordination, setCareCoordination] = useState(null);
  const [patient, setPatient] = useState(null);
  const [billingCodes, setBillingCodes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    cpo_minutes: 0,
    coordination_notes: '',
    billing_codes: [],
    session_date: new Date().toISOString().split('T')[0]
  });

  const generateAICoordinationNotes = useCallback(async () => {
    if (!patient) return;
    
    // AI-generated care coordination notes based on patient data
    const aiNotes = `Care Plan Oversight - ${patient.name}
    
📋 Patient Status: ${patient.billability_status}
🏥 Current PG: ${patient.current_pg}
🏠 Assigned HHA: ${patient.assigned_hha}

📝 Care Coordination Activities:
• Reviewed current plan of care and patient progress
• Coordinated with HHA regarding ongoing treatments
• Assessed need for plan modifications
• Ensured compliance with Medicare requirements
• Documented patient status and care transitions

🎯 Next Steps:
• Continue monitoring patient progress
• Schedule follow-up assessments as needed
• Maintain communication between all care providers
• Review and update care plan as necessary

Generated on: ${new Date().toLocaleDateString()}`;

    setFormData(prev => ({
      ...prev,
      coordination_notes: aiNotes,
      cpo_minutes: 30 // Default CPO minutes
    }));
  }, [patient]);

  const loadCareCoordinationData = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const [coordData, patientData, codesData] = await Promise.all([
        CareCoordination.filter({ patient_id: patientId }, '-session_date'),
        Patient.filter({ patient_id: patientId }),
        BillingCode.list()
      ]);
      
      const latestCoord = coordData.length > 0 ? coordData[0] : null;
      setCareCoordination(latestCoord);
      setPatient(patientData[0]);
      setBillingCodes(codesData);
      
      if (latestCoord) {
        setFormData({
          cpo_minutes: latestCoord.cpo_minutes || 0,
          coordination_notes: latestCoord.coordination_notes || '',
          billing_codes: latestCoord.billing_codes || [],
          session_date: latestCoord.session_date || new Date().toISOString().split('T')[0]
        });
      } else {
        // Generate AI-suggested care coordination notes
        if (patientData[0]) {
          setPatient(patientData[0]);
          // generateAICoordinationNotes will be called after patient is set
        }
      }
    } catch (error) {
      console.error('Error loading care coordination data:', error);
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    loadCareCoordinationData();
  }, [loadCareCoordinationData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const careCoordData = {
        patient_id: patientId,
        cpo_minutes: parseInt(formData.cpo_minutes),
        coordination_notes: formData.coordination_notes,
        billing_codes: formData.billing_codes,
        session_date: formData.session_date,
        generated_by: careCoordination ? 'manual' : 'ai',
        is_billable: formData.cpo_minutes >= 15 // Medicare requires minimum 15 minutes
      };

      if (careCoordination) {
        await CareCoordination.update(careCoordination.id, careCoordData);
      } else {
        await CareCoordination.create(careCoordData);
      }
      
      await loadCareCoordinationData();
      setEditMode(false);
    } catch (error) {
      console.error('Error saving care coordination:', error);
    }
    setSaving(false);
  };

  const getTotalBillingValue = () => {
    return formData.billing_codes.reduce((total, codeId) => {
      const code = billingCodes.find(c => c.id === codeId);
      return total + (code ? code.value : 0);
    }, 0);
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!patient) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a patient to manage care coordination</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-600" />
            CPO & Care Coordination
          </div>
          <div className="flex items-center gap-2">
            {!editMode && (
              <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Edit Notes
              </Button>
            )}
            {!careCoordination && !editMode && (
              <Button size="sm" onClick={generateAICoordinationNotes} className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Notes
              </Button>
            )}
          </div>
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Patient: <strong>{patient.name}</strong></span>
          <Badge className={`${careCoordination?.is_billable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {careCoordination?.is_billable ? 'Billable' : 'Non-Billable'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {editMode ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  CPO Minutes
                </label>
                <Input
                  type="number"
                  value={formData.cpo_minutes}
                  onChange={(e) => setFormData(prev => ({...prev, cpo_minutes: e.target.value}))}
                  className="w-full"
                  min="0"
                />
                {formData.cpo_minutes < 15 && (
                  <p className="text-xs text-red-600 mt-1">
                    Minimum 15 minutes required for Medicare billing
                  </p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Session Date
                </label>
                <Input
                  type="date"
                  value={formData.session_date}
                  onChange={(e) => setFormData(prev => ({...prev, session_date: e.target.value}))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Care Coordination Notes
              </label>
              <Textarea
                value={formData.coordination_notes}
                onChange={(e) => setFormData(prev => ({...prev, coordination_notes: e.target.value}))}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter care coordination notes..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Associated Billing Codes
              </label>
              <div className="space-y-2">
                {billingCodes.map(code => (
                  <label key={code.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.billing_codes.includes(code.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev, 
                            billing_codes: [...prev.billing_codes, code.id]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            billing_codes: prev.billing_codes.filter(id => id !== code.id)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <Badge className="bg-blue-100 text-blue-700 font-mono">
                      {code.code}
                    </Badge>
                    <span className="text-sm text-gray-700">${code.value}</span>
                    <span className="text-xs text-gray-500">({code.cpo_minutes} min)</span>
                  </label>
                ))}
              </div>
              {formData.billing_codes.length > 0 && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Total Billing Value: ${getTotalBillingValue().toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSave} 
                disabled={saving || !formData.coordination_notes.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Coordination Notes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* CPO Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {careCoordination?.cpo_minutes || 0}
                </div>
                <div className="text-sm text-purple-600">CPO Minutes</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {careCoordination?.billing_codes?.length || 0}
                </div>
                <div className="text-sm text-blue-600">Billing Codes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${getTotalBillingValue().toFixed(2)}
                </div>
                <div className="text-sm text-green-600">Revenue</div>
              </div>
            </div>

            {/* Care Coordination Notes */}
            {careCoordination?.coordination_notes ? (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Care Coordination Notes</h4>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {careCoordination.coordination_notes}
                  </pre>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>
                    Generated: {careCoordination.generated_by === 'ai' ? 'AI-Generated' : 'Manual Entry'}
                  </span>
                  <span>
                    Session Date: {new Date(careCoordination.session_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">No care coordination notes yet</p>
                <Button onClick={() => setEditMode(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Care Coordination Notes
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}