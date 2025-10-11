import {
  Cpu,
  Settings,
  HelpCircle,
  Phone,
  Layout,
  Mail,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

// Issue type options for categorization
export const issueTypeOptions = [
  { value: 'clinical', label: 'Clinical', color: 'blue' },
  { value: 'operational', label: 'Operational/Patient services', color: 'green' },
  { value: 'queries', label: 'Queries', color: 'purple' },
  { value: 'technical', label: 'Technical error', color: 'red' },
  { value: 'followup', label: 'Follow up mails', color: 'orange' },
  { value: 'enquiry', label: 'Enquiry mails', color: 'indigo' }
];

// Issue category icons
export const issueCategoryIcons = {
  technical: Cpu,
  clinical: AlertCircle,
  operational: Settings,
  queries: HelpCircle,
  followup: Mail,
  enquiry: MessageSquare,
  callTranscripts: Phone,
  others: Layout
};

// Issue category colors
export const issueCategoryColors = {
  technical: 'from-blue-500 to-blue-600',
  clinical: 'from-red-500 to-red-600',
  operational: 'from-green-500 to-green-600',
  queries: 'from-purple-500 to-purple-600',
  followup: 'from-orange-500 to-orange-600',
  enquiry: 'from-indigo-500 to-indigo-600',
  callTranscripts: 'from-pink-500 to-rose-600',
  others: 'from-orange-500 to-orange-600'
};

// Priority levels
export const priorityLevels = {
  critical: { label: 'Critical', color: 'bg-red-600 text-white', emoji: '🔴' },
  high: { label: 'High', color: 'bg-red-100 text-red-800', emoji: '🟡' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', emoji: '🔵' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800', emoji: '🟣' }
};

// Channel types
export const channelTypes = {
  email: { label: 'Email', emoji: '📧', color: 'bg-blue-100 text-blue-800' },
  call: { label: 'Call', emoji: '📞', color: 'bg-green-100 text-green-800' },
  ticket: { label: 'System Ticket', emoji: '🎫', color: 'bg-purple-100 text-purple-800' }
};

// Status types
export const statusTypes = {
  new: { label: 'New', color: 'bg-yellow-100 text-yellow-800' },
  analyzed: { label: 'Analyzed', color: 'bg-blue-100 text-blue-800' },
  catalyzed: { label: 'Catalyzed', color: 'bg-purple-100 text-purple-800' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800' },
  solved: { label: 'Solved', color: 'bg-green-100 text-green-800' },
  unsolved: { label: 'Unsolved', color: 'bg-red-100 text-red-800' }
};


