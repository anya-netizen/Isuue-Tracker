import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emailTemplates, detailedIssues } from '@/data/detailedCommunications';
import { channelTypes } from '@/constants/issueConstants';
import { 
  Trophy, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Users,
  DollarSign,
  Activity,
  Eye,
  Download,
  Upload,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Settings,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Bug,
  Zap,
  Shield,
  HelpCircle,
  GitBranch,
  Layout,
  Cpu,
  Database,
  Server,
  Network,
  Code,
  ChevronDown,
  ChevronRight,
  X,
  Plus,
  Edit,
  Trash2,
  User,
  Heart,
  ThumbsDown,
  Briefcase,
  TrendingDown,
  AlertCircle,
  FileX,
  UserPlus,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';

// Issue Categorization Card Component
function IssueCategorizationCard({ issue, index, issueCategorizationData, editingIssueId, setEditingIssueId, handleSaveCategorization, issueTypeOptions, currentUser }) {
  const savedData = issueCategorizationData[issue.id];
  const isEditing = editingIssueId === issue.id;
  
  const [localType, setLocalType] = React.useState(savedData?.type || '');
  const [localReason, setLocalReason] = React.useState(savedData?.reason || '');
  const [localPriority, setLocalPriority] = React.useState(savedData?.manualPriority || '');
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  React.useEffect(() => {
    if (savedData && !isEditing) {
      setLocalType(savedData.type);
      setLocalReason(savedData.reason);
      setLocalPriority(savedData.manualPriority);
    }
  }, [savedData, isEditing]);

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
                <Badge className="bg-gray-100 text-gray-800 text-xs">
                  {issue.id.replace(/^\D+/, '')}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="flex items-center gap-1 h-6 px-2 text-xs hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                  title="View full description"
                >
                  <Eye className="w-3 h-3" />
                  View
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created: {new Date(issue.createdDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  Assigned: {issue.assignedTo}
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Status: {issue.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex flex-col items-end gap-2">
              {savedData ? (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Categorized
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                  <Clock className="w-3 h-3 mr-1" />
                  Pending Review
                </Badge>
              )}
            </div>
          </div>

          {/* Issue Description Expandable Section */}
          {showFullDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-indigo-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-indigo-900 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Issue Description
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullDescription(false)}
                  className="h-6 w-6 p-0 hover:bg-indigo-100"
                >
                  <XCircle className="w-4 h-4 text-indigo-600" />
                </Button>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                <div className="bg-white p-4 rounded-lg border border-indigo-200">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {issue.fullContent?.detailedDescription || issue.description}
                  </p>
                </div>
                
                {/* Attachments Section */}
                {issue.fullContent?.attachments && issue.fullContent.attachments.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-indigo-200">
                    <h5 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Attachments ({issue.fullContent.attachments.length})
                    </h5>
                    <div className="space-y-2">
                      {issue.fullContent.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{attachment}</p>
                            <p className="text-xs text-gray-500">Document</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0 h-8 px-3 text-xs hover:bg-indigo-50 hover:text-indigo-700"
                            onClick={() => alert(`View: ${attachment}`)}
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
                    onClick={() => setEditingIssueId(null)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Display Saved Categorization */
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-green-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Categorization Complete
                </h4>
                <Button
                  onClick={() => {
                    setEditingIssueId(issue.id);
                  }}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-green-700 font-medium block mb-1">Issue Type:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {issueTypeOptions.find(t => t.value === savedData.type)?.label || savedData.type}
                  </Badge>
                </div>
                <div>
                  <span className="text-green-700 font-medium block mb-1">Priority:</span>
                  <Badge className={`${
                    savedData.manualPriority === 'high' ? 'bg-red-100 text-red-800' :
                    savedData.manualPriority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
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
}

export default function CustomerSuccessTab({ selectedPG, patients, documents }) {
  // Dynamic Priority Calculation System
  const calculateDynamicPriority = (issue) => {
    let priorityScore = 0;
    
    // Base priority scores
    const basePriority = {
      'critical': 100,
      'high': 75,
      'medium': 50,
      'low': 25
    };
    
    priorityScore = basePriority[issue.priority] || 50;
    
    // Calculate days open
    const createdDate = new Date(issue.createdDate);
    const today = new Date();
    const daysOpen = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
    
    // Time-based escalation
    if (daysOpen > 30) priorityScore += 40;
    else if (daysOpen > 21) priorityScore += 30;
    else if (daysOpen > 14) priorityScore += 20;
    else if (daysOpen > 7) priorityScore += 10;
    else if (daysOpen > 3) priorityScore += 5;
    
    // High-priority keywords in title/description
    const highPriorityKeywords = [
      'critical', 'urgent', 'failure', 'down', 'outage', 'breach', 
      'security', 'data loss', 'revenue', 'compliance', 'patient safety',
      'billing', 'HIPAA', 'lawsuit', 'emergency', 'crash'
    ];
    
    const mediumPriorityKeywords = [
      'issue', 'problem', 'error', 'bug', 'delay', 'slow',
      'missing', 'incorrect', 'discrepancy', 'timeout'
    ];
    
    const text = `${issue.title} ${issue.description}`.toLowerCase();
    
    highPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) priorityScore += 15;
    });
    
    mediumPriorityKeywords.forEach(keyword => {
      if (text.includes(keyword.toLowerCase())) priorityScore += 5;
    });
    
    // Issue category multipliers
    const categoryMultipliers = {
      'technical': 1.2,
      'data': 1.3,
      'billing': 1.4,
      'compliance': 1.5,
      'security': 1.6,
      'patient': 1.4
    };
    
    const category = issue.category?.toLowerCase() || '';
    Object.keys(categoryMultipliers).forEach(cat => {
      if (category.includes(cat)) {
        priorityScore *= categoryMultipliers[cat];
      }
    });
    
    // Determine final priority level
    let finalPriority = 'low';
    let priorityColor = 'bg-blue-100 text-blue-800';
    let escalationWarning = false;
    
    if (priorityScore >= 150) {
      finalPriority = 'critical';
      priorityColor = 'bg-red-600 text-white animate-pulse';
      escalationWarning = true;
    } else if (priorityScore >= 100) {
      finalPriority = 'high';
      priorityColor = 'bg-red-100 text-red-800';
    } else if (priorityScore >= 60) {
      finalPriority = 'medium';
      priorityColor = 'bg-yellow-100 text-yellow-800';
    } else {
      finalPriority = 'low';
      priorityColor = 'bg-blue-100 text-blue-800';
    }
    
    return {
      finalPriority,
      priorityColor,
      priorityScore,
      daysOpen,
      escalationWarning,
      originalPriority: issue.priority
    };
  };
  
  // Format time since opened
  const formatTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };
  
  // Get urgency indicator
  const getUrgencyIndicator = (daysOpen) => {
    if (daysOpen > 30) return { text: '🔥 URGENT', color: 'text-red-600 font-bold animate-pulse' };
    if (daysOpen > 21) return { text: '⚠️ Overdue', color: 'text-orange-600 font-semibold' };
    if (daysOpen > 14) return { text: '⏰ Aging', color: 'text-yellow-600 font-medium' };
    if (daysOpen > 7) return { text: '📅 Open', color: 'text-blue-600' };
    return { text: '🆕 Recent', color: 'text-green-600' };
  };
  
  // Filter issues by priority
  const filterIssuesByPriority = (issues) => {
    if (priorityFilter === 'all') return issues;
    return issues.filter(issue => {
      const dynamicPriority = calculateDynamicPriority(issue);
      return dynamicPriority.finalPriority === priorityFilter;
    });
  };

  const [outcomesModalOpen, setOutcomesModalOpen] = useState(false);
  const [communicationModalOpen, setCommunicationModalOpen] = useState(false);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [addPersonaModalOpen, setAddPersonaModalOpen] = useState(false);
  const [selectedSubNode, setSelectedSubNode] = useState(null);
  const [subNodeModalOpen, setSubNodeModalOpen] = useState(false);
  const [patientsListModalOpen, setPatientsListModalOpen] = useState(false);
  const [agenciesListModalOpen, setAgenciesListModalOpen] = useState(false);
  const [mbrFile, setMbrFile] = useState(null);
  const [wbrFile, setWbrFile] = useState(null);
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [billedPatientsModalOpen, setBilledPatientsModalOpen] = useState(false);
  const [gcodePatientsModalOpen, setGcodePatientsModalOpen] = useState(false);
  const [selectedGcode, setSelectedGcode] = useState(null);
  const [unpreparedDocumentsModalOpen, setUnpreparedDocumentsModalOpen] = useState(false);
  const [unbilledPatientsModalOpen, setUnbilledPatientsModalOpen] = useState(false);
  const [rapportFlowchartModalOpen, setRapportFlowchartModalOpen] = useState(false);
  const [rapportSubNodeModalOpen, setRapportSubNodeModalOpen] = useState(false);
  const [selectedRapportSubNode, setSelectedRapportSubNode] = useState(null);
  const [processedDocumentsModalOpen, setProcessedDocumentsModalOpen] = useState(false);
  const [preparedDocumentsModalOpen, setPreparedDocumentsModalOpen] = useState(false);
  const [signedDocumentsModalOpen, setSignedDocumentsModalOpen] = useState(false);
  const [unsignedDocumentsModalOpen, setUnsignedDocumentsModalOpen] = useState(false);
  const [claimsSubmittedModalOpen, setClaimsSubmittedModalOpen] = useState(false);
  const [claimsRejectedModalOpen, setClaimsRejectedModalOpen] = useState(false);
  const [revenueGeneratedModalOpen, setRevenueGeneratedModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [issuesModalOpen, setIssuesModalOpen] = useState(false);
  const [issuesTab, setIssuesTab] = useState('flowchart');
  const [issueDetailModalOpen, setIssueDetailModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issuesExpandedCategory, setIssuesExpandedCategory] = useState(null);
  const [issueDetailTab, setIssueDetailTab] = useState('details');
  const [issueAnalysis, setIssueAnalysis] = useState('');
  const [issueAnalysisValid, setIssueAnalysisValid] = useState(false);
  const [issueResolutionNotes, setIssueResolutionNotes] = useState('');
  const [showOpportunity, setShowOpportunity] = useState(false);
  const [issueOpportunity, setIssueOpportunity] = useState('');
  const [opportunityEnabled, setOpportunityEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState('John Smith'); // In production, this would come from auth
  const [analysisHistory, setAnalysisHistory] = useState([]); // Store all saved analyses with user info
  const [validatedAnalyses, setValidatedAnalyses] = useState(new Set()); // Track which analyses have been validated
  
  // New state variables for Issue Categorization System
  const [issueFlowchartOpen, setIssueFlowchartOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [customerInfoModalOpen, setCustomerInfoModalOpen] = useState(false);
  const [issueAnalysisModalOpen, setIssueAnalysisModalOpen] = useState(false);
  const [currentIssueCategory, setCurrentIssueCategory] = useState(null);
  const [issueResolutionPanel, setIssueResolutionPanel] = useState({
    open: false,
    issue: null,
    activeTab: 'details'
  });
  const [organisationChartOpen, setOrganisationChartOpen] = useState(false);
  const [selectedProfile2, setSelectedProfile2] = useState(null);
  const [profileInterface2Open, setProfileInterface2Open] = useState(false);
  const [personaCardOpen, setPersonaCardOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [isEditingPersona, setIsEditingPersona] = useState(false);
  const [editedPersona, setEditedPersona] = useState(null);
  const [selectedStatCard, setSelectedStatCard] = useState(null);
  const [statDetailModalOpen, setStatDetailModalOpen] = useState(false);
  const [documentListModalOpen, setDocumentListModalOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [claimsListModalOpen, setClaimsListModalOpen] = useState(false);
  const [selectedClaimsType, setSelectedClaimsType] = useState(null);
  const [adminListModalOpen, setAdminListModalOpen] = useState(false);
  const [selectedAdminType, setSelectedAdminType] = useState(null);
  const [executiveSummaryOpen, setExecutiveSummaryOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [emailViewerOpen, setEmailViewerOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [reportType, setReportType] = useState('synopsis');
  const [priorityFilter, setPriorityFilter] = useState('all'); // all, critical, high, medium, low
  const [newPersona, setNewPersona] = useState({
    fullName: '',
    jobTitle: '',
    role: 'Staff',
    email: '',
    phone: '',
    likes: '',
    dislikes: ''
  });
  
  // Unsolved Issues Categorization Modal
  const [unsolvedModalOpen, setUnsolvedModalOpen] = useState(false);
  const [issueCategorizationData, setIssueCategorizationData] = useState({}); // Store categorization for each issue
  const [editingIssueId, setEditingIssueId] = useState(null);
  
  // Advanced Filtering States
  const [regionTypeFilter, setRegionTypeFilter] = useState('all');
  const [regionNameFilter, setRegionNameFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Derived values - calculated after state declarations
  // Check if at least one analysis for the current issue has been validated
  const issueAnalyses = analysisHistory.filter(a => a.issueId === issueResolutionPanel.issue?.id);
  const isResolutionEnabled = issueAnalyses.some(analysis => validatedAnalyses.has(analysis.id));
  const isOpportunityEnabled = issueResolutionNotes.trim().length >= 10;

  // Handlers for resolution actions
  const handleMarkResolved = () => {
    if (!isResolutionEnabled || issueResolutionNotes.trim().length < 10) return;
    const solvedDate = new Date().toLocaleString();
    setIssueResolutionPanel(prev => ({
      ...prev,
      issue: prev.issue ? { ...prev.issue, status: 'solved', solvedDate } : prev.issue,
      activeTab: 'history'
    }));
  };

  // Handler for saving opportunity
  const handleSaveOpportunity = () => {
    if (issueOpportunity.trim().length < 10) return;
    // Here you would typically save the opportunity to your backend
    console.log('Opportunity saved:', issueOpportunity);
    setShowOpportunity(false);
    setIssueOpportunity('');
    // You could add a success notification here
  };

  const handleEscalate = () => {
    if (!isResolutionEnabled || issueResolutionNotes.trim().length < 10) return;
    alert('Issue escalated with resolution context.');
  };

  const handleRequestMoreInfo = () => {
    if (!isResolutionEnabled) return;
    alert('Requester has been asked for more information.');
  };

  const handleCloseIssue = () => {
    if (!isResolutionEnabled) return;
    setIssueResolutionPanel(prev => ({ ...prev, open: false }));
  };
  
  // Get all unsolved issues from all categories
  const getAllUnsolvedIssues = () => {
    const allIssues = [];
    Object.entries(issueCategories).forEach(([categoryKey, category]) => {
      category.issues.forEach(issue => {
        if (issue.status === 'unsolved' && !issueCategorizationData[issue.id]) {
          allIssues.push({
            ...issue,
            categoryName: category.name,
            categoryKey: categoryKey
          });
        }
      });
    });
    return allIssues;
  };

  // Handler to save categorization and prioritization
  const handleSaveCategorization = (issueId, data) => {
    setIssueCategorizationData(prev => ({
      ...prev,
      [issueId]: data
    }));
    setEditingIssueId(null);
    // Ensure categorized issues appear in the tree immediately
    const getCategoryKeyForIssue = () => {
      for (const [key, category] of Object.entries(issueCategories)) {
        if (category.issues && category.issues.some(i => i.id === issueId)) return key;
      }
      return null;
    };
    const categoryKey = getCategoryKeyForIssue();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      next.add('main-issues');
      if (categoryKey) next.add(categoryKey);
      return next;
    });
    setStatusFilter('analyzed');
  };

  // Issue type options
  const issueTypeOptions = [
    { value: 'clinical', label: 'Clinical', color: 'blue' },
    { value: 'operational', label: 'Operational/Patient services', color: 'green' },
    { value: 'queries', label: 'Queries', color: 'purple' },
    { value: 'technical', label: 'Technical error', color: 'red' },
    { value: 'followup', label: 'Follow up mails', color: 'orange' },
    { value: 'enquiry', label: 'Enquiry mails', color: 'indigo' }
  ];

  // Region Hierarchy Data
  const regionHierarchy = {
    division: [
      "Pacific Northwest Division",
      "Bay Area Central CA Division",
      "LA CSA Division",
      "Southwest Division",
      "Intermountain",
      "Great Plains Division",
      "Central Division 3",
      "South Division",
      "Central and East Texas Division",
      "East Central Divisional Group 2",
      "Illinois Wisconsin Division",
      "East Central Divisional Group 3",
      "East Central Divisional Group 4",
      "East Central Divisional Group 5",
      "NEMA Divisional Group 5",
      "NEMA Divisional Group 4",
      "East Central Divisional Group 1",
      "NEMA Divisional Group 3",
      "NEMA Divisional Group 2",
      "NEMA Divisional Group 1"
    ],
    divisionalGroup: ["East", "East Central", "West", "Central"],
    msa: ["New York City", "Los Angeles", "Chicago", "Dallas", "Atlanta", "Seattle", "Denver", "Boston"],
    gsa: ["Coastal Belt GSA", "Midwest GSA", "Southern Corridor GSA", "Mountain Ridge GSA", "Great Lakes GSA"]
  };

  // Get available region names based on selected region type
  const getAvailableRegions = () => {
    if (regionTypeFilter === 'all') return [];
    return regionHierarchy[regionTypeFilter] || [];
  };

  // Reset region name when region type changes
  React.useEffect(() => {
    setRegionNameFilter('all');
  }, [regionTypeFilter]);

  // Comprehensive filtering function for issues
  const applyAdvancedFilters = (issues) => {
    return issues.filter(issue => {
      const saved = issueCategorizationData[issue.id];
      const effectiveWorkflowStatus = saved ? 'analyzed' : issue.workflowStatus;
      const effectiveCategory = saved?.type || ((issue.source === 'Phone Call' || issue.issueCategory === 'callTranscripts') ? 'callTranscripts' : (issue.issueCategory || 'others'));
      // Priority filter
      if (priorityFilter !== 'all') {
        if (priorityFilter === 'solved' && issue.status !== 'solved') return false;
        if (priorityFilter === 'unsolved' && issue.status === 'solved') return false;
        if (['critical', 'high', 'medium', 'low'].includes(priorityFilter)) {
          const dynamicPriority = calculateDynamicPriority(issue);
          if (dynamicPriority.currentPriority !== priorityFilter) return false;
        }
      }

      // Region Type filter
      if (regionTypeFilter !== 'all' && issue.regionType !== regionTypeFilter) return false;

      // Region Name filter
      if (regionNameFilter !== 'all' && issue.regionName !== regionNameFilter) return false;

      // Category filter (respect categorizer overrides)
      if (categoryFilter !== 'all' && effectiveCategory !== categoryFilter) return false;

      // Channel filter
      if (channelFilter !== 'all' && issue.channel !== channelFilter) return false;

      // Status filter (mutually exclusive buckets)
      if (statusFilter !== 'all') {
        if (statusFilter === 'resolved') {
          if (issue.status !== 'solved') return false;
        } else if (statusFilter === 'new') {
          if (!(issue.status === 'unsolved' && effectiveWorkflowStatus !== 'analyzed' && effectiveWorkflowStatus !== 'catalyzed')) return false;
        } else {
          if (effectiveWorkflowStatus !== statusFilter) return false;
        }
      }

      return true;
    });
  };

  // Apply all filters except the status filter (used for stable stats)
  const applyAdvancedFiltersNoStatus = (issues) => {
    return issues.filter(issue => {
      // Priority filter
      if (priorityFilter !== 'all') {
        if (priorityFilter === 'solved' && issue.status !== 'solved') return false;
        if (priorityFilter === 'unsolved' && issue.status === 'solved') return false;
        if (['critical', 'high', 'medium', 'low'].includes(priorityFilter)) {
          const dynamicPriority = calculateDynamicPriority(issue);
          if (dynamicPriority.currentPriority !== priorityFilter) return false;
        }
      }

      // Region Type filter
      if (regionTypeFilter !== 'all' && issue.regionType !== regionTypeFilter) return false;

      // Region Name filter
      if (regionNameFilter !== 'all' && issue.regionName !== regionNameFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && issue.issueCategory !== categoryFilter) return false;

      // Channel filter
      if (channelFilter !== 'all' && issue.channel !== channelFilter) return false;

      // Intentionally skip statusFilter here

      return true;
    });
  };

  // computedIssueCategories is defined after base categories are initialized

  // Helper function to check if any advanced filters are active
  const hasAdvancedFiltersActive = () => {
    return regionTypeFilter !== 'all' || 
           regionNameFilter !== 'all' || 
           categoryFilter !== 'all' || 
           channelFilter !== 'all';
  };

  // Clear all advanced filters
  const clearAllFilters = () => {
    setRegionTypeFilter('all');
    setRegionNameFilter('all');
    setCategoryFilter('all');
    setChannelFilter('all');
    setPriorityFilter('all');
  };

  // Recipients data
  const recipientsData = [
    { id: 1, name: 'Dr. Michael Chen', title: 'Chief Medical Officer', avatar: 'MC', color: 'blue' },
    { id: 2, name: 'Dr. Patricia Williams', title: 'Chief Financial Officer', avatar: 'PW', color: 'purple' },
    { id: 3, name: 'Dr. Sarah Johnson', title: 'Chief Executive Officer', avatar: 'SJ', color: 'green' }
  ];

  // Sample data for detailed lists
  const detailedStatsData = {
    'Total Patients': [
      { id: 1, name: 'John Smith', mrn: 'MRN33600210357401', age: 72, diagnosis: 'Diabetes Type 2', status: 'Active', admissionDate: '2024-11-15', agency: 'Comfort Care Home Health' },
      { id: 2, name: 'Maria Garcia', mrn: 'MRN33600210357402', age: 68, diagnosis: 'Hypertension', status: 'Active', admissionDate: '2024-11-20', agency: 'Mercy Home Services' },
      { id: 3, name: 'Robert Johnson', mrn: 'MRN33600210357403', age: 75, diagnosis: 'Heart Failure', status: 'Discharged', admissionDate: '2024-10-28', agency: 'Angel Care Network' },
      { id: 4, name: 'Sarah Wilson', mrn: 'MRN33600210357404', age: 71, diagnosis: 'COPD', status: 'Active', admissionDate: '2024-12-01', agency: 'Healing Hands Agency' },
      { id: 5, name: 'Michael Brown', mrn: 'MRN33600210357405', age: 69, diagnosis: 'Stroke Recovery', status: 'Active', admissionDate: '2024-11-25', agency: 'Grace Home Healthcare' }
    ],
    'New Patients': [
      { id: 1, name: 'Emily Rodriguez', mrn: 'MRN089', age: 45, diagnosis: 'New Diagnosis', status: 'New', admissionDate: '2024-01-15' },
      { id: 2, name: 'David Lee', mrn: 'MRN090', age: 52, diagnosis: 'New Diagnosis', status: 'New', admissionDate: '2024-01-14' },
      { id: 3, name: 'Lisa Chen', mrn: 'MRN091', age: 38, diagnosis: 'New Diagnosis', status: 'New', admissionDate: '2024-01-13' }
    ],
    'Agency Count': [
      { id: 1, name: 'Comfort Care Home Health', address: '123 Healthcare Ave, City, State', patients: 23, rating: 4.8, contact: 'Dr. Sarah Wilson', phone: '(555) 123-4567', services: ['Skilled Nursing', 'Physical Therapy', '+1 more'] },
      { id: 2, name: 'Mercy Home Services', address: '456 Medical Blvd, City, State', patients: 18, rating: 4.6, contact: 'Dr. Michael Brown', phone: '(555) 234-5678', services: ['Home Health', 'Speech Therapy', '+1 more'] },
      { id: 3, name: 'Angel Care Network', address: '789 Wellness St, City, State', patients: 31, rating: 4.9, contact: 'Dr. Robert Johnson', phone: '(555) 345-6789', services: ['Palliative Care', 'Wound Care', '+1 more'] },
      { id: 4, name: 'Healing Hands Agency', address: '321 Recovery Rd, City, State', patients: 15, rating: 4.7, contact: 'Dr. Maria Garcia', phone: '(555) 456-7890', services: ['Rehabilitation', 'Chronic Care', '+1 more'] },
      { id: 5, name: 'Grace Home Healthcare', address: '654 Care Lane, City, State', patients: 27, rating: 4.5, contact: 'Dr. Jennifer Smith', phone: '(555) 567-8901', services: ['Geriatric Care', 'Cardiac Care', '+1 more'] }
    ],
    'Avg Satisfaction': {
      type: 'chart',
      data: {
        overallScore: 86,
        breakdown: [
          { category: 'Episode Billability', score: 92, color: 'green' },
          { category: 'Communication', score: 88, color: 'blue' },
          { category: 'Response Time', score: 85, color: 'orange' }
        ],
        trends: {
          monthly: [82, 84, 85, 86],
          quarterly: [78, 81, 84, 86]
        }
      }
    },
    // Achievements Statistics
    'Time Saved': [
      { id: 1, task: 'Document Processing', timeSaved: '45hrs', date: '2024-01-15', description: 'Automated document classification' },
      { id: 2, task: 'Patient Validation', timeSaved: '32hrs', date: '2024-01-14', description: 'Streamlined validation workflow' },
      { id: 3, task: 'Claims Processing', timeSaved: '28hrs', date: '2024-01-13', description: 'Automated claims submission' },
      { id: 4, task: 'Report Generation', timeSaved: '25hrs', date: '2024-01-12', description: 'Automated report creation' },
      { id: 5, task: 'Data Entry', timeSaved: '26hrs', date: '2024-01-11', description: 'Reduced manual data entry' }
    ],
    'Revenue Generated': [
      { id: 1, source: 'G0181 Billing', amount: '$12,500', date: '2024-01-15', patient: 'John Smith', amount: '$12,500' },
      { id: 2, source: 'G0182 Billing', amount: '$8,750', date: '2024-01-14', patient: 'Maria Garcia', amount: '$8,750' },
      { id: 3, source: 'G0179 Billing', amount: '$15,200', date: '2024-01-13', patient: 'Robert Johnson', amount: '$15,200' },
      { id: 4, source: 'G0180 Billing', amount: '$9,330', date: '2024-01-12', patient: 'Sarah Wilson', amount: '$9,330' }
    ],
    'Billed Patients': [
      { id: 1, name: 'John Smith', mrn: 'MRN001', diagnosis: 'Diabetes Type 2', billingCode: 'G0181', amount: '$2,500', date: '2024-01-15', status: 'Billed' },
      { id: 2, name: 'Maria Garcia', mrn: 'MRN002', diagnosis: 'Hypertension', billingCode: 'G0182', amount: '$1,750', date: '2024-01-14', status: 'Billed' },
      { id: 3, name: 'Robert Johnson', mrn: 'MRN003', diagnosis: 'Heart Failure', billingCode: 'G0179', amount: '$3,200', date: '2024-01-13', status: 'Billed' },
      { id: 4, name: 'Sarah Wilson', mrn: 'MRN004', diagnosis: 'COPD', billingCode: 'G0180', amount: '$1,830', date: '2024-01-12', status: 'Billed' },
      { id: 5, name: 'Michael Brown', mrn: 'MRN005', diagnosis: 'Stroke Recovery', billingCode: 'G0181', amount: '$2,100', date: '2024-01-11', status: 'Billed' }
    ],
    'G0181 Segregation': [
      { id: 1, patient: 'John Smith', mrn: 'MRN001', date: '2024-01-15', status: 'Completed', amount: '$2,500' },
      { id: 2, patient: 'Michael Brown', mrn: 'MRN005', date: '2024-01-11', status: 'Completed', amount: '$2,100' },
      { id: 3, patient: 'David Lee', mrn: 'MRN006', date: '2024-01-10', status: 'Completed', amount: '$1,800' },
      { id: 4, patient: 'Lisa Chen', mrn: 'MRN007', date: '2024-01-09', status: 'Completed', amount: '$2,200' },
      { id: 5, patient: 'James Wilson', mrn: 'MRN008', date: '2024-01-08', status: 'Completed', amount: '$1,900' }
    ],
    'G0182 Segregation': [
      { id: 1, patient: 'Maria Garcia', mrn: 'MRN002', date: '2024-01-14', status: 'Completed', amount: '$1,750' },
      { id: 2, patient: 'Emily Rodriguez', mrn: 'MRN009', date: '2024-01-13', status: 'Completed', amount: '$1,600' },
      { id: 3, patient: 'William Davis', mrn: 'MRN010', date: '2024-01-12', status: 'Completed', amount: '$1,850' },
      { id: 4, patient: 'Jennifer Taylor', mrn: 'MRN011', date: '2024-01-11', status: 'Completed', amount: '$1,700' },
      { id: 5, patient: 'Christopher Moore', mrn: 'MRN012', date: '2024-01-10', status: 'Completed', amount: '$1,650' }
    ],
    'G0179 Segregation': [
      { id: 1, patient: 'Robert Johnson', mrn: 'MRN003', date: '2024-01-13', status: 'Completed', amount: '$3,200' },
      { id: 2, patient: 'Susan Anderson', mrn: 'MRN013', date: '2024-01-12', status: 'Completed', amount: '$2,800' },
      { id: 3, patient: 'Thomas Martinez', mrn: 'MRN014', date: '2024-01-11', status: 'Completed', amount: '$3,100' },
      { id: 4, patient: 'Nancy Thompson', mrn: 'MRN015', date: '2024-01-10', status: 'Completed', amount: '$2,900' },
      { id: 5, patient: 'Charles White', mrn: 'MRN016', date: '2024-01-09', status: 'Completed', amount: '$3,000' }
    ],
    'G0180 Segregation': [
      { id: 1, patient: 'Sarah Wilson', mrn: 'MRN004', date: '2024-01-12', status: 'Completed', amount: '$1,830' },
      { id: 2, patient: 'Mark Thompson', mrn: 'MRN017', date: '2024-01-11', status: 'Completed', amount: '$1,750' },
      { id: 3, patient: 'Linda Garcia', mrn: 'MRN018', date: '2024-01-10', status: 'Completed', amount: '$1,900' },
      { id: 4, patient: 'Paul Rodriguez', mrn: 'MRN019', date: '2024-01-09', status: 'Completed', amount: '$1,650' },
      { id: 5, patient: 'Karen Martinez', mrn: 'MRN020', date: '2024-01-08', status: 'Completed', amount: '$1,800' }
    ],
    // Risk Analysis Statistics
    'Decrease in Document Inflow': [
      { id: 1, documentType: '485 Certifications', previousCount: 45, currentCount: 38, decrease: '15%', date: '2024-01-15' },
      { id: 2, documentType: 'F2F Assessments', previousCount: 32, currentCount: 28, decrease: '12%', date: '2024-01-14' },
      { id: 3, documentType: 'Plan of Care', previousCount: 28, currentCount: 24, decrease: '14%', date: '2024-01-13' },
      { id: 4, documentType: 'Physician Orders', previousCount: 35, currentCount: 30, decrease: '14%', date: '2024-01-12' }
    ],
    'Unbilled Patients': [
      { id: 1, name: 'Alice Johnson', mrn: 'MRN021', diagnosis: 'Diabetes', daysUnbilled: 15, reason: 'Missing Documentation', status: 'Pending' },
      { id: 2, name: 'Bob Smith', mrn: 'MRN022', diagnosis: 'Hypertension', daysUnbilled: 12, reason: 'Authorization Required', status: 'Pending' },
      { id: 3, name: 'Carol Davis', mrn: 'MRN023', diagnosis: 'COPD', daysUnbilled: 18, reason: 'Physician Signature', status: 'Pending' },
      { id: 4, name: 'Daniel Wilson', mrn: 'MRN024', diagnosis: 'Heart Failure', daysUnbilled: 10, reason: 'Insurance Verification', status: 'Pending' },
      { id: 5, name: 'Eva Brown', mrn: 'MRN025', diagnosis: 'Stroke Recovery', daysUnbilled: 22, reason: 'Missing Assessment', status: 'Pending' }
    ],
    'Unprepared Document Count': [
      { id: 1, documentType: '485 Certification', patient: 'Frank Miller', mrn: 'MRN026', date: '2024-01-15', reason: 'Physician Signature Missing' },
      { id: 2, documentType: 'F2F Assessment', patient: 'Grace Lee', mrn: 'MRN027', date: '2024-01-14', reason: 'Incomplete Assessment' },
      { id: 3, documentType: 'Plan of Care', patient: 'Henry Clark', mrn: 'MRN028', date: '2024-01-13', reason: 'Missing Goals' },
      { id: 4, documentType: 'Physician Orders', patient: 'Irene Taylor', mrn: 'MRN029', date: '2024-01-12', reason: 'Incomplete Orders' },
      { id: 5, documentType: '485 Certification', patient: 'Jack Anderson', mrn: 'MRN030', date: '2024-01-11', reason: 'Missing Diagnosis' }
    ],
    'Rapport Deteriorate': [
      { id: 1, patient: 'Katherine White', mrn: 'MRN031', previousScore: 85, currentScore: 75, decrease: '12%', reason: 'Communication Issues' },
      { id: 2, patient: 'Louis Garcia', mrn: 'MRN032', previousScore: 90, currentScore: 79, decrease: '12%', reason: 'Service Delays' },
      { id: 3, patient: 'Mary Rodriguez', mrn: 'MRN033', previousScore: 88, currentScore: 77, decrease: '12%', reason: 'Documentation Problems' },
      { id: 4, patient: 'Nick Thompson', mrn: 'MRN034', previousScore: 82, currentScore: 72, decrease: '12%', reason: 'Billing Issues' },
      { id: 5, patient: 'Olivia Martinez', mrn: 'MRN035', previousScore: 87, currentScore: 77, decrease: '11%', reason: 'Care Coordination' }
    ],
    // Opportunities Statistics
    'Increased Revenue Generation': [
      { id: 1, source: 'New Patient Acquisition', amount: '$8,500', date: '2024-01-15', description: '15 new patients added' },
      { id: 2, source: 'Improved Billing Efficiency', amount: '$5,200', date: '2024-01-14', description: 'Faster claims processing' },
      { id: 3, source: 'Additional Services', amount: '$3,800', date: '2024-01-13', description: 'Extended care services' },
      { id: 4, source: 'Reduced Denials', amount: '$1,000', date: '2024-01-12', description: 'Better documentation' }
    ],
    'New Patient Count': [
      { id: 1, name: 'Patricia Davis', mrn: 'MRN036', age: 72, diagnosis: 'Diabetes Type 2', admissionDate: '2024-01-15', status: 'Active' },
      { id: 2, name: 'Richard Wilson', mrn: 'MRN037', age: 68, diagnosis: 'Hypertension', admissionDate: '2024-01-14', status: 'Active' },
      { id: 3, name: 'Susan Brown', mrn: 'MRN038', age: 75, diagnosis: 'Heart Failure', admissionDate: '2024-01-13', status: 'Active' },
      { id: 4, name: 'Thomas Garcia', mrn: 'MRN039', age: 71, diagnosis: 'COPD', admissionDate: '2024-01-12', status: 'Active' },
      { id: 5, name: 'Victoria Martinez', mrn: 'MRN040', age: 69, diagnosis: 'Stroke Recovery', admissionDate: '2024-01-11', status: 'Active' }
    ],
    'Admin Time Saved': [
      { id: 1, task: 'Document Processing', timeSaved: '25hrs', date: '2024-01-15', description: 'Automated workflow' },
      { id: 2, task: 'Patient Validation', timeSaved: '18hrs', date: '2024-01-14', description: 'Streamlined process' },
      { id: 3, task: 'Report Generation', timeSaved: '22hrs', date: '2024-01-13', description: 'Automated reports' },
      { id: 4, task: 'Data Entry', timeSaved: '24hrs', date: '2024-01-12', description: 'Reduced manual work' }
    ],
    'Positive Things That Can Be Mentioned': [
      { id: 1, category: 'Patient Satisfaction', description: 'Improved patient communication', impact: 'High', date: '2024-01-15' },
      { id: 2, category: 'Efficiency Gains', description: 'Reduced processing time by 40%', impact: 'High', date: '2024-01-14' },
      { id: 3, category: 'Quality Improvement', description: 'Zero billing errors this month', impact: 'Medium', date: '2024-01-13' },
      { id: 4, category: 'Staff Morale', description: 'Reduced administrative burden', impact: 'High', date: '2024-01-12' },
      { id: 5, category: 'Cost Savings', description: 'Reduced operational costs by 15%', impact: 'Medium', date: '2024-01-11' }
    ]
  };

  // Stats data for sub-nodes
  const statsData = {
    patient: {
      title: 'Patient Statistics',
      stats: [
        { label: 'Total Patients', value: '1,247' },
        { label: 'Avg Satisfaction', value: '86%' },
        { label: 'New Patients', value: '89' },
        { label: 'Agency Count', value: '24' }
      ]
    },
    document: {
      title: 'Document Flow Statistics',
      stats: [
        { label: 'Processed Documents', value: '3,456' },
        { label: 'Prepared Documents', value: '2,847' },
        { label: 'Signed Documents', value: '2,234' },
        { label: 'Unsigned Documents', value: '613' }
      ]
    },
    billing: {
      title: 'Claims & Billing Statistics',
      stats: [
        { label: 'Claims Submitted', value: '2,158' },
        { label: 'Claims Rejected', value: '23' },
        { label: 'Revenue Generated', value: '$1.2M' },
        { label: 'Patient Episode Billability', value: '98.9%' }
      ]
    },
    admin: {
      title: 'Admin Efficiency Statistics',
      stats: [
        { label: 'Avg Response Time', value: '2.4hrs' },
        { label: 'Task Completion', value: '97%' },
        { label: 'Workflow Efficiency', value: '92%' },
        { label: 'Staff Utilization', value: '89%' }
      ]
    },
    achievements: {
      title: 'Achievements Statistics',
      stats: [
        { label: 'Time Saved', value: '156hrs' },
        { label: 'Revenue Generated', value: '$45,280' },
        { label: 'Billed Patients', value: '89' },
        { label: 'G0181 Segregation', value: '23' },
        { label: 'G0182 Segregation', value: '18' },
        { label: 'G0179 Segregation', value: '31' },
        { label: 'G0180 Segregation', value: '17' }
      ]
    },
    risks: {
      title: 'Risk Analysis Statistics',
      stats: [
        { label: 'Decrease in Document Inflow', value: '15%' },
        { label: 'Unbilled Patients', value: '23' },
        { label: 'Unprepared Document Count', value: '8' },
        { label: 'Rapport Deteriorate', value: '12%' }
      ]
    },
    opportunities: {
      title: 'Opportunities Statistics',
      stats: [
        { label: 'Increased Revenue Generation', value: '$18,500' },
        { label: 'New Patient Count', value: '67' },
        { label: 'Admin Time Saved', value: '89hrs' },
        { label: 'Positive Things That Can Be Mentioned', value: '15' }
      ]
    }
  };

  // Communication sub-nodes data
  const communicationSubNodes = [
    {
      id: 'achievements',
      title: 'Achievements',
      icon: Trophy,
      color: 'from-green-500 to-emerald-600',
      tooltip: 'Key Achievements and Success Metrics'
    },
    {
      id: 'risks',
      title: 'Risks',
      icon: AlertTriangle,
      color: 'from-red-500 to-rose-600',
      tooltip: 'Risk Analysis and Mitigation'
    },
    {
      id: 'opportunities',
      title: 'Opportunities',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-600',
      tooltip: 'Growth Opportunities and Potential'
    }
  ];

  // Mock data for billed patients
  const billedPatientsData = [
    {
      id: 'bp001',
      name: 'MAYER, PAMELA',
      mrn: '33600210357401',
      age: 72,
      diagnosis: 'Diabetes Type 2',
      status: 'Billed',
      billingDate: '2025-01-15',
      amount: '$2,450',
      agency: 'Comfort Care Home Health',
      physician: 'Dr. Sarah Wilson'
    },
    {
      id: 'bp002',
      name: 'JOHNSON, ROBERT',
      mrn: '33600210357402',
      age: 68,
      diagnosis: 'Hypertension',
      status: 'Billed',
      billingDate: '2025-01-14',
      amount: '$1,890',
      agency: 'Mercy Home Services',
      physician: 'Dr. Michael Brown'
    },
    {
      id: 'bp003',
      name: 'SMITH, MARY',
      mrn: '33600210357403',
      age: 75,
      diagnosis: 'COPD',
      status: 'Billed',
      billingDate: '2025-01-13',
      amount: '$3,200',
      agency: 'Angel Care Network',
      physician: 'Dr. Robert Johnson'
    },
    {
      id: 'bp004',
      name: 'DAVIS, JOHN',
      mrn: '33600210357404',
      age: 81,
      diagnosis: 'Heart Failure',
      status: 'Billed',
      billingDate: '2025-01-12',
      amount: '$4,100',
      agency: 'Healing Hands Agency',
      physician: 'Dr. Maria Garcia'
    },
    {
      id: 'bp005',
      name: 'WILSON, LINDA',
      mrn: '33600210357405',
      age: 69,
      diagnosis: 'Stroke Recovery',
      status: 'Billed',
      billingDate: '2025-01-11',
      amount: '$2,800',
      agency: 'Grace Home Healthcare',
      physician: 'Dr. David Lee'
    }
  ];

  // Mock data for G-code patients
  const gcodePatientsData = {
    'G0181': [
      { id: 'g181001', name: 'ANDERSON, JAMES', mrn: 'G181001', diagnosis: 'Physical Therapy', status: 'Completed', amount: '$120' },
      { id: 'g181002', name: 'TAYLOR, SUSAN', mrn: 'G181002', diagnosis: 'Occupational Therapy', status: 'Completed', amount: '$120' },
      { id: 'g181003', name: 'THOMAS, CHARLES', mrn: 'G181003', diagnosis: 'Speech Therapy', status: 'Completed', amount: '$120' },
      { id: 'g181004', name: 'JACKSON, LISA', mrn: 'G181004', diagnosis: 'Physical Therapy', status: 'Completed', amount: '$120' },
      { id: 'g181005', name: 'WHITE, DAVID', mrn: 'G181005', diagnosis: 'Occupational Therapy', status: 'Completed', amount: '$120' }
    ],
    'G0182': [
      { id: 'g182001', name: 'HARRIS, PATRICIA', mrn: 'G182001', diagnosis: 'Medical Social Services', status: 'Completed', amount: '$120' },
      { id: 'g182002', name: 'MARTIN, MICHAEL', mrn: 'G182002', diagnosis: 'Medical Social Services', status: 'Completed', amount: '$120' },
      { id: 'g182003', name: 'GARCIA, MARIA', mrn: 'G182003', diagnosis: 'Medical Social Services', status: 'Completed', amount: '$120' },
      { id: 'g182004', name: 'MARTINEZ, CARLOS', mrn: 'G182004', diagnosis: 'Medical Social Services', status: 'Completed', amount: '$120' }
    ],
    'G0179': [
      { id: 'g179001', name: 'ROBINSON, JENNIFER', mrn: 'G179001', diagnosis: 'Home Health Aide Services', status: 'Completed', amount: '$40' },
      { id: 'g179002', name: 'CLARK, WILLIAM', mrn: 'G179002', diagnosis: 'Home Health Aide Services', status: 'Completed', amount: '$40' },
      { id: 'g179003', name: 'RODRIGUEZ, CARMEN', mrn: 'G179003', diagnosis: 'Home Health Aide Services', status: 'Completed', amount: '$40' },
      { id: 'g179004', name: 'LEWIS, BARBARA', mrn: 'G179004', diagnosis: 'Home Health Aide Services', status: 'Completed', amount: '$40' }
    ],
    'G0180': [
      { id: 'g180001', name: 'LEE, RICHARD', mrn: 'G180001', diagnosis: 'Skilled Nursing Services', status: 'Completed', amount: '$60' },
      { id: 'g180002', name: 'WALKER, NANCY', mrn: 'G180002', diagnosis: 'Skilled Nursing Services', status: 'Completed', amount: '$60' },
      { id: 'g180003', name: 'HALL, JOSEPH', mrn: 'G180003', diagnosis: 'Skilled Nursing Services', status: 'Completed', amount: '$60' },
      { id: 'g180004', name: 'ALLEN, SANDRA', mrn: 'G180004', diagnosis: 'Skilled Nursing Services', status: 'Completed', amount: '$60' }
    ]
  };

  // Mock data for unprepared documents
  const unpreparedDocumentsData = [
    {
      id: 'ud001',
      documentId: 'DOC-2025-001',
      patientName: 'MARTINEZ, CARLOS',
      mrn: 'MRN-2025-001',
      documentType: 'Physician Order',
      dateReceived: '2025-01-15',
      status: 'Unprepared',
      reason: 'Missing physician signature',
      priority: 'High',
      assignedTo: 'Dr. Sarah Wilson'
    },
    {
      id: 'ud002',
      documentId: 'DOC-2025-002',
      patientName: 'THOMPSON, LISA',
      mrn: 'MRN-2025-002',
      documentType: 'Plan of Care',
      dateReceived: '2025-01-14',
      status: 'Unprepared',
      reason: 'Incomplete patient information',
      priority: 'Medium',
      assignedTo: 'Dr. Michael Brown'
    },
    {
      id: 'ud003',
      documentId: 'DOC-2025-003',
      patientName: 'GARCIA, MARIA',
      mrn: 'MRN-2025-003',
      documentType: 'Face-to-Face Encounter',
      dateReceived: '2025-01-13',
      status: 'Unprepared',
      reason: 'Missing encounter details',
      priority: 'High',
      assignedTo: 'Dr. Robert Johnson'
    },
    {
      id: 'ud004',
      documentId: 'DOC-2025-004',
      patientName: 'WILSON, JAMES',
      mrn: 'MRN-2025-004',
      documentType: 'Certification',
      dateReceived: '2025-01-12',
      status: 'Unprepared',
      reason: 'Incomplete certification',
      priority: 'Medium',
      assignedTo: 'Dr. Maria Garcia'
    },
    {
      id: 'ud005',
      documentId: 'DOC-2025-005',
      patientName: 'DAVIS, ANNA',
      mrn: 'MRN-2025-005',
      documentType: 'Physician Order',
      dateReceived: '2025-01-11',
      status: 'Unprepared',
      reason: 'Missing patient demographics',
      priority: 'Low',
      assignedTo: 'Dr. David Lee'
    },
    {
      id: 'ud006',
      documentId: 'DOC-2025-006',
      patientName: 'BROWN, MICHAEL',
      mrn: 'MRN-2025-006',
      documentType: 'Plan of Care',
      dateReceived: '2025-01-10',
      status: 'Unprepared',
      reason: 'Incomplete service details',
      priority: 'High',
      assignedTo: 'Dr. Sarah Wilson'
    },
    {
      id: 'ud007',
      documentId: 'DOC-2025-007',
      patientName: 'TAYLOR, SUSAN',
      mrn: 'MRN-2025-007',
      documentType: 'Face-to-Face Encounter',
      dateReceived: '2025-01-09',
      status: 'Unprepared',
      reason: 'Missing physician notes',
      priority: 'Medium',
      assignedTo: 'Dr. Michael Brown'
    },
    {
      id: 'ud008',
      documentId: 'DOC-2025-008',
      patientName: 'ANDERSON, ROBERT',
      mrn: 'MRN-2025-008',
      documentType: 'Certification',
      dateReceived: '2025-01-08',
      status: 'Unprepared',
      reason: 'Incomplete homebound status',
      priority: 'High',
      assignedTo: 'Dr. Robert Johnson'
    }
  ];

  // Mock data for claims submitted
  const claimsSubmittedData = [
    {
      id: 'cs001',
      claimId: 'CLM-2025-001',
      patientName: 'JOHNSON, MARY',
      mrn: 'MRN-2025-001',
      claimAmount: '$1,200',
      submissionDate: '2025-01-15',
      status: 'Submitted',
      billingCode: 'G0181',
      agency: 'Comfort Care Home Health',
      physician: 'Dr. Sarah Wilson'
    },
    {
      id: 'cs002',
      claimId: 'CLM-2025-002',
      patientName: 'SMITH, JOHN',
      mrn: 'MRN-2025-002',
      claimAmount: '$1,800',
      submissionDate: '2025-01-14',
      status: 'Submitted',
      billingCode: 'G0182',
      agency: 'Mercy Home Services',
      physician: 'Dr. Michael Brown'
    },
    {
      id: 'cs003',
      claimId: 'CLM-2025-003',
      patientName: 'WILLIAMS, PATRICIA',
      mrn: 'MRN-2025-003',
      claimAmount: '$1,400',
      submissionDate: '2025-01-13',
      status: 'Submitted',
      billingCode: 'G0179',
      agency: 'Angel Care Network',
      physician: 'Dr. Robert Johnson'
    },
    {
      id: 'cs004',
      claimId: 'CLM-2025-004',
      patientName: 'JONES, CHARLES',
      mrn: 'MRN-2025-004',
      claimAmount: '$1,600',
      submissionDate: '2025-01-12',
      status: 'Submitted',
      billingCode: 'G0180',
      agency: 'Healing Hands Agency',
      physician: 'Dr. Maria Garcia'
    },
    {
      id: 'cs005',
      claimId: 'CLM-2025-005',
      patientName: 'WILSON, LINDA',
      mrn: 'MRN-2025-005',
      claimAmount: '$1,300',
      submissionDate: '2025-01-11',
      status: 'Submitted',
      billingCode: 'G0181',
      agency: 'Grace Home Healthcare',
      physician: 'Dr. David Lee'
    }
  ];

  // Mock data for claims rejected
  const claimsRejectedData = [
    {
      id: 'cr001',
      claimId: 'CLM-2025-REJ-001',
      patientName: 'BROWN, MICHAEL',
      mrn: 'MRN-2025-REJ-001',
      claimAmount: '$1,100',
      rejectionDate: '2025-01-10',
      rejectionReason: 'Missing physician signature',
      status: 'Rejected',
      billingCode: 'G0181',
      agency: 'Comfort Care Home Health',
      physician: 'Dr. Sarah Wilson'
    },
    {
      id: 'cr002',
      claimId: 'CLM-2025-REJ-002',
      patientName: 'DAVIS, ANNA',
      mrn: 'MRN-2025-REJ-002',
      claimAmount: '$1,500',
      rejectionDate: '2025-01-09',
      rejectionReason: 'Incomplete documentation',
      status: 'Rejected',
      billingCode: 'G0182',
      agency: 'Mercy Home Services',
      physician: 'Dr. Michael Brown'
    },
    {
      id: 'cr003',
      claimId: 'CLM-2025-REJ-003',
      patientName: 'TAYLOR, SUSAN',
      mrn: 'MRN-2025-REJ-003',
      claimAmount: '$1,200',
      rejectionDate: '2025-01-08',
      rejectionReason: 'Invalid billing code',
      status: 'Rejected',
      billingCode: 'G0179',
      agency: 'Angel Care Network',
      physician: 'Dr. Robert Johnson'
    }
  ];

  const issueCategories = {
    technical: {
      name: 'Technical',
      icon: Cpu,
      color: 'from-blue-500 to-blue-600',
      count: 23,
      issues: [
        {
          id: 'tech-001',
          title: 'API Integration Failure',
          description: 'Patient data sync failing with external systems',
          priority: 'high',
          status: 'unsolved',
          createdDate: '2025-09-29T14:23:00',
          assignedTo: 'Tech Team',
          category: 'Integration',
          source: 'System',
          regionType: 'division',
          regionName: 'East',
          issueCategory: 'technical',
          channel: 'email',
          workflowStatus: 'analyzed',
          reporter: {
            name: 'Dr. Sarah Chen',
            email: 'sarah.chen@medicalpractice.com',
            phone: '+1 (555) 234-5678',
            company: 'Metro Medical Group',
            role: 'Chief Technology Officer'
          },
          fullContent: {
            summary: 'Patient data sync failing with external systems',
            detailedDescription: `Hi team,

We've been having serious problems with our patient data not syncing properly since last Thursday (Sept 25th). The sync just keeps failing and timing out, and now we have 247 patient records that aren't matching up between our system and yours.

This started happening around 3:45 PM last Thursday and it's been on and off ever since. Usually happens most during our busy hours (9 AM - 2 PM). Our staff are spending hours every day trying to manually fix these records and it's really slowing everything down.

The main problems we're seeing:
- Patient records aren't updating across systems
- Billing is getting delayed (we're looking at about $12,400 stuck right now)
- Three of our home health agencies are calling us constantly about missing or wrong data
- We keep getting HTTP 503 errors in the logs

I've attached the error logs and a list of the affected patients. This is really urgent because we're worried about HIPAA compliance issues if patient records stay incomplete like this.`,
            stepsToReproduce: `Here's what happens every time:
1. We try to sync patient data from our dashboard
2. The system shows it's processing
3. After about 30 seconds it just times out
4. Get an error message saying "sync failed"
5. Have to manually update each record

Happens pretty consistently, especially during morning hours.`,
            expectedBehavior: `Patient data should sync automatically within 30 seconds without any errors. All our patient information should stay current in both systems.`,
            actualBehavior: `Instead, about 15-20 sync attempts fail every hour. We see "Service Unavailable" errors and the whole thing just times out. Staff have to go in and manually update records which takes forever.`,
            impactAssessment: `This is really hurting us:
- 247 patients with mismatched records
- $12,400 in billing that can't be submitted
- 3 agencies calling us daily about data issues
- Staff spending 15+ hours per day on manual fixes
- We're worried about HIPAA violations with incomplete records
- Patient care is being delayed because of missing info`,
            environment: `We're using Healthcare Management System version 4.2.1, connecting to your API at /api/v2/patients/sync. Database is PostgreSQL 14.5 hosted on AWS (us-east-1). The problem is worst during peak hours 9 AM - 2 PM EST.`,
            attachments: ['error_logs_jan26-30.txt', 'affected_patients_list.csv', 'api_health_report.pdf'],
            additionalNotes: `I think this might be related to server capacity? We have seen an increase in patient volume recently. Whatever the cause, we really need help ASAP - this is affecting patient care and our entire billing process. Please let me know if you need any other information from us.`
          }
        },
        {
          id: 'tech-002',
          title: 'Database Connection Timeout',
          description: 'Intermittent database connectivity issues',
          priority: 'medium',
          status: 'solved',
          createdDate: '2025-09-29T08:30:00',
          solvedDate: '2025-10-01T16:45:00',
          assignedTo: 'DevOps Team',
          category: 'Infrastructure',
          source: 'Monitoring'
        },
        {
          id: 'tech-003',
          title: 'Mobile App Crashes',
          description: 'App crashes on patient registration screen',
          priority: 'critical',
          status: 'unsolved',
          createdDate: '2025-09-28T09:15:00',
          assignedTo: 'Mobile Team',
          category: 'Application',
          source: 'User Report',
          regionType: 'msa',
          regionName: 'New York City',
          issueCategory: 'technical',
          channel: 'call',
          workflowStatus: 'new',
          reporter: {
            name: 'Jennifer Martinez',
            email: 'j.martinez@healthclinic.com',
            phone: '+1 (555) 789-4561',
            company: 'Riverside Health Clinic',
            role: 'Office Manager'
          },
          fullContent: {
            summary: 'Mobile app crashes on patient registration screen',
            detailedDescription: `URGENT - Our mobile app is completely broken!

The app crashes every single time we try to register a new patient. This started yesterday morning and it's happening on ALL our tablets (4 iPads and 2 Android tablets). Our front desk is freaking out because we can't check in new patients.

What happens: Staff opens the app, logs in fine, but as soon as they tap "Register New Patient" the whole app just closes. Boom, gone. No error message, nothing. They have to reopen it and log back in, but same thing happens every time.

We already had 12 new patients this morning that we couldn't register properly. Everyone is having to crowd around the desktop computers which is taking way longer and patients are getting upset about the wait times.`,
            stepsToReproduce: `It's super easy to reproduce (unfortunately):
1. Open app on any of our tablets
2. Log in (this part works fine)
3. Tap the "Register New Patient" button
4. App crashes immediately
5. Back to home screen

Happens 100% of the time on every device.`,
            expectedBehavior: `When we tap "Register New Patient" it should just open the registration form so we can enter patient info like we always do.`,
            actualBehavior: `App crashes instantly. No form, no error, just closes completely. We have to keep restarting the app and it happens again every time.`,
            impactAssessment: `This is really bad:
- Can't register ANY new patients on tablets
- Front desk stuck using only desktop computers
- Check-in taking twice as long
- Already delayed 12 patients today and it's only 10 AM
- Staff are stressed and patients are complaining
- Our workflow is completely disrupted`,
            environment: `App version 3.4.2 (it updated automatically last night around 11 PM). We have 4 iPads and 2 Samsung tablets. All running latest iOS/Android. WiFi is working fine. The old version (3.4.1) was working perfectly yesterday.`,
            attachments: ['crash_screenshots.png', 'device_logs.txt'],
            additionalNotes: `We see patients every 15 minutes and this is creating a huge backup. Can you please either fix this ASAP or tell us how to rollback to the old version? This is an emergency for us!`
          }
        }
      ]
    },
    operational: {
      name: 'Operational',
      icon: Settings,
      color: 'from-green-500 to-green-600',
      count: 31,
      issues: [
        {
          id: 'op-001',
          title: 'Document Processing Delays',
          description: 'Backlog in document preparation and signing',
          priority: 'high',
          status: 'unsolved',
          createdDate: '2025-09-27T11:45:00',
          assignedTo: 'Operations Team',
          category: 'Workflow',
          source: 'Internal',
          reporter: {
            name: 'Michael Thompson',
            email: 'mthompson@healthcare.com',
            phone: '+1 (555) 456-7890',
            company: 'Healthcare Solutions Inc',
            role: 'Operations Manager'
          },
          fullContent: {
            summary: 'Backlog in document preparation and signing workflow',
            detailedDescription: `Hey,

We're having a major problem with our document workflow. Documents that used to take 2-3 days to get signed are now taking over a week. We currently have 45 documents just sitting there waiting for signatures and it's causing all kinds of problems.

The issue seems to be that documents are getting stuck in the review queue forever. They get prepared fine by our admin staff, but then they just sit there for 5-7 days before physicians even see them. Our doctors are complaining they're getting too many emails and can't keep track of what needs to be signed.

Meanwhile, we can't process billing for these patients, and we're starting to hear complaints from patients and agencies about delays in care coordination. We're looking at about $28,000 in billing that can't go through until these docs are signed.`,
            stepsToReproduce: `Here's what's happening:
1. Admin staff prepares document (takes a few hours)
2. Doc goes into review queue
3. System sends email notification to doctor
4. Document just sits there for almost a week
5. Doctor finally signs it
6. Then it gets processed

Used to take 2-3 days total, now taking 7-10 days.`,
            expectedBehavior: `Documents should move through quickly - prep in a few hours, physician reviews and signs within a day or two, then processed. Should be done in 2-3 days max.`,
            actualBehavior: `Documents are getting stuck in the review queue for way too long. Physicians say they're getting buried in notification emails and missing the important ones. Takes a full week or more now.`,
            impactAssessment: `Problems this is causing:
- 45 documents backed up right now
- Taking 7-10 days instead of 2-3 days
- $28,000 in billing held up
- Doctors complaining about too many emails
- Admin staff having to constantly chase down signatures
- Patient care getting delayed
- Worried about compliance issues if this keeps up`,
            environment: `Using Document Management System v2.1.5. We have 12 physicians and 8 admin staff. Usually handle about 25 documents per week. Right now 45 are pending. Notifications go through email and SMS.`,
            attachments: ['backlog_report.xlsx', 'workflow_metrics.pdf', 'physician_feedback.docx'],
            additionalNotes: `The doctors are telling us they get too many emails and they're missing the important signature requests. Maybe we need a better way to alert them or a dashboard they can check? Also thinking we might need an "urgent" flag for time-sensitive documents. Any suggestions would be great!`
          }
        },
        {
          id: 'op-002',
          title: 'Staff Training Required',
          description: 'New team members need system training',
          priority: 'medium',
          status: 'solved',
          createdDate: '2025-09-27T10:00:00',
          solvedDate: '2025-10-03T15:30:00',
          assignedTo: 'HR Team',
          category: 'Training',
          source: 'Management'
        }
      ]
    },
    support: {
      name: 'Support',
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600',
      count: 18,
      issues: [
        {
          id: 'sup-001',
          title: 'Client Onboarding Issues',
          description: 'New clients having difficulty with setup process',
          priority: 'medium',
          status: 'unsolved',
          createdDate: '2025-09-29T16:30:00',
          assignedTo: 'Support Team',
          category: 'Onboarding',
          source: 'Customer',
          reporter: {
            name: 'Lisa Anderson',
            email: 'landerson@newclinic.com',
            phone: '+1 (555) 321-9876',
            company: 'Northside Family Practice',
            role: 'Practice Administrator'
          }
        }
      ]
    },
    callTranscripts: {
      name: 'Call Transcripts',
      icon: Phone,
      color: 'from-pink-500 to-rose-600',
      count: 14,
      issues: [
        {
          id: 'call-001',
          title: 'Billing Discrepancy Call - Dr. Anderson',
          description: 'Physician called regarding unexpected charges on recent billing statement',
          priority: 'high',
          status: 'unsolved',
          createdDate: '2025-09-27T14:35:00',
          assignedTo: 'Billing Team',
          category: 'Billing',
          source: 'Phone Call',
          callDuration: '12:45',
          callerName: 'Dr. Sarah Anderson',
          callerPhone: '(555) 234-8901',
          reporter: {
            name: 'Dr. Sarah Anderson',
            email: 'sanderson@metromedical.com',
            phone: '(555) 234-8901',
            company: 'Metro Medical Group',
            role: 'Chief Physician'
          },
          transcript: `Call Transcript - Duration: 12:45

Agent: Thank you for calling Healthcare Support. This is Mike. How can I help you today?

Dr. Anderson: Hi Mike, this is Dr. Sarah Anderson from Metro Medical. I'm calling about our recent billing statement. There are some charges I don't recognize.

Agent: I understand your concern, Dr. Anderson. Let me pull up your account. Can you provide your account number or physician group name?

Dr. Anderson: It's Metro Medical Group, account number HCP-8832.

Agent: Thank you. I have your account here. Which charges are you questioning?

Dr. Anderson: On the February statement, there's a $4,500 charge for "CPO Extended Services" dated January 28th. We didn't request any extended services that day.

Agent: Let me investigate this charge. I see it's related to Care Plan Oversight services for 8 patients. Was your group providing oversight for these patients during that period?

Dr. Anderson: We were, but we've never been charged this amount before. Our typical charge is around $2,800 for similar services.

Agent: I understand. It appears there may have been a billing code error or a rate change. Let me escalate this to our billing department for immediate review. Can I have them call you back within 2 hours?

Dr. Anderson: That would be great. Please have them reach me at this number. I need this resolved before month-end.

Agent: Absolutely. I'm creating a high-priority ticket now - reference number BL-2025-045. You'll receive a call from our billing specialist within 2 hours. Is there anything else I can help you with?

Dr. Anderson: No, that's all. Thank you for your help, Mike.

Agent: You're welcome, Dr. Anderson. We'll get this resolved for you quickly. Have a great day.

[Call End]`
        },
        {
          id: 'call-002',
          title: 'System Access Issue - Urgent Call',
          description: 'Medical office staff unable to access patient records, affecting patient care',
          priority: 'critical',
          status: 'unsolved',
          createdDate: '2025-09-29T09:22:00',
          assignedTo: 'Tech Support',
          category: 'Technical',
          source: 'Phone Call',
          callDuration: '8:12',
          callerName: 'Jennifer Martinez (Office Manager)',
          callerPhone: '(555) 876-5432',
          reporter: {
            name: 'Jennifer Martinez',
            email: 'jmartinez@riversidefp.com',
            phone: '(555) 876-5432',
            company: 'Riverside Family Practice',
            role: 'Office Manager'
          },
          transcript: `Call Transcript - Duration: 8:12

Agent: Technical Support, this is Rachel. How can I assist you?

Caller: Hi Rachel, this is Jennifer Martinez from Riverside Family Practice. We have an emergency - none of our staff can access the patient portal. We have patients waiting!

Agent: I understand this is urgent, Jennifer. Let me help you right away. How many users are affected?

Caller: All 6 of our front desk and nursing staff. We've tried logging out and back in, but we're getting "Authentication Failed" errors.

Agent: I see. Let me check our system status... I'm not seeing any widespread outages. Can you tell me the error code you're seeing?

Caller: It says "Error Code: AUTH-503" and "Unable to verify credentials."

Agent: That's helpful. It sounds like there might be an issue with your practice's authentication settings. Were there any recent changes to your network or passwords?

Caller: Not that I know of. This started about 30 minutes ago, right when we opened.

Agent: Understood. I'm escalating this immediately to our senior technical team. In the meantime, I can set up temporary emergency access for your most critical users. How many do you need right now?

Caller: At least 2 - our head nurse and one receptionist.

Agent: Perfect. I'm creating emergency access credentials now. You'll receive them via email in about 2 minutes. The senior tech team will call you within 15 minutes to resolve the underlying issue. What's the best callback number?

Caller: This number is fine - (555) 876-5432.

Agent: Got it. Ticket number is TECH-2025-089, marked as critical. Emergency credentials coming your way now.

Caller: Thank you so much, Rachel. We really need this fixed quickly.

Agent: Absolutely. We'll get your team back online ASAP. Watch for that email and the callback.

[Call End]`
        },
        {
          id: 'call-003',
          title: 'Patient Data Missing After Update',
          description: 'Clinic reports patient records showing incomplete data following system update',
          priority: 'high',
          status: 'unsolved',
          createdDate: '2025-09-28T11:15:00',
          assignedTo: 'Data Team',
          category: 'Data Quality',
          source: 'Phone Call',
          callDuration: '15:33',
          callerName: 'Dr. Michael Chen',
          callerPhone: '(555) 392-7654',
          reporter: {
            name: 'Dr. Michael Chen',
            email: 'mchen@northsideclinic.com',
            phone: '(555) 392-7654',
            company: 'Northside Clinic',
            role: 'Medical Director'
          },
          transcript: `Call Transcript - Duration: 15:33

Agent: Healthcare Support, Data Services. This is Tom speaking.

Dr. Chen: Hi Tom, this is Dr. Michael Chen from Northside Clinic. We're having a serious problem with our patient data after last night's system update.

Agent: I'm sorry to hear that, Dr. Chen. Can you describe what you're seeing?

Dr. Chen: Several patient records are missing critical information - diagnosis codes, medication lists, even some visit notes. We noticed it this morning when we pulled up patient charts.

Agent: That is concerning. Approximately how many patient records are affected?

Dr. Chen: We've identified about 15 so far, but we haven't checked all our active patients yet. We have around 200 active files.

Agent: I understand. Were these records fine before last night's update?

Dr. Chen: Yes, absolutely. We reviewed charts yesterday afternoon and everything was complete. The update ran overnight, and this morning we found the missing data.

Agent: Do you remember what time the update was scheduled?

Dr. Chen: I believe it was set for 2 AM. We got a notification email about it last week.

Agent: Thank you. Let me check our update logs... I see the update completed at 2:47 AM for your system. Let me pull up the data migration logs. Can you give me an example of a patient record that's affected? Just the MRN number is fine.

Dr. Chen: Sure, patient MRN 44892 - that's one where the entire medication list disappeared.

Agent: Let me look that up... I see the record. You're right, the current medication field is blank, but I can see in our backup logs that it had 5 medications listed as of yesterday. This appears to be a data migration issue.

Dr. Chen: Can you restore the data?

Agent: Yes, we can. I'm creating a priority ticket for our database team. They'll need to run a rollback script to restore the affected data from last night's backup. This typically takes about 2-3 hours.

Dr. Chen: That's a relief. Do we need to do anything on our end?

Agent: No, but I'd recommend not editing any patient records for the next 3 hours while we complete the restoration. I'll send you an email list of the affected MRNs so you know which records to avoid.

Dr. Chen: Okay, we can work around that. How will we know when it's done?

Agent: Our database lead will call you directly once the restoration is complete, and you'll also get an email confirmation. Ticket number is DATA-2025-067.

Dr. Chen: Thank you, Tom. We really need this fixed before afternoon appointments.

Agent: Understood. We'll treat this as high priority. You should hear from us within 3 hours maximum.

[Call End]`
        },
        {
          id: 'call-004',
          title: 'Training Request - New Features',
          description: 'Medical practice requesting training session on recently released features',
          priority: 'medium',
          status: 'unsolved',
          createdDate: '2025-09-28T10:45:00',
          assignedTo: 'Training Team',
          category: 'Training',
          source: 'Phone Call',
          callDuration: '6:28',
          callerName: 'Lisa Thompson (Practice Administrator)',
          callerPhone: '(555) 445-9087',
          reporter: {
            name: 'Lisa Thompson',
            email: 'lthompson@eastsidemedical.com',
            phone: '(555) 445-9087',
            company: 'Eastside Medical',
            role: 'Practice Administrator'
          },
          transcript: `Call Transcript - Duration: 6:28

Agent: Customer Success Team, this is Amanda. How may I help you?

Caller: Hi Amanda, this is Lisa Thompson from Eastside Medical. I'm calling to schedule a training session for our staff on the new reporting features.

Agent: Of course, Lisa. I'd be happy to help arrange that. How many staff members would you like to include in the training?

Caller: We have 8 people who need training - 4 doctors, 3 nurses, and our billing coordinator.

Agent: Perfect. Are you interested in an on-site training session or would a virtual training work better for your team?

Caller: Virtual would be great. It's hard to get everyone in the same room at the same time.

Agent: I completely understand. Our virtual training sessions are very effective. We typically schedule them for 90 minutes. Do you have preferred dates or times?

Caller: Afternoons work best for us, maybe around 2 PM? And sometime in the next two weeks if possible?

Agent: Let me check our training calendar... I have availability on February 12th at 2 PM, or February 15th at 2:30 PM. Would either of those work?

Caller: February 12th at 2 PM would be perfect.

Agent: Excellent. I'm booking that for you now. You'll receive a calendar invitation with the Zoom link within the next hour. The training will cover the new reporting dashboard, custom report creation, and automated scheduling features.

Caller: That sounds great. Will we receive any training materials?

Agent: Yes, you'll get a training guide via email the day before, and we'll record the session so anyone who can't attend live can watch it later.

Caller: Perfect. One more thing - can we ask questions during the training?

Agent: Absolutely! It's interactive, so please ask questions anytime. We also have a 30-minute Q&A session built into the 90 minutes.

Caller: Wonderful. Thank you so much, Amanda.

Agent: You're very welcome, Lisa. You'll receive confirmation shortly. Anything else I can help with today?

Caller: No, that's everything. Thanks again!

Agent: Have a great day!

[Call End]`
        },
        {
          id: 'call-005',
          title: 'Complaint About Support Response Time',
          description: 'Physician expressing frustration about delayed responses to previous support tickets',
          priority: 'high',
          status: 'unsolved',
          createdDate: '2025-09-30T16:50:00',
          assignedTo: 'Customer Success',
          category: 'Customer Satisfaction',
          source: 'Phone Call',
          callDuration: '11:22',
          callerName: 'Dr. Robert Williams',
          callerPhone: '(555) 698-3421',
          reporter: {
            name: 'Dr. Robert Williams',
            email: 'rwilliams@westsideurgent.com',
            phone: '(555) 698-3421',
            company: 'Westside Urgent Care',
            role: 'Medical Director'
          },
          transcript: `Call Transcript - Duration: 11:22

Agent: Customer Support, this is Kevin. How can I assist you?

Dr. Williams: Kevin, this is Dr. Robert Williams from Westside Urgent Care. I need to speak with a supervisor about your support response times.

Agent: I understand you're frustrated, Dr. Williams. I'd like to help. Can you tell me what's been happening?

Dr. Williams: I've submitted three support tickets over the past two weeks, and I've either gotten very slow responses or no response at all. This is affecting our ability to serve our patients.

Agent: I sincerely apologize for that experience. That's not the level of service we strive for. Can you give me your ticket numbers so I can look into this?

Dr. Williams: Let me find them... SUP-2025-034, SUP-2025-041, and SUP-2025-056.

Agent: Thank you. Let me pull those up... I see all three tickets here. I can understand your frustration. Ticket 034 took 4 days for the initial response, 041 took 3 days, and 056 is still pending after 2 days.

Dr. Williams: Exactly. We can't wait that long when we're dealing with patient care issues. The first ticket was about prescription routing errors.

Agent: I completely understand. Prescription issues are critical. Let me first address what happened, then we'll fix the open issues. It looks like these tickets were incorrectly categorized as "general inquiries" instead of "urgent clinical operations."

Dr. Williams: So they went to the wrong queue?

Agent: Unfortunately, yes. That's our error, not yours. Let me immediately escalate all three tickets and get them to the right teams. But more importantly, I'm going to set up your practice account with priority routing so this doesn't happen again.

Dr. Williams: That would be appreciated.

Agent: I'm also going to have a senior support manager call you tomorrow to review these tickets and make sure we've resolved everything. And I want to personally follow up on each of these today. Can you spare a few minutes now so I can get the details on ticket 056 since it's still open?

Dr. Williams: Yes, it's about our new staff members not receiving access credentials even though we submitted requests a week ago.

Agent: I see it here. Let me contact our IT provisioning team right now. Actually, give me just one moment... [pause] I'm on chat with IT now, and they're going to create those credentials within the next hour. You should receive the welcome emails by 6 PM today.

Dr. Williams: That's a relief. Thank you for actually taking action.

Agent: It's the least we can do. Again, I apologize for the delays. You'll have a call from our Customer Success Manager tomorrow, and I'll send you a follow-up email in 2 hours with status updates on all three tickets.

Dr. Williams: I appreciate you taking this seriously, Kevin.

Agent: Of course. You have my direct email now, and I'm marking your practice for priority support. If you have any issues going forward, contact me directly.

Dr. Williams: Thank you. That helps.

[Call End]`
        }
      ]
    },
    others: {
      name: 'Other',
      icon: Layout,
      color: 'from-orange-500 to-orange-600',
      count: 17,
      issues: [
        {
          id: 'other-001',
          title: 'Compliance Documentation',
          description: 'Update required for new healthcare regulations',
          priority: 'low',
          status: 'solved',
          createdDate: '2025-09-27T09:00:00',
          solvedDate: '2025-10-03T17:00:00',
          assignedTo: 'Compliance Team',
          category: 'Documentation',
          source: 'Regulatory'
        }
      ]
    }
  };

  // Helper function to get all issues from all categories
  function getAllIssues() {
    const allIssues = [];
    Object.values(issueCategories).forEach(category => {
      if (category.issues) {
        allIssues.push(...category.issues);
      }
    });
    return allIssues;
  }

  // Calculate issue statistics dynamically based on filters
  const calculateIssueStatistics = () => {
    // Get all issues and apply advanced filters EXCEPT status (to keep totals stable)
    const allIssues = getAllIssues();
    const filteredIssues = applyAdvancedFiltersNoStatus(allIssues);
    
    // Calculate total issues
    const totalIssues = filteredIssues.length;
    
    // Compute mutually-exclusive buckets so numbers add up
    const solvedIssues = filteredIssues.filter(issue => issue.status === 'solved').length;
    const unsolvedIssues = filteredIssues.filter(issue => issue.status === 'unsolved').length;
    const analyzedIssues = filteredIssues.filter(issue => issue.status === 'unsolved' && (issue.effectiveWorkflowStatus || issue.workflowStatus) === 'analyzed').length;
    const catalyzedIssues = filteredIssues.filter(issue => issue.status === 'unsolved' && (issue.effectiveWorkflowStatus || issue.workflowStatus) === 'catalyzed').length;
    const newIssues = Math.max(unsolvedIssues - analyzedIssues - catalyzedIssues, 0);
    const resolvedIssues = solvedIssues; // alias for UI card
    
    // Calculate priority counts from filtered issues
    let highPriority = 0;
    let mediumPriority = 0;
    let lowPriority = 0;
    let criticalPriority = 0;
    
    filteredIssues.forEach(issue => {
      const dynamicPriority = calculateDynamicPriority(issue);
      const priority = dynamicPriority.finalPriority;
      
      if (priority === 'critical') criticalPriority++;
      else if (priority === 'high') highPriority++;
      else if (priority === 'medium') mediumPriority++;
      else if (priority === 'low') lowPriority++;
    });
    
    return {
      totalIssues,
      analyzedIssues,
      catalyzedIssues,
      resolvedIssues,
      solvedIssues,
      unsolvedIssues,
      newIssues,
      highPriority,
      mediumPriority,
      lowPriority,
      criticalPriority
    };
  };

  // Build dynamic categories that mirror the Issue Categorizer options
  const computedIssueCategories = React.useMemo(() => {
    const meta = {
      clinical: { name: 'Clinical', icon: AlertCircle, color: 'from-red-500 to-red-600' },
      operational: { name: 'Operational', icon: Settings, color: 'from-green-500 to-green-600' },
      queries: { name: 'Queries', icon: HelpCircle, color: 'from-purple-500 to-purple-600' },
      technical: { name: 'Technical error', icon: Cpu, color: 'from-blue-500 to-blue-600' },
      followup: { name: 'Follow up mails', icon: Mail, color: 'from-orange-500 to-orange-600' },
      enquiry: { name: 'Enquiry mails', icon: MessageSquare, color: 'from-indigo-500 to-indigo-600' }
    };

    const buckets = Object.entries(meta).reduce((acc, [key, m]) => {
      acc[key] = { ...m, count: 0, issues: [] };
      return acc;
    }, {});

    const allIssues = getAllIssues();

    const toEffectiveCategory = (issue) => {
      const saved = issueCategorizationData[issue.id];
      if (saved?.type && buckets[saved.type]) return saved.type;
      if (issue.issueCategory && buckets[issue.issueCategory]) return issue.issueCategory;
      return null; // not shown until categorized
    };

    allIssues.forEach(issue => {
      const key = toEffectiveCategory(issue);
      if (!key) return;
      buckets[key].issues.push(issue);
    });

    Object.values(buckets).forEach(cat => { cat.count = cat.issues.length; });
    return buckets;
  }, [issueCategorizationData, priorityFilter, regionTypeFilter, regionNameFilter, channelFilter]);

  // Persona data for detailed profiles
  const personaData = {
    'sarah-johnson': {
      id: 'sarah-johnson',
      name: 'Dr. Sarah Johnson',
      title: 'Chief Executive Officer',
      avatar: 'SJ',
      email: 'sarah.johnson@healthcare.com',
      phone: '+1 (555) 123-4567',
      jobTitle: 'CEO',
      birthdate: 'March 15, 1975',
      likes: 'Strategic planning, golf, classical music',
      dislikes: 'Last-minute changes, disorganized meetings',
      closenessScore: 85,
      relationshipStrength: 'Very Strong',
      lastContact: '1 day ago',
      totalCalls: 12,
      totalEmails: 28
    },
    'michael-chen': {
      id: 'michael-chen',
      name: 'Dr. Michael Chen',
      title: 'Chief Medical Officer',
      avatar: 'MC',
      email: 'michael.chen@healthcare.com',
      phone: '+1 (555) 123-4568',
      jobTitle: 'CMO',
      birthdate: 'July 22, 1978',
      likes: 'Medical research, tennis, jazz music',
      dislikes: 'Administrative delays, poor communication',
      closenessScore: 78,
      relationshipStrength: 'Strong',
      lastContact: '2 days ago',
      totalCalls: 8,
      totalEmails: 15
    },
    'emily-rodriguez': {
      id: 'emily-rodriguez',
      name: 'Emily Rodriguez',
      title: 'Chief Financial Officer',
      avatar: 'ER',
      email: 'emily.rodriguez@healthcare.com',
      phone: '+1 (555) 123-4569',
      jobTitle: 'CFO',
      birthdate: 'November 8, 1980',
      likes: 'Financial analysis, hiking, classical literature',
      dislikes: 'Budget cuts, unclear requirements',
      closenessScore: 72,
      relationshipStrength: 'Good',
      lastContact: '3 days ago',
      totalCalls: 6,
      totalEmails: 22
    }
  };

  // Organization Chart Data
  const organizationData = [
    {
      id: 'ceo',
      name: 'Sarah Johnson',
      title: 'Chief Executive Officer',
      role: 'Executive',
      avatar: 'SJ',
      level: 1,
      parent: null,
      contact: { phone: '+1-555-0101', email: 'sarah.johnson@company.com' },
      personaId: 'sarah-johnson'
    },
    {
      id: 'cmo',
      name: 'Michael Chen',
      title: 'Chief Medical Officer',
      role: 'Executive',
      avatar: 'MC',
      level: 2,
      parent: 'ceo',
      contact: { phone: '+1-555-0102', email: 'michael.chen@company.com' },
      personaId: 'michael-chen'
    },
    {
      id: 'cfo',
      name: 'Emily Rodriguez',
      title: 'Chief Financial Officer',
      role: 'Executive',
      avatar: 'ER',
      level: 2,
      parent: 'ceo',
      contact: { phone: '+1-555-0103', email: 'emily.rodriguez@company.com' },
      personaId: 'emily-rodriguez'
    },
    {
      id: 'dir1',
      name: 'David Wilson',
      title: 'Director of Operations',
      role: 'Director',
      avatar: 'DW',
      level: 3,
      parent: 'cmo',
      contact: { phone: '+1-555-0104', email: 'david.wilson@company.com' }
    },
    {
      id: 'mgr1',
      name: 'Lisa Thompson',
      title: 'Patient Care Manager',
      role: 'Manager',
      avatar: 'LT',
      level: 4,
      parent: 'dir1',
      contact: { phone: '+1-555-0105', email: 'lisa.thompson@company.com' }
    }
  ];

  // Customer Success Tracking Data
  const customerSuccessMetrics = {
    score: 87,
    trend: 'up',
    factors: [
      { name: 'Document Processing', score: 85, weight: 25 },
      { name: 'Billing Accuracy', score: 94, weight: 20 },
      { name: 'Response Time', score: 78, weight: 15 },
      { name: 'Issue Resolution', score: 81, weight: 10 }
    ]
  };

  // Helper functions for issue management
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const openIssueResolutionPanel = (issue) => {
    setIssueResolutionPanel({
      open: true,
      issue: issue,
      activeTab: 'details'
    });
  };

  const closeIssueResolutionPanel = () => {
    setIssueResolutionPanel({
      open: false,
      issue: null,
      activeTab: 'details'
    });
  };

  // Contact functionality - exactly like the HTML version
  const contactVia = (method, contact) => {
    switch(method) {
      case 'call':
        // Open phone app with the number
        window.open(`tel:${contact.phone}`, '_blank');
        break;
      case 'email':
        // Open email client with pre-filled recipient
        const subject = contact.subject || `Customer Success Follow-up`;
        const body = contact.body || `Hello ${selectedProfile2?.name || 'there'},`;
        const emailUrl = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(emailUrl, '_blank');
        break;
      case 'sms':
        // Open SMS app with the phone number
        const smsBody = `Hello ${selectedProfile2?.name || 'there'}, `;
        if (/iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)) {
          // iOS/macOS
          window.open(`sms:${contact.phone}&body=${encodeURIComponent(smsBody)}`, '_blank');
        } else {
          // Android/Windows
          window.open(`sms:${contact.phone}?body=${encodeURIComponent(smsBody)}`, '_blank');
        }
        break;
      case 'meet':
        // Open video meeting (you can customize this to use Zoom, Teams, Google Meet, etc.)
        const meetingSubject = `Customer Success Meeting with ${selectedProfile2?.name || 'Team'}`;
        const meetingBody = `Hello ${selectedProfile2?.name || 'there'},\n\nI would like to schedule a video meeting to discuss your customer success metrics and any support you might need.\n\nBest regards`;
        
        // Try to open Google Meet (you can change this to your preferred platform)
        const googleMeetUrl = `https://meet.google.com/new`;
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingSubject)}&details=${encodeURIComponent(meetingBody)}&add=${encodeURIComponent(contact.email)}`;
        
        // Open calendar to schedule the meeting
        window.open(calendarUrl, '_blank');
        break;
      default:
        console.log('Unknown contact method:', method);
    }
  };

  // Helper functions for document data
  const getDocumentCount = (documentType) => {
    const counts = {
      'Processed Documents': 3456,
      'Prepared Documents': 2847,
      'Signed Documents': 2234,
      'Unsigned Documents': 613
    };
    return counts[documentType] || 0;
  };

  const getDocumentList = (documentType) => {
    const mockDocuments = {
      'Processed Documents': [
        { id: 'DOC-001', name: '485 Certification - John Smith', patientName: 'John Smith', status: 'Processed', date: '2024-01-15' },
        { id: 'DOC-002', name: 'F2F Assessment - Jane Doe', patientName: 'Jane Doe', status: 'Processed', date: '2024-01-14' },
        { id: 'DOC-003', name: 'Orders Review - Mike Johnson', patientName: 'Mike Johnson', status: 'Processed', date: '2024-01-13' },
        { id: 'DOC-004', name: 'SOC Documentation - Sarah Wilson', patientName: 'Sarah Wilson', status: 'Processed', date: '2024-01-12' },
        { id: 'DOC-005', name: '485 Recertification - Robert Brown', patientName: 'Robert Brown', status: 'Processed', date: '2024-01-11' }
      ],
      'Prepared Documents': [
        { id: 'DOC-006', name: '485 Certification - Alice Green', patientName: 'Alice Green', status: 'Prepared', date: '2024-01-10' },
        { id: 'DOC-007', name: 'F2F Assessment - Bob White', patientName: 'Bob White', status: 'Prepared', date: '2024-01-09' },
        { id: 'DOC-008', name: 'Orders Review - Carol Black', patientName: 'Carol Black', status: 'Prepared', date: '2024-01-08' },
        { id: 'DOC-009', name: 'SOC Documentation - David Blue', patientName: 'David Blue', status: 'Prepared', date: '2024-01-07' }
      ],
      'Signed Documents': [
        { id: 'DOC-010', name: '485 Certification - Emma Red', patientName: 'Emma Red', status: 'Signed', date: '2024-01-06' },
        { id: 'DOC-011', name: 'F2F Assessment - Frank Yellow', patientName: 'Frank Yellow', status: 'Signed', date: '2024-01-05' },
        { id: 'DOC-012', name: 'Orders Review - Grace Orange', patientName: 'Grace Orange', status: 'Signed', date: '2024-01-04' }
      ],
      'Unsigned Documents': [
        { id: 'DOC-013', name: '485 Certification - Henry Purple', patientName: 'Henry Purple', status: 'Unsigned', date: '2024-01-03' },
        { id: 'DOC-014', name: 'F2F Assessment - Irene Pink', patientName: 'Irene Pink', status: 'Unsigned', date: '2024-01-02' }
      ]
    };
    return mockDocuments[documentType] || [];
  };

  const getClaimsCount = (claimsType) => {
    const counts = {
      'Claims Submitted': 2158,
      'Claims Rejected': 23,
      'Revenue Generated': 1200000,
      'Patient Episode Billability': 98.9
    };
    return counts[claimsType] || 0;
  };

  const getClaimsList = (claimsType) => {
    const mockClaims = {
      'Claims Submitted': [
        { id: 'CLM-001', patientName: 'John Smith', amount: 1250, status: 'Submitted', date: '2024-01-15', type: '485 Certification' },
        { id: 'CLM-002', patientName: 'Jane Doe', amount: 980, status: 'Submitted', date: '2024-01-14', type: 'F2F Assessment' },
        { id: 'CLM-003', patientName: 'Mike Johnson', amount: 2100, status: 'Submitted', date: '2024-01-13', type: 'Orders Review' },
        { id: 'CLM-004', patientName: 'Sarah Wilson', amount: 1750, status: 'Submitted', date: '2024-01-12', type: 'SOC Documentation' }
      ],
      'Claims Rejected': [
        { id: 'CLM-005', patientName: 'Alice Green', amount: 850, status: 'Rejected', date: '2024-01-11', reason: 'Missing Documentation' },
        { id: 'CLM-006', patientName: 'Bob White', amount: 1200, status: 'Rejected', date: '2024-01-10', reason: 'Invalid Codes' }
      ],
      'Revenue Generated': [
        { id: 'REV-001', patientName: 'Carol Black', amount: 1500, status: 'Paid', date: '2024-01-15', type: 'Episode Billability' },
        { id: 'REV-002', patientName: 'David Blue', amount: 2200, status: 'Paid', date: '2024-01-14', type: 'Certification' },
        { id: 'REV-003', patientName: 'Emma Red', amount: 1800, status: 'Paid', date: '2024-01-13', type: 'Assessment' }
      ],
      'Patient Episode Billability': [
        { id: 'EP-001', patientName: 'Frank Yellow', billability: 100, status: 'Fully Billable', date: '2024-01-15', episode: 'Episode 1' },
        { id: 'EP-002', patientName: 'Grace Orange', billability: 95, status: 'Mostly Billable', date: '2024-01-14', episode: 'Episode 2' },
        { id: 'EP-003', patientName: 'Henry Purple', billability: 100, status: 'Fully Billable', date: '2024-01-13', episode: 'Episode 3' }
      ]
    };
    return mockClaims[claimsType] || [];
  };

  const getAdminCount = (adminType) => {
    const counts = {
      'Avg Response Time': 2.4,
      'Task Completion': 97,
      'Workflow Efficiency': 92,
      'Staff Utilization': 89
    };
    return counts[adminType] || 0;
  };

  const getAdminList = (adminType) => {
    const mockAdmin = {
      'Avg Response Time': [
        { id: 'TASK-001', task: 'Patient Inquiry Response', responseTime: 1.2, staff: 'Sarah Johnson', date: '2024-01-15', status: 'Completed' },
        { id: 'TASK-002', task: 'Document Review', responseTime: 3.1, staff: 'Mike Chen', date: '2024-01-14', status: 'Completed' },
        { id: 'TASK-003', task: 'Claims Processing', responseTime: 2.8, staff: 'Lisa Davis', date: '2024-01-13', status: 'Completed' }
      ],
      'Task Completion': [
        { id: 'TASK-004', task: 'Patient Onboarding', completion: 100, staff: 'John Smith', date: '2024-01-15', status: 'Completed' },
        { id: 'TASK-005', task: 'Document Verification', completion: 95, staff: 'Amy Wilson', date: '2024-01-14', status: 'In Progress' },
        { id: 'TASK-006', task: 'Billing Review', completion: 100, staff: 'Tom Brown', date: '2024-01-13', status: 'Completed' }
      ],
      'Workflow Efficiency': [
        { id: 'WF-001', process: 'Patient Intake', efficiency: 95, staff: 'Team A', date: '2024-01-15', status: 'Optimized' },
        { id: 'WF-002', process: 'Document Processing', efficiency: 88, staff: 'Team B', date: '2024-01-14', status: 'Good' },
        { id: 'WF-003', process: 'Claims Submission', efficiency: 92, staff: 'Team C', date: '2024-01-13', status: 'Optimized' }
      ],
      'Staff Utilization': [
        { id: 'STAFF-001', name: 'Sarah Johnson', utilization: 95, department: 'Patient Care', date: '2024-01-15', status: 'High' },
        { id: 'STAFF-002', name: 'Mike Chen', utilization: 87, department: 'Documentation', date: '2024-01-14', status: 'Good' },
        { id: 'STAFF-003', name: 'Lisa Davis', utilization: 92, department: 'Billing', date: '2024-01-13', status: 'High' }
      ]
    };
    return mockAdmin[adminType] || [];
  };

  // Calculate issue statistics with useMemo to optimize performance
  const issueStatistics = useMemo(() => {
    return calculateIssueStatistics();
  }, [regionTypeFilter, regionNameFilter, categoryFilter, channelFilter, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Customer Success Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {setSelectedSubNode(statsData.patient); setSubNodeModalOpen(true);}}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Users className="w-5 h-5" />
                Patient Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800 mb-1">1,247</div>
              <div className="text-sm text-blue-600">Total Patients</div>
              <div className="text-lg font-semibold text-blue-700 mt-2">86% Satisfaction</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Document Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {setSelectedSubNode(statsData.document); setSubNodeModalOpen(true);}}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-700">
                <FileText className="w-5 h-5" />
                Document Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-800 mb-1">3,456</div>
              <div className="text-sm text-green-600">Processed Docs</div>
              <div className="text-lg font-semibold text-green-700 mt-2">97% Success Rate</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims & Billing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {setSelectedSubNode(statsData.billing); setSubNodeModalOpen(true);}}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <DollarSign className="w-5 h-5" />
                Claims & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-800 mb-1">$1.2M</div>
              <div className="text-sm text-purple-600">Revenue Generated</div>
              <div className="text-lg font-semibold text-purple-700 mt-2">98.9% Billability</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Efficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-amber-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => {setSelectedSubNode(statsData.admin); setSubNodeModalOpen(true);}}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Activity className="w-5 h-5" />
                Admin Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800 mb-1">97%</div>
              <div className="text-sm text-orange-600">Task Completion</div>
              <div className="text-lg font-semibold text-orange-700 mt-2">2.4hrs Response</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Communication Flow Chart */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            Customer Success Communication Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {communicationSubNodes.map((node, index) => {
              const IconComponent = node.icon;
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => {setSelectedSubNode(statsData[node.id]); setSubNodeModalOpen(true);}}
                >
                  <Card className={`shadow-lg border-0 bg-gradient-to-br ${node.color} text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <IconComponent className="w-8 h-8" />
                        <ArrowRight className="w-5 h-5 opacity-70" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                      <p className="text-sm opacity-90">{node.tooltip}</p>
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <div className="text-2xl font-bold">
                          {node.id === 'achievements' && '156hrs'}
                          {node.id === 'risks' && '23'}
                          {node.id === 'opportunities' && '$18.5K'}
                        </div>
                        <div className="text-xs opacity-80">
                          {node.id === 'achievements' && 'Time Saved'}
                          {node.id === 'risks' && 'Issues Identified'}
                          {node.id === 'opportunities' && 'Revenue Potential'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {/* Executive Summary Button */}
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={() => setExecutiveSummaryOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Trophy className="w-5 h-5 mr-2" />
              Generate Executive Summary
            </Button>
          </div>
        </CardContent>
      </Card>



      {/* Side-by-side Layout: Issue Categorization & Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Issue Categorization System - Takes 3/4 of the width */}
        <div className="lg:col-span-3">
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Issue Categorization & Resolution System
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Active Filter Indicator */}
          {priorityFilter !== 'all' && (
            <div className="mb-4 flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-900">
                  Active Filter: <span className="capitalize">{priorityFilter}</span>
                </span>
            </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPriorityFilter('all')}
                className="flex items-center gap-2 hover:bg-indigo-100"
              >
                <XCircle className="w-4 h-4" />
                Clear Filter
              </Button>
            </div>
          )}

          {/* Issue Statistics & Priority Filter */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            {/* Status Filter Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
              {/* All Status */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  statusFilter === 'all' ? 'border-gray-600 ring-2 ring-gray-300' : 'border-gray-200'
                }`}
                onClick={() => setStatusFilter('all')}
              >
                <div className="text-2xl font-bold text-gray-800">{issueStatistics.totalIssues}</div>
                <div className="text-sm text-gray-600 font-medium">All</div>
              </motion.div>
              
              {/* New Status */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  statusFilter === 'new' ? 'border-yellow-600 ring-2 ring-yellow-300' : 'border-yellow-200'
                }`}
                onClick={() => {
                  setStatusFilter('new');
                  setUnsolvedModalOpen(true);
                }}
              >
                <div className="text-2xl font-bold text-yellow-800">{issueStatistics.newIssues}</div>
                <div className="text-sm text-yellow-600 font-medium">New</div>
              </motion.div>
              
              {/* Analyzed Status */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  statusFilter === 'analyzed' ? 'border-blue-600 ring-2 ring-blue-300' : 'border-blue-200'
                }`}
                onClick={() => setStatusFilter('analyzed')}
              >
                <div className="text-2xl font-bold text-blue-800">{issueStatistics.analyzedIssues}</div>
                <div className="text-sm text-blue-600 font-medium">Analyzed</div>
              </motion.div>
              
              {/* Catalyzed Status */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  statusFilter === 'catalyzed' ? 'border-purple-600 ring-2 ring-purple-300' : 'border-purple-200'
                }`}
                onClick={() => setStatusFilter('catalyzed')}
              >
                <div className="text-2xl font-bold text-purple-800">{issueStatistics.catalyzedIssues}</div>
                <div className="text-sm text-purple-600 font-medium">Catalyzed</div>
              </motion.div>
              
              {/* Resolved Status */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  statusFilter === 'resolved' ? 'border-green-600 ring-2 ring-green-300' : 'border-green-200'
                }`}
                onClick={() => setStatusFilter('resolved')}
              >
                <div className="text-2xl font-bold text-green-800">{issueStatistics.resolvedIssues}</div>
                <div className="text-sm text-green-600 font-medium">Resolved</div>
              </motion.div>
            </div>

            {/* Priority Filter Dropdown */}
            <div className="w-full lg:w-64">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm hover:border-gray-400 transition-colors text-sm font-medium"
              >
                <option value="all">All Priorities ({issueStatistics.totalIssues})</option>
                <option value="critical">🔴 Critical ({issueStatistics.criticalPriority})</option>
                <option value="high">🟡 High Priority ({issueStatistics.highPriority})</option>
                <option value="medium">🔵 Medium Priority ({issueStatistics.mediumPriority})</option>
                <option value="low">🟣 Low Priority ({issueStatistics.lowPriority})</option>
              </select>
            </div>
            </div>

          {/* Advanced Filters Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                Advanced Filters
              </h3>
              {hasAdvancedFiltersActive() && (
                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
                >
                  <XCircle className="w-4 h-4" />
                  Clear All Filters
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Region Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region Type
                </label>
                <select
                  value={regionTypeFilter}
                  onChange={(e) => setRegionTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="division">Division</option>
                  <option value="divisionalGroup">Divisional Group</option>
                  <option value="msa">MSA</option>
                  <option value="gsa">GSA</option>
                </select>
            </div>

              {/* Region Name Filter (Dynamic) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region Name
                </label>
                <select
                  value={regionNameFilter}
                  onChange={(e) => setRegionNameFilter(e.target.value)}
                  disabled={regionTypeFilter === 'all'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="all">All Regions</option>
                  {getAvailableRegions().map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="clinical">Clinical</option>
                  <option value="operational">Operational/Patient Services</option>
                  <option value="queries">Queries</option>
                </select>
              </div>

              {/* Channel Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel
                </label>
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
                >
                  <option value="all">All Channels</option>
                  <option value="email">Email</option>
                  <option value="ticket">Ticket</option>
                  <option value="call">Call</option>
                </select>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {hasAdvancedFiltersActive() && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                {regionTypeFilter !== 'all' && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Region Type: {regionTypeFilter}
                  </Badge>
                )}
                {regionNameFilter !== 'all' && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Region: {regionNameFilter}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Category: {categoryFilter}
                  </Badge>
                )}
                {channelFilter !== 'all' && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Channel: {channelFilter}
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Issue Categories Flowchart */}
          <div className="space-y-8">
            <div className="text-center">
              <Button
                onClick={() => setIssueFlowchartOpen(!issueFlowchartOpen)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                {issueFlowchartOpen ? 'Hide' : 'Show'} Issue Categorization Tree
              </Button>
            </div>

            {issueFlowchartOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Main Issues Node */}
                <div className="text-center">
                  <div 
                    className="inline-block cursor-pointer p-6 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => toggleNode('main-issues')}
                  >
                    <div className="flex items-center gap-2">
                      <Bug className="w-6 h-6" />
                      <span className="font-bold text-lg">All Issues ({issueStatistics.totalIssues})</span>
                      {expandedNodes.has('main-issues') ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Issue Categories - mirroring categorizer names */}
                {expandedNodes.has('main-issues') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                  >
                    {Object.entries(computedIssueCategories).map(([key, category]) => {
                      const IconComponent = category.icon;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card 
                            className={`cursor-pointer shadow-lg border-0 bg-gradient-to-br ${category.color} text-white hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                            onClick={() => toggleNode(key)}
                          >
                            <CardContent className="p-6 text-center">
                              <IconComponent className="w-8 h-8 mx-auto mb-3" />
                              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                              <div className="text-2xl font-bold mb-1">{applyAdvancedFilters(category.issues.map(issue => ({...issue, issueCategory: (issueCategorizationData[issue.id]?.type || issue.issueCategory)}))).length}</div>
                              <div className="text-sm opacity-90">Issues</div>
                              <div className="mt-3 flex items-center justify-center">
                                {expandedNodes.has(key) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {/* Individual Issues - driven by categorizer categories */}
                {Object.entries(computedIssueCategories).map(([categoryKey, category]) => (
                  expandedNodes.has(categoryKey) && (
                    <motion.div
                      key={`${categoryKey}-issues`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <h4 className="text-lg font-semibold mb-4 text-center text-gray-700">
                        {category.name} - Individual Issues
                        {(priorityFilter !== 'all' || hasAdvancedFiltersActive()) && (
                          <Badge className="ml-2 bg-indigo-100 text-indigo-800">
                            Filtered: {applyAdvancedFilters(category.issues.map(issue => ({...issue, issueCategory: (issueCategorizationData[issue.id]?.type || issue.issueCategory)}))).length} of {category.issues.length}
                          </Badge>
                        )}
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {applyAdvancedFilters(category.issues.map(issue => ({...issue, issueCategory: (issueCategorizationData[issue.id]?.type || issue.issueCategory)}))).map((issue, index) => (
                          <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card 
                              className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300"
                              onClick={() => openIssueResolutionPanel(issue)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-gray-800">{issue.title}</h5>
                                  <Badge 
                                    className={`text-xs ${
                                      issue.priority === 'critical' ? 'bg-red-100 text-red-800' :
                                      issue.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                                      issue.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                      'bg-purple-100 text-purple-800'
                                    }`}
                                  >
                                    {issue.priority.toUpperCase()}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>ID: {issue.id.replace(/^\D+/, '')}</span>
                                  <div className="flex items-center gap-2">
                                    {issue.status === 'solved' ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                    <span className={issue.status === 'solved' ? 'text-green-600' : 'text-red-600'}>
                                      {issue.status.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
        </div>

        {/* Customer Information & Success Tracker - Takes 1/4 of the width */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                Customer Information & Success Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-100 p-4 rounded-xl border border-indigo-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      PG
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-indigo-800">Premium Group Healthcare</h3>
                      <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                        Enterprise Customer
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-xs font-medium text-indigo-600">Contract Start</div>
                      <div className="text-sm font-bold text-indigo-800">Jan 2024</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-indigo-600">Total Users</div>
                      <div className="text-sm font-bold text-indigo-800">1,247</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-indigo-600">Active Agencies</div>
                      <div className="text-sm font-bold text-indigo-800">24</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-indigo-600">Support Tier</div>
                      <div className="text-sm font-bold text-indigo-800">Premium</div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setOrganisationChartOpen(true)}
                    className="flex items-center gap-2 w-full mt-3"
                  >
                    <GitBranch className="w-4 h-4" />
                    Org Chart
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-800 mb-1">{customerSuccessMetrics.score}%</div>
                    <div className="text-sm font-medium text-green-600">Customer Success Score</div>
                    <div className="mt-2">
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${customerSuccessMetrics.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {customerSuccessMetrics.factors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-700">{factor.name}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-12 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-indigo-500 h-1 rounded-full"
                              style={{ width: `${factor.score}%` }}
                            />
                          </div>
                          <span className="text-indigo-600 font-medium text-xs">{factor.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sub-node Statistics Modal */}
      <Dialog open={subNodeModalOpen} onOpenChange={setSubNodeModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedSubNode?.title}</DialogTitle>
            <DialogDescription>
              Detailed statistics and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubNode && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {selectedSubNode.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="p-4 text-center bg-gradient-to-br from-indigo-50 to-blue-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      if (selectedSubNode?.title === 'Document Flow Statistics' && 
                          ['Processed Documents', 'Prepared Documents', 'Signed Documents', 'Unsigned Documents'].includes(stat.label)) {
                        setSelectedDocumentType(stat.label);
                        setDocumentListModalOpen(true);
                      } else if (selectedSubNode?.title === 'Claims & Billing Statistics' && 
                          ['Claims Submitted', 'Claims Rejected', 'Revenue Generated', 'Patient Episode Billability'].includes(stat.label)) {
                        setSelectedClaimsType(stat.label);
                        setClaimsListModalOpen(true);
                      } else if (selectedSubNode?.title === 'Admin Efficiency Statistics' && 
                          ['Avg Response Time', 'Task Completion', 'Workflow Efficiency', 'Staff Utilization'].includes(stat.label)) {
                        setSelectedAdminType(stat.label);
                        setAdminListModalOpen(true);
                      } else {
                        setSelectedStatCard(stat.label);
                        setStatDetailModalOpen(true);
                      }
                    }}
                  >
                    <div className="text-2xl font-bold text-indigo-800">{stat.value}</div>
                    <div className="text-sm text-indigo-600 mt-1">{stat.label}</div>
                    <div className="text-xs text-indigo-500 mt-2">Click for details</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stat Detail Modal */}
      <Dialog open={statDetailModalOpen} onOpenChange={setStatDetailModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              {selectedStatCard} Details
            </DialogTitle>
            <DialogDescription>
              Complete list of {selectedStatCard?.toLowerCase()} with detailed information
            </DialogDescription>
          </DialogHeader>
          
          {selectedStatCard && detailedStatsData[selectedStatCard] && (
            <div className="space-y-4">
              {selectedStatCard === 'Avg Satisfaction' ? (
                // Satisfaction Chart View
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-green-700 bg-green-50">
                      Overall Satisfaction: {detailedStatsData[selectedStatCard].data.overallScore}%
                    </Badge>
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </div>

                  {/* Overall Score Display */}
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                    <div className="text-6xl font-bold text-green-600 mb-2">
                      {detailedStatsData[selectedStatCard].data.overallScore}%
                    </div>
                    <div className="text-lg text-green-700 font-semibold">Overall Satisfaction Score</div>
                    <div className="text-sm text-green-600 mt-2">Based on patient feedback and surveys</div>
                  </div>

                  {/* Breakdown by Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {detailedStatsData[selectedStatCard].data.breakdown.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-700">{item.category}</span>
                          <span className="text-lg font-bold text-gray-800">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              item.color === 'green' ? 'bg-green-500' :
                              item.color === 'blue' ? 'bg-blue-500' :
                              item.color === 'orange' ? 'bg-orange-500' :
                              'bg-purple-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Trend Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Monthly Trend</h4>
                      <div className="flex items-end gap-2 h-20">
                        {detailedStatsData[selectedStatCard].data.trends.monthly.map((value, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="bg-blue-500 rounded-t w-full transition-all duration-500"
                              style={{ height: `${(value / 100) * 60}px` }}
                            ></div>
                            <span className="text-xs text-gray-600 mt-1">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-700 mb-3">Quarterly Trend</h4>
                      <div className="flex items-end gap-2 h-20">
                        {detailedStatsData[selectedStatCard].data.trends.quarterly.map((value, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div 
                              className="bg-green-500 rounded-t w-full transition-all duration-500"
                              style={{ height: `${(value / 100) * 60}px` }}
                            ></div>
                            <span className="text-xs text-gray-600 mt-1">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                // List View for other stats
                <>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-blue-700 bg-blue-50">
                      Total: {detailedStatsData[selectedStatCard].length} {selectedStatCard}
                    </Badge>
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </div>

                  {selectedStatCard === 'Total Patients' ? (
                    // Card-style layout for Total Patients
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {/* Profile Icon */}
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-purple-600" />
                            </div>
                            
                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Age: <span className="font-medium">{patient.age}</span></span>
                                    <span className="text-gray-600">Diagnosis: <span className="font-medium">{patient.diagnosis}</span></span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Status: 
                                      <Badge className={`ml-1 ${
                                        patient.status === 'Active' 
                                          ? 'bg-gray-800 text-white' 
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {patient.status}
                                      </Badge>
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                    <span>Admitted: <span className="font-medium">{patient.admissionDate}</span></span>
                                    <span>Agency: <span className="font-medium">{patient.agency}</span></span>
                                  </div>
                                </div>
                                
                                {/* Dashboard Link */}
                                <div className="flex-shrink-0">
                                  <Button 
                                    variant="link" 
                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                                    onClick={() => alert(`Opening dashboard for ${patient.name}`)}
                                  >
                                    Click to view dashboard →
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Agency Count' ? (
                    // Card-style layout for Agency Count
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((agency) => (
                        <Card key={agency.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {/* Agency Icon */}
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-6 h-6 text-green-600" />
                            </div>
                            
                            {/* Agency Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{agency.name}</h3>
                                  <p className="text-sm text-gray-600">{agency.address}</p>
                                  
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Patients: <span className="font-medium">{agency.patients}</span></span>
                                    <span className="text-gray-600">Rating: <span className="font-medium flex items-center gap-1">
                                      {agency.rating} <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                    </span></span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                    <span>Contact: <span className="font-medium">{agency.contact}</span></span>
                                    <span>Phone: <span className="font-medium">{agency.phone}</span></span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-gray-600">Services:</span>
                                    {agency.services.map((service, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Dashboard Link */}
                                <div className="flex-shrink-0">
                                  <Button 
                                    variant="link" 
                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                                    onClick={() => alert(`Opening HHA dashboard for ${agency.name}`)}
                                  >
                                    Click to view HHA dashboard →
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'New Patients' ? (
                    // Card-style layout for New Patients
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            {/* Profile Icon */}
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            
                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Age: <span className="font-medium">{patient.age}</span></span>
                                    <span className="text-gray-600">Diagnosis: <span className="font-medium">{patient.diagnosis}</span></span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Status: 
                                      <Badge className="ml-1 bg-blue-100 text-blue-800">
                                        {patient.status}
                                      </Badge>
                                    </span>
                                    <span className="text-gray-600">Admitted: <span className="font-medium">{patient.admissionDate}</span></span>
                                  </div>
                                </div>
                                
                                {/* Dashboard Link */}
                                <div className="flex-shrink-0">
                                  <Button 
                                    variant="link" 
                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                                    onClick={() => alert(`Opening dashboard for ${patient.name}`)}
                                  >
                                    Click to view dashboard →
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Time Saved' ? (
                    // Time Saved details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.task}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Time Saved: <span className="font-medium text-green-600">{item.timeSaved}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Revenue Generated' ? (
                    // Revenue Generated details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.source}</h3>
                                  <p className="text-sm text-gray-600">Patient: {item.patient}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Amount: <span className="font-medium text-green-600">{item.amount}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Billed Patients' ? (
                    // Billed Patients details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Diagnosis: <span className="font-medium">{patient.diagnosis}</span></span>
                                    <span className="text-gray-600">Code: <span className="font-medium">{patient.billingCode}</span></span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Amount: <span className="font-medium text-green-600">{patient.amount}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{patient.date}</span></span>
                                    <Badge className="bg-green-100 text-green-800">{patient.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : ['G0181 Segregation', 'G0182 Segregation', 'G0179 Segregation', 'G0180 Segregation'].includes(selectedStatCard) ? (
                    // G-Code Segregation details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.patient}</h3>
                                  <p className="text-sm text-gray-600">MRN: {item.mrn}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Amount: <span className="font-medium text-green-600">{item.amount}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                    <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Decrease in Document Inflow' ? (
                    // Document Inflow details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.documentType}</h3>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Previous: <span className="font-medium">{item.previousCount}</span></span>
                                    <span className="text-gray-600">Current: <span className="font-medium">{item.currentCount}</span></span>
                                    <span className="text-gray-600">Decrease: <span className="font-medium text-red-600">{item.decrease}</span></span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Unbilled Patients' ? (
                    // Unbilled Patients details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Diagnosis: <span className="font-medium">{patient.diagnosis}</span></span>
                                    <span className="text-gray-600">Days Unbilled: <span className="font-medium text-red-600">{patient.daysUnbilled}</span></span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Reason: <span className="font-medium">{patient.reason}</span></span>
                                    <Badge className="bg-red-100 text-red-800">{patient.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Unprepared Document Count' ? (
                    // Unprepared Documents details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((doc) => (
                        <Card key={doc.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <FileX className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{doc.documentType}</h3>
                                  <p className="text-sm text-gray-600">Patient: {doc.patient} (MRN: {doc.mrn})</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Date: <span className="font-medium">{doc.date}</span></span>
                                    <span className="text-gray-600">Reason: <span className="font-medium text-orange-600">{doc.reason}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Rapport Deteriorate' ? (
                    // Rapport Deteriorate details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.patient}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Previous: <span className="font-medium">{patient.previousScore}%</span></span>
                                    <span className="text-gray-600">Current: <span className="font-medium text-red-600">{patient.currentScore}%</span></span>
                                    <span className="text-gray-600">Decrease: <span className="font-medium text-red-600">{patient.decrease}</span></span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Reason: <span className="font-medium">{patient.reason}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Increased Revenue Generation' ? (
                    // Revenue Generation details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.source}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Amount: <span className="font-medium text-green-600">{item.amount}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'New Patient Count' ? (
                    // New Patient Count details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((patient) => (
                        <Card key={patient.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <UserPlus className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{patient.name}</h3>
                                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Age: <span className="font-medium">{patient.age}</span></span>
                                    <span className="text-gray-600">Diagnosis: <span className="font-medium">{patient.diagnosis}</span></span>
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm">
                                    <span className="text-gray-600">Admitted: <span className="font-medium">{patient.admissionDate}</span></span>
                                    <Badge className="bg-blue-100 text-blue-800">{patient.status}</Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Admin Time Saved' ? (
                    // Admin Time Saved details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.task}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Time Saved: <span className="font-medium text-green-600">{item.timeSaved}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : selectedStatCard === 'Positive Things That Can Be Mentioned' ? (
                    // Positive Things details
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {detailedStatsData[selectedStatCard].map((item) => (
                        <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <ThumbsUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 text-lg">{item.category}</h3>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-gray-600">Impact: <span className="font-medium">{item.impact}</span></span>
                                    <span className="text-gray-600">Date: <span className="font-medium">{item.date}</span></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    // Fallback for other stats
                    <div className="text-center py-8 text-gray-500">
                      No data available for {selectedStatCard}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Billed Patients Modal */}
      <Dialog open={billedPatientsModalOpen} onOpenChange={setBilledPatientsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Billed Patients Report
            </DialogTitle>
            <DialogDescription>
              Complete list of successfully billed patients with details
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-green-700 bg-green-50">
                Total: {billedPatientsData.length} Patients Billed
              </Badge>
              <Button size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Billing Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Physician</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billedPatientsData.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.mrn}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.diagnosis}</TableCell>
                    <TableCell>{patient.billingDate}</TableCell>
                    <TableCell className="font-medium text-green-600">{patient.amount}</TableCell>
                    <TableCell>{patient.agency}</TableCell>
                    <TableCell>{patient.physician}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unprepared Documents Modal */}
      <Dialog open={unpreparedDocumentsModalOpen} onOpenChange={setUnpreparedDocumentsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-600" />
              Unprepared Documents Report
            </DialogTitle>
            <DialogDescription>
              Documents requiring attention and preparation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-orange-700 bg-orange-50">
                Total: {unpreparedDocumentsData.length} Documents Pending
              </Badge>
              <Button size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Date Received</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unpreparedDocumentsData.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.documentId}</TableCell>
                    <TableCell>{doc.patientName}</TableCell>
                    <TableCell>{doc.mrn}</TableCell>
                    <TableCell>{doc.documentType}</TableCell>
                    <TableCell>{doc.dateReceived}</TableCell>
                    <TableCell>{doc.reason}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          doc.priority === 'High' ? 'text-red-700 bg-red-50' :
                          doc.priority === 'Medium' ? 'text-orange-700 bg-orange-50' :
                          'text-gray-700 bg-gray-50'
                        }
                      >
                        {doc.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Claims Submitted Modal */}
      <Dialog open={claimsSubmittedModalOpen} onOpenChange={setClaimsSubmittedModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Claims Submitted Report
            </DialogTitle>
            <DialogDescription>
              Successfully submitted claims awaiting processing
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-blue-700 bg-blue-50">
                Total: {claimsSubmittedData.length} Claims Submitted
              </Badge>
              <Button size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Billing Code</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Physician</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claimsSubmittedData.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.claimId}</TableCell>
                    <TableCell>{claim.patientName}</TableCell>
                    <TableCell>{claim.mrn}</TableCell>
                    <TableCell className="font-medium text-blue-600">{claim.claimAmount}</TableCell>
                    <TableCell>{claim.submissionDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-blue-700 bg-blue-50">
                        {claim.billingCode}
                      </Badge>
                    </TableCell>
                    <TableCell>{claim.agency}</TableCell>
                    <TableCell>{claim.physician}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revenue Generated Modal */}
      <Dialog open={revenueGeneratedModalOpen} onOpenChange={setRevenueGeneratedModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-purple-600" />
              Revenue Generated Report
            </DialogTitle>
            <DialogDescription>
              Total revenue and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-emerald-100">
                <div className="text-3xl font-bold text-green-800">$1.2M</div>
                <div className="text-sm text-green-600 mt-1">Total Revenue</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-3xl font-bold text-blue-800">2,158</div>
                <div className="text-sm text-blue-600 mt-1">Claims Processed</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-violet-100">
                <div className="text-3xl font-bold text-purple-800">98.9%</div>
                <div className="text-sm text-purple-600 mt-1">Success Rate</div>
              </Card>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Revenue Breakdown by Service</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>G0181 (Therapy Services):</span>
                  <span className="font-medium">$450,000</span>
                </div>
                <div className="flex justify-between">
                  <span>G0182 (Social Services):</span>
                  <span className="font-medium">$320,000</span>
                </div>
                <div className="flex justify-between">
                  <span>G0179 (Home Health Aide):</span>
                  <span className="font-medium">$280,000</span>
                </div>
                <div className="flex justify-between">
                  <span>G0180 (Skilled Nursing):</span>
                  <span className="font-medium">$150,000</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Organization Chart Modal */}
      <Dialog open={organisationChartOpen} onOpenChange={setOrganisationChartOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="w-6 h-6 text-indigo-600" />
              Organization Chart
            </DialogTitle>
            <DialogDescription>
              Company organizational structure and contact information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {organizationData.map((person) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300"
                    onClick={() => {
                      if (person.personaId && personaData[person.personaId]) {
                        setSelectedPersona(personaData[person.personaId]);
                        setPersonaCardOpen(true);
                      } else {
                        setSelectedProfile2(person);
                        setProfileInterface2Open(true);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 ${
                        person.role === 'Executive' ? 'bg-indigo-600' :
                        person.role === 'Director' ? 'bg-blue-600' :
                        'bg-green-600'
                      }`}>
                        {person.avatar}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{person.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{person.title}</p>
                      <Badge className="text-xs bg-gray-100 text-gray-700">
                        {person.role}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Interface Modal */}
      <Dialog open={profileInterface2Open} onOpenChange={setProfileInterface2Open}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                selectedProfile2?.role === 'Executive' ? 'bg-indigo-600' :
                selectedProfile2?.role === 'Director' ? 'bg-blue-600' :
                'bg-green-600'
              }`}>
                {selectedProfile2?.avatar}
              </div>
              <div>
                <div className="text-xl font-bold">{selectedProfile2?.name}</div>
                <div className="text-sm text-gray-600">{selectedProfile2?.title}</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProfile2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => contactVia('call', selectedProfile2.contact)}
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200 hover:border-green-300 transition-all duration-200"
                  variant="outline"
                >
                  <Phone className="w-6 h-6" />
                  <span className="text-sm font-medium">Call</span>
                  <span className="text-xs opacity-70">{selectedProfile2.contact.phone}</span>
                </Button>

                <Button
                  onClick={() => contactVia('email', selectedProfile2.contact)}
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  variant="outline"
                >
                  <Mail className="w-6 h-6" />
                  <span className="text-sm font-medium">Email</span>
                  <span className="text-xs opacity-70 truncate">{selectedProfile2.contact.email}</span>
                </Button>

                <Button
                  onClick={() => contactVia('sms', selectedProfile2.contact)}
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  variant="outline"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span className="text-sm font-medium">Message</span>
                  <span className="text-xs opacity-70">SMS/Chat</span>
                </Button>

                <Button
                  onClick={() => contactVia('meet', selectedProfile2.contact)}
                  className="h-auto p-4 flex flex-col items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300 transition-all duration-200"
                  variant="outline"
                >
                  <Video className="w-6 h-6" />
                  <span className="text-sm font-medium">Meet</span>
                  <span className="text-xs opacity-70">Google Meet</span>
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-medium">{selectedProfile2.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">Level {selectedProfile2.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direct Reports:</span>
                    <span className="font-medium">
                      {organizationData.filter(p => p.parent === selectedProfile2.id).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Resolution Panel */}
      <Dialog open={issueResolutionPanel.open} onOpenChange={closeIssueResolutionPanel}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              Issue Resolution Panel
            </DialogTitle>
            <DialogDescription>
              Detailed issue analysis and resolution workflow
            </DialogDescription>
          </DialogHeader>
          
          {issueResolutionPanel.issue && (() => {
            const dynamicPriority = calculateDynamicPriority(issueResolutionPanel.issue);
            const urgencyIndicator = getUrgencyIndicator(dynamicPriority.daysOpen);
            const timeSince = formatTimeSince(issueResolutionPanel.issue.createdDate);
            
            return (
            <div className="space-y-6">
              {/* Escalation Warning Banner */}
              {dynamicPriority.escalationWarning && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-lg border-2 border-red-700 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                <div>
                      <div className="font-bold text-lg">🚨 PRIORITY ESCALATION ALERT</div>
                      <div className="text-sm">
                        This issue has been open for {dynamicPriority.daysOpen} days and has auto-escalated to CRITICAL priority.
                        Immediate action required!
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex items-start justify-between p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">{issueResolutionPanel.issue.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{issueResolutionPanel.issue.description}</p>
                  
                  {/* Sender/Reporter Information */}
                  {issueResolutionPanel.issue.reporter && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-700">Reported By</span>
                          </div>
                          <div className="space-y-1 ml-7">
                            <div className="font-semibold text-gray-900">{issueResolutionPanel.issue.reporter.name}</div>
                            <div className="text-sm text-gray-600">{issueResolutionPanel.issue.reporter.role}</div>
                            <div className="text-sm text-gray-600">{issueResolutionPanel.issue.reporter.company}</div>
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Mail className="w-3 h-3" />
                                {issueResolutionPanel.issue.reporter.email}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Phone className="w-3 h-3" />
                                {issueResolutionPanel.issue.reporter.phone}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Communication Tabs */}
                        <div className="flex flex-col gap-2 ml-4">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Connect Via:</div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                              onClick={() => window.location.href = `mailto:${issueResolutionPanel.issue.reporter.email}?subject=Re: ${encodeURIComponent(issueResolutionPanel.issue.title)}`}
                            >
                              <Mail className="w-4 h-4" />
                              Email
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                              onClick={() => window.location.href = `tel:${issueResolutionPanel.issue.reporter.phone}`}
                            >
                              <Phone className="w-4 h-4" />
                              Call
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300"
                              onClick={() => window.location.href = `sms:${issueResolutionPanel.issue.reporter.phone}?body=Regarding: ${encodeURIComponent(issueResolutionPanel.issue.title)}`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              SMS
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300"
                              onClick={() => {
                                const meetingTitle = `Issue: ${issueResolutionPanel.issue.title}`;
                                const meetingDetails = `Discussion regarding: ${issueResolutionPanel.issue.description}`;
                                window.open(`https://meet.google.com/new?name=${encodeURIComponent(meetingTitle)}&details=${encodeURIComponent(meetingDetails)}`, '_blank');
                              }}
                            >
                              <Video className="w-4 h-4" />
                              Meet
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Priority and Timing Indicators */}
                  <div className="flex items-center gap-3 flex-wrap mb-4">
                    {/* Dynamic Priority Badge */}
                    <div className="flex items-center gap-2">
                      <Badge className={`${dynamicPriority.priorityColor} px-3 py-1 text-sm font-bold`}>
                        {dynamicPriority.finalPriority.toUpperCase()} PRIORITY
                      </Badge>
                      {dynamicPriority.originalPriority !== dynamicPriority.finalPriority && (
                        <span className="text-xs text-gray-500">
                          (was {dynamicPriority.originalPriority.toUpperCase()})
                        </span>
                      )}
                    </div>
                    
                    {/* Exact Date/Time Created */}
                    <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-medium text-indigo-700">
                        {new Date(issueResolutionPanel.issue.createdDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {/* Urgency Indicator */}
                    <Badge variant="outline" className={`${urgencyIndicator.color} border-0 px-3 py-1`}>
                      {urgencyIndicator.text}
                    </Badge>
                    
                    {/* Days Open Counter */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      dynamicPriority.daysOpen > 30 ? 'bg-red-100 text-red-800' :
                      dynamicPriority.daysOpen > 14 ? 'bg-orange-100 text-orange-800' :
                      dynamicPriority.daysOpen > 7 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      <Calendar className="w-4 h-4" />
                      {dynamicPriority.daysOpen} {dynamicPriority.daysOpen === 1 ? 'day' : 'days'} open
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    {/* Channel/Source Badge */}
                    {issueResolutionPanel.issue.channel && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Channel:</span>
                        <Badge 
                          className={`text-xs font-semibold ${
                            issueResolutionPanel.issue.channel === 'email' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                            issueResolutionPanel.issue.channel === 'call' ? 'bg-green-100 text-green-800 border-green-300' :
                            issueResolutionPanel.issue.channel === 'ticket' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                            'bg-gray-100 text-gray-800 border-gray-300'
                          }`}
                        >
                          {issueResolutionPanel.issue.channel === 'email' && '📧 '}
                          {issueResolutionPanel.issue.channel === 'call' && '📞 '}
                          {issueResolutionPanel.issue.channel === 'ticket' && '🎫 '}
                          {issueResolutionPanel.issue.channel.toUpperCase()}
                    </Badge>
                  </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Source:</span>
                      <Badge variant="outline" className="text-xs">{issueResolutionPanel.issue.source}</Badge>
                </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Category:</span>
                      <Badge variant="outline" className="text-xs">{issueResolutionPanel.issue.category}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Priority Score:</span>
                      <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">
                        {Math.round(dynamicPriority.priorityScore)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right ml-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm ${
                    issueResolutionPanel.issue.status === 'solved' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                  }`}>
                    {issueResolutionPanel.issue.status === 'solved' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    {issueResolutionPanel.issue.status.toUpperCase()}
                  </div>
                </div>
              </div>

              <Tabs value={issueResolutionPanel.activeTab} onValueChange={(value) => {
                // Prevent switching to Resolution tab if analysis hasn't been saved
                if (value === 'resolution' && !isResolutionEnabled) {
                  return;
                }
                setIssueResolutionPanel({...issueResolutionPanel, activeTab: value})
              }}>
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="details">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="analysis">
                    Analysis
                    {!isResolutionEnabled && (
                      <Badge className="ml-2 bg-orange-100 text-orange-800 text-xs">Validation Required</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="resolution" 
                    disabled={!isResolutionEnabled}
                    className={`${!isResolutionEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2">
                      Resolution
                      {!isResolutionEnabled && (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-orange-600" />
                          <span className="text-xs text-orange-600">Locked</span>
                        </div>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="channel">Channel</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-6">
                    {/* Call Transcript Information - Special section for phone call issues */}
                    {issueResolutionPanel.issue.source === 'Phone Call' && issueResolutionPanel.issue.transcript && (
                      <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-pink-900 flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Call Transcript
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg border border-pink-200">
                              <div className="text-xs font-medium text-pink-600 mb-1">Caller</div>
                              <div className="text-sm font-semibold text-gray-900">{issueResolutionPanel.issue.callerName}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-pink-200">
                              <div className="text-xs font-medium text-pink-600 mb-1">Phone</div>
                              <div className="text-sm font-semibold text-gray-900">{issueResolutionPanel.issue.callerPhone}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-pink-200">
                              <div className="text-xs font-medium text-pink-600 mb-1">Duration</div>
                              <div className="text-sm font-semibold text-gray-900">{issueResolutionPanel.issue.callDuration}</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-pink-200">
                              <div className="text-xs font-medium text-pink-600 mb-1">Source</div>
                              <Badge className="bg-pink-100 text-pink-800 text-xs">
                                <Phone className="w-3 h-3 mr-1" />
                                Phone Call
                              </Badge>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-pink-200 max-h-96 overflow-y-auto">
                            <div className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                              {issueResolutionPanel.issue.transcript}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-pink-700 bg-white p-3 rounded-lg border border-pink-200">
                            <AlertCircle className="w-4 h-4" />
                            <span>This conversation was recorded for quality assurance and training purposes.</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Full Issue Content Submitted by User */}
                    {issueResolutionPanel.issue.fullContent && (
                      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-amber-900 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Full Issue Content - As Submitted by Reporter
                          </CardTitle>
                          <p className="text-sm text-amber-700 mt-1">Complete details provided by {issueResolutionPanel.issue.reporter?.name || 'the reporter'}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-white p-4 rounded-lg border border-amber-200 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {issueResolutionPanel.issue.fullContent.detailedDescription}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Full Issue Description */}
                    {detailedIssues[issueResolutionPanel.issue.id] && (
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-900">Full Issue Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="prose max-w-none text-sm text-gray-700 whitespace-pre-wrap">
                            {detailedIssues[issueResolutionPanel.issue.id].fullDescription}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Issue Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issue ID:</span>
                            <span className="font-medium font-mono bg-gray-100 px-2 py-1 rounded">{issueResolutionPanel.issue.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created Date:</span>
                          <span className="font-medium">{issueResolutionPanel.issue.createdDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Assigned To:</span>
                            <Badge variant="outline" className="font-medium">{issueResolutionPanel.issue.assignedTo}</Badge>
                        </div>
                        {issueResolutionPanel.issue.solvedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Solved Date:</span>
                            <span className="font-medium">{issueResolutionPanel.issue.solvedDate}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Suggested Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Button 
                            onClick={() => contactVia('call', { phone: '+1-555-SUPPORT' })}
                            className="w-full justify-start hover:bg-green-50" 
                            variant="outline"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Contact Support Team
                          </Button>
                          <Button 
                            onClick={() => {
                              const email = emailTemplates[issueResolutionPanel.issue?.id];
                              if (email) {
                                setSelectedEmail(email);
                                setEmailViewerOpen(true);
                              } else {
                                contactVia('email', { 
                              email: 'support@company.com',
                              subject: `Issue Follow-up: ${issueResolutionPanel.issue?.title}`,
                              body: `Regarding issue ${issueResolutionPanel.issue?.id}: ${issueResolutionPanel.issue?.description}`
                                });
                              }
                            }}
                            className="w-full justify-start hover:bg-blue-50" 
                            variant="outline"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email Update
                          </Button>
                          <Button 
                            onClick={() => {
                              // Could open a priority update modal or form
                              alert('Priority update feature would be implemented here');
                            }}
                            className="w-full justify-start hover:bg-yellow-50" 
                            variant="outline"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update Priority
                          </Button>
                          <Button 
                            onClick={() => contactVia('email', { 
                              email: 'management@company.com',
                              subject: `Escalation Required: ${issueResolutionPanel.issue?.title}`,
                              body: `This issue requires management attention:\n\nIssue: ${issueResolutionPanel.issue?.title}\nDescription: ${issueResolutionPanel.issue?.description}\nPriority: ${issueResolutionPanel.issue?.priority}\nAssigned to: ${issueResolutionPanel.issue?.assignedTo}`
                            })}
                            className="w-full justify-start hover:bg-red-50" 
                            variant="outline"
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Escalate to Manager
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="channel" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Channel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const info = channelTypes[issueResolutionPanel.issue?.channel] || channelTypes.email;
                        return (
                          <div className="flex items-center gap-3">
                            <Badge className={info.color}>{info.emoji} {info.label}</Badge>
                            <span className="text-sm text-gray-600">Source: {issueResolutionPanel.issue?.source || '—'}</span>
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Issue Analysis</span>
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {currentUser}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter detailed analysis of the issue..."
                        value={issueAnalysis}
                        onChange={(e) => setIssueAnalysis(e.target.value)}
                      />
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Analysis quality: {issueAnalysisValid ? 'Valid' : 'Needs improvement'}
                        </span>
                        <div className="flex gap-2">
                        <Button 
                            onClick={() => {
                              if (issueAnalysis.length > 50) {
                                setIssueAnalysisValid(true);
                                // Save analysis with user and timestamp
                                const newAnalysis = {
                                  id: Date.now(),
                                  content: issueAnalysis,
                                  user: currentUser,
                                  timestamp: new Date().toLocaleString(),
                                  issueId: issueResolutionPanel.issue?.id
                                };
                                setAnalysisHistory(prev => [...prev, newAnalysis]);
                                // Clear the textarea for next analysis
                                setIssueAnalysis('');
                                // Show success message
                                alert('✅ Analysis saved successfully!\n\nPlease validate the analysis to unlock the Resolution tab.');
                              }
                            }}
                          className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={issueAnalysis.length <= 50}
                        >
                            Save Analysis
                        </Button>
                          {isResolutionEnabled && (
                            <Button
                              onClick={() => setIssueResolutionPanel({...issueResolutionPanel, activeTab: 'resolution'})}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Go to Resolution
                            </Button>
                          )}
                      </div>
                      </div>

                      {/* Analysis History */}
                      {analysisHistory.filter(a => a.issueId === issueResolutionPanel.issue?.id).length > 0 && (
                        <div className="mt-6 space-y-3">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Analysis History
                          </h4>
                          {analysisHistory
                            .filter(a => a.issueId === issueResolutionPanel.issue?.id)
                            .reverse()
                            .map((analysis) => (
                              <div 
                                key={analysis.id} 
                                className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-indigo-900">{analysis.user}</div>
                                      <div className="text-xs text-indigo-600 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {analysis.timestamp}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {validatedAnalyses.has(analysis.id) ? (
                                      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Validated
                                      </Badge>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          const newValidated = new Set(validatedAnalyses);
                                          newValidated.add(analysis.id);
                                          setValidatedAnalyses(newValidated);
                                          alert(`✅ Analysis validated successfully by ${currentUser}!\n\nThe Resolution tab is now unlocked. You can proceed to create a resolution for this issue.`);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3"
                                      >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Validate
                                      </Button>
                                    )}
                                    <Badge className="bg-indigo-100 text-indigo-800">
                                      Analysis #{analysisHistory.filter(a => a.issueId === issueResolutionPanel.issue?.id).length - analysisHistory.filter(a => a.issueId === issueResolutionPanel.issue?.id).indexOf(analysis)}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded border border-indigo-100">
                                  {analysis.content}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="resolution" className="space-y-4">
                  {/* Show warning if resolution is not enabled */}
                  {!isResolutionEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-orange-900 mb-2">
                            🔒 Resolution Tab Locked
                          </h3>
                          <p className="text-sm text-orange-800 mb-3">
                            Before you can create a resolution, you need to provide and validate an analysis of the issue.
                          </p>
                          <div className="bg-white rounded-lg p-4 border border-orange-200">
                            <p className="text-sm font-semibold text-orange-900 mb-2">To unlock this tab:</p>
                            <ol className="text-sm text-orange-800 space-y-1 ml-5 list-decimal">
                              <li>Go to the <strong>Analysis</strong> tab</li>
                              <li>Write a detailed analysis (minimum 50 characters)</li>
                              <li>Click <strong>"Save Analysis"</strong> button</li>
                              <li>Click <strong>"Validate"</strong> button on the saved analysis</li>
                              <li>Return here to create your resolution</li>
                            </ol>
                          </div>
                          <Button
                            onClick={() => setIssueResolutionPanel({...issueResolutionPanel, activeTab: 'analysis'})}
                            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Go to Analysis Tab
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Resolution Notes</span>
                        {isResolutionEnabled && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50"
                        placeholder={isResolutionEnabled ? 'Enter resolution steps and notes...' : 'Complete the Analysis tab first to unlock this section'}
                        value={issueResolutionNotes}
                        onChange={(e) => setIssueResolutionNotes(e.target.value)}
                        disabled={!isResolutionEnabled}
                      />
                      
                      {/* Opportunity Creation Section */}
                      {isOpportunityEnabled && (
                        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Star className="w-5 h-5 text-purple-600" />
                            <h4 className="font-semibold text-purple-800">Opportunity Created</h4>
                          </div>
                          <p className="text-sm text-purple-700 mb-3">
                            Based on this issue resolution, you can identify potential opportunities for improvement or business growth.
                          </p>
                          <textarea
                            className="w-full h-24 p-3 border border-purple-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Describe the opportunity identified from this issue resolution (e.g., process improvements, new features, cost savings, etc.)..."
                            value={issueOpportunity}
                            onChange={(e) => setIssueOpportunity(e.target.value)}
                          />
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-sm text-purple-600">
                              Opportunity quality: {issueOpportunity.trim().length >= 10 ? 'Good' : 'Needs more detail'}
                            </span>
                            <Button
                              onClick={handleSaveOpportunity}
                              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={issueOpportunity.trim().length < 10}
                            >
                              Save Opportunity
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          onClick={handleMarkResolved}
                          disabled={!isResolutionEnabled || issueResolutionNotes.trim().length < 10}
                        >
                          Mark as Resolved
                        </Button>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          onClick={handleEscalate}
                          disabled={!isResolutionEnabled || issueResolutionNotes.trim().length < 10}
                        >
                          Escalate Issue
                        </Button>
                        <Button 
                          className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          onClick={handleRequestMoreInfo}
                          disabled={!isResolutionEnabled}
                        >
                          Request More Info
                        </Button>
                        <Button 
                          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                          onClick={handleCloseIssue}
                          disabled={!isResolutionEnabled}
                        >
                          Close Issue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Issue History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Issue Created Event */}
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="font-medium">Issue Created</div>
                            <div className="text-sm text-gray-600">
                              {issueResolutionPanel.issue.createdDate} by {issueResolutionPanel.issue.assignedTo}
                            </div>
                          </div>
                        </div>

                        {/* Analysis Events */}
                        {analysisHistory
                          .filter(a => a.issueId === issueResolutionPanel.issue?.id)
                          .map((analysis) => (
                            <React.Fragment key={analysis.id}>
                              <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                  <div className="font-medium flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Analysis Added
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">
                                    {analysis.timestamp} by {analysis.user}
                                  </div>
                                  <div className="text-sm text-gray-700 bg-white p-2 rounded border border-indigo-100 italic">
                                    "{analysis.content.substring(0, 100)}{analysis.content.length > 100 ? '...' : ''}"
                                  </div>
                                </div>
                              </div>
                              {/* Validation Event */}
                              {validatedAnalyses.has(analysis.id) && (
                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg ml-6">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                  <div className="flex-1">
                                    <div className="font-medium flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Analysis Validated
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Validated by {currentUser}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </React.Fragment>
                          ))}

                        {/* Issue Resolved Event */}
                        {issueResolutionPanel.issue.status === 'solved' && issueResolutionPanel.issue.solvedDate && (
                          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <div className="font-medium">Issue Resolved</div>
                              <div className="text-sm text-gray-600">
                                {issueResolutionPanel.issue.solvedDate} by {issueResolutionPanel.issue.assignedTo}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Empty State */}
                        {analysisHistory.filter(a => a.issueId === issueResolutionPanel.issue?.id).length === 0 && 
                         issueResolutionPanel.issue.status !== 'solved' && (
                          <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No additional history yet. Add analysis to track progress.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Persona Card Modal */}
      <Dialog open={personaCardOpen} onOpenChange={setPersonaCardOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] bg-white border-gray-200 shadow-2xl overflow-hidden">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <div></div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsEditingPersona(true);
                  setEditedPersona({ ...selectedPersona });
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                onClick={() => setPersonaCardOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          {selectedPersona && (
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] space-y-4 pr-2">
              {/* Header */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-lg">
                  {selectedPersona.avatar}
                </div>
                {isEditingPersona ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editedPersona?.name || ''}
                      onChange={(e) => setEditedPersona({...editedPersona, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-center font-bold text-xl"
                      placeholder="Name"
                    />
                    <input
                      type="text"
                      value={editedPersona?.title || ''}
                      onChange={(e) => setEditedPersona({...editedPersona, title: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg text-center text-sm"
                      placeholder="Title"
                    />
                  </div>
                ) : (
                  <>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{selectedPersona.name}</h2>
                <p className="text-sm text-gray-600">{selectedPersona.title}</p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant="outline"
                  className="h-auto p-2 flex flex-col items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200 hover:border-red-300 transition-all duration-200"
                  onClick={() => contactVia('call', { phone: selectedPersona.phone })}
                >
                  <Phone className="w-3 h-3" />
                  <span className="text-xs font-medium">Call</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-2 flex flex-col items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300 transition-all duration-200"
                  onClick={() => contactVia('email', { email: selectedPersona.email })}
                >
                  <Mail className="w-3 h-3" />
                  <span className="text-xs font-medium">Email</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-2 flex flex-col items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 transition-all duration-200"
                  onClick={() => contactVia('sms', { phone: selectedPersona.phone })}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs font-medium">SMS</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-2 flex flex-col items-center gap-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300 transition-all duration-200"
                  onClick={() => contactVia('meet', { email: selectedPersona.email })}
                >
                  <Calendar className="w-3 h-3" />
                  <span className="text-xs font-medium">Meet</span>
                </Button>
              </div>

              {/* Contact Information */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800 text-sm">Contact Information</span>
                  </div>
                  {isEditingPersona ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-blue-500" />
                        <input
                          type="email"
                          value={editedPersona?.email || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, email: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Email"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-red-500" />
                        <input
                          type="tel"
                          value={editedPersona?.phone || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, phone: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3 h-3 text-yellow-500" />
                        <input
                          type="text"
                          value={editedPersona?.jobTitle || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, jobTitle: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Job Title"
                        />
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.jobTitle}</span>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Personal Information */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-purple-800 text-sm">Personal Information</span>
                  </div>
                  {isEditingPersona ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <input
                          type="date"
                          value={editedPersona?.birthdate || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, birthdate: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Birthdate"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="w-3 h-3 text-red-500" />
                        <input
                          type="text"
                          value={editedPersona?.likes || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, likes: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Likes/Interests"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="w-3 h-3 text-yellow-500" />
                        <input
                          type="text"
                          value={editedPersona?.dislikes || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, dislikes: e.target.value})}
                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                          placeholder="Dislikes"
                        />
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.birthdate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-3 h-3 text-yellow-500" />
                      <span className="text-gray-700 text-sm">{selectedPersona.dislikes}</span>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Relationship Closeness */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800 text-sm">Relationship Closeness</span>
                  </div>
                  {isEditingPersona ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Closeness</span>
                        <select
                          value={editedPersona?.relationshipStrength || ''}
                          onChange={(e) => setEditedPersona({...editedPersona, relationshipStrength: e.target.value})}
                          className="p-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="Weak">Weak</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Strong">Strong</option>
                          <option value="Very Strong">Very Strong</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Closeness Score</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editedPersona?.closenessScore || 0}
                          onChange={(e) => setEditedPersona({...editedPersona, closenessScore: parseInt(e.target.value) || 0})}
                          className="w-20 p-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">Closeness</span>
                      <span className="text-gray-600 font-medium text-sm">{selectedPersona.relationshipStrength}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${selectedPersona.closenessScore}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700 font-medium text-sm">Closeness Score: {selectedPersona.closenessScore}%</span>
                    </div>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Communication History */}
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold text-indigo-800 text-sm">Communication History</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700 text-sm">Last Contact: {selectedPersona.lastContact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-red-500" />
                      <span className="text-gray-700 text-sm">Total Calls: {selectedPersona.totalCalls}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-700 text-sm">Total Emails: {selectedPersona.totalEmails}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Edit Mode Buttons */}
              {isEditingPersona && (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setSelectedPersona(editedPersona);
                      setIsEditingPersona(false);
                      setEditedPersona(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingPersona(false);
                      setEditedPersona(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Executive Summary Modal */}
      <Dialog open={executiveSummaryOpen} onOpenChange={setExecutiveSummaryOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-indigo-600" />
                <DialogTitle>Executive Summary - Metro Health PG</DialogTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setExecutiveSummaryOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription>
              Comprehensive performance overview and network analysis
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-6">
            {/* Main Content Area */}
            <div className="flex-1 space-y-4">
              {/* Documentation Excellence */}
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Documentation Excellence</h3>
                  </div>
                  <p className="text-gray-700">
                    Achieved high segregation rates across multiple G-codes (G0181: 23, G0182: 18, G0179: 31, G0180: 17)
                  </p>
                </CardContent>
              </Card>

              {/* Risk Mitigation */}
              <Card className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Risk Mitigation</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Documentation Gap:</strong> 23 patients remain unbilled, requiring immediate attention</li>
                    <li><strong>Process Optimization:</strong> 15% decrease in document inflow indicates need for workflow improvements</li>
                    <li><strong>Relationship Management:</strong> 12% rapport deterioration suggests need for enhanced communication strategies</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Strategic Opportunities */}
              <Card className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Strategic Opportunities</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li><strong>Revenue Growth:</strong> Potential for $18,500 additional revenue through optimized processes</li>
                    <li><strong>Patient Expansion:</strong> 67 new patients onboarded, expanding our service reach</li>
                    <li><strong>Efficiency Gains:</strong> 89 hours of admin time saved, enabling focus on high-value activities</li>
                    <li><strong>Positive Outcomes:</strong> 15 positive developments that can be leveraged for relationship building</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
                  </div>
                  <div className="text-gray-700">
                    <p className="mb-3">To maximize our success and address identified risks, we recommend:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Implementing automated billing processes to reduce unbilled patient count</li>
                      <li>Enhancing communication protocols to improve rapport scores</li>
                      <li>Leveraging positive outcomes for relationship strengthening</li>
                      <li>Continuing process optimization to maintain efficiency gains</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 space-y-4">
              {/* Business Reports */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Business Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* MBR */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">MBR (Monthly Business Report)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setMbrFile(e.target.files[0])}
                        className="hidden"
                        id="mbr-upload"
                      />
                      <label 
                        htmlFor="mbr-upload"
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 cursor-pointer"
                      >
                        Choose File
                      </label>
                      <span className="text-xs text-gray-500">
                        {mbrFile ? mbrFile.name : 'No file chosen'}
                      </span>
                    </div>
                  </div>

                  {/* WBR */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">WBR (Weekly Business Report)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setWbrFile(e.target.files[0])}
                        className="hidden"
                        id="wbr-upload"
                      />
                      <label 
                        htmlFor="wbr-upload"
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 cursor-pointer"
                      >
                        Choose File
                      </label>
                      <span className="text-xs text-gray-500">
                        {wbrFile ? wbrFile.name : 'No file chosen'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Personas */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Account Personas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recipientsData.map((recipient) => (
                    <div key={recipient.id} className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        className="rounded"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients([...selectedRecipients, recipient.id]);
                          } else {
                            setSelectedRecipients(selectedRecipients.filter(id => id !== recipient.id));
                          }
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 ${recipient.color === 'blue' ? 'bg-blue-100' : recipient.color === 'purple' ? 'bg-purple-100' : 'bg-green-100'} rounded-full flex items-center justify-center ${recipient.color === 'blue' ? 'text-blue-600' : recipient.color === 'purple' ? 'text-purple-600' : 'text-green-600'} font-semibold text-sm`}>
                          {recipient.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{recipient.name}</div>
                          <div className="text-xs text-gray-500">{recipient.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    onClick={() => setAddPersonaModalOpen(true)}
                  >
                    + Add New Persona
                  </Button>
                </CardContent>
              </Card>

              {/* Send Reports */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="synopsis" 
                        checked={reportType === 'synopsis'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600" 
                      />
                      <span className="text-sm">Synopsis Only</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="mbr" 
                        checked={reportType === 'mbr'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600" 
                      />
                      <span className="text-sm">With MBR</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="wbr" 
                        checked={reportType === 'wbr'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600" 
                      />
                      <span className="text-sm">With WBR</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="reportType" 
                        value="both" 
                        checked={reportType === 'both'}
                        onChange={(e) => setReportType(e.target.value)}
                        className="text-blue-600" 
                      />
                      <span className="text-sm">With Both Reports</span>
                    </label>
                  </div>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    onClick={() => alert(`Sending ${reportType} report to ${selectedRecipients.length} recipients`)}
                  >
                    Send to Selected ({selectedRecipients.length})
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add New Persona Modal */}
      <Dialog open={addPersonaModalOpen} onOpenChange={setAddPersonaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add New Persona
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newPersona.fullName}
                onChange={(e) => setNewPersona({...newPersona, fullName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                placeholder="Enter job title"
                value={newPersona.jobTitle}
                onChange={(e) => setNewPersona({...newPersona, jobTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={newPersona.role}
                onChange={(e) => setNewPersona({...newPersona, role: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newPersona.email}
                onChange={(e) => setNewPersona({...newPersona, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={newPersona.phone}
                onChange={(e) => setNewPersona({...newPersona, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Likes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Likes
              </label>
              <input
                type="text"
                placeholder="Enter interests/likes"
                value={newPersona.likes}
                onChange={(e) => setNewPersona({...newPersona, likes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dislikes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dislikes
              </label>
              <input
                type="text"
                placeholder="Enter dislikes/concerns"
                value={newPersona.dislikes}
                onChange={(e) => setNewPersona({...newPersona, dislikes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setAddPersonaModalOpen(false);
                  setNewPersona({
                    fullName: '',
                    jobTitle: '',
                    role: 'Staff',
                    email: '',
                    phone: '',
                    likes: '',
                    dislikes: ''
                  });
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newPersona.fullName && newPersona.jobTitle) {
                    // Add the new persona to recipients
                    const newId = recipientsData.length + 1;
                    const initials = newPersona.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
                    const newRecipient = {
                      id: newId,
                      name: newPersona.fullName,
                      title: newPersona.jobTitle,
                      avatar: initials,
                      color: 'blue'
                    };
                    
                    // In a real app, you'd update the recipientsData array
                    alert(`Added new persona: ${newPersona.fullName}`);
                    
                    setAddPersonaModalOpen(false);
                    setNewPersona({
                      fullName: '',
                      jobTitle: '',
                      role: 'Staff',
                      email: '',
                      phone: '',
                      likes: '',
                      dislikes: ''
                    });
                  } else {
                    alert('Please fill in the required fields (Full Name and Job Title)');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Persona
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Actions */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Quick Actions & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => setBilledPatientsModalOpen(true)}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              variant="outline"
            >
              <CheckCircle className="w-6 h-6" />
              <span className="text-sm font-medium">Billed Patients</span>
              <span className="text-xs opacity-70">89 Patients</span>
            </Button>

            <Button 
              onClick={() => setUnpreparedDocumentsModalOpen(true)}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
              variant="outline"
            >
              <Clock className="w-6 h-6" />
              <span className="text-sm font-medium">Pending Docs</span>
              <span className="text-xs opacity-70">8 Documents</span>
            </Button>

            <Button 
              onClick={() => setClaimsSubmittedModalOpen(true)}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
              variant="outline"
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-sm font-medium">Claims</span>
              <span className="text-xs opacity-70">2,158 Submitted</span>
            </Button>

            <Button 
              onClick={() => setRevenueGeneratedModalOpen(true)}
              className="h-auto p-4 flex flex-col items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
              variant="outline"
            >
              <Star className="w-6 h-6" />
              <span className="text-sm font-medium">Revenue</span>
              <span className="text-xs opacity-70">$1.2M Generated</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document List Modal */}
      <Dialog open={documentListModalOpen} onOpenChange={setDocumentListModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {selectedDocumentType} - Document List
            </DialogTitle>
            <DialogDescription>
              Complete list of {selectedDocumentType?.toLowerCase()} with detailed information
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocumentType && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-blue-700 bg-blue-50">
                  Total: {getDocumentCount(selectedDocumentType)} {selectedDocumentType}
                </Badge>
                <Button size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export List
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {getDocumentList(selectedDocumentType).map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{document.name}</h4>
                            <p className="text-sm text-gray-600">Patient: {document.patientName}</p>
                            <p className="text-xs text-gray-500">ID: {document.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">{document.status}</div>
                            <div className="text-xs text-gray-500">{document.date}</div>
                          </div>
                          <Badge 
                            className={`${
                              document.status === 'Processed' ? 'bg-green-100 text-green-800' :
                              document.status === 'Prepared' ? 'bg-blue-100 text-blue-800' :
                              document.status === 'Signed' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {document.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Claims & Billing List Modal */}
      <Dialog open={claimsListModalOpen} onOpenChange={setClaimsListModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-green-600" />
              {selectedClaimsType} - Claims & Billing List
            </DialogTitle>
            <DialogDescription>
              Complete list of {selectedClaimsType?.toLowerCase()} with detailed information
            </DialogDescription>
          </DialogHeader>
          
          {selectedClaimsType && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-green-700 bg-green-50">
                  Total: {getClaimsCount(selectedClaimsType)} {selectedClaimsType}
                </Badge>
                <Button size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export List
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {getClaimsList(selectedClaimsType).map((claim, index) => (
                  <motion.div
                    key={claim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{claim.id}</h4>
                            <p className="text-sm text-gray-600">Patient: {claim.patientName}</p>
                            {claim.amount && <p className="text-sm text-gray-600">Amount: ${claim.amount}</p>}
                            {claim.billability && <p className="text-sm text-gray-600">Billability: {claim.billability}%</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">{claim.status}</div>
                            <div className="text-xs text-gray-500">{claim.date}</div>
                            {claim.type && <div className="text-xs text-gray-500">{claim.type}</div>}
                            {claim.reason && <div className="text-xs text-red-500">{claim.reason}</div>}
                          </div>
                          <Badge 
                            className={`${
                              claim.status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                              claim.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              claim.status === 'Paid' ? 'bg-green-100 text-green-800' :
                              claim.status === 'Fully Billable' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {claim.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admin Efficiency List Modal */}
      <Dialog open={adminListModalOpen} onOpenChange={setAdminListModalOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              {selectedAdminType} - Admin Efficiency List
            </DialogTitle>
            <DialogDescription>
              Complete list of {selectedAdminType?.toLowerCase()} with detailed information
            </DialogDescription>
          </DialogHeader>
          
          {selectedAdminType && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-purple-700 bg-purple-50">
                  Total: {getAdminCount(selectedAdminType)} {selectedAdminType}
                </Badge>
                <Button size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export List
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {getAdminList(selectedAdminType).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Target className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.task || item.process || item.name}</h4>
                            <p className="text-sm text-gray-600">Staff: {item.staff}</p>
                            {item.responseTime && <p className="text-sm text-gray-600">Response Time: {item.responseTime}hrs</p>}
                            {item.completion && <p className="text-sm text-gray-600">Completion: {item.completion}%</p>}
                            {item.efficiency && <p className="text-sm text-gray-600">Efficiency: {item.efficiency}%</p>}
                            {item.utilization && <p className="text-sm text-gray-600">Utilization: {item.utilization}%</p>}
                            {item.department && <p className="text-sm text-gray-600">Department: {item.department}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">{item.status}</div>
                            <div className="text-xs text-gray-500">{item.date}</div>
                          </div>
                          <Badge 
                            className={`${
                              item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'Optimized' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'High' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {item.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Viewer Modal - Full Email Content Display */}
      <Dialog open={emailViewerOpen} onOpenChange={setEmailViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-gray-900">Email Communication</div>
                <div className="text-sm font-normal text-gray-500">Full message content and details</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmail && (
            <div className="space-y-6">
              {/* Email Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex-1">{selectedEmail.subject}</h2>
                    <Badge className={`${
                      selectedEmail.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      selectedEmail.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedEmail.priority} PRIORITY
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-20">From:</span>
                      <span className="text-gray-900 font-medium">{selectedEmail.from}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-20">To:</span>
                      <span className="text-gray-900">{selectedEmail.to}</span>
                    </div>
                    {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 w-20">CC:</span>
                        <span className="text-gray-600">{selectedEmail.cc.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700 w-20">Date:</span>
                      <span className="text-gray-600">{selectedEmail.date}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedEmail.tags && selectedEmail.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-blue-200">
                      <span className="text-sm font-semibold text-gray-700">Tags:</span>
                      {selectedEmail.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-white/70">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Body */}
              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Message Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div 
                    className="prose max-w-none text-sm text-gray-800 whitespace-pre-wrap leading-relaxed"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                      lineHeight: '1.7'
                    }}
                  >
                    {selectedEmail.body}
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader className="bg-purple-50">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Download className="w-5 h-5 text-purple-600" />
                      Attachments ({selectedEmail.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedEmail.attachments.map((attachment, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 truncate group-hover:text-purple-700 transition-colors">
                              {attachment.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span>{attachment.size}</span>
                              <span>•</span>
                              <span className="text-gray-400">{attachment.type}</span>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="flex-shrink-0">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setEmailViewerOpen(false)}
                  className="px-6"
                >
                  Close
                </Button>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => alert('Forward functionality would be implemented here')}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Forward
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => alert('Reply functionality would be implemented here')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Reply
                  </Button>
                  <Button 
                    onClick={() => {
                      window.open(`mailto:${selectedEmail.to}?subject=RE: ${selectedEmail.subject}&body=${encodeURIComponent(selectedEmail.body)}`);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Mail className="w-4 h-4" />
                    Open in Email Client
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unsolved Issues Categorization Modal */}
      <Dialog open={unsolvedModalOpen} onOpenChange={setUnsolvedModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">New Issues Categorization</div>
                <div className="text-sm font-normal text-gray-500 mt-1">
                  Categorize and prioritize new issues
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-800">{getAllUnsolvedIssues().length}</div>
                  <div className="text-sm text-yellow-600 font-medium">Total New Issues</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-800">
                    {Object.keys(issueCategorizationData).length}
                  </div>
                  <div className="text-sm text-green-600 font-medium">Categorized</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-blue-800">
                    {getAllUnsolvedIssues().length - Object.keys(issueCategorizationData).length}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">Pending Review</div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2">Categorization Instructions</h4>
                    <p className="text-sm text-indigo-800 mb-2">
                      For each unsolved issue, please:
                    </p>
                    <ol className="text-sm text-indigo-700 space-y-1 ml-5 list-decimal">
                      <li>Select the appropriate <strong>Issue Type</strong> from the dropdown</li>
                      <li>Provide a <strong>Reason/Justification</strong> for your categorization</li>
                      <li>Assign a <strong>Priority Level</strong> (High, Medium, or Low)</li>
                      <li>Click <strong>"Save Categorization"</strong> to apply your changes</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues List */}
            <div className="space-y-4">
              {getAllUnsolvedIssues().map((issue, index) => (
                <IssueCategorizationCard
                  key={issue.id}
                  issue={issue}
                  index={index}
                  issueCategorizationData={issueCategorizationData}
                  editingIssueId={editingIssueId}
                  setEditingIssueId={setEditingIssueId}
                  handleSaveCategorization={handleSaveCategorization}
                  issueTypeOptions={issueTypeOptions}
                  currentUser={currentUser}
                />
              ))}
            </div>

            {/* No Issues Message */}
            {getAllUnsolvedIssues().length === 0 && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">All Clear!</h3>
                  <p className="text-green-700">There are no unsolved issues at the moment.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}