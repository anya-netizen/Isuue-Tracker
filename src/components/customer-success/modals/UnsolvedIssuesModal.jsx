import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { IssueCategorizationCard } from '../issues/IssueCategorizationCard';
import { getAllUnsolvedIssues } from '@/utils/customer-success/filterUtils';
import { issueTypeOptions } from '@/constants/issueConstants';

export const UnsolvedIssuesModal = ({
  open,
  onOpenChange,
  issueCategories,
  issueCategorizationData,
  editingIssueId,
  setEditingIssueId,
  handleSaveCategorization,
  currentUser
}) => {
  const unsolvedIssues = getAllUnsolvedIssues(issueCategories);
  const categorizedCount = Object.keys(issueCategorizationData).length;
  const pendingCount = unsolvedIssues.length - categorizedCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            New Issues Categorization
          </DialogTitle>
          <DialogDescription>
            Review and categorize all new issues to improve tracking and resolution
          </DialogDescription>
        </DialogHeader>

        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-800">{unsolvedIssues.length}</div>
            <div className="text-sm text-orange-600 font-medium">Total Unsolved</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-800">{categorizedCount}</div>
            <div className="text-sm text-green-600 font-medium flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Categorized
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-800">{pendingCount}</div>
            <div className="text-sm text-yellow-600 font-medium flex items-center justify-center gap-1">
              <Clock className="w-4 h-4" />
              Pending Review
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Review each unsolved issue carefully</li>
            <li>Select the appropriate issue type from the dropdown</li>
            <li>Provide a detailed reason (minimum 20 characters) for your categorization</li>
            <li>Assign a priority level (High, Medium, or Low)</li>
            <li>Click "Save Categorization" to submit</li>
          </ul>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {unsolvedIssues.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                All Issues Resolved!
              </h3>
              <p className="text-gray-600">
                There are no unsolved issues at the moment.
              </p>
            </div>
          ) : (
            unsolvedIssues.map((issue, index) => (
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

