import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

const priorityStyles = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function ActionItemCard({ item, user }) {
  return (
    <Card className="p-3 mb-3 bg-white hover:bg-slate-50 transition-colors duration-200 shadow-sm">
      <h4 className="font-semibold text-sm text-slate-800 mb-2">{item.title}</h4>
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge className={priorityStyles[item.priority]}>{item.priority}</Badge>
        {item.due_date && (
          <Badge variant="outline" className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3 h-3" />
            {format(new Date(item.due_date), 'MMM d')}
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-slate-500">Patient: {item.patient_id}</p>
        {user && (
          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600" title={user.full_name}>
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </Card>
  );
}