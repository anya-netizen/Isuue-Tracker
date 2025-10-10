import React from 'react';
import { Filter } from 'lucide-react';

export const PriorityFilterDropdown = ({ 
  priorityFilter, 
  setPriorityFilter, 
  issueStatistics 
}) => {
  return (
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
  );
};

