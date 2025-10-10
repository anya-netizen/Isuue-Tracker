import { useState, useMemo } from 'react';
import { calculateIssueStatistics, applyAdvancedFilters } from '@/utils/customer-success/filterUtils';

/**
 * Custom hook for managing issues, filters, and statistics
 */
export const useIssueManagement = (issueCategories) => {
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [regionTypeFilter, setRegionTypeFilter] = useState('all');
  const [regionNameFilter, setRegionNameFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Issue categorization states
  const [issueCategorizationData, setIssueCategorizationData] = useState({});
  const [editingIssueId, setEditingIssueId] = useState(null);

  // Modal states
  const [unsolvedModalOpen, setUnsolvedModalOpen] = useState(false);
  const [issueFlowchartOpen, setIssueFlowchartOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  // Issue resolution panel state
  const [issueResolutionPanel, setIssueResolutionPanel] = useState({
    open: false,
    issue: null,
    activeTab: 'details'
  });

  // Create filters object
  const filters = useMemo(() => ({
    regionTypeFilter,
    regionNameFilter,
    categoryFilter,
    channelFilter,
    statusFilter
  }), [regionTypeFilter, regionNameFilter, categoryFilter, channelFilter, statusFilter]);

  // Calculate issue statistics with useMemo to optimize performance
  const issueStatistics = useMemo(() => {
    return calculateIssueStatistics(issueCategories, filters);
  }, [issueCategories, filters]);

  // Handler to save categorization
  const handleSaveCategorization = (issueId, data) => {
    setIssueCategorizationData(prev => ({
      ...prev,
      [issueId]: data
    }));
    setEditingIssueId(null);
  };

  // Clear all advanced filters
  const clearAllFilters = () => {
    setRegionTypeFilter('all');
    setRegionNameFilter('all');
    setCategoryFilter('all');
    setChannelFilter('all');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  // Toggle node expansion
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Open issue resolution panel
  const openIssueResolutionPanel = (issue) => {
    setIssueResolutionPanel({
      open: true,
      issue: issue,
      activeTab: 'details'
    });
  };

  // Close issue resolution panel
  const closeIssueResolutionPanel = () => {
    setIssueResolutionPanel({
      open: false,
      issue: null,
      activeTab: 'details'
    });
  };

  return {
    // Filter states
    priorityFilter,
    setPriorityFilter,
    regionTypeFilter,
    setRegionTypeFilter,
    regionNameFilter,
    setRegionNameFilter,
    categoryFilter,
    setCategoryFilter,
    channelFilter,
    setChannelFilter,
    statusFilter,
    setStatusFilter,
    
    // Categorization states
    issueCategorizationData,
    setIssueCategorizationData,
    editingIssueId,
    setEditingIssueId,
    
    // Modal states
    unsolvedModalOpen,
    setUnsolvedModalOpen,
    issueFlowchartOpen,
    setIssueFlowchartOpen,
    expandedNodes,
    setExpandedNodes,
    
    // Resolution panel state
    issueResolutionPanel,
    setIssueResolutionPanel,
    
    // Computed values
    filters,
    issueStatistics,
    
    // Handlers
    handleSaveCategorization,
    clearAllFilters,
    toggleNode,
    openIssueResolutionPanel,
    closeIssueResolutionPanel
  };
};

