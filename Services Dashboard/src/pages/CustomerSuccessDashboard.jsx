import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hospital, MapPin, Phone, Mail } from 'lucide-react';
import CustomerSuccessDashboard from '@/components/customer-success/CustomerSuccessDashboard';
import { physicianGroups, patients as mockPatients, documents as mockDocuments } from '@/data/mockData';
import { enhancedPhysicianGroups } from '@/data/enhancedPGData';

export default function CustomerSuccessDashboardPage() {
  const [selectedPG, setSelectedPG] = useState(null);
  const [pgs, setPgs] = useState([]);
  const [patients, setPatients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const combinedPGs = [...physicianGroups, ...enhancedPhysicianGroups];
        setPgs(combinedPGs);
        setPatients(mockPatients);
        setDocuments(mockDocuments);

        // Select first PG with patients
        let initialSelection = null;
        if (combinedPGs.length > 0 && mockPatients.length > 0) {
          const patientPgNames = new Set(mockPatients.map(p => p.current_pg).filter(Boolean));
          initialSelection = combinedPGs.find(pg => patientPgNames.has(pg.name)) || combinedPGs[0];
        }

        if (!initialSelection && combinedPGs.length > 0) {
          initialSelection = combinedPGs[0];
        }

        if (initialSelection) {
          setSelectedPG(initialSelection);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-slate-600 text-lg">Loading Customer Success Dashboard...</p>
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
            <p className="text-gray-500">Please select a Physician Group to view customer success metrics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
                    <p className="text-slate-600 text-lg">Customer Success Dashboard</p>
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
                </div>
              </div>

              <div className="w-80">
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
            </div>
          </div>
        </div>

        {/* Customer Success Dashboard */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="p-6">
            <CustomerSuccessDashboard 
              selectedPG={selectedPG}
              patients={patients}
              documents={documents}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

