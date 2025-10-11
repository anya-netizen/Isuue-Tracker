import React, { useState, useEffect } from 'react';
import { ActionItem } from '@/api/entities';
import { User } from '@/api/entities';
import ActionItemCard from '../components/resolution/ActionItemCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { ClipboardCheck, Hourglass, CheckCircle2 } from 'lucide-react';

const columnsConfig = {
  open: { title: "Open", icon: ClipboardCheck, color: "text-blue-600" },
  in_progress: { title: "In Progress", icon: Hourglass, color: "text-orange-600" },
  resolved: { title: "Resolved", icon: CheckCircle2, color: "text-green-600" },
};

export default function ResolutionCenterPage() {
  const [tasks, setTasks] = useState({ open: [], in_progress: [], resolved: [] });
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [actionItems, userList] = await Promise.all([ActionItem.list(), User.list()]);
      
      const userMap = userList.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
      }, {});
      setUsers(userMap);

      const groupedTasks = actionItems.reduce((acc, task) => {
        const status = task.status || 'open';
        if (!acc[status]) acc[status] = [];
        acc[status].push(task);
        return acc;
      }, { open: [], in_progress: [], resolved: [] });
      
      setTasks(groupedTasks);
      setLoading(false);
    };
    loadData();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const startColumn = tasks[source.droppableId];
    const endColumn = tasks[destination.droppableId];
    const movedTask = startColumn.find(t => t.id === draggableId);

    // Optimistic UI update
    const newStartColumn = Array.from(startColumn);
    newStartColumn.splice(source.index, 1);
    const newEndColumn = Array.from(endColumn);
    newEndColumn.splice(destination.index, 0, movedTask);

    setTasks(prev => ({
      ...prev,
      [source.droppableId]: newStartColumn,
      [destination.droppableId]: newEndColumn,
    }));

    // Update backend
    try {
      await ActionItem.update(draggableId, { status: destination.droppableId });
    } catch (e) {
      // Revert if API call fails
      console.error("Failed to update task status:", e);
      setTasks(prev => ({
        ...prev,
        [source.droppableId]: startColumn,
        [destination.droppableId]: endColumn,
      }));
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Resolution Center</h1>
      <p className="text-slate-600 mb-8">Visually manage and track all action items across the platform.</p>
      
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(columnsConfig).map(([columnId, column]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 rounded-xl bg-slate-100 transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200' : ''}`}
                  >
                    <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${column.color.replace('text', 'border')}`}>
                      <column.icon className={`w-5 h-5 ${column.color}`} />
                      <h3 className="font-semibold text-slate-800">{column.title}</h3>
                      <span className="text-sm font-bold text-slate-500">{tasks[columnId]?.length || 0}</span>
                    </div>
                    <div className="min-h-[400px]">
                      {tasks[columnId]?.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <motion.div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              layout
                              className={snapshot.isDragging ? 'shadow-2xl' : ''}
                            >
                              <ActionItemCard item={item} user={users[item.assigned_to]} />
                            </motion.div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}