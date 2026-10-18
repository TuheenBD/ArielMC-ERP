'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Filter,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Circle,
  Tag,
  User,
  AlertCircle,
  Lightbulb,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  X,
  Sparkles,
  Sliders
} from 'lucide-react';
import { UtilityTask, TaskTemplate, TaskStage, TaskPriority } from '@/types/utilities';
import { INITIAL_UTILITY_TASKS, INITIAL_TASK_TEMPLATES } from '@/data/initialUtilitiesData';
import { ThemeProfile } from '@/components/Sidebar';

interface TodoCalendarUtilityProps {
  theme?: ThemeProfile;
}

type ViewMode = 'LIST' | 'CALENDAR' | 'TIME_TRACKING';

export const TodoCalendarUtility: React.FC<TodoCalendarUtilityProps> = ({
  theme = 'crm-green',
}) => {
  const [tasks, setTasks] = useState<UtilityTask[]>(INITIAL_UTILITY_TASKS);
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<UtilityTask>(tasks[1] || tasks[0]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<'ALL' | TaskStage>('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('ALL');
  const [hideCheckedItems, setHideCheckedItems] = useState(false);

  // Quick Task Creation Modal / Inline Form State (Flowlu Screenshot 1)
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [quickTaskForm, setQuickTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '2026-10-27',
    dueTime: '17:00',
    assignee: 'Benjamin Noel',
    owner: 'Syed Akramul Hassan',
    priority: 'HIGH' as TaskPriority,
    stage: 'TODO' as TaskStage,
    estimatedHours: 4,
    tagsString: 'Marketing, Awareness',
    templateId: '',
  });

  // Calendar View State (Flowlu Screenshot 2)
  const [calendarScope, setCalendarScope] = useState<'DAY' | 'WEEK' | 'MONTH'>('WEEK');
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [showMyTasksOnly, setShowMyTasksOnly] = useState<boolean>(false);

  // Active Timer Simulation (Flowlu Screenshot 3)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTasks(prev =>
        prev.map(t => {
          if (t.isTimerRunning) {
            return { ...t, trackedSeconds: t.trackedSeconds + 1 };
          }
          return t;
        })
      );
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Sync selected task with updated tasks
  const activeTask = tasks.find(t => t.id === selectedTaskForDetail?.id) || selectedTaskForDetail;

  // Format seconds to Hh Mm
  const formatTimeHoursMinutes = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Toggle Timer
  const handleToggleTimer = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, isTimerRunning: !t.isTimerRunning };
        }
        return t;
      })
    );
  };

  // Stop Timer
  const handleStopTimer = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return { ...t, isTimerRunning: false };
        }
        return t;
      })
    );
  };

  // Toggle Checklist item
  const handleToggleChecklist = (taskId: string, checklistId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedChecklist = t.checklist.map(item =>
            item.id === checklistId ? { ...item, completed: !item.completed } : item
          );
          return { ...t, checklist: updatedChecklist };
        }
        return t;
      })
    );
  };

  // Update Task Stage
  const handleUpdateStage = (taskId: string, newStage: TaskStage) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, stage: newStage } : t))
    );
  };

  // Quick Task Submission
  const handleCreateQuickTask = () => {
    if (!quickTaskForm.title.trim()) return;

    let initialChecklist: Array<{ id: string; text: string; completed: boolean }> = [
      { id: 'c-1', text: 'Initial planning and scope verification', completed: false },
      { id: 'c-2', text: 'Review deliverables with team lead', completed: false },
    ];

    if (quickTaskForm.templateId) {
      const tpl = INITIAL_TASK_TEMPLATES.find(t => t.id === quickTaskForm.templateId);
      if (tpl) {
        initialChecklist = tpl.defaultChecklist.map((item, idx) => ({
          id: `c-tpl-${idx}`,
          text: item,
          completed: false,
        }));
      }
    }

    const newTask: UtilityTask = {
      id: `TASK-FL-${Date.now().toString().slice(-4)}`,
      title: quickTaskForm.title,
      description: quickTaskForm.description || 'Quickly captured task on the fly.',
      stage: quickTaskForm.stage,
      priority: quickTaskForm.priority,
      dueDate: quickTaskForm.dueDate,
      dueTime: quickTaskForm.dueTime,
      owner: quickTaskForm.owner,
      assignee: quickTaskForm.assignee,
      tags: quickTaskForm.tagsString.split(',').map(s => s.trim()).filter(Boolean),
      checklist: initialChecklist,
      estimatedHours: quickTaskForm.estimatedHours,
      trackedSeconds: 0,
      isTimerRunning: false,
      hourlyRate: 60,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks(prev => [newTask, ...prev]);
    setSelectedTaskForDetail(newTask);
    setIsQuickTaskOpen(false);
    setQuickTaskForm({
      title: '',
      description: '',
      dueDate: '2026-10-27',
      dueTime: '17:00',
      assignee: 'Benjamin Noel',
      owner: 'Syed Akramul Hassan',
      priority: 'HIGH',
      stage: 'TODO',
      estimatedHours: 4,
      tagsString: 'Marketing, Awareness',
      templateId: '',
    });
  };

  // Apply Template selection
  const handleSelectTemplate = (templateId: string) => {
    const tpl = INITIAL_TASK_TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    setQuickTaskForm(prev => ({
      ...prev,
      templateId: tpl.id,
      title: tpl.name,
      description: tpl.description,
      estimatedHours: tpl.defaultEstimatedHours,
      priority: tpl.defaultPriority,
      tagsString: tpl.tags.join(', '),
    }));
  };

  // Export Tasks to CSV
  const handleExportCsv = () => {
    const headers = ['Task ID', 'Title', 'Stage', 'Priority', 'Owner', 'Assignee', 'Due Date', 'Estimated Hours', 'Tracked Hours'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.stage,
      t.priority,
      t.owner,
      t.assignee,
      t.dueDate,
      t.estimatedHours,
      (t.trackedSeconds / 3600).toFixed(2),
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArielMC_Tasks_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filtered Task List
  const filteredTasks = tasks
    .filter(t => (selectedStage === 'ALL' ? true : t.stage === selectedStage))
    .filter(t => (selectedAssignee === 'ALL' ? true : t.assignee.includes(selectedAssignee)))
    .filter(t => (showMyTasksOnly ? t.owner.includes('Syed') || t.assignee.includes('Syed') : true))
    .filter(t =>
      searchQuery
        ? t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    );

  // Time slots for Calendar View (8:00 AM to 5:00 PM)
  const timeSlots = [
    '8:00 am',
    '9:00 am',
    '10:00 am',
    '11:00 am',
    '12:00 pm',
    '1:00 pm',
    '2:00 pm',
    '3:00 pm',
    '4:00 pm',
    '5:00 pm',
  ];

  const weekDays = [
    { label: 'Mon 8/25', date: '2026-10-25' },
    { label: 'Tue 8/26', date: '2026-10-26' },
    { label: 'Wed 8/27', date: '2026-10-27' },
    { label: 'Thu 8/28', date: '2026-10-28' },
    { label: 'Fri 8/29', date: '2026-10-29' },
    { label: 'Sat 8/30', date: '2026-10-30' },
    { label: 'Sun 8/31', date: '2026-10-31' },
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
      {/* Top Header & View Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#234534] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#C8A96A]/20 border border-[#C8A96A]/40 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider">
              Flowlu Productivity Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Tasks • Calendar • Time Tracking
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
            To-Do, Workload Calendar &amp; Billable Time Tracker
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#12241b] border border-[#2b5540] text-xs">
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'LIST'
                  ? 'bg-[#C8A96A] text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('CALENDAR')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'CALENDAR'
                  ? 'bg-[#C8A96A] text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setViewMode('TIME_TRACKING')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'TIME_TRACKING'
                  ? 'bg-[#C8A96A] text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time Tracking</span>
            </button>
          </div>

          {/* Quick Task Creation Trigger */}
          <button
            onClick={() => setIsQuickTaskOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#193d2b] hover:bg-[#22523b] text-white border border-[#347855] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" />
            <span>Create Task</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="p-2 rounded-xl bg-[#14281f] border border-[#2b5540] text-slate-300 hover:text-white transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: LIST VIEW (Flowlu Screenshot 4)
          ========================================================================= */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12241b] border border-[#2b5540]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search high-volume tasks, assignees, tags..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Stage:</span>
              {(['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                    selectedStage === st
                      ? 'bg-[#C8A96A] text-slate-950 font-bold'
                      : 'bg-[#183225] text-slate-300 hover:text-white border border-[#2e5d45]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* High-Volume Tasks Table (Flowlu List View) */}
          <div className="overflow-x-auto rounded-xl border border-[#2b5540] bg-[#0f1f18] shadow-xl">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-[#162f22] border-b border-[#2b5540] text-slate-300 font-mono text-xs uppercase">
                  <th className="p-3.5 w-10">
                    <input type="checkbox" className="rounded accent-[#C8A96A]" />
                  </th>
                  <th className="p-3.5">Task Name</th>
                  <th className="p-3.5">Stage</th>
                  <th className="p-3.5">Owner</th>
                  <th className="p-3.5">Assignee</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Checklist Progress</th>
                  <th className="p-3.5">Time Logged</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#234534] text-slate-300">
                {filteredTasks.map(task => {
                  const completedChecklist = task.checklist.filter(c => c.completed).length;
                  const totalChecklist = task.checklist.length;
                  const isTimerActive = task.isTimerRunning;

                  return (
                    <tr
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskForDetail(task);
                        setViewMode('TIME_TRACKING');
                      }}
                      className="hover:bg-[#152e21]/70 transition-colors cursor-pointer group"
                    >
                      <td className="p-3.5" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="rounded accent-[#C8A96A]" />
                      </td>
                      <td className="p-3.5 font-medium text-white max-w-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold flex items-center gap-1.5 group-hover:text-[#C8A96A] transition-colors">
                            {task.title}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{task.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {task.tags.map((tg, i) => (
                              <span key={i} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            task.stage === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : task.stage === 'IN_PROGRESS'
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                              : task.stage === 'REVIEW'
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {task.stage.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-xs text-slate-300">{task.owner}</td>
                      <td className="p-3.5 text-xs font-medium text-white flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#1e3c2d] text-[#C8A96A] text-[10px] font-bold flex items-center justify-center">
                          {task.assignee.charAt(0)}
                        </div>
                        <span>{task.assignee}</span>
                      </td>
                      <td className="p-3.5 font-mono text-xs text-slate-300">
                        {task.dueDate}
                      </td>
                      <td className="p-3.5 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>{completedChecklist}/{totalChecklist} done</span>
                            <span>{totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0}%</span>
                          </div>
                          <div className="w-24 bg-slate-800 rounded-full h-1.5">
                            <div
                              className="bg-[#C8A96A] h-1.5 rounded-full"
                              style={{ width: `${totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        <span className={isTimerActive ? 'text-emerald-400 font-bold animate-pulse' : 'text-slate-300'}>
                          {formatTimeHoursMinutes(task.trackedSeconds)} / {task.estimatedHours}h
                        </span>
                      </td>
                      <td className="p-3.5 text-right" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleTimer(task.id)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            isTimerActive
                              ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                              : 'bg-[#183226] border-[#2e5d45] text-slate-300 hover:text-white'
                          }`}
                          title={isTimerActive ? 'Pause Timer' : 'Start Timer'}
                        >
                          {isTimerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Flowlu Pro Tip Callout */}
          <div className="p-4 rounded-xl bg-[#14281f] border border-[#28523c] flex items-center gap-3 text-xs text-slate-300">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong>Pro tip:</strong> Need to share progress with an international buyer or internal director?
              Filter tasks by project and date, then export a clear task table. Only visible columns and filtered data will be included.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: CALENDAR VIEW (Flowlu Screenshot 2)
          ========================================================================= */}
      {viewMode === 'CALENDAR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Mini-Calendar & Filter Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl bg-[#0f1f18] border border-[#2b5540] p-4 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#234534] pb-2">
                <span className="font-bold text-sm text-white font-mono">August 2026</span>
                <div className="flex items-center gap-1 text-slate-400">
                  <button className="p-1 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
                  <button className="p-1 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Mini Calendar 7-col grid */}
              <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                  <span key={d} className="text-slate-500 font-bold text-[10px] py-1">{d}</span>
                ))}
                {[28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((dayNum, idx) => {
                  const isSelected = dayNum === 27;
                  return (
                    <button
                      key={idx}
                      className={`py-1.5 rounded-md text-[11px] transition-colors ${
                        isSelected
                          ? 'bg-[#003B73] text-white font-bold'
                          : 'text-slate-300 hover:bg-[#183226]'
                      }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#234534] space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={!showMyTasksOnly}
                    onChange={() => setShowMyTasksOnly(false)}
                    className="rounded border-slate-700 accent-[#C8A96A]"
                  />
                  <span>All Operational Tasks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={showMyTasksOnly}
                    onChange={() => setShowMyTasksOnly(true)}
                    className="rounded border-slate-700 accent-[#C8A96A]"
                  />
                  <span>My Tasks Only</span>
                </label>
              </div>
            </div>

            {/* Calendar Workload Tip */}
            <div className="p-4 rounded-xl bg-[#12241b] border border-[#244935] text-xs space-y-2 text-slate-300">
              <span className="font-bold text-[#C8A96A] block">Calendar View Guidance:</span>
              <p className="leading-relaxed">
                Balance your cross-border workload by day, week, or month. Click any time slot to schedule production milestones and buyer meetings.
              </p>
            </div>
          </div>

          {/* Main Calendar Grid (9 cols) */}
          <div className="lg:col-span-9 rounded-xl bg-[#0f1f18] border border-[#2b5540] p-4 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#234534] pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                  className="p-1.5 rounded-lg bg-[#14281f] border border-[#2b5540] hover:bg-[#1a382b]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-white font-mono">
                  Week: Mon 8/25 – Sun 8/31, 2026
                </span>
                <button
                  onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                  className="p-1.5 rounded-lg bg-[#14281f] border border-[#2b5540] hover:bg-[#1a382b]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#12241b] border border-[#2b5540] text-xs">
                {(['DAY', 'WEEK', 'MONTH'] as const).map(sc => (
                  <button
                    key={sc}
                    onClick={() => setCalendarScope(sc)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                      calendarScope === sc
                        ? 'bg-[#C8A96A] text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sc}
                  </button>
                ))}
              </div>
            </div>

            {/* Time-Slotted Calendar Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Days Header */}
                <div className="grid grid-cols-8 border-b border-[#234534] pb-2 text-center text-xs font-mono">
                  <div className="text-slate-500 font-bold">Time</div>
                  {weekDays.map((d, i) => (
                    <div key={i} className="text-slate-300 font-bold">
                      {d.label}
                    </div>
                  ))}
                </div>

                {/* Slots Rows */}
                <div className="divide-y divide-[#1e3c2d] text-xs">
                  {timeSlots.map((time, rowIdx) => (
                    <div key={time} className="grid grid-cols-8 py-2.5 items-start min-h-[50px]">
                      <div className="text-[11px] font-mono text-slate-500 pr-2 pt-1">{time}</div>

                      {weekDays.map((day, colIdx) => {
                        // Place realistic tasks into specific slots like in Flowlu screenshot
                        const isMatchTask1 = rowIdx === 1 && colIdx === 2; // Tue 9am: Social Media Campaign
                        const isMatchTask2 = rowIdx === 2 && colIdx === 1; // Mon 10am: Analyze Competitors
                        const isMatchTask3 = rowIdx === 3 && colIdx === 4; // Thu 11am: AQL 2.5 Inspection

                        return (
                          <div
                            key={colIdx}
                            className="px-1 min-h-[40px] border-l border-[#1e3c2d] hover:bg-[#14281f]/40 transition-colors"
                          >
                            {isMatchTask1 && (
                              <div
                                onClick={() => {
                                  setSelectedTaskForDetail(tasks[0]);
                                  setViewMode('TIME_TRACKING');
                                }}
                                className="p-1.5 rounded-md bg-[#003B73] border border-blue-400/40 text-[10px] text-white font-medium cursor-pointer shadow hover:scale-102 transition-transform"
                              >
                                <span className="font-bold block truncate">Social Media Awareness</span>
                                <span className="text-[9px] text-blue-200 block">Benjamin Noel</span>
                              </div>
                            )}

                            {isMatchTask2 && (
                              <div
                                onClick={() => {
                                  setSelectedTaskForDetail(tasks[1]);
                                  setViewMode('TIME_TRACKING');
                                }}
                                className="p-1.5 rounded-md bg-amber-950/80 border border-amber-500/40 text-[10px] text-amber-100 font-medium cursor-pointer shadow hover:scale-102 transition-transform"
                              >
                                <span className="font-bold block truncate">Analyze Competitors</span>
                                <span className="text-[9px] text-amber-300 block">Molly Clarkson</span>
                              </div>
                            )}

                            {isMatchTask3 && (
                              <div
                                onClick={() => {
                                  setSelectedTaskForDetail(tasks[2]);
                                  setViewMode('TIME_TRACKING');
                                }}
                                className="p-1.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[10px] text-emerald-100 font-medium cursor-pointer shadow hover:scale-102 transition-transform"
                              >
                                <span className="font-bold block truncate">AQL 2.5 Savar Audit</span>
                                <span className="text-[9px] text-emerald-300 block">Tariqul Islam</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: TIME TRACKING & TASK DETAIL (Flowlu Screenshot 3)
          ========================================================================= */}
      {viewMode === 'TIME_TRACKING' && activeTask && (
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0f1f18] border border-[#2b5540] p-6 md:p-8 shadow-2xl space-y-6">
          {/* Header & Stage Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider">
                Active Time-Tracked Task
              </span>
              <h2 className="text-2xl font-black text-white">{activeTask.title}</h2>
              <p className="text-xs md:text-sm text-slate-300">{activeTask.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Stage Dropdown (Flowlu Style) */}
              <div className="relative">
                <select
                  value={activeTask.stage}
                  onChange={e => handleUpdateStage(activeTask.id, e.target.value as TaskStage)}
                  className="px-3.5 py-2 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold font-mono focus:outline-none"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Stopwatch Timer Controls (Flowlu Style: Play/Pause, Stop, Time) */}
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#14281f] border border-[#2b5540]">
                <button
                  onClick={() => handleToggleTimer(activeTask.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    activeTask.isTimerRunning
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                  title={activeTask.isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                >
                  {activeTask.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleStopTimer(activeTask.id)}
                  className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 hover:bg-red-900 transition-colors"
                  title="Stop Timer"
                >
                  <Square className="w-4 h-4" />
                </button>
                <div className="px-3 py-1 font-mono text-sm font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#C8A96A]" />
                  <span>
                    {formatTimeHoursMinutes(activeTask.trackedSeconds)} / {activeTask.estimatedHours}h 0m
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Section with Dynamic Progress Bar (Flowlu Screenshot 3) */}
          <div className="rounded-xl bg-[#14281f] border border-[#28523c] p-6 space-y-4">
            {(() => {
              const completedCount = activeTask.checklist.filter(c => c.completed).length;
              const totalCount = activeTask.checklist.length;
              const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-white">Checklist</span>
                      <div className="w-44 bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#003B73] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        Completed: {completedCount} out of {totalCount}
                      </span>
                    </div>

                    <button
                      onClick={() => setHideCheckedItems(!hideCheckedItems)}
                      className="text-xs text-[#C8A96A] hover:underline font-mono"
                    >
                      {hideCheckedItems ? 'Show checked' : 'Hide checked'}
                    </button>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 pt-1">
                    {activeTask.checklist
                      .filter(item => (hideCheckedItems ? !item.completed : true))
                      .map(item => (
                        <div
                          key={item.id}
                          onClick={() => handleToggleChecklist(activeTask.id, item.id)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                            item.completed
                              ? 'bg-[#102219]/60 border-[#234533] text-slate-400'
                              : 'bg-[#183225] border-[#2e5d45] text-slate-100 hover:border-[#3d7a5a]'
                          }`}
                        >
                          <div className="pt-0.5">
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#003B73] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                          </div>
                          <span
                            className={`text-xs md:text-sm leading-relaxed ${
                              item.completed ? 'line-through text-slate-400' : 'text-slate-200'
                            }`}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Auto-Cost Calculation & Invoicing Box (Flowlu Pro Tip 3) */}
          <div className="p-4 rounded-xl bg-[#14281f] border border-[#2b5540] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Auto-Cost &amp; Invoicing Calculator (Pro Tip)
              </span>
              <p className="text-xs text-slate-300">
                Tracked time ({formatTimeHoursMinutes(activeTask.trackedSeconds)}) automatically calculates billable client costs.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">
                Billable Cost @ ${activeTask.hourlyRate || 65}/hr
              </span>
              <div className="text-xl font-black text-[#C8A96A] font-mono">
                ${(((activeTask.trackedSeconds / 3600) * (activeTask.hourlyRate || 65))).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          QUICK TASK CREATION MODAL / DRAWER (Flowlu Screenshot 1)
          ========================================================================= */}
      {isQuickTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1f18] border-2 border-[#C8A96A]/60 shadow-2xl p-6 space-y-4 text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#C8A96A] font-bold uppercase tracking-wider">
                  Flowlu Quick Task Creation
                </span>
                <h3 className="text-base font-bold text-white">Create Repeatable Task or Capture on the Fly</h3>
              </div>
              <button
                onClick={() => setIsQuickTaskOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1">
                Use a Task Template (Optional):
              </label>
              <select
                value={quickTaskForm.templateId}
                onChange={e => handleSelectTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white text-xs focus:outline-none focus:border-[#C8A96A]"
              >
                <option value="">-- Blank Task (Create from Scratch) --</option>
                {INITIAL_TASK_TEMPLATES.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.defaultEstimatedHours}h)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Title:</label>
                <input
                  type="text"
                  value={quickTaskForm.title}
                  onChange={e => setQuickTaskForm({ ...quickTaskForm, title: e.target.value })}
                  placeholder="e.g. Create a Social Media Awareness Campaign"
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-bold focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={quickTaskForm.description}
                  onChange={e => setQuickTaskForm({ ...quickTaskForm, description: e.target.value })}
                  placeholder="Build visibility and engagement for the client's new product launch."
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date:</label>
                  <input
                    type="date"
                    value={quickTaskForm.dueDate}
                    onChange={e => setQuickTaskForm({ ...quickTaskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assignee:</label>
                  <select
                    value={quickTaskForm.assignee}
                    onChange={e => setQuickTaskForm({ ...quickTaskForm, assignee: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="Benjamin Noel">Benjamin Noel</option>
                    <option value="Molly Clarkson">Molly Clarkson</option>
                    <option value="Tariqul Islam">Tariqul Islam (QC)</option>
                    <option value="Sarah Jenkins">Sarah Jenkins (UK)</option>
                    <option value="Syed Akramul Hassan">Syed Akramul Hassan</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#234534] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsQuickTaskOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuickTask}
                disabled={!quickTaskForm.title.trim()}
                className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
