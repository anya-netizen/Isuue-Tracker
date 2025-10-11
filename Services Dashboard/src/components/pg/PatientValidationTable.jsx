import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Link,
  Upload,
  Eye,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PatientValidationTable({
  patients,
  validationMode,
  onValidationModeChange,
  selectedPatients,
  onPatientSelection,
  onSelectAll,
  onBulkValidation,
  searchTerm,
  onSearchChange,
  documentFilter,
  onDocumentFilterChange,
  onFetchDocument,
  loading
}) {
  // Collect dynamic document types present across patients
  const docTypes = Array.from(new Set(
    (patients || []).flatMap(p => Object.keys(p.documents || {}))
  ));
  const filteredPatients = patients.filter(patient => {
    // Filter by validation mode
    if (validationMode === 'to_be_moved') {
      if (patient.validationStatus !== 'pending') return false;
    } else {
      if (patient.validationStatus !== 'validated') return false;
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!patient.name.toLowerCase().includes(term) &&
          !patient.physician.toLowerCase().includes(term) &&
          !patient.pg.toLowerCase().includes(term)) {
        return false;
      }
    }

    // Filter by document availability
    if (documentFilter !== 'all') {
      const doc = patient.documents[documentFilter];
      if (!doc || doc.available) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Validation Mode Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={validationMode} onValueChange={onValidationModeChange} className="w-auto">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="to_be_moved" className="data-[state=active]:bg-white">
              <Clock className="w-4 h-4 mr-2" />
              To Be Moved ({patients.filter(p => p.validationStatus === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="already_moved" className="data-[state=active]:bg-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Already Moved ({patients.filter(p => p.validationStatus === 'validated').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            disabled={filteredPatients.length === 0}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {filteredPatients.every(p => p.selectedForValidation) ? 'Deselect All' : 'Select All'}
          </Button>
          
          {selectedPatients.length > 0 && (
            <Button
              size="sm"
              onClick={onBulkValidation}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Validate Selected ({selectedPatients.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={documentFilter} onValueChange={onDocumentFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by missing documents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="485">Missing 485</SelectItem>
                <SelectItem value="F2F">Missing F2F</SelectItem>
                <SelectItem value="Orders">Missing Orders</SelectItem>
                <SelectItem value="SOC">Missing SOC</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {filteredPatients.length} patients
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {selectedPatients.length} selected
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Validation Table */}
      <Card className="shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800 w-12">
                    <Checkbox
                      checked={filteredPatients.length > 0 && filteredPatients.every(p => p.selectedForValidation)}
                      onCheckedChange={onSelectAll}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Patient Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Physician</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Diagnosis</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Dates</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">PG & Ancillary</th>
                  {docTypes.map((type) => (
                    <th key={type} className="text-left py-3 px-4 font-semibold text-gray-800">{type}</th>
                  ))}
                  <th className="text-center py-3 px-4 font-semibold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.tr
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={patient.selectedForValidation}
                          onCheckedChange={(checked) => onPatientSelection(patient.id, checked)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.dob}</p>
                          <p className="text-xs text-gray-500 truncate max-w-48">{patient.address}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.physician}</p>
                          <p className="text-xs text-gray-500">NPI: {patient.physicianNPI}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 text-blue-700">{patient.diagnosisCode}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-xs space-y-1">
                          <p><span className="font-medium">SOC:</span> {patient.soc}</p>
                          <p><span className="font-medium">SO:</span> {patient.so}</p>
                          <p><span className="font-medium">EOE:</span> {patient.eoe}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{patient.pg}</p>
                          <p className="text-xs text-gray-500">{patient.ancillary}</p>
                        </div>
                      </td>
                      {docTypes.map((type) => {
                        const doc = (patient.documents || {})[type];
                        const available = !!doc?.available;
                        const link = doc?.link || null;
                        return (
                          <td key={type} className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{type}</Badge>
                              {available && link ? (
                                <a href={link} target="_blank" rel="noreferrer" title="Open document">
                                  <Link className="w-3 h-3 text-green-600" />
                                </a>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onFetchDocument(patient.id, type)}
                                  disabled={loading}
                                  className="h-6 px-2"
                                  title={`Fetch ${type}`}
                                >
                                  <Upload className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {Object.entries(patient.documents).some(([_, doc]) => !doc.available) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const missingDoc = Object.entries(patient.documents).find(([_, doc]) => !doc.available);
                                if (missingDoc) {
                                  onFetchDocument(patient.id, missingDoc[0]);
                                }
                              }}
                              disabled={loading}
                            >
                              <Upload className="w-3 h-3 mr-1" />
                              Fetch
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Patients Found</h3>
                <p>No patients match the current filter criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


