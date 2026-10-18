'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Trash2,
  Copy,
  Check,
  Search,
  Download,
  Printer,
  Tag,
  Clock,
  Sparkles,
  Edit3
} from 'lucide-react';
import { OfficeNote, NoteCategory } from '@/types/utilities';
import { INITIAL_OFFICE_NOTES } from '@/data/initialUtilitiesData';

export const NotePadUtility: React.FC = () => {
  const [notes, setNotes] = useState<OfficeNote[]>(INITIAL_OFFICE_NOTES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNote, setActiveNote] = useState<OfficeNote | null>(notes[0] || null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form for new/editing note
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: 'GENERAL' as NoteCategory,
    tagsString: '',
    color: '#1E3B2F',
    isPinned: false,
  });

  const handleStartCreate = () => {
    setNoteForm({
      title: '',
      content: '',
      category: 'GENERAL',
      tagsString: '',
      color: '#1E3B2F',
      isPinned: false,
    });
    setIsCreatingNew(true);
  };

  const handleSaveNewNote = () => {
    if (!noteForm.title.trim()) return;
    const newNote: OfficeNote = {
      id: `NOTE-${Date.now().toString().slice(-4)}`,
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category,
      tags: noteForm.tagsString
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      isPinned: noteForm.isPinned,
      color: noteForm.color,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setIsCreatingNew(false);
  };

  const handleDeleteNote = (id: string) => {
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeNote?.id === id) {
      setActiveNote(remaining[0] || null);
    }
  };

  const handleTogglePin = (id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleCopyNote = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadTxt = (note: OfficeNote) => {
    const element = document.createElement('a');
    const file = new Blob([`${note.title}\n\nCategory: ${note.category}\nDate: ${note.updatedAt}\n\n${note.content}`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered Notes
  const filteredNotes = notes
    .filter(n => (selectedCategory === 'ALL' ? true : n.category === selectedCategory))
    .filter(n =>
      searchQuery
        ? n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C8A96A]" />
            Enterprise Note Pad &amp; Scratchpad Studio
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Quick notes, meeting minutes, technical pattern specs, and corporate memos with local export.
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Note List & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Category Pills */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search memos, tags, notes..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#14261d] border border-[#2b5540] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C8A96A]"
              />
            </div>

            <div className="flex flex-wrap gap-1 text-[11px] font-mono">
              {['ALL', 'SOURCING', 'MEETING', 'TECHPACK', 'FINANCE', 'GENERAL'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#C8A96A] text-slate-950 font-bold'
                      : 'bg-[#14261d] text-slate-400 hover:text-white border border-[#234534]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Cards List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-[#12241b] border border-[#244835] text-slate-400 text-xs">
                No notes found matching your filter criteria.
              </div>
            ) : (
              filteredNotes.map(note => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNote(note);
                      setIsCreatingNew(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#183226] border-[#C8A96A] shadow-lg shadow-black/40'
                        : 'bg-[#12241b] border-[#254d37] hover:border-[#387050]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {note.isPinned && <Pin className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />}
                        <h4 className="font-bold text-sm text-white truncate">{note.title}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] shrink-0">
                        {note.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {note.content}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                      <span>{note.updatedAt}</span>
                      <div className="flex items-center gap-1">
                        {note.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Note Editor / Full Note View (7 cols) */}
        <div className="lg:col-span-7">
          {isCreatingNew ? (
            /* Creation Form */
            <div className="rounded-xl bg-[#0f1f18] border border-[#2b5540] p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#234534] pb-3">
                <span className="text-xs font-mono font-bold text-[#C8A96A] uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" />
                  Compose New Office Memo
                </span>
                <button
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-400 hover:text-white font-mono"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Note Title:</label>
                  <input
                    type="text"
                    value={noteForm.title}
                    onChange={e => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="e.g. Sourcing Terms for Savar Lot #48"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-bold focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category:</label>
                    <select
                      value={noteForm.category}
                      onChange={e => setNoteForm({ ...noteForm, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                    >
                      <option value="GENERAL">General</option>
                      <option value="SOURCING">Sourcing</option>
                      <option value="MEETING">Meeting</option>
                      <option value="TECHPACK">TechPack</option>
                      <option value="FINANCE">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Tags (Comma-separated):</label>
                    <input
                      type="text"
                      value={noteForm.tagsString}
                      onChange={e => setNoteForm({ ...noteForm, tagsString: e.target.value })}
                      placeholder="e.g. Leather, MOQ, Savar"
                      className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Content / Memo Body:</label>
                  <textarea
                    rows={10}
                    value={noteForm.content}
                    onChange={e => setNoteForm({ ...noteForm, content: e.target.value })}
                    placeholder="Write detailed specifications, meeting notes, action items..."
                    className="w-full px-3 py-2.5 rounded-lg bg-[#183326] border border-[#2e5d45] text-white leading-relaxed font-sans focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={noteForm.isPinned}
                      onChange={e => setNoteForm({ ...noteForm, isPinned: e.target.checked })}
                      className="rounded border-slate-700 accent-[#C8A96A]"
                    />
                    <span>Pin to top of list</span>
                  </label>

                  <button
                    onClick={handleSaveNewNote}
                    disabled={!noteForm.title.trim()}
                    className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50"
                  >
                    Save Memo
                  </button>
                </div>
              </div>
            </div>
          ) : activeNote ? (
            /* Active Note Reader & Tools */
            <div className="rounded-xl bg-[#0f1f18] border border-[#2b5540] p-6 space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-4 border-b border-[#234534] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1e3c2d] text-emerald-300 border border-[#2d5942]">
                      {activeNote.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {activeNote.updatedAt}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{activeNote.title}</h3>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleTogglePin(activeNote.id)}
                    className={`p-2 rounded-lg border text-xs transition-colors ${
                      activeNote.isPinned
                        ? 'bg-[#C8A96A]/20 border-[#C8A96A] text-[#C8A96A]'
                        : 'bg-[#183226] border-[#2e5d45] text-slate-400 hover:text-white'
                    }`}
                    title={activeNote.isPinned ? 'Unpin' : 'Pin Note'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyNote(activeNote.content, activeNote.id)}
                    className="p-2 rounded-lg bg-[#183226] border border-[#2e5d45] text-slate-300 hover:text-white transition-colors"
                    title="Copy Content"
                  >
                    {copiedId === activeNote.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDownloadTxt(activeNote)}
                    className="p-2 rounded-lg bg-[#183226] border border-[#2e5d45] text-slate-300 hover:text-white transition-colors"
                    title="Download as TXT"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(activeNote.id)}
                    className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 transition-colors"
                    title="Delete Note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <div className="p-5 rounded-xl bg-[#14281f] border border-[#28523c] text-slate-200 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {activeNote.content}
              </div>

              {/* Tags Footer */}
              {activeNote.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Tags:
                  </span>
                  {activeNote.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-[#1a382a] border border-[#2d5942] text-[#C8A96A] text-xs font-mono font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[#0f1f18] border border-[#234534] text-slate-400 text-xs space-y-3">
              <FileText className="w-8 h-8 text-slate-500 mx-auto" />
              <p>Select a note from the list on the left or create a new memo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
