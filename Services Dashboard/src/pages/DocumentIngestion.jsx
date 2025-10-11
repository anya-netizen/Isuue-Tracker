import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadForm from '../components/ingestion/UploadForm';
import ProcessingPipeline from '../components/dashboard/ProcessingPipeline';

export default function DocumentIngestionPage() {
  const [lastUploadedDoc, setLastUploadedDoc] = useState(null);

  const handleUploadSuccess = (doc) => {
    setLastUploadedDoc(doc);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-white min-h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <UploadCloud className="w-10 h-10 text-blue-500" />
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Document Ingestion Center</h1>
              <p className="text-slate-600 mt-1">
                Securely upload patient documents for AI-powered processing and validation.
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Instructions & Upload */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-slate-200 bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-slate-500" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3 text-sm text-slate-700">
                  <li>Select or drag-and-drop a patient document into the upload area.</li>
                  <li>Fill in the required <span className="font-semibold text-blue-600">Patient ID</span> and <span className="font-semibold text-blue-600">Document Type</span>.</li>
                  <li>Click <span className="font-semibold text-blue-600">"Upload & Process"</span> to submit.</li>
                  <li>Our AI extracts key data and cross-validates it with EHR records.</li>
                  <li>Watch your document move through the <span className="font-semibold text-blue-600">Live Data Refinery</span> in real-time.</li>
                </ol>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-blue-600" />
                  Upload New Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadForm onUploadSuccess={handleUploadSuccess} />
              </CardContent>
            </Card>
            
            <AnimatePresence>
              {lastUploadedDoc && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <div>
                        <p className="font-semibold">Upload Successful!</p>
                        <p>Document "{lastUploadedDoc.title}" is now entering the refinery.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Live Pipeline */}
          <div className="lg:col-span-3">
            <ProcessingPipeline />
          </div>
        </div>
      </div>
    </div>
  );
}