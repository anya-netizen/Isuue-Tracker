import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UploadFile } from '@/api/integrations';
import { processDocumentWithAI } from '@/api/functions';
import { Document, Patient, PhysicianGroup, HomeHealthAgency } from '@/api/entities';
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadForm({ onUploadSuccess }) {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, processing, success, error
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [title, setTitle] = useState('');
  const [physician, setPhysician] = useState('');
  const [episodeDate, setEpisodeDate] = useState('');
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !patientId || !documentType) {
      setError('Please fill in all required fields');
      return;
    }

    setUploadState('uploading');
    setError('');
    setProcessingStep('Uploading file...');

    try {
      // Step 1: Upload file
      const { file_url } = await UploadFile({ file });
      
      setUploadState('processing');
      setProcessingStep('Processing with AI...');

      // Step 2: Process with AI
      const mimeType = file.type || 'application/pdf';
      const jsonSchema = {
        type: "object",
        properties: {
          patient_id: { type: "string" },
          physician: { type: "string" },
          episode_date: { type: "string", format: "date" },
          extracted_text: { type: "string" },
          diagnosis: { type: "string" },
          medications: { type: "array", items: { type: "string" } },
          care_plan: { type: "string" }
        }
      };

      const aiResult = await processDocumentWithAI({
        file_url,
        json_schema: jsonSchema,
        mime_type: mimeType
      });

      if (aiResult.status === 'error') {
        throw new Error(aiResult.details);
      }

      setProcessingStep('Saving document...');

      // Step 3: Save document
      const documentData = {
        patient_id: patientId,
        document_type: documentType,
        title: title,
        file_url: file_url,
        processing_status: 'extracted',
        extracted_data: aiResult.output,
        physician: physician || aiResult.output.physician || '',
        episode_date: episodeDate || aiResult.output.episode_date || new Date().toISOString().split('T')[0],
        date_received: new Date().toISOString()
      };

      const newDoc = await Document.create(documentData);

      setProcessingStep('Updating patient record...');

      // Step 4: Update patient if needed
      const existingPatients = await Patient.filter({ patient_id: patientId });
      if (existingPatients.length === 0) {
        // Fetch PGs and HHAs to simulate a real assignment for the animation
        const [pgs, hhas] = await Promise.all([
          PhysicianGroup.list(),
          HomeHealthAgency.list()
        ]);
        
        const randomPg = pgs.length > 0 ? pgs[Math.floor(Math.random() * pgs.length)] : { name: 'Default PG' };
        const randomHha = hhas.length > 0 ? hhas[Math.floor(Math.random() * hhas.length)] : { name: 'Default HHA' };

        // Create new patient record with a simulated assignment
        await Patient.create({
          patient_id: patientId,
          name: `Patient ${patientId}`,
          date_of_birth: '1970-01-01', // Default, should be extracted from document
          validation_status: 'pending',
          billability_status: 'pending_review',
          admission_date: episodeDate || new Date().toISOString().split('T')[0],
          current_pg: randomPg.name,
          assigned_hha: randomHha.name
        });
      }

      setUploadState('success');
      setProcessingStep('Complete! Document processed successfully.');
      
      // Trigger success callback with the new document object
      if (onUploadSuccess) {
        onUploadSuccess(newDoc);
      }

      // Clear form after a delay
      setTimeout(() => {
        setFile(null);
        setPatientId('');
        setDocumentType('');
        setTitle('');
        setPhysician('');
        setEpisodeDate('');
        setUploadState('idle');
        setProcessingStep('');
      }, 2000);

    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload and process document');
      setUploadState('error');
      setProcessingStep('');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <Label htmlFor="file">Select Document *</Label>
          <div className="mt-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <p className="mb-2 text-sm text-slate-500">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-slate-500">PDF, PNG, JPG up to 10MB</p>
              </div>
              <input
                id="file"
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={uploadState === 'uploading' || uploadState === 'processing'}
              />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="patientId">Patient ID *</Label>
            <Input
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. PAT001"
              disabled={uploadState === 'uploading' || uploadState === 'processing'}
            />
          </div>
          
          <div>
            <Label htmlFor="documentType">Document Type *</Label>
            <Select value={documentType} onValueChange={setDocumentType} disabled={uploadState === 'uploading' || uploadState === 'processing'}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="discharge">Discharge Summary</SelectItem>
                <SelectItem value="soc">Start of Care (SOC)</SelectItem>
                <SelectItem value="485">485 Plan of Care</SelectItem>
                <SelectItem value="f2f">Face-to-Face</SelectItem>
                <SelectItem value="discharge_summary">Discharge Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Auto-filled from filename"
            disabled={uploadState === 'uploading' || uploadState === 'processing'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="physician">Physician (Optional)</Label>
            <Input
              id="physician"
              value={physician}
              onChange={(e) => setPhysician(e.target.value)}
              placeholder="Will be extracted by AI"
              disabled={uploadState === 'uploading' || uploadState === 'processing'}
            />
          </div>
          
          <div>
            <Label htmlFor="episodeDate">Episode Date (Optional)</Label>
            <Input
              id="episodeDate"
              type="date"
              value={episodeDate}
              onChange={(e) => setEpisodeDate(e.target.value)}
              disabled={uploadState === 'uploading' || uploadState === 'processing'}
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={uploadState === 'uploading' || uploadState === 'processing'}
        >
          {uploadState === 'uploading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {uploadState === 'processing' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {uploadState === 'success' && <CheckCircle className="w-4 h-4 mr-2" />}
          {uploadState === 'idle' && <FileText className="w-4 h-4 mr-2" />}
          
          {uploadState === 'idle' && 'Upload & Process Document'}
          {uploadState === 'uploading' && 'Uploading...'}
          {uploadState === 'processing' && 'Processing with AI...'}
          {uploadState === 'success' && 'Success!'}
          {uploadState === 'error' && 'Try Again'}
        </Button>
      </form>

      {/* Processing Status */}
      <AnimatePresence>
        {(uploadState === 'uploading' || uploadState === 'processing') && processingStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <p className="font-medium text-blue-900">Processing Document</p>
                    <p className="text-sm text-blue-700">{processingStep}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}