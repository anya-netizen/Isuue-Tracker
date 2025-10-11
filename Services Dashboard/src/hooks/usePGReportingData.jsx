import { useState, useEffect, useMemo, useCallback } from 'react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Mock data - in a real app, this would come from API calls
const mockDivisionGroups = [
  { id: '1', name: 'Northeast Division Group', region: 'Northeast' },
  { id: '2', name: 'Southeast Division Group', region: 'Southeast' },
  { id: '3', name: 'Midwest Division Group', region: 'Midwest' },
  { id: '4', name: 'West Division Group', region: 'West' }
];

const mockDivisions = [
  { id: '1', name: 'Metro Health Division', groupId: '1', location: 'New York, NY' },
  { id: '2', name: 'Coastal Care Division', groupId: '1', location: 'Boston, MA' },
  { id: '3', name: 'Sunshine Division', groupId: '2', location: 'Miami, FL' },
  { id: '4', name: 'Heartland Division', groupId: '3', location: 'Chicago, IL' },
  { id: '5', name: 'Pacific Division', groupId: '4', location: 'Los Angeles, CA' }
];

const mockMSAs = [
  { id: '1', name: 'New York-Newark-Jersey City MSA', divisionId: '1', population: '20.1M' },
  { id: '2', name: 'Boston-Cambridge-Newton MSA', divisionId: '2', population: '4.9M' },
  { id: '3', name: 'Miami-Fort Lauderdale-West Palm Beach MSA', divisionId: '3', population: '6.1M' },
  { id: '4', name: 'Chicago-Naperville-Elgin MSA', divisionId: '4', population: '9.5M' },
  { id: '5', name: 'Los Angeles-Long Beach-Anaheim MSA', divisionId: '5', population: '13.2M' }
];

const mockGSAs = [
  { id: '1', name: 'GSA Contract 1', msaId: '1', contractValue: '$2.5M' },
  { id: '2', name: 'GSA Contract 2', msaId: '2', contractValue: '$1.8M' },
  { id: '3', name: 'GSA Contract 3', msaId: '3', contractValue: '$3.2M' },
  { id: '4', name: 'GSA Contract 4', msaId: '4', contractValue: '$4.1M' },
  { id: '5', name: 'GSA Contract 5', msaId: '5', contractValue: '$5.7M' }
];

const mockPGs = [
  { id: '1', name: 'Metro Health PG', divisionId: '1', msaId: '1', gsaId: '1', expectedCount: 150, actualCount: 142 },
  { id: '2', name: 'Boston Care PG', divisionId: '2', msaId: '2', gsaId: '2', expectedCount: 95, actualCount: 89 },
  { id: '3', name: 'Sunshine Medical PG', divisionId: '3', msaId: '3', gsaId: '3', expectedCount: 120, actualCount: 115 },
  { id: '4', name: 'Heartland Health PG', divisionId: '4', msaId: '4', gsaId: '4', expectedCount: 180, actualCount: 175 },
  { id: '5', name: 'Pacific Care PG', divisionId: '5', msaId: '5', gsaId: '5', expectedCount: 200, actualCount: 198 }
];

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    dob: '1955-03-15',
    address: '123 Main St, New York, NY 10001',
    physician: 'Dr. Sarah Johnson',
    physicianNPI: '1234567890',
    diagnosisCode: 'I50.9',
    soc: '2024-01-15',
    so: '2024-01-16',
    eoe: '2024-02-15',
    pg: 'Metro Health PG',
    ancillary: 'Physical Therapy',
    documents: {
      '485': { available: true, link: '/documents/485/1', status: 'validated' },
      'F2F': { available: true, link: '/documents/f2f/1', status: 'validated' },
      'Orders': { available: false, link: null, status: 'missing' },
      'SOC': { available: true, link: '/documents/soc/1', status: 'validated' }
    },
    validationStatus: 'pending',
    selectedForValidation: false
  },
  {
    id: '2',
    name: 'Mary Johnson',
    dob: '1948-07-22',
    address: '456 Oak Ave, Boston, MA 02101',
    physician: 'Dr. Michael Brown',
    physicianNPI: '0987654321',
    diagnosisCode: 'M79.3',
    soc: '2024-01-20',
    so: '2024-01-21',
    eoe: '2024-02-20',
    pg: 'Boston Care PG',
    ancillary: 'Occupational Therapy',
    documents: {
      '485': { available: true, link: '/documents/485/2', status: 'validated' },
      'F2F': { available: false, link: null, status: 'missing' },
      'Orders': { available: true, link: '/documents/orders/2', status: 'validated' },
      'SOC': { available: true, link: '/documents/soc/2', status: 'validated' }
    },
    validationStatus: 'pending',
    selectedForValidation: false
  }
];

