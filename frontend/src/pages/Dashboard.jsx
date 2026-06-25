import React, { useState, useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, Search, Filter } from 'lucide-react';
import api from '../services/api';
import SidebarLayout from '../components/layout/SidebarLayout';
import TaskCard from '../components/ui/TaskCard';
import TaskModal from '../components/ui/TaskModal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const COLUMNS = ['Todo', 'In Progress', 'Done'];

const Column = ({ id, children }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="bg-slate-100/50 rounded-2xl p-3 min-h-[500px] border border-slate-100 flex flex-col gap-3">
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchTasks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filter) params.status = filter;
      // Fetching all for dnd simplicity instead of pagination, though pagination is requested.
      // We'll set a high limit.
      params.limit = 100;
      const response = await api.get('/tasks/', { params });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter]);

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = tasks.findIndex(t => t.id === activeId);
    const overIndex = tasks.findIndex(t => t.id === overId);
    
    if (activeIndex === -1) return;

    const activeTask = tasks[activeIndex];
    const overTask = overIndex >= 0 ? tasks[overIndex] : null;

    let targetStatus = overTask ? overTask.status : overId;

    if (!COLUMNS.includes(targetStatus)) {
        targetStatus = over.data?.current?.sortable?.containerId || targetStatus;
    }

    if (activeTask.status !== targetStatus && COLUMNS.includes(targetStatus)) {
      setTasks((prev) => {
        const updatedTasks = [...prev];
        updatedTasks[activeIndex] = { ...activeTask, status: targetStatus };
        return updatedTasks;
      });
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) {
      fetchTasks();
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeIndex = tasks.findIndex(t => t.id === activeId);
    const overIndex = tasks.findIndex(t => t.id === overId);

    if (activeIndex === -1) return;
    const activeTask = tasks[activeIndex];

    // Handle reordering within the same column
    if (activeIndex !== overIndex && overIndex >= 0 && tasks[activeIndex].status === tasks[overIndex].status) {
      setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
    }

    // Save status to DB
    try {
      await api.put(`/tasks/${activeId}`, { status: activeTask.status });
    } catch (error) {
      console.error('Failed to update task status in DB', error);
      fetchTasks();
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        await api.post('/tasks/', taskData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  };

  return (
    <SidebarLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Task Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your tasks by dragging them across columns.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((columnId) => {
            const columnTasks = tasks.filter(t => t.status === columnId);
            return (
              <div key={columnId} className="flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-medium text-slate-700 flex items-center">
                    {columnId}
                    <span className="ml-2 bg-slate-200 text-slate-600 text-xs font-semibold py-0.5 px-2 rounded-full">
                      {columnTasks.length}
                    </span>
                  </h3>
                </div>
                
                <Column id={columnId}>
                  <SortableContext id={columnId} items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {columnTasks.length > 0 ? (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={(t) => { setEditingTask(t); setIsModalOpen(true); }}
                          onDelete={handleDeleteTask}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[120px] border-2 border-dashed border-slate-200/60 rounded-xl bg-slate-50/50">
                        <span className="text-sm font-medium">
                          {columnId === 'Todo' && 'No todo tasks'}
                          {columnId === 'In Progress' && 'No pending tasks'}
                          {columnId === 'Done' && 'No done tasks'}
                        </span>
                      </div>
                    )}
                  </SortableContext>
                </Column>
              </div>
            );
          })}
        </div>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSave={handleSaveTask}
        initialData={editingTask}
      />
    </SidebarLayout>
  );
};

export default Dashboard;
