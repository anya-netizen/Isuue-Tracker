import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Cpu, ScanLine, CheckCircle, AlertTriangle, Eye, Database, ShieldCheck, Zap, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const stations = [
  { id: 'intake', name: 'Intake', icon: FileText, position: { top: '50%', left: '5%' } },
  { id: 'ocr', name: 'OCR & Scan', icon: ScanLine, position: { top: '20%', left: '30%' } },
  { id: 'extraction', name: 'AI Extraction', icon: Cpu, position: { top: '80%', left: '30%' } },
  { id: 'validation', name: 'EHR Validation', icon: Database, position: { top: '50%', left: '60%' } },
  { id: 'validated', name: 'Validated', icon: ShieldCheck, position: { top: '20%', left: '90%' }, clickable: true },
  { id: 'flagged', name: 'Flagged', icon: AlertTriangle, position: { top: '80%', left: '90%' }, clickable: true },
];

const documentTemplates = [
    { 
        type: 'Referral', 
        issues: [
            'Missing physician signature',
            'Invalid insurance authorization', 
            'Incomplete patient demographics',
            'Referral date has expired'
        ]
    },
    { 
        type: 'SOC', 
        issues: [
            'Incomplete medication list', 
            'No emergency contact provided',
            'Missing required assessments',
            'Care plan not specified'
        ]
    },
    { 
        type: '485 Plan', 
        issues: [
            'Treatment frequency not specified', 
            'Goals and outcomes missing',
            'Discipline requirements unclear',
            'Duration not documented'
        ]
    },
    { 
        type: 'Orders', 
        issues: [
            'Orders not signed by physician',
            'Medication dosages unclear',
            'Treatment modalities missing',
            'Invalid prescription format'
        ]
    },
];

