import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Zap, CheckCircle, DollarSign, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CPOCapturePanel({ patient, onCapture, onCancel }) {
  const [capturing, setCapturing] = useState(false);

  const handleCapture = async () => {
    setCapturing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onCapture();
    setCapturing(false);
  };

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
        <p className="text-gray-600">Patient ID: {patient.patient_id}</p>
      </div>

      {/* CPO Details */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-orange-600 mb-2">15</div>
          <p className="text-orange-800 font-medium">Minutes Pending Capture</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Total CPO Required:</span>
            <span className="font-semibold">30 minutes</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Already Captured:</span>
            <span className="font-semibold text-green-600">15 minutes</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-semibold text-orange-600">15 minutes</span>
          </div>
          
          <Progress value={50} className="h-2 mt-4" />
        </div>
      </div>

      {/* What will happen */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          What happens when you capture CPO:
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Remaining 15 CPO minutes will be automatically captured
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Patient will be marked as billable
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Patient will move to the billable patients list
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Care coordination notes will be generated
          </li>
        </ul>
      </div>

      {/* Estimated Value */}
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">Estimated Billing Value</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${Math.floor(Math.random() * 1000) + 500}
          </div>
        </div>
        <p className="text-sm text-green-700 mt-2">
          Based on current CPO minutes and applicable billing codes
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleCapture}
          disabled={capturing}
          className="flex-1 bg-orange-600 hover:bg-orange-700"
        >
          {capturing ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Capturing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Capture CPO Minutes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}