export function usePGReportingData() {
  // Selection state
  const [selectedDivisionGroup, setSelectedDivisionGroup] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [selectedMSA, setSelectedMSA] = useState(null);
  const [selectedGSA, setSelectedGSA] = useState(null);
  const [selectedPractice, setSelectedPractice] = useState(null);
  
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  
  // Patient validation state
  const [patients, setPatients] = useState(mockPatients);
  const [selectedPatients, setSelectedPatients] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [validationMode, setValidationMode] = useState('to_be_moved');
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Practices (from external API)
  const [practices, setPractices] = useState([]);
  const [practicesLoading, setPracticesLoading] = useState(false);

  // Normalize arbitrary entity shape into { id, name }
  const normalizePractice = (item, idx) => {
    const id = item?.id || item?.Id || item?.practiceId || item?.PracticeId || String(idx);
    const name = item?.name || item?.Name || item?.practiceName || item?.PracticeName || item?.entityName || item?.EntityName || `Practice ${id}`;
    return { id: String(id), name: String(name) };
  };

  const fetchPractices = useCallback(async () => {
    setPracticesLoading(true);
    try {
      const url = (import.meta?.env?.DEV)
        ? '/da-entity/Entity?EntityType=PRACTICE'
        : 'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity?EntityType=PRACTICE';
      const res = await fetch(url, { headers: { accept: '*/*' } });
      let fetched = [];
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
        fetched = list.map(normalizePractice);
      }

      // Fallback to PG-derived practices if API returns nothing
      if (!fetched.length) {
        const derived = Array.from(new Map(
          (mockPGs || []).map(pg => [pg.id, { id: String(pg.id), name: pg.name }])
        ).values());
        fetched = derived;
      }

      setPractices(fetched);
      // Initialize selection if none
      if (!selectedPractice && fetched.length) {
        setSelectedPractice(fetched[0]);
      }
    } catch (e) {
      // Fallback on any error
      const derived = Array.from(new Map(
        (mockPGs || []).map(pg => [pg.id, { id: String(pg.id), name: pg.name }])
      ).values());
      setPractices(derived);
      if (!selectedPractice && derived.length) {
        setSelectedPractice(derived[0]);
      }
    } finally {
      setPracticesLoading(false);
    }
  }, [selectedPractice]);

  // initial load of practices
  useEffect(() => {
    fetchPractices();
  }, [fetchPractices]);

  // Filtered data based on selections
  const filteredDivisions = useMemo(() => {
    if (!selectedDivisionGroup) return mockDivisions;
    return mockDivisions.filter(d => d.groupId === selectedDivisionGroup.id);
  }, [selectedDivisionGroup]);

  const filteredMSAs = useMemo(() => {
    if (!selectedDivision) return mockMSAs;
    return mockMSAs.filter(m => m.divisionId === selectedDivision.id);
  }, [selectedDivision]);

  const filteredGSAs = useMemo(() => {
    if (!selectedMSA) return mockGSAs;
    return mockGSAs.filter(g => g.msaId === selectedMSA.id);
  }, [selectedMSA]);

  const filteredPGs = useMemo(() => {
    let filtered = mockPGs;
    
    if (selectedDivisionGroup) {
      filtered = filtered.filter(pg => {
        const division = mockDivisions.find(d => d.id === pg.divisionId);
        return division?.groupId === selectedDivisionGroup.id;
      });
    }
    
    if (selectedDivision) {
      filtered = filtered.filter(pg => pg.divisionId === selectedDivision.id);
    }
    
    if (selectedMSA) {
      filtered = filtered.filter(pg => pg.msaId === selectedMSA.id);
    }
    
    if (selectedGSA) {
      filtered = filtered.filter(pg => pg.gsaId === selectedGSA.id);
    }
    
    return filtered;
  }, [selectedDivisionGroup, selectedDivision, selectedMSA, selectedGSA]);

  const filteredPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      // Filter by PG selection
      if (selectedDivisionGroup || selectedDivision || selectedMSA || selectedGSA) {
        const patientPG = mockPGs.find(pg => pg.name === patient.pg);
        if (!patientPG) return false;
        
        if (selectedDivisionGroup) {
          const division = mockDivisions.find(d => d.id === patientPG.divisionId);
          if (division?.groupId !== selectedDivisionGroup.id) return false;
        }
        
        if (selectedDivision && patientPG.divisionId !== selectedDivision.id) return false;
        if (selectedMSA && patientPG.msaId !== selectedMSA.id) return false;
        if (selectedGSA && patientPG.gsaId !== selectedGSA.id) return false;
      }
      
      return true;
    });

    // Filter by validation mode
    if (validationMode === 'to_be_moved') {
      filtered = filtered.filter(p => p.validationStatus === 'pending');
    } else {
      filtered = filtered.filter(p => p.validationStatus === 'validated');
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.physician.toLowerCase().includes(term) ||
        p.pg.toLowerCase().includes(term)
      );
    }

    // Filter by document availability
    if (documentFilter !== 'all') {
      filtered = filtered.filter(p => {
        const doc = p.documents[documentFilter];
        return doc && !doc.available;
      });
    }

    return filtered;
  }, [patients, selectedDivisionGroup, selectedDivision, selectedMSA, selectedGSA, validationMode, searchTerm, documentFilter]);

  // Chart data for visualization
  const chartData = useMemo(() => {
    return filteredPGs.map(pg => ({
      name: pg.name,
      expected: pg.expectedCount,
      actual: pg.actualCount,
      difference: pg.expectedCount - pg.actualCount
    }));
  }, [filteredPGs]);

  const trendData = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      return {
        date: format(date, 'MM/dd'),
        expected: Math.floor(Math.random() * 20) + 10,
        actual: Math.floor(Math.random() * 18) + 8
      };
    });
  }, []);

  // Handlers
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 1000)),
        fetchPractices()
      ]);
      return true;
    } catch (error) {
      return false;
    } finally {
      setRefreshing(false);
    }
  }, [fetchPractices]);

  const handlePatientSelection = useCallback((patientId, selected) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, selectedForValidation: selected } : p
    ));
    
    if (selected) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  }, []);

  const handleSelectAll = useCallback(() => {
    const allSelected = filteredPatients.every(p => p.selectedForValidation);
    
    setPatients(prev => prev.map(p => ({
      ...p,
      selectedForValidation: allSelected ? false : filteredPatients.some(fp => fp.id === p.id)
    })));
    
    if (allSelected) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map(p => p.id));
    }
  }, [filteredPatients]);

  const handleBulkValidation = useCallback(async () => {
    if (selectedPatients.length === 0) {
      return { success: false, message: "No patients selected" };
    }

    setLoading(true);
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPatients(prev => prev.map(p => 
        selectedPatients.includes(p.id) 
          ? { ...p, validationStatus: 'validated', selectedForValidation: false }
          : p
      ));
      
      setSelectedPatients([]);
      
      return { success: true, message: `${selectedPatients.length} patients validated successfully` };
    } catch (error) {
      return { success: false, message: "Validation failed" };
    } finally {
      setLoading(false);
    }
  }, [selectedPatients]);

  const handleFetchDocument = useCallback(async (patientId, documentType) => {
    setLoading(true);
    try {
      // Simulate fetching from back office
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPatients(prev => prev.map(p => 
        p.id === patientId 
          ? { 
              ...p, 
              documents: {
                ...p.documents,
                [documentType]: { available: true, link: `/documents/${documentType.toLowerCase()}/${patientId}`, status: 'validated' }
              }
            }
          : p
      ));
      
      return { success: true, message: `${documentType} document fetched successfully` };
    } catch (error) {
      return { success: false, message: "Fetch failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedDivisionGroup(null);
    setSelectedDivision(null);
    setSelectedMSA(null);
    setSelectedGSA(null);
    setSelectedPractice(null);
  }, []);

  return {
    // Data
    divisionGroups: mockDivisionGroups,
    divisions: filteredDivisions,
    msas: filteredMSAs,
    gsas: filteredGSAs,
    practices,
    pgs: filteredPGs,
    patients: filteredPatients,
    
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
    refreshPractices: fetchPractices
  };
}