const ProcessingPipeline = () => {
    const [docs, setDocs] = useState([]);
    const [validatedDocs, setValidatedDocs] = useState([]);
    const [flaggedDocs, setFlaggedDocs] = useState([]);
    const [docId, setDocId] = useState(0);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showValidated, setShowValidated] = useState(false);
    const [showFlagged, setShowFlagged] = useState(false);

    const createDoc = useCallback(() => {
        const template = documentTemplates[docId % documentTemplates.length];
        const isValid = Math.random() > 0.25; // 75% success rate
        return {
            id: `DOC-${String(docId).padStart(4, '0')}`,
            type: template.type,
            status: 'intake',
            isValid,
            flaggedReason: isValid ? null : template.issues[Math.floor(Math.random() * template.issues.length)],
            patientId: `P${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
            patientName: `Patient ${Math.floor(Math.random() * 999) + 1}`,
            processedAt: new Date(),
            processingTime: Math.floor(Math.random() * 5) + 2, // 2-7 seconds
        };
    }, [docId]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDocId(id => id + 1);
            setDocs(currentDocs => [...currentDocs, createDoc()]);
        }, 4000); // Add a new doc every 4 seconds
        return () => clearInterval(interval);
    }, [createDoc]);

    useEffect(() => {
        const processInterval = setInterval(() => {
            setDocs(currentDocs =>
                currentDocs.map(doc => {
                    if (doc.status === 'intake') return { ...doc, status: 'ocr' };
                    if (doc.status === 'ocr') return { ...doc, status: 'extraction' };
                    if (doc.status === 'extraction') return { ...doc, status: 'validation' };
                    if (doc.status === 'validation') {
                        // Move completed documents to their respective lists
                        const completedDoc = { ...doc, status: doc.isValid ? 'validated' : 'flagged' };
                        
                        setTimeout(() => {
                            if (doc.isValid) {
                                setValidatedDocs(prev => [completedDoc, ...prev]);
                            } else {
                                setFlaggedDocs(prev => [completedDoc, ...prev]);
                            }
                        }, 100);
                        
                        return completedDoc;
                    }
                    return doc;
                }).filter(doc => doc.status !== 'validated' && doc.status !== 'flagged') // Remove finished docs from pipeline
            );
        }, 2500); // Move docs to next stage every 2.5 seconds
        return () => clearInterval(processInterval);
    }, []);

    const handleStationClick = (stationId) => {
        if (stationId === 'validated') {
            setShowValidated(true);
        } else if (stationId === 'flagged') {
            setShowFlagged(true);
        }
    };

    const ValidatedDocumentsList = () => (
        <Dialog open={showValidated} onOpenChange={setShowValidated}>
            <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        Validated Documents ({validatedDocs.length})
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Documents that passed all validation checks and are ready for processing
                    </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-96 overflow-y-auto space-y-3 mt-4">
                    {validatedDocs.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No validated documents yet. Processing will begin shortly...</p>
                    ) : (
                        validatedDocs.map(doc => (
                            <div key={doc.id} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-green-400">{doc.id} - {doc.type}</h4>
                                        <div className="text-sm text-slate-300 mt-1">
                                            <p><User className="w-4 h-4 inline mr-1" />Patient: {doc.patientName} ({doc.patientId})</p>
                                            <p><Clock className="w-4 h-4 inline mr-1" />Processed: {format(doc.processedAt, 'MMM d, h:mm a')}</p>
                                            <p className="text-green-400">✓ All validation checks passed</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                        {doc.processingTime}s
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );

    const FlaggedDocumentsList = () => (
        <Dialog open={showFlagged} onOpenChange={setShowFlagged}>
            <DialogContent className="max-w-2xl bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                        Flagged Documents ({flaggedDocs.length})
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Documents that require manual review due to validation issues
                    </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-96 overflow-y-auto space-y-3 mt-4">
                    {flaggedDocs.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No flagged documents yet. Great job - your documents are clean!</p>
                    ) : (
                        flaggedDocs.map(doc => (
                            <div key={doc.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-red-400">{doc.id} - {doc.type}</h4>
                                        <div className="text-sm text-slate-300 mt-1">
                                            <p><User className="w-4 h-4 inline mr-1" />Patient: {doc.patientName} ({doc.patientId})</p>
                                            <p><Clock className="w-4 h-4 inline mr-1" />Processed: {format(doc.processedAt, 'MMM d, h:mm a')}</p>
                                        </div>
                                        <div className="mt-3 bg-red-500/20 rounded-md p-3">
                                            <p className="text-red-300 font-medium">⚠️ Flagged Reason:</p>
                                            <p className="text-white mt-1">{doc.flaggedReason}</p>
                                            <Button 
                                                size="sm" 
                                                className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                                                onClick={() => {
                                                    // Here you could navigate to validation queue or trigger manual review
                                                    console.log('Review document:', doc.id);
                                                }}
                                            >
                                                Review Document
                                            </Button>
                                        </div>
                                    </div>
                                    <Badge variant="destructive" className="text-xs">
                                        {doc.processingTime}s
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 text-white relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Zap className="w-8 h-8 text-blue-400" />
                        Live Data Refinery
                    </h2>
                    <p className="text-slate-400 mt-1">Real-time document processing and AI validation stream</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-green-400 font-bold text-xl">{validatedDocs.length}</div>
                        <div className="text-slate-400">Validated</div>
                    </div>
                    <div className="text-center">
                        <div className="text-red-400 font-bold text-xl">{flaggedDocs.length}</div>
                        <div className="text-slate-400">Flagged</div>
                    </div>
                    <div className="text-center">
                        <div className="text-blue-400 font-bold text-xl">{docs.length}</div>
                        <div className="text-slate-400">Processing</div>
                    </div>
                </div>
            </div>
            
            <div className="h-80 relative">
                {/* Paths */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Main paths */}
                    <path d="M 8 50 C 15 50, 20 20, 30 20" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                    <path d="M 8 50 C 15 50, 20 80, 30 80" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                    <path d="M 30 20 C 40 20, 45 50, 60 50" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                    <path d="M 30 80 C 40 80, 45 50, 60 50" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                    {/* Sorting paths */}
                    <path d="M 60 50 C 70 50, 80 20, 90 20" stroke="#22c55e" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                    <path d="M 60 50 C 70 50, 80 80, 90 80" stroke="#ef4444" strokeWidth="0.5" fill="none" strokeDasharray="1" />
                </svg>

                {/* Stations */}
                {stations.map(station => (
                    <div
                        key={station.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 group"
                        style={station.position}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`w-16 h-16 rounded-full flex items-center justify-center border-2 relative ${
                                station.id === 'validated' ? 'border-green-500 bg-green-500/10 cursor-pointer' :
                                station.id === 'flagged' ? 'border-red-500 bg-red-500/10 cursor-pointer' :
                                'border-blue-500 bg-blue-500/10'
                            }`}
                            onClick={() => station.clickable && handleStationClick(station.id)}
                        >
                            <station.icon className={`w-7 h-7 ${
                                station.id === 'validated' ? 'text-green-400' :
                                station.id === 'flagged' ? 'text-red-400' :
                                'text-blue-400'
                            }`} />
                            
                            {/* Count badges */}
                            {station.id === 'validated' && validatedDocs.length > 0 && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    {validatedDocs.length}
                                </div>
                            )}
                            {station.id === 'flagged' && flaggedDocs.length > 0 && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                    {flaggedDocs.length}
                                </div>
                            )}
                        </motion.div>
                        <span className="text-xs font-semibold text-slate-300">{station.name}</span>
                        {station.clickable && (
                            <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to view
                            </span>
                        )}
                    </div>
                ))}

                {/* Animated Docs */}
                <AnimatePresence>
                    {docs.map(doc => {
                        const from = stations.find(s => s.id === doc.status);
                        const to = stations.find(s => s.id === (
                            doc.status === 'intake' ? 'ocr' :
                            doc.status === 'ocr' ? 'extraction' :
                            doc.status === 'extraction' ? 'validation' :
                            doc.status === 'validation' ? (doc.isValid ? 'validated' : 'flagged') : 'intake'
                        ));
                        if (!from || !to) return null;
                        
                        return (
                            <motion.div
                                key={doc.id}
                                className={`absolute w-5 h-5 rounded-full cursor-pointer ${
                                    doc.isValid ? 'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]'
                                }`}
                                initial={{ top: from.position.top, left: from.position.left, scale: 0 }}
                                animate={{ top: to.position.top, left: to.position.left, scale: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 2, ease: 'linear' }}
                                onClick={() => setSelectedDoc(doc)}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Document Detail Modal */}
            <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
                <DialogContent className="bg-slate-800 text-white border-slate-700">
                    <DialogHeader>
                        <DialogTitle>Document {selectedDoc?.id}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Type: {selectedDoc?.type} • Status: <span className="capitalize">{selectedDoc?.status}</span>
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDoc?.flaggedReason ? (
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg mt-4">
                            <h4 className="font-semibold flex items-center gap-2"><AlertTriangle className="text-red-400" />Will Be Flagged</h4>
                            <p className="mt-2 text-slate-300">Reason: <span className="font-medium text-white">{selectedDoc.flaggedReason}</span></p>
                        </div>
                    ) : (
                         <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg mt-4">
                            <h4 className="font-semibold flex items-center gap-2"><CheckCircle className="text-green-400" />Validation Passed</h4>
                            <p className="mt-2 text-slate-300">Document is proceeding to validated storage.</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Document Lists Modals */}
            <ValidatedDocumentsList />
            <FlaggedDocumentsList />
        </div>
    );
};

export default ProcessingPipeline;