import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Edit2, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusColors = {
    'Todo': 'bg-slate-100 text-slate-600',
    'In Progress': 'bg-blue-50 text-blue-600',
    'Done': 'bg-green-50 text-green-600'
  };

  const formattedDate = task.due_date 
    ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 ${
        isDragging ? 'opacity-50 ring-2 ring-indigo-500 shadow-xl' : ''
      }`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing mb-3"
      >
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-slate-800 line-clamp-2">{task.title}</h3>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${statusColors[task.status] || statusColors['Todo']}`}>
            {task.status}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-3">{task.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center text-slate-400 text-xs font-medium">
          {formattedDate ? (
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formattedDate}
            </div>
          ) : (
            <span className="text-transparent">No date</span>
          )}
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
