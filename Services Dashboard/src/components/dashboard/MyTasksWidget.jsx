import React, { useState, useEffect } from 'react';
import { ActionItem } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const priorityStyles = {
  high: "border-red-500",
  medium: "border-yellow-500",
  low: "border-blue-500",
};

export default function MyTasksWidget() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const currentUser = await User.me();
        const userTasks = await ActionItem.filter({
          assigned_to: currentUser.email,
          status: { '$ne': 'resolved' }
        }, '-priority');
        setTasks(userTasks);
      } catch (e) {
        console.error("Could not load user tasks", e);
      }
      setLoading(false);
    };
    loadTasks();
  }, []);

  const handleMarkAsDone = async (taskId) => {
    const originalTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== taskId)); // Optimistic update
    try {
      await ActionItem.update(taskId, { status: 'resolved' });
    } catch (e) {
      console.error("Failed to mark task as done", e);
      setTasks(originalTasks); // Revert on failure
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center justify-between text-slate-900">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-purple-600" />
            My Action Items
          </div>
          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to={createPageUrl("ResolutionCenter")}>
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-0">
          {loading ? <p className="p-4 text-sm text-slate-500">Loading your tasks...</p> : (
            tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task.id} className={`flex items-start gap-3 p-4 border-l-4 hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0 ${priorityStyles[task.priority]}`}>
                  <Checkbox 
                    id={`task-${task.id}`}
                    onCheckedChange={() => handleMarkAsDone(task.id)} 
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor={`task-${task.id}`} className="font-medium text-slate-900 text-sm cursor-pointer">{task.title}</label>
                    <p className="text-xs text-slate-500">Patient: {task.patient_id}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-sm text-slate-500">No open action items assigned to you. Great job!</p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}