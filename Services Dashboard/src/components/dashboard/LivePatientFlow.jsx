import React, { useState, useEffect, useRef } from 'react';
import { PhysicianGroup, HomeHealthAgency } from '@/api/entities';
import { motion, AnimatePresence } from 'framer-motion';
import { Hospital, Home, GitBranch, Phone, Mail, MapPin, Users, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LivePatientFlow = () => {
    const [pgs, setPgs] = useState([]);
    const [hhas, setHhas] = useState([]);
    const [flows, setFlows] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const flowId = useRef(0);

    useEffect(() => {
        const loadData = async () => {
            const [pgData, hhaData] = await Promise.all([
                PhysicianGroup.list(),
                HomeHealthAgency.list()
            ]);
            setPgs(pgData.slice(0, 5)); // Limit for visualization
            setHhas(hhaData.slice(0, 5));
        };
        loadData();
    }, []);

    useEffect(() => {
        if (pgs.length === 0 || hhas.length === 0) return;

        const interval = setInterval(() => {
            const fromPg = pgs[Math.floor(Math.random() * pgs.length)];
            const toHha = hhas[Math.floor(Math.random() * hhas.length)];
            
            const newFlow = {
                id: flowId.current++,
                fromId: `pg-${fromPg.id}`,
                toId: `hha-${toHha.id}`,
            };

            setFlows(prev => [...prev, newFlow]);

            // Remove the flow after animation
            setTimeout(() => {
                setFlows(current => current.filter(f => f.id !== newFlow.id));
            }, 4900); // Just under 5s animation duration

        }, 2500); // New flow every 2.5 seconds

        return () => clearInterval(interval);
    }, [pgs, hhas]);
    
    const getCoords = (id) => {
        const element = document.getElementById(id);
        if (!element || !containerRef.current) return null;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const elemRect = element.getBoundingClientRect();
        
        const isPg = id.startsWith('pg');
        const x = isPg 
            ? (elemRect.left - containerRect.left + elemRect.width) 
            : (elemRect.left - containerRect.left);

        const y = elemRect.top - containerRect.top + elemRect.height / 2;

        return { x, y };
    };

    const handleMouseEnter = (item, type, event) => {
        setHoveredItem({ ...item, type });
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const handleMouseMove = (event) => {
        if (hoveredItem) {
            setMousePosition({ x: event.clientX, y: event.clientY });
        }
    };

    const Tooltip = ({ item }) => {
        if (!item) return null;

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed z-50 bg-white border border-slate-200 rounded-lg shadow-2xl p-4 max-w-sm"
                style={{
                    left: mousePosition.x + 10,
                    top: mousePosition.y - 10,
                    transform: 'translateY(-100%)'
                }}
            >
                <div className="flex items-center gap-2 mb-3">
                    {item.type === 'pg' ? (
                        <Hospital className="w-5 h-5 text-blue-500" />
                    ) : (
                        <Home className="w-5 h-5 text-purple-500" />
                    )}
                    <h3 className="font-semibold text-slate-900">{item.name}</h3>
                    <Badge variant="outline" className={item.type === 'pg' ? 'text-blue-700 border-blue-200' : 'text-purple-700 border-purple-200'}>
                        {item.type === 'pg' ? 'Physician Group' : 'Home Health Agency'}
                    </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                    {item.type === 'pg' && (
                        <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Type:</span>
                            <Badge variant="secondary" className="text-xs">
                                {item.type === 'facility' ? 'Facility' : 'Individual'}
                            </Badge>
                        </div>
                    )}
                    
                    {item.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Location:</span>
                            <span className="text-slate-900">{item.location}</span>
                        </div>
                    )}
                    
                    {item.contact_person && (
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Contact:</span>
                            <span className="text-slate-900">{item.contact_person}</span>
                        </div>
                    )}
                    
                    {item.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Phone:</span>
                            <span className="text-slate-900">{item.phone}</span>
                        </div>
                    )}
                    
                    {item.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">Email:</span>
                            <span className="text-slate-900">{item.email}</span>
                        </div>
                    )}

                    {item.type === 'pg' && (
                        <>
                            {item.active_patients !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">Active Patients:</span>
                                    <Badge className="bg-blue-100 text-blue-700 text-xs">
                                        {item.active_patients}
                                    </Badge>
                                </div>
                            )}
                            
                            {item.ehr_integration !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">EHR Integration:</span>
                                    <Badge variant={item.ehr_integration ? "default" : "secondary"} className="text-xs">
                                        {item.ehr_integration ? 'Connected' : 'Not Connected'}
                                    </Badge>
                                </div>
                            )}
                        </>
                    )}

                    {item.type === 'hha' && (
                        <>
                            {item.specialties && item.specialties.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <Building className="w-4 h-4 text-slate-400 mt-0.5" />
                                    <div>
                                        <span className="text-slate-600">Specialties:</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {item.specialties.map((specialty, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {specialty}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {item.capacity !== undefined && (
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400" />
                                    <span className="text-slate-600">Capacity:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-900">{item.current_load || 0}/{item.capacity}</span>
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
                                                style={{ width: `${Math.min(((item.current_load || 0) / item.capacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div onMouseMove={handleMouseMove}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8 overflow-hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-slate-900">
                        <GitBranch className="w-6 h-6 text-blue-600" />
                        Live Referral Flow
                    </CardTitle>
                    <p className="text-slate-500">Real-time visualization of patients moving from PGs to HHAs.</p>
                </CardHeader>
                <CardContent className="p-6">
                    <div ref={containerRef} className="relative h-64 flex justify-between items-center">
                        {/* PG Column */}
                        <div className="flex flex-col justify-around h-full z-10">
                            {pgs.map(pg => (
                                <div 
                                    key={pg.id} 
                                    id={`pg-${pg.id}`} 
                                    className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-2 text-sm hover:bg-blue-100 hover:border-blue-300 transition-all duration-200 cursor-pointer"
                                    onMouseEnter={(e) => handleMouseEnter(pg, 'pg', e)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Hospital className="w-4 h-4 text-blue-500" />
                                    <span className="font-semibold text-blue-800">{pg.name}</span>
                                </div>
                            ))}
                        </div>

                        {/* HHA Column */}
                        <div className="flex flex-col justify-around h-full z-10">
                            {hhas.map(hha => (
                                <div 
                                    key={hha.id} 
                                    id={`hha-${hha.id}`} 
                                    className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-2 text-sm hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 cursor-pointer"
                                    onMouseEnter={(e) => handleMouseEnter(hha, 'hha', e)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Home className="w-4 h-4 text-purple-500" />
                                    <span className="font-semibold text-purple-800">{hha.name}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Flow Animations */}
                        <div className="absolute inset-0">
                          <AnimatePresence>
                              {flows.map(flow => {
                                  const from = getCoords(flow.fromId);
                                  const to = getCoords(flow.toId);
                                  if (!from || !to) return null;

                                  return (
                                      <motion.div
                                          key={flow.id}
                                          className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                                          initial={{ x: from.x, y: from.y, opacity: 0 }}
                                          animate={{ x: to.x, y: to.y, opacity: [0, 1, 1, 0] }}
                                          exit={{ opacity: 0 }}
                                          transition={{ duration: 5, ease: "easeInOut", times: [0, 0.1, 0.9, 1] }}
                                      />
                                  );
                              })}
                          </AnimatePresence>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tooltip */}
            <AnimatePresence>
                {hoveredItem && <Tooltip item={hoveredItem} />}
            </AnimatePresence>
        </div>
    );
};

export default LivePatientFlow;