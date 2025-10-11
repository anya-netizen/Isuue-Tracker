import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { 
  BarChart3, 
  Users, 
  RefreshCw,
  Settings,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import modular components
import SelectionInterface from './SelectionInterface';
import VisualizationCharts from './VisualizationCharts';
import PatientValidationTable from './PatientValidationTable';
import DocumentStats from './DocumentStats';
import DocumentStatsChart from './DocumentStatsChart';
import { usePGReportingData } from '@/hooks/usePGReportingData';


export default function PGReportingDashboard() {
  const [activeTab, setActiveTab] = useState('visualization');
  
  // Use the custom hook for all data management
  const {
    // Data
    divisionGroups,
    divisions,
    msas,
    gsas,
    practices,
    pgs,
    patients,
    
    // Selections
    selectedDivisionGroup,
    selectedDivision,
    selectedMSA,
    selectedGSA,
    selectedPractice,
    dateRange,
    selectedPatients,
    validationMode,
    
    // Filters
    searchTerm,
    documentFilter,
    
    // Chart data
    chartData,
    trendData,
    
    // Loading states
    loading,
    refreshing,
    practicesLoading,
    
    // Handlers
    setSelectedDivisionGroup,
    setSelectedDivision,
    setSelectedMSA,
    setSelectedGSA,
    setSelectedPractice,
    setDateRange,
    setValidationMode,
    setSearchTerm,
    setDocumentFilter,
    handleRefresh,
    handlePatientSelection,
    handleSelectAll,
    handleBulkValidation,
    handleFetchDocument,
    clearSelections,
    refreshPractices
  } = usePGReportingData();

  // Enhanced handlers with toast notifications
  const handleRefreshWithToast = async () => {
    const result = await handleRefresh();
    if (result) {
      toast({
        title: "Data Refreshed",
        description: "All data has been updated successfully.",
      });
    } else {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBulkValidationWithToast = async () => {
    const result = await handleBulkValidation();
    if (result.success) {
      toast({
        title: "Validation Complete",
        description: result.message,
      });
    } else {
      toast({
        title: "Validation Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  const handleFetchDocumentWithToast = async (patientId, documentType) => {
    const result = await handleFetchDocument(patientId, documentType);
    if (result.success) {
      toast({
        title: "Document Retrieved",
        description: result.message,
      });
    } else {
      toast({
        title: "Fetch Failed",
        description: result.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10 rounded-3xl blur-3xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      PG Reporting Dashboard
                    </h1>
                    <p className="text-gray-600 font-medium">
                      Comprehensive PG Performance Analysis & Patient Validation
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await refreshPractices();
                    toast({ title: 'Practice Fetch', description: `Loaded ${(practices || []).length} practices` });
                  }}
                  disabled={practicesLoading}
                  className="bg-white/80"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${practicesLoading ? 'animate-spin' : ''}`} />
                  Test Practice Fetch
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshWithToast}
                  disabled={refreshing}
                  className="bg-white/80"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelections}
                  className="bg-white/80"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selection Interface */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" />
              Selection Criteria
            </CardTitle>
            <p className="text-gray-600">Select division group, division, MSA, and GSA for targeted analysis</p>
          </CardHeader>
          <CardContent>
            <SelectionInterface
              selectedDivisionGroup={selectedDivisionGroup}
              selectedDivision={selectedDivision}
              selectedMSA={selectedMSA}
              selectedGSA={selectedGSA}
              selectedPractice={selectedPractice}
              onDivisionGroupChange={(value) => {
                const group = divisionGroups.find(g => g.id === value);
                setSelectedDivisionGroup(group);
                setSelectedDivision(null);
                setSelectedMSA(null);
                setSelectedGSA(null);
              }}
              onDivisionChange={(value) => {
                const division = divisions.find(d => d.id === value);
                setSelectedDivision(division);
                setSelectedMSA(null);
                setSelectedGSA(null);
              }}
              onMSAChange={(value) => {
                const msa = msas.find(m => m.id === value);
                setSelectedMSA(msa);
                setSelectedGSA(null);
              }}
              onGSAChange={(value) => {
                const gsa = gsas.find(g => g.id === value);
                setSelectedGSA(gsa);
              }}
              onPracticeChange={(value) => {
                const practice = (practices || []).find(p => p.id === value);
                setSelectedPractice(practice || null);
              }}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              divisionGroups={divisionGroups}
              divisions={divisions}
              msas={msas}
              gsas={gsas}
              practices={practices}
            />
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-gray-50 to-gray-100 p-2 rounded-2xl shadow-inner">
              <TabsTrigger value="visualization" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                <BarChart3 className="w-4 h-4 mr-2" />
                Visualization & Reporting
              </TabsTrigger>
              <TabsTrigger value="validation" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl transition-all duration-200">
                <Users className="w-4 h-4 mr-2" />
                Patient Validation
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="visualization" className="space-y-6 mt-0">
                <VisualizationCharts 
                  chartData={chartData}
                  trendData={trendData}
                  filteredPGs={pgs}
                />
              </TabsContent>

              <TabsContent value="validation" className="space-y-6 mt-0">
                <PatientValidationTable
                  patients={patients}
                  validationMode={validationMode}
                  onValidationModeChange={setValidationMode}
                  selectedPatients={selectedPatients}
                  onPatientSelection={handlePatientSelection}
                  onSelectAll={handleSelectAll}
                  onBulkValidation={handleBulkValidationWithToast}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  documentFilter={documentFilter}
                  onDocumentFilterChange={setDocumentFilter}
                  onFetchDocument={handleFetchDocumentWithToast}
                  loading={loading}
                />

                <DocumentStats patients={patients} />
                <DocumentStatsChart patients={patients} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
