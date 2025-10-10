import React from 'react';
import { motion } from 'framer-motion';

export const IssueStatisticsCards = ({ 
  issueStatistics, 
  priorityFilter, 
  setPriorityFilter,
  setUnsolvedModalOpen 
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
      {/* Total Issues */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
          priorityFilter === 'all' ? 'border-blue-600 ring-2 ring-blue-300' : 'border-blue-200'
        }`}
        onClick={() => setPriorityFilter('all')}
      >
        <div className="text-2xl font-bold text-blue-800">{issueStatistics.totalIssues}</div>
        <div className="text-sm text-blue-600 font-medium">Total Issues</div>
      </motion.div>

      {/* Solved Issues */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
          priorityFilter === 'solved' ? 'border-green-600 ring-2 ring-green-300' : 'border-green-200'
        }`}
        onClick={() => setPriorityFilter('solved')}
      >
        <div className="text-2xl font-bold text-green-800">{issueStatistics.solvedIssues}</div>
        <div className="text-sm text-green-600 font-medium">Solved</div>
      </motion.div>

      {/* Unsolved Issues */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`text-center p-4 bg-gradient-to-br from-red-50 to-rose-100 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
          priorityFilter === 'unsolved' ? 'border-red-600 ring-2 ring-red-300' : 'border-red-200'
        }`}
        onClick={() => {
          setPriorityFilter('unsolved');
          setUnsolvedModalOpen(true);
        }}
      >
        <div className="text-2xl font-bold text-red-800">{issueStatistics.unsolvedIssues}</div>
        <div className="text-sm text-red-600 font-medium">Unsolved</div>
      </motion.div>
    </div>
  );
};

