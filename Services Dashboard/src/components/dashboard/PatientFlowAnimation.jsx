
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient, PhysicianGroup, HomeHealthAgency, Document } from '@/api/entities';
import { Maximize2, X, ChevronDown, ChevronUp, Activity, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PatientFlowAnimation = ({ containerRef }) => {
  const [pipelineData, setPipelineData] = useState({
    stations: [],
    patients: [],
    stats: { total: 0, processing: 0, completed: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, documentData] = await Promise.all([
          Patient.list('-created_date', 30),
          Document.list('-date_received', 50)
        ]);

        // Helper functions moved inside useEffect
        const hasAnyDocument = (patientId, documents) => {
          return documents.some(doc => doc.patient_id === patientId);
        };

        const getCurrentStation = (patient, documentData, stations) => {
          if (patient.billability_status === 'billable') return stations.find(s => s.id === 'billing');
          if (patient.billability_status === 'unbillable' || patient.validation_status === 'flagged') {
            return stations.find(s => s.id === 'alert');
          }
          if (patient.billability_status === 'pending_review') return stations.find(s => s.id === 'quality');
          if (patient.validation_status === 'validated') return stations.find(s => s.id === 'validation');
          if (hasAnyDocument(patient.patient_id, documentData)) return stations.find(s => s.id === 'documentation');
          return stations.find(s => s.id === 'intake');
        };

        const getNextStation = (currentStation, stations) => {
          const stationOrder = ['intake', 'documentation', 'validation', 'quality', 'billing'];
          const currentIndex = stationOrder.indexOf(currentStation?.id);
          return currentIndex < stationOrder.length - 1 ? 
                 stations.find(s => s.id === stationOrder[currentIndex + 1]) : null;
        };

        // Define processing stations
        const stations = [
          {
            id: 'intake',
            name: 'Patient Intake',
            icon: '🏥',
            color: '#3b82f6',
            position: { x: 100, y: 200 },
            patients: patientData.filter(p => !hasAnyDocument(p.patient_id, documentData)),
            capacity: 10
          },
          {
            id: 'documentation',
            name: 'Documentation',
            icon: '📋',
            color: '#8b5cf6',
            position: { x: 300, y: 150 },
            patients: patientData.filter(p => hasAnyDocument(p.patient_id, documentData) && p.validation_status === 'pending'),
            capacity: 15
          },
          {
            id: 'validation',
            name: 'Validation',
            icon: '✅',
            color: '#10b981',
            position: { x: 500, y: 200 },
            patients: patientData.filter(p => p.validation_status === 'validated' && p.billability_status === 'pending_review'),
            capacity: 8
          },
          {
            id: 'quality',
            name: 'Quality Check',
            icon: '🔍',
            color: '#f59e0b',
            position: { x: 700, y: 150 },
            patients: patientData.filter(p => p.billability_status === 'pending_review'),
            capacity: 5
          },
          {
            id: 'billing',
            name: 'Billing Ready',
            icon: '💰',
            color: '#059669',
            position: { x: 900, y: 200 },
            patients: patientData.filter(p => p.billability_status === 'billable'),
            capacity: 20
          },
          {
            id: 'alert',
            name: 'Needs Attention',
            icon: '⚠️',
            color: '#dc2626',
            position: { x: 500, y: 350 },
            patients: patientData.filter(p => p.validation_status === 'flagged' || p.billability_status === 'unbillable'),
            capacity: 12
          }
        ];

        // Create CONTINUOUS flowing patients showing the complete journey
        const flowingPatients = [];
        
        // Generate demo patients at different stages for continuous flow
        for (let i = 0; i < 25; i++) {
          const patientTypes = [
            { stage: 'intake', next: 'documentation', status: 'new', color: '#3b82f6', delay: i * 2 },
            { stage: 'documentation', next: 'validation', status: 'processing', color: '#8b5cf6', delay: i * 2 + 0.5 },
            { stage: 'validation', next: 'quality', status: 'validated', color: '#10b981', delay: i * 2 + 1 },
            { stage: 'quality', next: Math.random() > 0.3 ? 'billing' : 'alert', status: 'review', color: '#f59e0b', delay: i * 2 + 1.5 },
            { stage: 'billing', next: null, status: 'billable', color: '#059669', delay: i * 2 + 2 },
            { stage: 'alert', next: 'documentation', status: 'flagged', color: '#dc2626', delay: i * 2 + 2.5 }
          ];
          
          const patientType = patientTypes[i % patientTypes.length];
          const currentStation = stations.find(s => s.id === patientType.stage);
          const nextStation = patientType.next ? stations.find(s => s.id === patientType.next) : null;
          
          flowingPatients.push({
            id: `demo-patient-${i}`,
            name: `Patient ${String.fromCharCode(65 + (i % 26))}${Math.floor(i/26) + 1}`,
            currentStation: patientType.stage,
            nextStation: patientType.next,
            status: patientType.status,
            color: patientType.color,
            animationDelay: patientType.delay,
            speed: 1 + Math.random() * 2, // Variable speed for realism
            position: currentStation ? currentStation.position : { x: 100, y: 200 }
          });
        }

        setPipelineData({
          stations: stations.map(station => ({
            ...station,
            load: (station.patients.length / station.capacity) * 100,
            status: station.patients.length > station.capacity * 0.8 ? 'high' : 
                   station.patients.length > station.capacity * 0.5 ? 'medium' : 'normal'
          })),
          patients: flowingPatients,
          stats: {
            total: patientData.length,
            processing: patientData.filter(p => p.validation_status === 'pending').length,
            completed: patientData.filter(p => p.billability_status === 'billable').length
          }
        });

      } catch (error) {
        console.error("Error loading pipeline data:", error);
      }
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []); // No dependencies needed since helper functions are now inside

  const toggleFullScreen = () => {
    if (!containerRef?.current) return;
    
    const element = containerRef.current;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Initializing Medical Pipeline...</p>
        </div>
      </div>
    );
  }

  const svgWidth = isFullScreen ? 1400 : 1000;
  const svgHeight = isFullScreen ? 800 : 450;

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${isFullScreen ? 'h-screen bg-slate-900' : 'h-[450px] bg-gradient-to-br from-slate-100 to-blue-50'}`}>
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        <div className="flex gap-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            <Activity className="w-3 h-3 mr-1" />
            Live Pipeline
          </Badge>
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            {pipelineData.stats.total} Total Patients
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleFullScreen}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        >
          {isFullScreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Pipeline Visualization */}
      <div className="w-full h-full overflow-hidden">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="bg-gradient-to-br from-slate-50 via-white to-blue-50"
        >
          <defs>
            {/* Pipeline gradient */}
            <linearGradient id="pipeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="25%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="75%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            
            {/* Conveyor belt pattern */}
            <pattern id="conveyor-pattern" patternUnits="userSpaceOnUse" width="20" height="8">
              <rect width="20" height="8" fill="#e2e8f0"/>
              <rect width="10" height="4" fill="#cbd5e1"/>
            </pattern>

            {/* Glowing effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Main Pipeline Track */}
          <path
            d="M 80 200 Q 200 180 320 160 T 520 200 Q 640 180 720 160 T 920 200"
            stroke="url(#pipeline-gradient)"
            strokeWidth="12"
            fill="none"
            opacity="0.3"
          />
          
          {/* Alert Branch */}
          <path
            d="M 500 200 Q 500 275 500 350"
            stroke="#dc2626"
            strokeWidth="8"
            fill="none"
            opacity="0.4"
          />

          {/* Conveyor Belts */}
          {pipelineData.stations.map((station, index) => (
            <g key={station.id}>
              {/* Station Platform */}
              <motion.rect
                x={station.position.x - 40}
                y={station.position.y - 30}
                width="80"
                height="60"
                rx="12"
                fill="white"
                stroke={station.color}
                strokeWidth="2"
                className="drop-shadow-lg"
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedStation(station)}
              />
              
              {/* Station Icon */}
              <text
                x={station.position.x}
                y={station.position.y - 5}
                textAnchor="middle"
                fontSize="24"
              >
                {station.icon}
              </text>
              
              {/* Station Name */}
              <text
                x={station.position.x}
                y={station.position.y + 45}
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
                fontWeight="600"
              >
                {station.name}
              </text>
              
              {/* Load Indicator */}
              <motion.rect
                x={station.position.x - 35}
                y={station.position.y + 20}
                width="70"
                height="4"
                rx="2"
                fill="#e2e8f0"
              />
              <motion.rect
                x={station.position.x - 35}
                y={station.position.y + 20}
                width={(station.load / 100) * 70}
                height="4"
                rx="2"
                fill={station.status === 'high' ? '#dc2626' : station.status === 'medium' ? '#f59e0b' : station.color}
                animate={{ width: (station.load / 100) * 70 }}
                transition={{ duration: 1 }}
              />
              
              {/* Patient Count Badge */}
              <circle
                cx={station.position.x + 25}
                cy={station.position.y - 25}
                r="12"
                fill={station.color}
              />
              <text
                x={station.position.x + 25}
                y={station.position.y - 21}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
              >
                {station.patients.length}
              </text>
            </g>
          ))}

          {/* LIVE FLOWING PATIENTS - Complete Journey Animation */}
          {pipelineData.patients.map((patient, index) => {
            const currentStation = pipelineData.stations.find(s => s.id === patient.currentStation);
            const nextStation = pipelineData.stations.find(s => s.id === patient.nextStation);
            
            if (!currentStation) return null;
            
            const startX = currentStation.position.x;
            const startY = currentStation.position.y;
            const endX = nextStation ? nextStation.position.x : startX + 100; // Continue off-screen if no next
            const endY = nextStation ? nextStation.position.y : startY;

            return (
              <motion.g key={patient.id}>
                {/* Patient Dot with Status Color */}
                <motion.circle
                  r="6"
                  fill={patient.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#glow)"
                  style={{ cursor: 'pointer' }}
                  initial={{ 
                    cx: startX, 
                    cy: startY, 
                    opacity: 0,
                    scale: 0.5
                  }}
                  animate={{
                    cx: [startX, endX],
                    cy: [startY, endY],
                    opacity: [0, 1, nextStation ? 1 : 0],
                    scale: [0.8, 1, 1]
                  }}
                  transition={{
                    duration: 8 + patient.speed,
                    delay: patient.animationDelay,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                  title={`${patient.name} - ${patient.status}`}
                />
                
                {/* Patient Trail Effect */}
                <motion.circle
                  r="3"
                  fill={patient.color}
                  opacity="0.4"
                  initial={{ cx: startX, cy: startY }}
                  animate={{
                    cx: [startX, endX],
                    cy: [startY, endY]
                  }}
                  transition={{
                    duration: 8 + patient.speed,
                    delay: patient.animationDelay + 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                />

                {/* Secondary Trail */}
                <motion.circle
                  r="2"
                  fill={patient.color}
                  opacity="0.2"
                  initial={{ cx: startX, cy: startY }}
                  animate={{
                    cx: [startX, endX],
                    cy: [startY, endY]
                  }}
                  transition={{
                    duration: 8 + patient.speed,
                    delay: patient.animationDelay + 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 2,
                    ease: "linear"
                  }}
                />
              </motion.g>
            );
          })}
          
          {/* Processing Effects - Pulsing rings around active stations */}
          {pipelineData.stations.map((station) => (
            station.load > 50 && (
              <g key={`effect-${station.id}`}>
                {[...Array(3)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={station.position.x}
                    cy={station.position.y}
                    r="30"
                    fill="none"
                    stroke={station.color}
                    strokeWidth="2"
                    opacity="0"
                    animate={{
                      r: [20, 50],
                      opacity: [0.6, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.7,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </g>
            )
          ))}

          {/* Zone Labels */}
          <text x="100" y="50" textAnchor="middle" className="text-lg font-bold fill-blue-600">
            INTAKE
          </text>
          <text x="300" y="100" textAnchor="middle" className="text-lg font-bold fill-purple-600">
            DOCS
          </text>
          <text x="500" y="50" textAnchor="middle" className="text-lg font-bold fill-green-600">
            VALIDATION
          </text>
          <text x="700" y="100" textAnchor="middle" className="text-lg font-bold fill-orange-600">
            QUALITY
          </text>
          <text x="900" y="50" textAnchor="middle" className="text-lg font-bold fill-green-700">
            BILLING
          </text>
          <text x="500" y="400" textAnchor="middle" className="text-lg font-bold fill-red-600">
            ALERTS
          </text>
        </svg>
      </div>

      {/* Live Stats Panel */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">{pipelineData.stats.processing}</p>
            <p className="text-xs text-slate-500">Processing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">{pipelineData.stats.completed}</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-700">{pipelineData.stats.total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
        </div>
      </div>

      {/* Station Details Modal */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30"
            onClick={() => setSelectedStation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedStation.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{selectedStation.name}</h3>
                  <p className="text-sm text-slate-500">Station Details</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Patients in Queue:</span>
                  <Badge>{selectedStation.patients.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span>{selectedStation.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Load:</span>
                  <Badge variant={selectedStation.status === 'high' ? 'destructive' : 'outline'}>
                    {Math.round(selectedStation.load)}%
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => setSelectedStation(null)} 
                className="w-full mt-4"
                variant="outline"
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientFlowAnimation;
