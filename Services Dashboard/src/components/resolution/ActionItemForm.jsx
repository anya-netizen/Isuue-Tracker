import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { ActionItem } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ActionItemForm({ patient, onSubmit, onCancel }) {
  const [users, setUsers] = useState([]);
  const [task, setTask] = useState({
    title: `Resolve issue for patient ${patient.name}`,
    description: '',
    priority: 'medium',
    status: 'open',
    due_date: '',
    patient_id: patient.patient_id,
    assigned_to: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const userList = await User.list();
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const handleChange = (field, value) => {
    setTask(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ActionItem.create(task);
      onSubmit();
    } catch (err) {
      console.error("Failed to create action item", err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Action Title"
        value={task.title}
        onChange={e => handleChange('title', e.target.value)}
        required
      />
      <Textarea
        placeholder="Describe the action needed..."
        value={task.description}
        onChange={e => handleChange('description', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select value={task.priority} onValueChange={value => handleChange('priority', value)}>
          <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {task.due_date ? format(new Date(task.due_date), 'PPP') : <span>Pick a due date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={task.due_date ? new Date(task.due_date) : null} onSelect={date => handleChange('due_date', date)} /></PopoverContent>
        </Popover>
      </div>
      <Select value={task.assigned_to} onValueChange={value => handleChange('assigned_to', value)} required>
        <SelectTrigger><SelectValue placeholder="Assign to..." /></SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.email}>{user.full_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Action'}
        </Button>
      </div>
    </form>
  );
}