/**
 * Dynamic Priority Calculation System
 * Calculates issue priority based on multiple factors
 */

export const calculateDynamicPriority = (issue) => {
  let priorityScore = 0;
  
  // Base priority scores
  const basePriority = {
    'critical': 75, // map any legacy "critical" to high
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
  
  if (priorityScore >= 100) {
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
export const formatTimeSince = (dateString) => {
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
export const getUrgencyIndicator = (daysOpen) => {
  if (daysOpen > 30) return { text: '🔥 URGENT', color: 'text-red-600 font-bold animate-pulse' };
  if (daysOpen > 21) return { text: '⚠️ Overdue', color: 'text-orange-600 font-semibold' };
  if (daysOpen > 14) return { text: '⏰ Aging', color: 'text-yellow-600 font-medium' };
  if (daysOpen > 7) return { text: '📅 Open', color: 'text-blue-600' };
  return { text: '🆕 Recent', color: 'text-green-600' };
};


