import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckSquare } from 'lucide-react';
import api from '../services/api';
import SidebarLayout from '../components/layout/SidebarLayout';
import Input from '../components/ui/Input';

const COLUMNS = ['Todo', 'In Progress', 'Done'];

const statusColors = {
  'Todo': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-blue-50 text-blue-600',
  'Done': 'bg-green-50 text-green-600'
};

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  
  const fetchTasks = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filter) params.status = filter;
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

  return (
    <SidebarLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">View all your tasks in one place.</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map(task => {
            const formattedDate = task.due_date 
              ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : null;
            
            return (
              <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-slate-800 line-clamp-2">{task.title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ml-3 ${statusColors[task.status] || statusColors['Todo']}`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{task.description}</p>
                )}
                
                <div className="flex items-center mt-5 pt-4 border-t border-slate-100 text-slate-400 text-xs font-medium">
                  {formattedDate ? (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {formattedDate}
                    </div>
                  ) : (
                    <span className="text-transparent">No date</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <CheckSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-sm font-medium text-slate-900">No tasks found</h3>
            <p className="mt-1 text-sm text-slate-500">Get started by creating a new task on the dashboard.</p>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default MyTasks;
