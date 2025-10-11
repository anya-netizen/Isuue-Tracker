
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, FileText, Clock, TestTube, List, Eye, Search, Filter, Calendar, User, Building, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

// Demo data generator for showcasing the belt system
const generateDemoOrders = (pgPatients) => {
  if (!pgPatients || pgPatients.length === 0) return [];
  
  const demoOrders = [];
  const orderTypes = ['Initial Assessment', 'Plan of Care Update', 'Discharge Planning', 'Medication Review', 'Progress Notes', 'Therapy Orders', 'Lab Orders'];
  
  // Create 1-3 orders per patient based on their billability status
  pgPatients.forEach((patient, i) => {
    const numOrders = patient.billability_status === 'billable' ? 
      Math.floor(Math.random() * 2) + 1 : // 1-2 orders for billable patients
      Math.floor(Math.random() * 3) + 1;   // 1-3 orders for non-billable patients
    
    for (let j = 0; j < numOrders; j++) {
      // Map billability status to processing status
      let processingStatus;
      switch (patient.billability_status) {
        case 'billable':
          processingStatus = 'validated';
          break;
        case 'pending_review':
        case 'pending':
          processingStatus = 'processing';
          break;
        case 'unbillable':
          processingStatus = Math.random() > 0.5 ? 'processing' : 'rejected';
          break;
        default:
          processingStatus = 'processing';
      }
      
      demoOrders.push({
        id: `demo-${patient.patient_id}-${j}-${Math.random().toString(36).substr(2, 6)}`,
        title: `${orderTypes[(i + j) % orderTypes.length]} - ${patient.name}`,
        patient_id: patient.patient_id,
        patient_name: patient.name,
        document_type: 'orders',
        processing_status: processingStatus,
        billability_status: patient.billability_status,
        priority: ['high', 'medium', 'low'][(i + j) % 3],
        physician: patient.certification_provider || `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][i % 5]}`,
        estimated_value: Math.floor(Math.random() * 1500) + 500,
        cpo_minutes: Math.floor(Math.random() * 30) + 15,
        date_received: patient.admission_date || new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        due_date: new Date(Date.now() + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
        insurance: patient.insurance_company,
        diagnosis: patient.primaryDiagnosis,
        isDemo: true
      });
    }
  });
  
  return demoOrders;
};

export default function ConveyorBeltSystem({ selectedPG, documents, patients, onOrderAction }) {
  const [isRunning, setIsRunning] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [beltSpeed, setBeltSpeed] = useState(1);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [viewMode, setViewMode] = useState('belt'); // 'belt' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const beltData = useMemo(() => {
    if (!selectedPG || !patients.length) return { autoVerified: [], notVerified: [], allOrders: [] };

    const pgPatients = patients.filter(p => p.current_pg === selectedPG.name);
    const pgPatientIds = pgPatients.map(p => p.patient_id);
    
    let relevantOrders = documents.filter(d => 
      d.document_type === 'orders' && 
      pgPatientIds.includes(d.patient_id)
    );

    // If no real orders exist, generate demo data
    if (relevantOrders.length === 0) {
      relevantOrders = generateDemoOrders(pgPatients);
      setIsDemoMode(true);
    } else {
      setIsDemoMode(false);
    }

    const autoVerified = relevantOrders.filter(d => d.processing_status === 'validated');
    const notVerified = relevantOrders.filter(d => d.processing_status === 'processing');

    return { 
      autoVerified, 
      notVerified, 
      allOrders: relevantOrders
    };
  }, [selectedPG, documents, patients]);

  // Filter orders for list view
  const filteredOrders = useMemo(() => {
    let filtered = beltData.allOrders;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.title.toLowerCase().includes(term) ||
        order.patient_name?.toLowerCase().includes(term) ||
        order.physician?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.processing_status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter);
    }

    return filtered.sort((a, b) => {
      // Sort by priority (high -> medium -> low) then by date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.date_received) - new Date(b.date_received);
    });
  }, [beltData.allOrders, searchTerm, statusFilter, priorityFilter]);

  const OrderCard = ({ order, type, index }) => {
    const patient = patients.find(p => p.patient_id === order.patient_id);
    const isVerified = type === 'verified';

    return (
      <motion.div
        className={`min-w-48 h-32 rounded-xl shadow-lg p-4 cursor-pointer ${
          isVerified ? 'bg-green-50 border-2 border-green-200' : 'bg-orange-50 border-2 border-orange-200'
        }`}
        onClick={() => setSelectedOrder({ order, patient, type })}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        animate={isRunning ? { x: [-400, window.innerWidth] } : {}}
        transition={isRunning ? { 
          duration: 20 / beltSpeed, 
          repeat: Infinity, 
          ease: "linear",
          delay: index * 2 
        } : {}}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`p-1 rounded-full ${isVerified ? 'bg-green-200' : 'bg-orange-200'}`}>
            {isVerified ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            )}
          </div>
          <div className="flex items-center gap-1">
            {order.isDemo && <TestTube className="w-3 h-3 text-purple-500" />}
            <Badge className={`text-xs ${
              isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {isVerified ? 'Auto-Verified' : 'Needs Review'}
            </Badge>
          </div>
        </div>
        
        <div>
          <p className="font-semibold text-sm truncate">{patient?.name || order.patient_name || 'Unknown'}</p>
          <p className="text-xs text-gray-600 truncate">{order.title}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {order.patient_id}</p>
        </div>
      </motion.div>
    );
  };

  const OrderListItem = ({ order, patient }) => {
    const getPriorityColor = () => {
      switch (order.priority) {
        case 'high': return 'bg-red-100 text-red-700 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    const getStatusColor = () => {
      switch (order.processing_status) {
        case 'validated': return 'bg-green-100 text-green-700';
        case 'processing': return 'bg-orange-100 text-orange-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedOrder({ order, patient, type: order.processing_status === 'validated' ? 'verified' : 'not-verified' })}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{order.title}</h3>
              {order.isDemo && (
                <Badge className="bg-purple-100 text-purple-700 text-xs">
                  <TestTube className="w-3 h-3 mr-1" />
                  Demo
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{patient?.name || order.patient_name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                <span>{order.physician}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(order.date_received), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{order.cpo_minutes} CPO min</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Badge className={getPriorityColor()}>
                {order.priority} priority
              </Badge>
              <Badge className={getStatusColor()}>
                {order.processing_status === 'validated' ? 'Verified' : 'Processing'}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-green-600">
                Est. ${order.estimated_value?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                Due: {format(new Date(order.due_date || Date.now()), 'MMM d')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Patient ID: {order.patient_id}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={(e) => {
              e.stopPropagation();
              if (onOrderAction) onOrderAction(order, 'view');
            }}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {order.processing_status !== 'validated' && (
              <Button size="sm" onClick={(e) => {
                e.stopPropagation();
                if (onOrderAction) onOrderAction(order, 'approve');
              }}>
                <CheckCircle className="w-3 h-3 mr-1" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Control Panel with View Toggle */}
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50/30">
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              Order Processing System
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="belt" className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Belt View
                  </TabsTrigger>
                  <TabsTrigger value="list" className="flex items-center gap-2">
                    <List className="w-4 h-4" />
                    List View
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {viewMode === 'belt' && (
                <>
                  <Button
                    variant={isRunning ? "destructive" : "default"}
                    size="sm"
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  <select 
                    value={beltSpeed} 
                    onChange={(e) => setBeltSpeed(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-md border text-sm bg-white shadow-sm"
                  >
                    <option value={0.5}>0.5x Speed</option>
                    <option value={1}>1x Speed</option>
                    <option value={2}>2x Speed</option>
                    <option value={3}>3x Speed</option>
                  </select>
                </>
              )}
            </div>
          </CardTitle>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 pt-2">
            {isDemoMode && (
              <div className="flex items-center gap-2 font-semibold text-purple-600">
                <TestTube className="w-4 h-4" />
                <span>Displaying Demo Data</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Auto-Verified: {beltData.autoVerified.length} orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <span>Needs Review: {beltData.notVerified.length} orders</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span>Total Orders: {beltData.allOrders.length}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Conditional Rendering Based on View Mode */}
      {viewMode === 'belt' ? (
        <>
          {/* Auto-Verified Belt */}
          <Card className="shadow-lg border-2 border-green-200 bg-green-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <CheckCircle className="w-5 h-5" />
                Auto-Verified Orders Belt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 bg-gradient-to-r from-green-100 to-green-200 rounded-xl border-2 border-dashed border-green-300 overflow-hidden">
                {/* Belt Track Lines */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-green-400"></div>
                <div className="absolute bottom-4 left-0 w-full h-0.5 bg-green-400"></div>
                
                {/* Moving Track Pattern */}
                {isRunning && (
                  <div className="absolute inset-0 opacity-30">
                    <motion.div
                      className="h-full w-full bg-repeat-x"
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, #22c55e 20px, #22c55e 22px)',
                      }}
                      animate={{ x: [0, -44] }}
                      transition={{ duration: 2 / beltSpeed, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}

                {/* Orders on Belt */}
                <div className="absolute inset-0 flex items-center">
                  <AnimatePresence>
                    {beltData.autoVerified.map((order, index) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        type="verified"
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {beltData.autoVerified.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-green-700 font-medium">No auto-verified orders in queue</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Not-Verified Belt */}
          <Card className="shadow-lg border-2 border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <AlertTriangle className="w-5 h-5" />
                Manual Review Required Belt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-40 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl border-2 border-dashed border-orange-300 overflow-hidden">
                {/* Belt Track Lines */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-orange-400"></div>
                <div className="absolute bottom-4 left-0 w-full h-0.5 bg-orange-400"></div>
                
                {/* Moving Track Pattern */}
                {isRunning && (
                  <div className="absolute inset-0 opacity-30">
                    <motion.div
                      className="h-full w-full bg-repeat-x"
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, #f97316 20px, #f97316 22px)',
                      }}
                      animate={{ x: [0, -44] }}
                      transition={{ duration: 2 / beltSpeed, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                )}

                {/* Orders on Belt */}
                <div className="absolute inset-0 flex items-center">
                  <AnimatePresence>
                    {beltData.notVerified.map((order, index) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        type="not-verified"
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {beltData.notVerified.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-orange-700 font-medium">No orders pending review</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* List View */
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5 text-blue-600" />
                All Orders List ({filteredOrders.length})
              </CardTitle>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="validated">Verified</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredOrders.map((order) => {
                  const patient = patients.find(p => p.patient_id === order.patient_id);
                  return (
                    <OrderListItem
                      key={order.id}
                      order={order}
                      patient={patient}
                    />
                  );
                })}
              </AnimatePresence>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                  <p>No orders match your current filters. Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-600" />
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Title:</span> {selectedOrder.order.title}</p>
                    <p><span className="font-medium">Type:</span> {selectedOrder.order.document_type}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge className={`ml-2 ${
                        selectedOrder.type === 'verified' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {selectedOrder.type === 'verified' ? 'Auto-Verified' : 'Needs Review'}
                      </Badge>
                    </p>
                    <p><span className="font-medium">Priority:</span> 
                      <Badge className={`ml-2 ${
                        selectedOrder.order.priority === 'high' ? 'bg-red-100 text-red-700' :
                        selectedOrder.order.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {selectedOrder.order.priority} priority
                      </Badge>
                    </p>
                    <p><span className="font-medium">Physician:</span> {selectedOrder.order.physician}</p>
                    <p><span className="font-medium">Received:</span> {format(new Date(selectedOrder.order.date_received), 'PPP h:mm a')}</p>
                    {selectedOrder.order.due_date && (
                      <p><span className="font-medium">Due:</span> {format(new Date(selectedOrder.order.due_date), 'PPP')}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedOrder.patient?.name || selectedOrder.order.patient_name}</p>
                    <p><span className="font-medium">ID:</span> {selectedOrder.order.patient_id}</p>
                    <p><span className="font-medium">PG:</span> {selectedOrder.patient?.current_pg || selectedPG?.name}</p>
                    <p><span className="font-medium">HHA:</span> {selectedOrder.patient?.assigned_hha || 'Not Assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-900 mb-2">Financial Impact</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <p><span className="font-medium">Estimated Value:</span> ${selectedOrder.order.estimated_value?.toLocaleString() || 'N/A'}</p>
                        <p><span className="font-medium">CPO Minutes:</span> {selectedOrder.order.cpo_minutes || 15} min</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Status:</span> 
                          {selectedOrder.type === 'verified' 
                            ? ' ✅ Ready for Billing' 
                            : ' ⏳ Pending Verification'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                {selectedOrder.type === 'not-verified' && (
                  <>
                    <Button variant="destructive" onClick={() => {
                      if (onOrderAction) onOrderAction(selectedOrder.order, 'reject');
                      setSelectedOrder(null);
                    }}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Order
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
                      if (onOrderAction) onOrderAction(selectedOrder.order, 'approve');
                      setSelectedOrder(null);
                    }}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify & Approve
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
