import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HomeHealthAgency } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { Hospital, Home, Users, ArrowRight, Search, MapPin, Briefcase, HeartPulse, PieChart, User as UserIcon, Phone, Mail, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

// Fixed ConnectionLine component with proper coordinate handling
const ConnectionLine = ({ from, to, delay = 0, isHighlighted = false }) => {
  return (
    <g>
      {/* Static background line */}
      <line
        x1={from.x} y1={from.y}
        x2={to.x} y2={to.y}
        stroke={isHighlighted ? "#3b82f6" : "#e2e8f0"}
        strokeWidth={isHighlighted ? "3" : "2"}
        opacity={isHighlighted ? 1 : 0.7}
      />
      {/* Animated foreground line */}
      <motion.line
        x1={from.x} y1={from.y}
        x2={to.x} y2={to.y}
        stroke={isHighlighted ? "#6366f1" : "#a5b4fc"}
        strokeWidth={isHighlighted ? "4" : "3"}
        strokeDasharray="8 4"
        initial={{ strokeDashoffset: 24 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        }}
      />
    </g>
  );
};

export default function PGNetworkVisualization({ selectedPG, patients, onPatientSelect, onRefresh }) {
  const [hhas, setHhas] = useState([]);
  const [selectedCommonNode, setSelectedCommonNode] = useState(null);
  const [commonPatients, setCommonPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadHHAs = async () => {
      try {
        setLoading(true);
        // Use HHA partnerships from selectedPG instead of API call
        if (selectedPG && selectedPG.hha_partnerships) {
          const hhaData = selectedPG.hha_partnerships.map(partnership => ({
            id: partnership.id,
            name: partnership.name,
            npi: partnership.npi,
            type: partnership.type,
            patients_count: partnership.patients_count,
            monthly_revenue: partnership.monthly_revenue,
            partnership_start: partnership.partnership_start,
            address: `Healthcare Partnership with ${selectedPG.name}`,
            city: selectedPG.city,
            state: selectedPG.state,
            phone: selectedPG.phone
          }));
          setHhas(hhaData);
        } else {
          // Fallback to empty array if no partnerships
          setHhas([]);
        }
      } catch (error) {
        console.error('Error loading HHAs:', error);
        toast({
          title: "Error Loading HHAs",
          description: "Failed to load Home Health Agencies.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    loadHHAs();
  }, [selectedPG]);

  // Memoize network data to prevent flicker
  const networkData = useMemo(() => {
    if (!selectedPG || !patients.length || !hhas.length) return { connections: [] };

    const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
    const connections = [];

    // Group patients by HHA
    const hhaGroups = {};
    pgPatients.forEach(patient => {
      if (patient.assigned_hha) {
        if (!hhaGroups[patient.assigned_hha]) {
          hhaGroups[patient.assigned_hha] = [];
        }
        hhaGroups[patient.assigned_hha].push(patient);
      }
    });

    // Create connections with common patient nodes
    Object.entries(hhaGroups).forEach(([hhaName, hhaPatients]) => {
      const hha = hhas.find(h => h.name === hhaName);
      if (hha && hhaPatients.length > 0) {
        connections.push({
          hha,
          patients: hhaPatients,
          patientCount: hhaPatients.length,
          billableCount: hhaPatients.filter(p => p.billability_status === 'billable').length,
          id: `${selectedPG.id}-${hha.id}`
        });
      }
    });

    return { connections, totalPatients: pgPatients.length };
  }, [selectedPG, patients, hhas]);

  const highlightedNodeIds = useMemo(() => {
    if (!searchTerm) return new Set();
    const term = searchTerm.toLowerCase();
    const highlighted = new Set();

    if (selectedPG.name.toLowerCase().includes(term)) {
      highlighted.add(`pg-${selectedPG.id}`);
    }

    networkData.connections.forEach(connection => {
      if (connection.hha.name.toLowerCase().includes(term)) {
        highlighted.add(`hha-${connection.hha.id}`);
      }
      if (connection.patients.some(p => p.name.toLowerCase().includes(term))) {
        highlighted.add(`common-${connection.id}`);
      }
    });

    return highlighted;
  }, [searchTerm, networkData, selectedPG]);

  const handleCommonNodeClick = (connection) => {
    setCommonPatients(connection.patients);
    setSelectedCommonNode(connection);
  };

  const handlePatientClick = (patient) => {
    if (onPatientSelect) {
      onPatientSelect(patient);
    }
  };

  const handleContactHHA = (hha) => {
    toast({
      title: "Contacting HHA",
      description: `Initiated contact with ${hha.name}`,
    });
  };

  const handlePGAction = (action) => {
    switch(action) {
      case 'view_details':
        toast({
          title: "PG Details",
          description: `Viewing detailed information for ${selectedPG.name}`,
        });
        break;
      case 'update_info':
        toast({
          title: "Update Information",
          description: "Opening PG information update form...",
        });
        break;
      default:
        break;
    }
  };

  // Define IMPROVED positioning system that uses full space
  const getNodePosition = (type, index = 0, totalConnections = 1) => {
    const containerWidth = 800;
    const containerHeight = 500;

    switch (type) {
      case 'pg':
        return {
          x: containerWidth * 0.12,
          y: containerHeight * 0.5
        };
      case 'common':
        const commonSpacing = totalConnections > 1 ? containerHeight * 0.6 / (totalConnections - 1) : 0;
        const startY = containerHeight * 0.2;
        return {
          x: containerWidth * 0.45,
          y: totalConnections === 1 ? containerHeight * 0.5 : startY + (index * commonSpacing)
        };
      case 'hha':
        const hhaSpacing = totalConnections > 1 ? containerHeight * 0.6 / (totalConnections - 1) : 0;
        const hhaStartY = containerHeight * 0.2;
        return {
          x: containerWidth * 0.75,
          y: totalConnections === 1 ? containerHeight * 0.5 : hhaStartY + (index * hhaSpacing)
        };
      default:
        return { x: 0, y: 0 };
    }
  };

  const NetworkNode = ({ type, data, index = 0, onClick, isHighlighted, totalConnections = 1 }) => {
    const position = getNodePosition(type, index, totalConnections);

    const getNodeColor = () => {
      switch (type) {
        case 'pg': return 'from-blue-500 to-blue-600';
        case 'hha': return 'from-purple-500 to-purple-600';
        case 'common': return 'from-green-500 to-green-600';
        default: return 'from-gray-500 to-gray-600';
      }
    };

    const getIcon = () => {
      switch (type) {
        case 'pg': return <Hospital className="w-6 h-6 text-white" />;
        case 'hha': return <Home className="w-6 h-6 text-white" />;
        case 'common': return <Users className="w-6 h-6 text-white" />;
        default: return null;
      }
    };

    const nodeElement = (
      <motion.div
        className="absolute cursor-pointer group"
        style={{
          left: position.x - 40,
          top: position.y - 40,
          transform: 'none'
        }}
        onClick={onClick}
        whileHover={{ zIndex: 10 }}
        whileTap={{ scale: 0.95 }}
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        <div 
          className={`relative w-20 h-20 rounded-full shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-200 ${isHighlighted ? 'ring-4 ring-offset-2 ring-yellow-400 animate-pulse' : ''}`}
          style={{
            background: type === 'pg' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                       type === 'hha' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
                       type === 'common' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                       'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = type === 'pg' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                                        type === 'hha' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
                                        type === 'common' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                        'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = type === 'pg' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
                                        type === 'hha' ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' :
                                        type === 'common' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                                        'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
          }}
        >
          {getIcon()}
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 text-center min-w-max max-w-36">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {type === 'common' ? `${data.patientCount} Patients` : data.name}
          </p>
          {type === 'hha' && data.specialties && data.specialties.length > 0 && (
            <p className="text-xs text-gray-600 truncate mt-1">
              {data.specialties[0]}
            </p>
          )}
          {type === 'common' && data.billableCount > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {data.billableCount} billable
            </p>
          )}
        </div>
      </motion.div>
    );

    // For common nodes, return element directly
    if (type === 'common') {
      return nodeElement;
    }

    // For PG and HHA nodes, wrap with Popover
    return (
      <Popover>
        <PopoverTrigger asChild>
          {nodeElement}
        </PopoverTrigger>
        <PopoverContent className="w-80 border-slate-300 bg-white/95 backdrop-blur-lg">
          {type === 'pg' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-blue-800 flex items-center gap-2">
                <Hospital className="w-5 h-5"/>
                {data.name}
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0"/>
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0"/>
                  Type: <Badge variant="outline">{data.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 shrink-0"/>
                  Contact: {data.contact_person}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0"/>
                  Active Patients: <span className="font-bold text-blue-600">{data.active_patients}</span>
                </div>
                {data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0"/>
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0"/>
                    <span className="text-blue-600">{data.email}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" onClick={() => handlePGAction('view_details')}>
                  View Details
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePGAction('update_info')}>
                  Update Info
                </Button>
              </div>
            </div>
          )}
          {type === 'hha' && (
             <div className="space-y-4">
              <h3 className="font-bold text-lg text-purple-800 flex items-center gap-2">
                <Home className="w-5 h-5"/>
                {data.name}
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0"/>
                  <span>{data.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <HeartPulse className="w-4 h-4 mt-0.5 shrink-0"/>
                  <div>
                    <strong>Specialties:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data.specialties?.map(s => <Badge key={s} className="bg-purple-100 text-purple-800 text-xs">{s}</Badge>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 shrink-0"/>
                  Contact: {data.contact_person}
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 shrink-0"/>
                  Capacity: <span className="font-bold text-purple-600">{data.current_load} / {data.capacity}</span>
                </div>
                {data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 shrink-0"/>
                    <span>{data.phone}</span>
                  </div>
                )}
                {data.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 shrink-0"/>
                    <span className="text-purple-600">{data.email}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" onClick={() => handleContactHHA(data)}>
                  Contact
                </Button>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  };

  if (!selectedPG) return null;

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Hospital className="w-6 h-6 text-white" />
                </div>
                Network Structure: {selectedPG.name}
              </CardTitle>
              <p className="text-gray-600 mt-2">Interactive network showing real-time connections and patient flow</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search PGs, HHAs, patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-8 flex justify-center items-center">
          <div
            ref={containerRef}
            className="relative h-[500px] bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border-2 border-dashed border-blue-200 overflow-hidden"
            style={{ width: '100%', maxWidth: '700px', transform: 'scale(0.85)' }}
          >
            {/* Enhanced Background Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="network-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                    <circle cx="15" cy="15" r="1" fill="#cbd5e1" opacity="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#network-grid)" />
              </svg>
            </div>

            {/* Enhanced SVG for connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.6"/>
                </linearGradient>
              </defs>
              {networkData.connections.map((connection, index) => {
                const totalConnections = networkData.connections.length;
                const pgPos = getNodePosition('pg', 0, totalConnections);
                const commonPos = getNodePosition('common', index, totalConnections);
                const hhaPos = getNodePosition('hha', index, totalConnections);
                const isHighlighted = highlightedNodeIds.has(`common-${connection.id}`) || 
                                   highlightedNodeIds.has(`hha-${connection.hha.id}`) ||
                                   highlightedNodeIds.has(`pg-${selectedPG.id}`);

                return (
                  <g key={connection.id}>
                    <ConnectionLine
                      from={pgPos}
                      to={commonPos}
                      delay={index * 0.3}
                      isHighlighted={isHighlighted}
                    />
                    <ConnectionLine
                      from={commonPos}
                      to={hhaPos}
                      delay={index * 0.3 + 0.6}
                      isHighlighted={isHighlighted}
                    />

                    {/* Enhanced connection flow indicators */}
                    <motion.circle
                      r={isHighlighted ? "4" : "3"}
                      fill={isHighlighted ? "#6366f1" : "url(#connectionGradient)"}
                      initial={{
                        cx: pgPos.x,
                        cy: pgPos.y
                      }}
                      animate={{
                        cx: [pgPos.x, commonPos.x, hhaPos.x],
                        cy: [pgPos.y, commonPos.y, hhaPos.y]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* PG Node */}
            <NetworkNode
              type="pg"
              data={selectedPG}
              totalConnections={networkData.connections.length}
              isHighlighted={highlightedNodeIds.has(`pg-${selectedPG.id}`)}
            />

            {/* HHA and Common Patient Nodes */}
            {networkData.connections.map((connection, index) => (
              <React.Fragment key={connection.id}>
                <NetworkNode
                  type="common"
                  data={connection}
                  index={index}
                  totalConnections={networkData.connections.length}
                  onClick={() => handleCommonNodeClick(connection)}
                  isHighlighted={highlightedNodeIds.has(`common-${connection.id}`)}
                />

                <NetworkNode
                  type="hha"
                  data={connection.hha}
                  index={index}
                  totalConnections={networkData.connections.length}
                  isHighlighted={highlightedNodeIds.has(`hha-${connection.hha.id}`)}
                />
              </React.Fragment>
            ))}

            {/* Enhanced Labels */}
            <div className="absolute top-6 left-6">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1.5 font-semibold shadow-lg pointer-events-none hover:bg-blue-100">
                <Hospital className="w-4 h-4 mr-2" />
                Physician Group
              </Badge>
            </div>
            <div className="absolute top-6 right-6">
              <Badge className="bg-purple-100 text-purple-800 px-3 py-1.5 font-semibold shadow-lg pointer-events-none hover:bg-purple-100">
                <Home className="w-4 h-4 mr-2" />
                Home Health Agencies
              </Badge>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-green-100 text-green-800 px-3 py-1.5 font-semibold shadow-lg pointer-events-none hover:bg-green-100">
                <Users className="w-4 h-4 mr-2" />
                Click patient groups for details
              </Badge>
            </div>

            {/* Enhanced Network Statistics */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border">
                <div className="flex items-center gap-4 text-sm font-medium">
                  <span className="text-blue-600">{networkData.connections.length} HHA Connections</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-green-600">
                    {networkData.totalPatients} Total Patients
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-600">
                    {networkData.connections.reduce((acc, conn) => acc + conn.billableCount, 0)} Billable
                  </span>
                </div>
              </div>
            </div>

            {/* No connections state */}
            {networkData.connections.length === 0 && !loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Network Connections</h3>
                  <p>No patient-HHA relationships found for {selectedPG.name}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Common Patients Dialog */}
      <Dialog open={!!selectedCommonNode} onOpenChange={() => setSelectedCommonNode(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-600" />
              Patient Details ({commonPatients.length} patients)
            </DialogTitle>
            <p className="text-gray-600">
              Patients managed by {selectedPG?.name} through {selectedCommonNode?.hha?.name}
            </p>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {commonPatients.map(patient => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {patient.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <Badge className={`text-xs ${
                        patient.billability_status === 'billable'
                          ? 'bg-green-100 text-green-700'
                          : patient.billability_status === 'unbillable'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {patient.billability_status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">ID: {patient.patient_id}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {patient.referral_type || 'Standard Referral'}
                      </Badge>
                      {patient.admission_date && (
                        <Badge variant="outline" className="text-xs">
                          Admitted: {new Date(patient.admission_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onPatientSelect(patient);
                      setSelectedCommonNode(null);
                    }}
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onPatientSelect(patient);
                      setSelectedCommonNode(null);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Open Dashboard
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              <strong>Summary:</strong> {commonPatients.filter(p => p.billability_status === 'billable').length} billable, {commonPatients.filter(p => p.billability_status === 'unbillable').length} non-billable patients
            </div>
            <Button variant="outline" onClick={() => setSelectedCommonNode(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}