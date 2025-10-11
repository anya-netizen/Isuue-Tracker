import React, { useState, useEffect, useCallback } from 'react';
import { BillingCode, PhysicianGroup, Patient, Document } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, FileText, Download, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CareTypeBillingPanel() {
  const [billingCodes, setBillingCodes] = useState([]);
  const [pgs, setPgs] = useState([]);
  const [selectedPG, setSelectedPG] = useState('all');
  const [loading, setLoading] = useState(true);
  const [completionStats, setCompletionStats] = useState({});

  const createDefaultBillingCodes = useCallback(async () => {
    const defaultCodes = [
      {
        code: 'G0180',
        description: 'Physician certification for Medicare-covered home health services',
        required_documents: ['soc', '485', 'orders'],
        cpo_minutes: 30,
        value: 87.50
      },
      {
        code: 'G0181',
        description: 'Physician recertification for Medicare-covered home health services',
        required_documents: ['recertification', '485'],
        cpo_minutes: 20,
        value: 62.25
      },
      {
        code: 'G0179',
        description: 'Physician re-certification for Medicare-covered home health services',
        required_documents: ['discharge', 'f2f'],
        cpo_minutes: 25,
        value: 75.00
      }
    ];

    for (const code of defaultCodes) {
      await BillingCode.create(code);
    }
    
    // Reload data
    const updatedCodes = await BillingCode.list();
    setBillingCodes(updatedCodes);
  }, []);

  const loadBillingData = useCallback(async () => {
    setLoading(true);
    try {
      const [codesData, pgsData] = await Promise.all([
        BillingCode.list(),
        PhysicianGroup.list()
      ]);
      
      setBillingCodes(codesData);
      setPgs(pgsData);
      
      // Create default billing codes if none exist
      if (codesData.length === 0) {
        await createDefaultBillingCodes();
      }
    } catch (error) {
      console.error('Error loading billing data:', error);
    }
    setLoading(false);
  }, [createDefaultBillingCodes]);

  const calculateCompletion = useCallback(async () => {
    if (selectedPG === 'all') return;

    try {
      // Get all patients for the selected PG
      const patients = await Patient.filter({ current_pg: selectedPG });
      const patientIds = patients.map(p => p.patient_id);
      
      // Get all documents for these patients
      const allDocs = await Document.list();
      const pgDocs = allDocs.filter(doc => patientIds.includes(doc.patient_id));
      
      // Calculate completion for each billing code
      const stats = {};
      
      for (const code of billingCodes) {
        let completed = 0;
        
        for (const patient of patients) {
          const patientDocs = pgDocs.filter(doc => doc.patient_id === patient.patient_id);
          const hasAllRequiredDocs = code.required_documents.every(requiredDoc => 
            patientDocs.some(doc => doc.document_type === requiredDoc)
          );
          
          if (hasAllRequiredDocs) {
            completed++;
          }
        }
        
        const completionRate = patients.length > 0 ? (completed / patients.length) * 100 : 0;
        stats[code.code] = {
          completed,
          total: patients.length,
          rate: completionRate,
          revenue: completed * code.value
        };
      }
      
      setCompletionStats(stats);
    } catch (error) {
      console.error('Error calculating completion:', error);
    }
  }, [selectedPG, billingCodes]);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  useEffect(() => {
    if (selectedPG !== 'all') {
      calculateCompletion();
    }
  }, [calculateCompletion, selectedPG]);

  const exportBillingReport = () => {
    // Create CSV content
    let csvContent = "Billing Code,Description,Completed,Total Patients,Completion Rate,Revenue\n";
    
    billingCodes.forEach(code => {
      const stats = completionStats[code.code] || { completed: 0, total: 0, rate: 0, revenue: 0 };
      csvContent += `${code.code},"${code.description}",${stats.completed},${stats.total},${stats.rate.toFixed(1)}%,$${stats.revenue.toFixed(2)}\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `care-type-billing-${selectedPG}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-8">
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = Object.values(completionStats).reduce((sum, stat) => sum + stat.revenue, 0);
  const averageCompletion = Object.values(completionStats).length > 0 
    ? Object.values(completionStats).reduce((sum, stat) => sum + stat.rate, 0) / Object.values(completionStats).length 
    : 0;

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Care Type Billing Panel
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedPG} onValueChange={setSelectedPG}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select PG" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Physician Groups</SelectItem>
                {pgs.map(pg => (
                  <SelectItem key={pg.id} value={pg.name}>{pg.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPG !== 'all' && (
              <Button variant="outline" size="sm" onClick={exportBillingReport}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            )}
          </div>
        </CardTitle>
        {selectedPG !== 'all' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{averageCompletion.toFixed(1)}%</div>
              <div className="text-sm text-green-600">Avg Completion</div>
            </div>
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-blue-600">Total Revenue</div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6">
        {selectedPG === 'all' ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Physician Group</h3>
            <p className="text-gray-500">Choose a PG to view detailed billing code completion rates and revenue tracking.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {billingCodes.map((code, index) => {
              const stats = completionStats[code.code] || { completed: 0, total: 0, rate: 0, revenue: 0 };
              return (
                <motion.div
                  key={code.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-blue-100 text-blue-700 font-mono text-sm">
                          {code.code}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {code.cpo_minutes} min CPO
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ${code.value}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{code.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {code.required_documents.map(doc => (
                          <Badge key={doc} variant="secondary" className="text-xs">
                            {doc.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        {stats.completed}/{stats.total}
                      </div>
                      <div className="text-sm text-gray-500">patients</div>
                      <div className="text-sm font-semibold text-green-600 mt-1">
                        ${stats.revenue.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">{stats.rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.rate} className="h-2" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}