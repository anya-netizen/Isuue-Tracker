import { calculateDynamicPriority } from './priorityCalculator';

/**
 * Apply advanced filters to issues
 */
export const applyAdvancedFilters = (issues, filters) => {
  const { regionTypeFilter, regionNameFilter, categoryFilter, channelFilter, statusFilter } = filters;
  
  return issues.filter(issue => {
    // Region Type Filter
    if (regionTypeFilter !== 'all' && issue.regionType !== regionTypeFilter) {
      return false;
    }
    
    // Region Name Filter
    if (regionNameFilter !== 'all' && issue.regionName !== regionNameFilter) {
      return false;
    }
    
    // Category Filter
    if (categoryFilter !== 'all' && issue.issueCategory !== categoryFilter) {
      return false;
    }
    
    // Channel Filter
    if (channelFilter !== 'all' && issue.channel !== channelFilter) {
      return false;
    }
    
    // Status Filter
    if (statusFilter !== 'all' && issue.workflowStatus !== statusFilter) {
      return false;
    }
    
    return true;
  });
};

/**
 * Filter issues by priority
 */
export const filterIssuesByPriority = (issues, priorityFilter) => {
  if (priorityFilter === 'all') return issues;
  return issues.filter(issue => {
    const dynamicPriority = calculateDynamicPriority(issue);
    return dynamicPriority.finalPriority === priorityFilter;
  });
};

/**
 * Check if any advanced filters are active
 */
export const hasAdvancedFiltersActive = (filters) => {
  const { regionTypeFilter, regionNameFilter, categoryFilter, channelFilter, statusFilter } = filters;
  return regionTypeFilter !== 'all' || 
         regionNameFilter !== 'all' || 
         categoryFilter !== 'all' || 
         channelFilter !== 'all' || 
         statusFilter !== 'all';
};

/**
 * Get all issues from all categories
 */
export const getAllIssues = (issueCategories) => {
  const allIssues = [];
  Object.values(issueCategories).forEach(category => {
    if (category.issues) {
      allIssues.push(...category.issues);
    }
  });
  return allIssues;
};

/**
 * Calculate issue statistics dynamically based on filters
 */
export const calculateIssueStatistics = (issueCategories, filters) => {
  // Get all issues and apply advanced filters
  const allIssues = getAllIssues(issueCategories);
  const filteredIssues = applyAdvancedFilters(allIssues, filters);
  
  // Calculate total, solved, unsolved from filtered issues
  const totalIssues = filteredIssues.length;
  const solvedIssues = filteredIssues.filter(issue => issue.status === 'solved').length;
  const unsolvedIssues = filteredIssues.filter(issue => issue.status === 'unsolved').length;
  
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
    solvedIssues,
    unsolvedIssues,
    highPriority,
    mediumPriority,
    lowPriority,
    criticalPriority
  };
};

/**
 * Get all unsolved issues from all categories
 */
export const getAllUnsolvedIssues = (issueCategories) => {
  const allIssues = [];
  Object.entries(issueCategories).forEach(([categoryKey, category]) => {
    category.issues.forEach(issue => {
      if (issue.status === 'unsolved') {
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

