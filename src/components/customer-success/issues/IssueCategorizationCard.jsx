import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Settings, Eye, FileText } from 'lucide-react';
import { channelTypes } from '@/constants/issueConstants';

export const IssueCategorizationCard = ({ 
  issue, 
  index, 
  issueCategorizationData, 
  editingIssueId, 
  setEditingIssueId, 
  handleSaveCategorization, 
  issueTypeOptions, 
  currentUser 
}) => {
  const savedData = issueCategorizationData[issue.id];
  const isEditing = editingIssueId === issue.id;
  
  const [localType, setLocalType] = useState(savedData?.type || '');
  const [localReason, setLocalReason] = useState(savedData?.reason || '');
  const [localPriority, setLocalPriority] = useState(savedData?.manualPriority || '');
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (savedData && !isEditing) {
      setLocalType(savedData.type);
      setLocalReason(savedData.reason);
      setLocalPriority(savedData.manualPriority);
    }
  }, [savedData, isEditing]);

  const channelInfo = channelTypes[issue.channel] || channelTypes.email;

  return (
    <motion.div
      key={issue.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`border-2 ${
        savedData ? 'border-green-300 bg-green-50/30' : 'border-orange-300 bg-orange-50/30'
      } hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6">
          {/* Issue Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{issue.title}</h3>
                <Badge className={channelInfo.color}>
                  {channelInfo.emoji} {channelInfo.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Created: {new Date(issue.createdDate).toLocaleString()}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="ml-2"
            >
              <Eye className="w-4 h-4 mr-1" />
              {showFullDescription ? 'Hide' : 'View'}
            </Button>
          </div>

          {/* Full Description (Expandable) */}
          {showFullDescription && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Issue Description
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {issue.fullContent?.detailedDescription || issue.description}
                </p>

                {/* Attachments */}
                {issue.fullContent?.attachments && issue.fullContent.attachments.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-semibold text-gray-700 text-sm mb-2">Attachments:</h5>
                    <div className="space-y-2">
                      {issue.fullContent.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{attachment}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => alert(`View: ${attachment}`)}
                            className="ml-auto"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Categorization Form or Display */}
          {isEditing || !savedData ? (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Categorization & Prioritization
              </h4>
              
              {/* Issue Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={localType}
                  onChange={(e) => setLocalType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Issue Type...</option>
                  {issueTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason/Justification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Categorization <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={localReason}
                  onChange={(e) => setLocalReason(e.target.value)}
                  placeholder="Explain why you're categorizing this issue this way..."
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters ({localReason.length}/20)
                </p>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['high', 'medium', 'low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setLocalPriority(priority)}
                      className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                        localPriority === priority
                          ? priority === 'high'
                            ? 'border-red-500 bg-red-100 text-red-800'
                            : priority === 'medium'
                            ? 'border-yellow-500 bg-yellow-100 text-yellow-800'
                            : 'border-green-500 bg-green-100 text-green-800'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    if (localType && localReason.length >= 20 && localPriority) {
                      handleSaveCategorization(issue.id, {
                        type: localType,
                        reason: localReason,
                        manualPriority: localPriority,
                        categorizedBy: currentUser,
                        categorizedAt: new Date().toLocaleString()
                      });
                    }
                  }}
                  disabled={!localType || localReason.length < 20 || !localPriority}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Categorization
                </Button>
                {savedData && (
                  <Button
                    variant="outline"
                    onClick={() => setEditingIssueId(null)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Categorization Complete
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIssueId(issue.id)}
                  className="text-green-700 border-green-300 hover:bg-green-100"
                >
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-green-700 font-medium block mb-1">Type:</span>
                  <Badge className="bg-green-600 text-white">
                    {issueTypeOptions.find(opt => opt.value === savedData.type)?.label}
                  </Badge>
                </div>
                <div>
                  <span className="text-green-700 font-medium block mb-1">Priority:</span>
                  <Badge className={
                    savedData.manualPriority === 'high' ? 'bg-red-100 text-red-800' :
                    savedData.manualPriority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {savedData.manualPriority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <span className="text-green-700 font-medium block mb-1">By:</span>
                  <span className="text-green-800">{savedData.categorizedBy}</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-green-700 font-medium block mb-1">Reason:</span>
                <p className="text-green-800 text-sm">{savedData.reason}</p>
              </div>
              <div className="mt-2 text-xs text-green-600">
                Categorized on: {savedData.categorizedAt}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

