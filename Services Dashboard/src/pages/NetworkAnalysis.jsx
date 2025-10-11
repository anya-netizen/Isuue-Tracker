import React, { useState, useEffect, useRef } from 'react';
import { PhysicianGroup, Patient, HomeHealthAgency } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { GitBranch, Hospital, Home, User, Users, Activity, TrendingUp, Maximize2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NetworkAnalysisPage() {
  const [networkData, setNetworkData] = useState({ nodes: [], edges: [] });
  const [filteredData, setFilteredData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [stats, setStats] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Advanced Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPatients, setShowPatients] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [connectionStrength, setConnectionStrength] = useState([1]);
  const [viewMode, setViewMode] = useState('overview'); // Default to overview for large datasets
  const [focusedNode, setFocusedNode] = useState(null); // New focus state
  
  const svgRef = useRef(null);

  useEffect(() => {
    const generateNetworkData = async () => {
      setLoading(true);
      try {
        const [pgs, patients, hhas] = await Promise.all([
          PhysicianGroup.list(),
          Patient.list(),
          HomeHealthAgency.list()
        ]);

        console.log('Loaded data:', { pgs: pgs.length, patients: patients.length, hhas: hhas.length });

        // Network layout
        const width = 1400;
        const height = 800;
        const leftColumn = 200;
        const centerArea = width / 2;
        const rightColumn = width - 200;

        const nodes = [];
        const edges = [];
        const connectionCounts = new Map();

        // Create PG nodes
        pgs.forEach((pg, i) => {
          const connectedPatients = patients.filter(p => p.current_pg === pg.name);
          const y = (height / (pgs.length + 1)) * (i + 1);
          
          const pgNode = {
            id: `pg-${pg.id}`,
            type: 'pg',
            label: pg.name,
            shortLabel: pg.name.split(' ').slice(0, 3).join(' '),
            data: { ...pg, connectedPatients: connectedPatients.length },
            x: leftColumn,
            y: y,
            size: Math.max(40, Math.min(80, 40 + connectedPatients.length * 1)),
            connections: connectedPatients.length,
            visible: true
          };
          
          nodes.push(pgNode);
          connectionCounts.set(pgNode.id, connectedPatients.length);
        });

        // Create HHA nodes
        hhas.forEach((hha, i) => {
          const connectedPatients = patients.filter(p => p.assigned_hha === hha.name);
          const y = (height / (hhas.length + 1)) * (i + 1);
          
          const hhaNode = {
            id: `hha-${hha.id}`,
            type: 'hha',
            label: hha.name,
            shortLabel: hha.name.split(' ').slice(0, 3).join(' '),
            data: { ...hha, connectedPatients: connectedPatients.length },
            x: rightColumn,
            y: y,
            size: Math.max(40, Math.min(80, 40 + connectedPatients.length * 1)),
            connections: connectedPatients.length,
            visible: true
          };
          
          nodes.push(hhaNode);
          connectionCounts.set(hhaNode.id, connectedPatients.length);
        });

        // Group patients by PG-HHA combinations for aggregation
        const patientGroups = new Map();
        
        patients.forEach((patient) => {
          const key = `${patient.current_pg}-${patient.assigned_hha}-${patient.billability_status}`;
          if (!patientGroups.has(key)) {
            patientGroups.set(key, []);
          }
          patientGroups.get(key).push(patient);
        });

        // Create patient nodes (aggregated or individual based on view mode)
        let patientIndex = 0;
        patientGroups.forEach((groupPatients, key) => {
          const [pgName, hhaName, status] = key.split('-');
          const pgNode = nodes.find(n => n.type === 'pg' && n.data.name === pgName);
          const hhaNode = nodes.find(n => n.type === 'hha' && n.data.name === hhaName);
          
          if (pgNode && hhaNode) {
            if (viewMode === 'overview' && groupPatients.length > 2) {
              // Create aggregated node
              const cols = Math.ceil(Math.sqrt(patientGroups.size));
              const col = patientIndex % cols;
              const row = Math.floor(patientIndex / cols);
              
              const x = centerArea - 200 + (col * (400 / cols));
              const y = 100 + (row * (600 / Math.ceil(patientGroups.size / cols)));
              
              const aggregatedNode = {
                id: `patient-group-${patientIndex}`,
                type: 'patient-group',
                label: `${groupPatients.length} Patients`,
                shortLabel: `${groupPatients.length}x`,
                data: { 
                  patients: groupPatients, 
                  status: status,
                  count: groupPatients.length,
                  pgName,
                  hhaName 
                },
                x: x,
                y: y,
                size: Math.max(25, Math.min(60, 25 + groupPatients.length * 2)),
                connections: 2,
                visible: true
              };
              nodes.push(aggregatedNode);
              
              // Create edges
              edges.push({
                id: `edge-pg-${pgNode.id}-${aggregatedNode.id}`,
                source: pgNode.id,
                target: aggregatedNode.id,
                type: 'referral',
                weight: groupPatients.length,
                color: '#3b82f6',
                width: Math.max(2, Math.min(8, 2 + groupPatients.length * 0.5)),
                label: `${groupPatients.length}`,
                visible: true
              });
              
              edges.push({
                id: `edge-${aggregatedNode.id}-${hhaNode.id}`,
                source: aggregatedNode.id,
                target: hhaNode.id,
                type: 'assignment',
                weight: groupPatients.length,
                color: '#7c3aed',
                width: Math.max(2, Math.min(8, 2 + groupPatients.length * 0.5)),
                label: `${groupPatients.length}`,
                visible: true
              });
              
              patientIndex++;
            } else {
              // Create individual patient nodes
              groupPatients.forEach((patient, i) => {
                const cols = Math.ceil(Math.sqrt(patients.length));
                const col = patientIndex % cols;
                const row = Math.floor(patientIndex / cols);
                
                const x = centerArea - 250 + (col * (500 / cols)) + (Math.random() - 0.5) * 30;
                const y = 100 + (row * (600 / Math.ceil(patients.length / cols))) + (Math.random() - 0.5) * 30;
                
                const patientNode = {
                  id: `patient-${patient.id}`,
                  type: 'patient',
                  label: patient.name,
                  shortLabel: patient.name.split(' ')[0],
                  data: patient,
                  x: x,
                  y: y,
                  size: 20,
                  connections: 2,
                  visible: true
                };
                nodes.push(patientNode);

                // Create edges
                edges.push({
                  id: `edge-pg-${pgNode.id}-${patientNode.id}`,
                  source: pgNode.id,
                  target: patientNode.id,
                  type: 'referral',
                  weight: 1,
                  color: '#3b82f6',
                  width: 2,
                  visible: true
                });

                edges.push({
                  id: `edge-${patientNode.id}-${hhaNode.id}`,
                  source: patientNode.id,
                  target: hhaNode.id,
                  type: 'assignment',
                  weight: 1,
                  color: '#7c3aed',
                  width: 2,
                  visible: true
                });
                
                patientIndex++;
              });
            }
          }
        });

        // Calculate stats
        const networkStats = {
          totalPatients: patients.length,
          totalPGs: pgs.length,
          totalHHAs: hhas.length,
          totalConnections: edges.length,
          avgConnectionsPerPG: pgs.length > 0 ? Math.round(patients.length / pgs.length) : 0,
          avgConnectionsPerHHA: hhas.length > 0 ? Math.round(patients.length / hhas.length) : 0,
          maxConnections: connectionCounts.size > 0 ? Math.max(...Array.from(connectionCounts.values())) : 0,
          minConnections: connectionCounts.size > 0 ? Math.min(...Array.from(connectionCounts.values())) : 0
        };

        console.log('Generated network:', { 
          nodes: nodes.length, 
          edges: edges.length, 
          stats: networkStats 
        });

        setNetworkData({ nodes, edges });
        setFilteredData({ nodes, edges });
        setStats(networkStats);
      } catch (error) {
        console.error('Error generating network data:', error);
      }
      setLoading(false);
    };

    generateNetworkData();
  }, [viewMode]);

  // Enhanced filtering effect with focus mode
  useEffect(() => {
    let currentFilteredNodes = [...networkData.nodes];
    let currentFilteredEdges = [...networkData.edges];

    // Focus mode - show only connected network for a specific PG or HHA
    if (focusedNode) {
      const focusedNodeData = networkData.nodes.find(n => n.id === focusedNode.id);
      if (!focusedNodeData) {
        setFocusedNode(null); // Focused node not found in current networkData, reset focus
        setSelectedNode(null);
        return;
      }

      const visibleNodeIds = new Set([focusedNodeData.id]);
      let tempNodes = [focusedNodeData]; // Start with the focused node

      if (focusedNodeData.type === 'pg') {
        const connectedPatients = networkData.nodes.filter(n => 
          (n.type === 'patient' || n.type === 'patient-group') && 
          (n.data.current_pg === focusedNodeData.data.name || n.data.pgName === focusedNodeData.data.name)
        );
        connectedPatients.forEach(p => {
          if (!visibleNodeIds.has(p.id)) {
            tempNodes.push(p);
            visibleNodeIds.add(p.id);
          }
        });
        
        connectedPatients.forEach(patient => {
          const hhaName = patient.data.assigned_hha || patient.data.hhaName;
          const hhaNode = networkData.nodes.find(n => n.type === 'hha' && n.data.name === hhaName);
          if (hhaNode && !visibleNodeIds.has(hhaNode.id)) {
            tempNodes.push(hhaNode);
            visibleNodeIds.add(hhaNode.id);
          }
        });
        
        currentFilteredNodes = tempNodes;

      } else if (focusedNodeData.type === 'hha') {
        const connectedPatients = networkData.nodes.filter(n => 
          (n.type === 'patient' || n.type === 'patient-group') && 
          (n.data.assigned_hha === focusedNodeData.data.name || n.data.hhaName === focusedNodeData.data.name)
        );
        connectedPatients.forEach(p => {
          if (!visibleNodeIds.has(p.id)) {
            tempNodes.push(p);
            visibleNodeIds.add(p.id);
          }
        });
        
        connectedPatients.forEach(patient => {
          const pgName = patient.data.current_pg || patient.data.pgName;
          const pgNode = networkData.nodes.find(n => n.type === 'pg' && n.data.name === pgName);
          if (pgNode && !visibleNodeIds.has(pgNode.id)) {
            tempNodes.push(pgNode);
            visibleNodeIds.add(pgNode.id);
          }
        });
        currentFilteredNodes = tempNodes;
      } else {
        // If focusedNode is a patient or patient-group, show it and its direct PG/HHA
        const pgName = focusedNodeData.data.current_pg || focusedNodeData.data.pgName;
        const hhaName = focusedNodeData.data.assigned_hha || focusedNodeData.data.hhaName;

        const pgNode = networkData.nodes.find(n => n.type === 'pg' && n.data.name === pgName);
        if (pgNode && !visibleNodeIds.has(pgNode.id)) {
            tempNodes.push(pgNode);
            visibleNodeIds.add(pgNode.id);
        }
        const hhaNode = networkData.nodes.find(n => n.type === 'hha' && n.data.name === hhaName);
        if (hhaNode && !visibleNodeIds.has(hhaNode.id)) {
            tempNodes.push(hhaNode);
            visibleNodeIds.add(hhaNode.id);
        }
        currentFilteredNodes = tempNodes;
      }
      
      currentFilteredEdges = networkData.edges.filter(edge => 
        visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      );

    } else {
      // Not in focus mode, apply all general filters
      currentFilteredNodes = [...networkData.nodes];
      currentFilteredEdges = [...networkData.edges];

      // Search filter
      if (searchTerm) {
        currentFilteredNodes = currentFilteredNodes.filter(node => 
          node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (node.data.patient_id && node.data.patient_id.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Status filter
      if (statusFilter !== 'all') {
        currentFilteredNodes = currentFilteredNodes.filter(node => 
          node.type !== 'patient' || node.data.billability_status === statusFilter
        );
      }

      // Connection strength filter
      const minConnections = connectionStrength[0];
      currentFilteredNodes = currentFilteredNodes.filter(node => 
        node.connections >= minConnections || node.type === 'patient' || node.type === 'patient-group'
      );

      // Patient visibility toggle
      if (!showPatients) {
        currentFilteredNodes = currentFilteredNodes.filter(node => node.type !== 'patient' && node.type !== 'patient-group');
      }
    }

    // Connection visibility toggle (applies to both modes)
    if (!showConnections) {
      currentFilteredEdges = [];
    } else {
      // Update edge visibility based on filtered nodes
      const visibleNodeIdsAfterFilters = new Set(currentFilteredNodes.map(n => n.id));
      currentFilteredEdges = currentFilteredEdges.filter(edge => 
        visibleNodeIdsAfterFilters.has(edge.source) && visibleNodeIdsAfterFilters.has(edge.target)
      );
    }

    setFilteredData({ nodes: currentFilteredNodes, edges: currentFilteredEdges });
  }, [networkData, searchTerm, statusFilter, showPatients, showConnections, connectionStrength, focusedNode]);

  const getNodeById = (id) => filteredData.nodes.find(n => n.id === id);

  const getConnectedEdges = (nodeId) => {
    return filteredData.edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    );
  };

  const isHighlighted = (edge) => {
    if (!selectedNode && !hoveredNode) return false;
    const activeNode = selectedNode || hoveredNode;
    return edge.source === activeNode.id || edge.target === activeNode.id;
  };

  const isConnectedNode = (node) => {
    if (!selectedNode && !hoveredNode && !focusedNode) return true;
    const activeNode = selectedNode || hoveredNode;

    // Always show focused node and its direct connections
    if (focusedNode && node.id === focusedNode.id) return true;
    if (focusedNode && activeNode && activeNode.id === focusedNode.id) { // if the active node is the focused one
      return filteredData.edges.some(edge => 
        (edge.source === activeNode.id && edge.target === node.id) ||
        (edge.source === node.id && edge.target === activeNode.id)
      );
    }
    
    // Original logic for selected/hovered node
    if (activeNode && activeNode.id === node.id) return true;
    
    return filteredData.edges.some(edge => 
      (edge.source === (activeNode?.id || '') && edge.target === node.id) ||
      (edge.source === node.id && edge.target === (activeNode?.id || ''))
    );
  };

  const nodeTypeConfig = {
    pg: {
      color: '#2563eb',
      bgColor: '#dbeafe',
      icon: Hospital,
      label: 'Physician Group'
    },
    patient: {
      color: '#059669',
      bgColor: '#d1fae5',
      icon: User,
      label: 'Patient'
    },
    'patient-group': {
      color: '#059669',
      bgColor: '#d1fae5',
      icon: Users,
      label: 'Patient Group'
    },
    hha: {
      color: '#7c3aed',
      bgColor: '#e9d5ff',
      icon: Home,
      label: 'Home Health Agency'
    }
  };

  const handleNodeClick = (node) => {
    if (node.type === 'pg' || node.type === 'hha') {
      // If clicking the same node that's focused, unfocus it
      if (focusedNode && focusedNode.id === node.id) {
        setFocusedNode(null);
        setSelectedNode(null);
      } else {
        // Focus on this node
        setFocusedNode(node);
        setSelectedNode(node);
      }
    } else {
      // For patient nodes, just select them
      setSelectedNode(selectedNode?.id === node.id ? null : node);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setShowPatients(true);
    setShowConnections(true);
    setConnectionStrength([1]);
    setSelectedNode(null);
    setFocusedNode(null); // Clear focus mode
  };

  const exitFocusMode = () => {
    setFocusedNode(null);
    setSelectedNode(null);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-full">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading network data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Enterprise Network Analysis</h1>
        <p className="text-slate-600 mb-6">
          {focusedNode 
            ? `Focused view: ${focusedNode.label} network` 
            : 'Advanced visualization for large-scale patient flow relationships'
          }
        </p>
        
        {/* Focus Mode Alert */}
        {focusedNode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-semibold text-blue-900">
                  Focused on: {focusedNode.label}
                </p>
                <p className="text-sm text-blue-700">
                  Showing only connected {focusedNode.type === 'pg' ? 'patients and HHAs' : 'patients and PGs'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={exitFocusMode} className="bg-white">
              Show All Networks
            </Button>
          </div>
        )}

        {/* Network Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <Hospital className="w-6 h-6 mx-auto mb-1 text-blue-600" />
              <p className="text-xl font-bold text-blue-700">{focusedNode ? filteredData.nodes.filter(n => n.type === 'pg').length : stats.totalPGs}</p>
              <p className="text-xs text-blue-600">Physician Groups</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-1 text-green-600" />
              <p className="text-xl font-bold text-green-700">{focusedNode ? filteredData.nodes.filter(n => n.type === 'patient' || n.type === 'patient-group').length : stats.totalPatients}</p>
              <p className="text-xs text-green-600">Patients</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Home className="w-6 h-6 mx-auto mb-1 text-purple-600" />
              <p className="text-xl font-bold text-purple-700">{focusedNode ? filteredData.nodes.filter(n => n.type === 'hha').length : stats.totalHHAs}</p>
              <p className="text-xs text-purple-600">HHAs</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <GitBranch className="w-6 h-6 mx-auto mb-1 text-orange-600" />
              <p className="text-xl font-bold text-orange-700">{filteredData.edges.length}</p>
              <p className="text-xs text-orange-600">Connections</p>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-1 text-indigo-600" />
              <p className="text-xl font-bold text-indigo-700">{stats.maxConnections || 0}</p>
              <p className="text-xs text-indigo-600">Max Connections</p>
            </CardContent>
          </Card>
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-1 text-teal-600" />
              <p className="text-xl font-bold text-teal-700">{stats.avgConnectionsPerPG}</p>
              <p className="text-xs text-teal-600">Avg per PG</p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel - Hide most filters in focus mode */}
        {!focusedNode && (
          <Card className="mb-6 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Network Controls
                <Button variant="outline" size="sm" onClick={resetFilters} className="ml-auto">
                  Reset Filters
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search organizations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Patient Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="billable">Billable Only</SelectItem>
                      <SelectItem value="unbillable">Unbillable Only</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>View Mode</Label>
                  <Select value={viewMode} onValueChange={setViewMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detailed">Detailed View</SelectItem>
                      <SelectItem value="overview">Overview (Aggregated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Min Connections: {connectionStrength[0]}</Label>
                  <Slider
                    value={connectionStrength}
                    onValueChange={setConnectionStrength}
                    max={stats.maxConnections || 10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-patients"
                    checked={showPatients}
                    onCheckedChange={setShowPatients}
                  />
                  <Label htmlFor="show-patients">Show Patients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-connections"
                    checked={showConnections}
                    onCheckedChange={setShowConnections}
                  />
                  <Label htmlFor="show-connections">Show Connections</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className={`flex gap-6 ${isFullScreen ? 'flex-col' : ''}`}>
        {/* Network Map */}
        <Card className={`flex-grow shadow-xl bg-white/95 backdrop-blur-sm ${isFullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-blue-600" />
                Smart Network Visualization
                <Badge variant="outline" className="ml-2">
                  {filteredData.nodes.length} nodes, {filteredData.edges.length} connections
                </Badge>
                {focusedNode && (
                  <Badge className="ml-2 bg-blue-100 text-blue-700">
                    Focused Mode
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {focusedNode && (
                  <Button variant="outline" size="sm" onClick={exitFocusMode}>
                    Exit Focus
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={toggleFullScreen}>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  {isFullScreen ? 'Exit' : 'Full Screen'}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full" style={{ height: isFullScreen ? 'calc(100vh - 80px)' : '700px' }}>
              <svg 
                ref={svgRef}
                width="100%" 
                height="100%" 
                viewBox="0 0 1400 800"
                className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30"
                onClick={() => {
                  // Only clear selected node if not in focus mode, or if focusedNode is a patient/patient-group
                  // as PG/HHA clicks control focus state
                  if (!focusedNode || (focusedNode.type !== 'pg' && focusedNode.type !== 'hha')) {
                    setSelectedNode(null);
                  }
                }}
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Zone Labels */}
                <text x="200" y="40" textAnchor="middle" className="text-sm font-bold fill-blue-700">
                  PHYSICIAN GROUPS
                </text>
                <text x="700" y="40" textAnchor="middle" className="text-sm font-bold fill-green-700">
                  PATIENT NETWORK
                </text>
                <text x="1200" y="40" textAnchor="middle" className="text-sm font-bold fill-purple-700">
                  HOME HEALTH AGENCIES
                </text>

                {/* Render Edges */}
                {filteredData.edges.map(edge => {
                  const sourceNode = getNodeById(edge.source);
                  const targetNode = getNodeById(edge.target);
                  if (!sourceNode || !targetNode) return null;

                  const highlighted = isHighlighted(edge);
                  const dimmed = (selectedNode || hoveredNode) && !highlighted;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={sourceNode.x}
                        y1={sourceNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={highlighted ? edge.color : '#94a3b8'}
                        strokeWidth={highlighted ? edge.width + 1 : edge.width}
                        strokeDasharray={edge.type === 'assignment' ? '8,4' : '0'}
                        opacity={dimmed ? 0.2 : (highlighted ? 0.9 : 0.6)}
                      />
                      {edge.weight > 1 && (highlighted || focusedNode) && (
                        <text
                          x={(sourceNode.x + targetNode.x) / 2}
                          y={(sourceNode.y + targetNode.y) / 2}
                          textAnchor="middle"
                          className="text-xs font-bold fill-slate-700 pointer-events-none"
                          dy="4"
                        >
                          {edge.label || edge.weight}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Render Nodes */}
                {filteredData.nodes.map(node => {
                  const config = nodeTypeConfig[node.type];
                  const isSelected = selectedNode && selectedNode.id === node.id;
                  const isHovered = hoveredNode && hoveredNode.id === node.id;
                  const isFocused = focusedNode && focusedNode.id === node.id;
                  const isDimmed = (selectedNode || hoveredNode || focusedNode) && !isConnectedNode(node) && !isFocused;

                  return (
                    <g key={node.id}>
                      {/* Main node circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.size / 2}
                        fill={isFocused ? '#3b82f6' : config.bgColor}
                        stroke={isFocused ? '#1d4ed8' : config.color}
                        strokeWidth={isFocused ? 4 : (isSelected ? 3 : isHovered ? 2 : 1)}
                        opacity={isDimmed ? 0.3 : 1}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNodeClick(node);
                        }}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                      />

                      {/* Node labels */}
                      <text
                        x={node.x}
                        y={node.y + node.size/2 + 16}
                        textAnchor="middle"
                        className={`text-xs font-semibold pointer-events-none ${
                          isDimmed ? 'fill-slate-400' : (isFocused ? 'fill-blue-800' : 'fill-slate-800')
                        }`}
                      >
                        {node.shortLabel}
                      </text>

                      {/* Connection count badge */}
                      {node.connections > 0 && (
                        <>
                          <circle
                            cx={node.x + node.size/2 - 8}
                            cy={node.y - node.size/2 + 8}
                            r="10"
                            fill={isFocused ? '#1d4ed8' : config.color}
                            opacity="0.9"
                          />
                          <text
                            x={node.x + node.size/2 - 8}
                            y={node.y - node.size/2 + 12}
                            textAnchor="middle"
                            className="text-xs font-bold fill-white pointer-events-none"
                          >
                            {node.connections}
                          </text>
                        </>
                      )}

                      {/* Special indicators */}
                      {node.type === 'patient-group' && (
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-green-800 pointer-events-none"
                        >
                          {node.data.count}
                        </text>
                      )}

                      {/* Focus indicator */}
                      {isFocused && (
                        <text
                          x={node.x}
                          y={node.y - node.size/2 - 20}
                          textAnchor="middle"
                          className="text-xs font-bold fill-blue-600 pointer-events-none"
                        >
                          FOCUSED
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Details Panel */}
        <div className={`w-80 flex-shrink-0 ${isFullScreen ? 'hidden' : ''}`}>
          <Card className="shadow-xl sticky top-6">
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Network Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedNode ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: nodeTypeConfig[selectedNode.type].bgColor,
                        color: nodeTypeConfig[selectedNode.type].color 
                      }}
                    >
                      {React.createElement(nodeTypeConfig[selectedNode.type].icon, { className: "w-5 h-5" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{selectedNode.label}</h3>
                      <Badge variant="outline" className="text-xs">
                        {nodeTypeConfig[selectedNode.type].label}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Show focus action for PG/HHA nodes */}
                  {(selectedNode.type === 'pg' || selectedNode.type === 'hha') && (!focusedNode || focusedNode.id !== selectedNode.id) && (
                    <div className="mb-4">
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleNodeClick(selectedNode)}
                      >
                        {focusedNode && focusedNode.id === selectedNode.id ? 'Exit Focus Mode' : `Focus on ${selectedNode.shortLabel} Network`}
                      </Button>
                    </div>
                  )}

                  {/* Click instructions */}
                  {(!focusedNode || focusedNode.id !== selectedNode.id) && (selectedNode.type === 'pg' || selectedNode.type === 'hha') && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        💡 <strong>Tip:</strong> Click the button above or double-click the node to focus and see only its connected network.
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {selectedNode.type === 'patient' && (
                      <div className="text-sm space-y-2">
                        <p><strong>Patient ID:</strong> {selectedNode.data.patient_id}</p>
                        <p><strong>Current PG:</strong> {selectedNode.data.current_pg}</p>
                        <p><strong>Assigned HHA:</strong> {selectedNode.data.assigned_hha}</p>
                        <p><strong>Status:</strong> 
                          <Badge className={`ml-2 text-xs ${
                            selectedNode.data.billability_status === 'billable' 
                              ? 'bg-green-100 text-green-700' 
                              : selectedNode.data.billability_status === 'unbillable'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {selectedNode.data.billability_status}
                          </Badge>
                        </p>
                         <p><strong>Referral Type:</strong> 
                          <Badge className="ml-2 text-xs bg-gray-100 text-gray-700">
                            {selectedNode.data.referral_type || 'N/A'}
                          </Badge>
                        </p>
                      </div>
                    )}

                    {selectedNode.type === 'patient-group' && (
                      <div className="text-sm space-y-2">
                        <p><strong>Patient Count:</strong> {selectedNode.data.count}</p>
                        <p><strong>Status:</strong> {selectedNode.data.status}</p>
                        <p><strong>PG:</strong> {selectedNode.data.pgName}</p>
                        <p><strong>HHA:</strong> {selectedNode.data.hhaName}</p>
                      </div>
                    )}
                    
                    {selectedNode.type === 'pg' && (
                      <div className="text-sm space-y-2">
                        <p><strong>Connected Patients:</strong> {selectedNode.data.connectedPatients}</p>
                        <p><strong>Location:</strong> {selectedNode.data.location}</p>
                        <p><strong>Type:</strong> 
                          <Badge className="ml-2 text-xs bg-blue-100 text-blue-700">
                            {selectedNode.data.type}
                          </Badge>
                        </p>
                        <p><strong>Contact:</strong> {selectedNode.data.contact_person}</p>
                      </div>
                    )}
                    
                    {selectedNode.type === 'hha' && (
                      <div className="text-sm space-y-2">
                        <p><strong>Connected Patients:</strong> {selectedNode.data.connectedPatients}</p>
                        <p><strong>Location:</strong> {selectedNode.data.location}</p>
                        <p><strong>Contact:</strong> {selectedNode.data.contact_person}</p>
                        <p><strong>Capacity:</strong> {selectedNode.data.current_load || 0}/{selectedNode.data.capacity || 100}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold mb-2">Network Analysis</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-bold text-blue-600">
                            {getConnectedEdges(selectedNode.id).length}
                          </div>
                          <div className="text-slate-500">Direct Links</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-bold text-green-600">
                            {focusedNode ? '100' : Math.round((selectedNode.connections / (stats.totalConnections || 1)) * 100)}%
                          </div>
                          <div className="text-slate-500">{focusedNode ? 'Focus View' : 'Network Share'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">
                    {focusedNode 
                      ? `Exploring ${focusedNode.label} network` 
                      : 'Click any node to explore relationships and network details'
                    }
                  </p>
                  {!focusedNode && (
                    <div className="text-left text-xs space-y-2 mt-6">
                      <p className="font-semibold">Instructions:</p>
                      <p>• Click or double-click PG/HHA to focus on their network</p>
                      <p>• Click again to unfocus</p>
                      <p>• Use filters to customize the view</p>
                    </div>
                  )}
                  <div className="text-left text-xs space-y-2 mt-6">
                    <p className="font-semibold">Legend:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-200 border border-blue-500"></div>
                      <span>Physician Groups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-200 border border-green-500"></div>
                      <span>Patients</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-200 border border-purple-500"></div>
                      <span>Home Health Agencies</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}