'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  Tag,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Search,
  Check,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { AccountHead, AccountHeadType } from '@/types/accountHead';
import { INITIAL_ACCOUNT_HEADS } from '@/data/initialAccountHeads';
import { StandardVoucher } from '@/types/voucher';

interface AccountHeadManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountHeads: AccountHead[];
  onSaveAccountHeads: (updatedHeads: AccountHead[]) => void;
  vouchers?: StandardVoucher[];
  onRenameHeadInVouchers?: (oldHeadName: string, newHeadName: string) => void;
}

export const AccountHeadManagementModal: React.FC<AccountHeadManagementModalProps> = ({
  isOpen,
  onClose,
  accountHeads,
  onSaveAccountHeads,
  vouchers = [],
  onRenameHeadInVouchers,
}) => {
  // Tab filter
  const [activeTab, setActiveTab] = useState<'ALL' | 'EXPENSE' | 'INCOME'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Mode: List or Create
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form State for Creating New Head
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<AccountHeadType>('EXPENSE');
  const [newDescription, setNewDescription] = useState('');
  const [newSubCategories, setNewSubCategories] = useState<string[]>([]);
  const [subCategoryInput, setSubCategoryInput] = useState('');

  // State for Editing/Renaming Head
  const [editingHeadId, setEditingHeadId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editType, setEditType] = useState<AccountHeadType>('EXPENSE');
  const [editDescription, setEditDescription] = useState('');
  const [editSubCategories, setEditSubCategories] = useState<string[]>([]);
  const [editSubCategoryInput, setEditSubCategoryInput] = useState('');
  const [updateLinkedVouchersOnRename, setUpdateLinkedVouchersOnRename] = useState(true);

  // State for Delete Confirmation
  const [deletingHead, setDeletingHead] = useState<AccountHead | null>(null);

  // Success Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  if (!isOpen) return null;

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter heads
  const filteredHeads = accountHeads.filter((head) => {
    const matchesTab = activeTab === 'ALL' || head.type === activeTab;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      head.name.toLowerCase().includes(q) ||
      (head.code && head.code.toLowerCase().includes(q)) ||
      (head.description && head.description.toLowerCase().includes(q)) ||
      head.subCategories.some((sub) => sub.toLowerCase().includes(q));
    return matchesTab && matchesQuery;
  });

  // Calculate voucher counts for a head
  const getLinkedVoucherCount = (headName: string) => {
    return vouchers.filter((v) => v.mainAccountHead.toLowerCase() === headName.toLowerCase()).length;
  };

  // Add Subcategory in Create Form
  const handleAddSubCategory = () => {
    const trimmed = subCategoryInput.trim();
    if (!trimmed) return;
    if (newSubCategories.includes(trimmed)) return;
    setNewSubCategories([...newSubCategories, trimmed]);
    setSubCategoryInput('');
  };

  // Remove Subcategory in Create Form
  const handleRemoveSubCategory = (sub: string) => {
    setNewSubCategories(newSubCategories.filter((s) => s !== sub));
  };

  // Add Subcategory in Edit Form
  const handleAddEditSubCategory = () => {
    const trimmed = editSubCategoryInput.trim();
    if (!trimmed) return;
    if (editSubCategories.includes(trimmed)) return;
    setEditSubCategories([...editSubCategories, trimmed]);
    setEditSubCategoryInput('');
  };

  // Remove Subcategory in Edit Form
  const handleRemoveEditSubCategory = (sub: string) => {
    setEditSubCategories(editSubCategories.filter((s) => s !== sub));
  };

  // 1. CREATE NEW ACCOUNT HEAD
  const handleCreateHead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Please enter an Account Head Title/Name.');
      return;
    }

    // Check duplicate
    if (accountHeads.some((h) => h.name.trim().toLowerCase() === newName.trim().toLowerCase())) {
      alert('An Account Head with this name already exists.');
      return;
    }

    const newHead: AccountHead = {
      id: `head-custom-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim() || (newType === 'EXPENSE' ? `EXP-${accountHeads.length + 1}` : `INC-${accountHeads.length + 1}`),
      type: newType,
      description: newDescription.trim() || undefined,
      subCategories: newSubCategories.length > 0 ? newSubCategories : ['General Operational Particulars'],
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...accountHeads, newHead];
    onSaveAccountHeads(updated);

    // Reset Create Form
    setNewName('');
    setNewCode('');
    setNewDescription('');
    setNewSubCategories([]);
    setSubCategoryInput('');
    setIsCreatingNew(false);
    showNotification(`New Account Head "${newHead.name}" created successfully!`);
  };

  // 2. START EDITING HEAD
  const handleStartEdit = (head: AccountHead) => {
    setEditingHeadId(head.id);
    setEditName(head.name);
    setEditCode(head.code || '');
    setEditType(head.type);
    setEditDescription(head.description || '');
    setEditSubCategories([...head.subCategories]);
    setEditSubCategoryInput('');
    setUpdateLinkedVouchersOnRename(true);
  };

  // CANCEL EDITING
  const handleCancelEdit = () => {
    setEditingHeadId(null);
  };

  // 3. SAVE EDITED / RENAMED HEAD
  const handleSaveEdit = (originalHead: AccountHead) => {
    if (!editName.trim()) {
      alert('Account Head Title cannot be empty.');
      return;
    }

    const oldName = originalHead.name;
    const newNameTrimmed = editName.trim();
    const hasNameChanged = oldName !== newNameTrimmed;

    const updated = accountHeads.map((h) => {
      if (h.id === originalHead.id) {
        return {
          ...h,
          name: newNameTrimmed,
          code: editCode.trim() || h.code,
          type: editType,
          description: editDescription.trim() || undefined,
          subCategories: editSubCategories.length > 0 ? editSubCategories : ['General Operational Particulars'],
          updatedAt: new Date().toISOString(),
        };
      }
      return h;
    });

    onSaveAccountHeads(updated);

    // If name changed and user checked update vouchers
    if (hasNameChanged && updateLinkedVouchersOnRename && onRenameHeadInVouchers) {
      onRenameHeadInVouchers(oldName, newNameTrimmed);
    }

    setEditingHeadId(null);
    showNotification(`Account Head "${newNameTrimmed}" successfully updated and saved!`);
  };

  // 4. CONFIRM DELETE HEAD
  const handleConfirmDelete = () => {
    if (!deletingHead) return;
    const remaining = accountHeads.filter((h) => h.id !== deletingHead.id);
    onSaveAccountHeads(remaining);
    showNotification(`Account Head "${deletingHead.name}" has been deleted.`);
    setDeletingHead(null);
  };

  // 5. RESET TO SYSTEM DEFAULTS
  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to restore the default ArielMC Chart of Accounts? Any custom heads you created will be preserved or merged.')) {
      // Merge defaults with custom non-default heads
      const customOnes = accountHeads.filter((h) => !h.isDefault);
      const merged = [...INITIAL_ACCOUNT_HEADS, ...customOnes];
      onSaveAccountHeads(merged);
      showNotification('Restored system default statutory Account Heads.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn print:hidden">
      <div className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0A140F] border-b border-[#2C5240] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-950/80 to-[#12231B] border border-emerald-500/30 text-[#C8A96A]">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-white">
                  Chart of Accounts &amp; Account Heads Manager
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  {accountHeads.length} Total Heads
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Create, rename, configure sub-categories, or delete Expenditure &amp; Income heads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingNew && (
              <button
                type="button"
                id="btn-add-new-account-head-toggle"
                onClick={() => setIsCreatingNew(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] hover:from-[#258247] hover:to-[#1a6637] text-white font-bold text-xs flex items-center gap-1.5 shadow-md border border-[#C8A96A]/40 transition-all cursor-pointer font-['Montserrat']"
              >
                <Plus className="w-4 h-4 text-[#C8A96A]" />
                <span>+ New Account Head</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Notification Banner */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs font-mono shrink-0 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
              <span className="font-bold text-white">{notification.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#060D09] space-y-5">
          
          {/* =========================================================
              1. CREATE NEW ACCOUNT HEAD FORM (Accordion / Collapsible)
              ========================================================= */}
          {isCreatingNew && (
            <div className="p-5 rounded-2xl bg-[#12231B] border-2 border-[#C8A96A]/60 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                  <h4 className="font-heading font-bold text-sm text-white">
                    Create New Account Head
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-mono"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>

              <form onSubmit={handleCreateHead} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Account Head Title / Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. 5. Machinery & Tooling Capital Outlay"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-semibold focus:border-[#C8A96A] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Classification Type *
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as AccountHeadType)}
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-xs font-mono font-bold focus:border-[#C8A96A] outline-none text-white"
                    >
                      <option value="EXPENSE">Expenditure / Disbursement Head</option>
                      <option value="INCOME">Income / Money Receive Head</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Account Code / Identifier
                    </label>
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="e.g. EXP-05 or INC-06"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-[#C8A96A] text-xs font-mono font-bold focus:border-[#C8A96A] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-300 uppercase font-mono mb-1">
                      Description &amp; Compliance Notes
                    </label>
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Short summary of expenditures or revenues falling under this ledger head"
                      className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-gray-300 text-xs focus:border-[#C8A96A] outline-none"
                    />
                  </div>
                </div>

                {/* Sub-Categories Builder */}
                <div className="p-3.5 rounded-xl bg-[#0A140F] border border-[#2C5240] space-y-2">
                  <label className="block text-[11px] font-bold text-[#C8A96A] uppercase font-mono">
                    Sub-Categories / Line Items for this Head
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={subCategoryInput}
                      onChange={(e) => setSubCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubCategory();
                        }
                      }}
                      placeholder="Type a sub-category item and click Add (or press Enter)..."
                      className="flex-1 p-2 rounded-lg bg-[#12231B] border border-[#2C5240] text-white text-xs outline-none focus:border-[#C8A96A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubCategory}
                      className="px-3.5 py-1.5 rounded-lg bg-[#1E6B3A] hover:bg-[#258247] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      + Add Item
                    </button>
                  </div>

                  {/* Subcategories tags */}
                  {newSubCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {newSubCategories.map((sub) => (
                        <span
                          key={sub}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12231B] border border-emerald-500/30 text-xs text-gray-200"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubCategory(sub)}
                            className="text-gray-400 hover:text-red-400 ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500 font-mono italic pt-1">
                      No sub-categories added yet. (A default &quot;General Operational Particulars&quot; item will be created automatically).
                    </p>
                  )}
                </div>

                {/* Form Submit & Cancel */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNew(false)}
                    className="px-4 py-2 rounded-xl border border-gray-600 text-gray-300 font-semibold text-xs hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E6B3A] to-[#14512C] text-white font-bold text-xs shadow-lg hover:from-[#258247] hover:to-[#1a6637] transition-all cursor-pointer flex items-center gap-1.5 border border-[#C8A96A]/40"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                    <span>Save New Account Head</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* =========================================================
              2. SEARCH & CLASSIFICATION TABS BAR
              ========================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12231B] border border-[#2C5240]">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#0A140F] p-1 rounded-xl text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-[#1E6B3A] text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All Heads ({accountHeads.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('EXPENSE')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'EXPENSE'
                    ? 'bg-amber-900/60 text-amber-200 border border-amber-500/40 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                <span>Expense / Purchase ({accountHeads.filter((h) => h.type === 'EXPENSE').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('INCOME')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  activeTab === 'INCOME'
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>Income / Receive ({accountHeads.filter((h) => h.type === 'INCOME').length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search heads or sub-categories..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0A140F] border border-[#2C5240] text-xs text-white placeholder-gray-500 focus:border-[#C8A96A] outline-none font-mono"
              />
            </div>
          </div>

          {/* =========================================================
              3. LIST OF ACCOUNT HEADS (With Inline Edit / Rename & Delete)
              ========================================================= */}
          <div className="space-y-3">
            {filteredHeads.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-mono bg-[#12231B] rounded-xl border border-[#2C5240]">
                <FolderTree className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                No Account Heads found matching your search.
              </div>
            ) : (
              filteredHeads.map((head) => {
                const isEditing = editingHeadId === head.id;
                const linkedCount = getLinkedVoucherCount(head.name);
                const isExpense = head.type === 'EXPENSE';

                if (isEditing) {
                  {/* INLINE EDIT / RENAME FORM */}
                  return (
                    <div
                      key={head.id}
                      className="p-5 rounded-xl bg-[#12231B] border-2 border-emerald-500/70 shadow-lg space-y-3 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Edit2 className="w-4 h-4 text-[#C8A96A]" />
                          <h4 className="font-heading font-bold text-sm text-white">
                            Edit / Rename Account Head: <span className="text-[#C8A96A]">{head.name}</span>
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-gray-400">
                          {linkedCount} voucher(s) currently linked
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                            Account Head Title / Name *
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-bold focus:border-[#C8A96A] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                            Classification Type
                          </label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as AccountHeadType)}
                            className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-white text-xs font-mono font-bold focus:border-[#C8A96A] outline-none"
                          >
                            <option value="EXPENSE">Expenditure / Disbursement</option>
                            <option value="INCOME">Income / Money Receive</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                            Code / Identifier
                          </label>
                          <input
                            type="text"
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-[#C8A96A] text-xs font-mono font-bold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-300 uppercase font-mono mb-1">
                            Description &amp; Operational Purpose
                          </label>
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full p-2 rounded-lg bg-[#0A140F] border border-[#2C5240] text-gray-200 text-xs"
                          />
                        </div>
                      </div>

                      {/* Edit Sub-Categories */}
                      <div className="p-3 rounded-lg bg-[#0A140F] border border-[#2C5240] space-y-2">
                        <label className="block text-[10px] font-bold text-[#C8A96A] uppercase font-mono">
                          Manage Sub-Categories for this Head
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editSubCategoryInput}
                            onChange={(e) => setEditSubCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditSubCategory();
                              }
                            }}
                            placeholder="Add new sub-category line item..."
                            className="flex-1 p-1.5 rounded-lg bg-[#12231B] border border-[#2C5240] text-white text-xs outline-none focus:border-[#C8A96A]"
                          />
                          <button
                            type="button"
                            onClick={handleAddEditSubCategory}
                            className="px-3 py-1 rounded-lg bg-[#1E6B3A] text-white text-xs font-bold"
                          >
                            + Add
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {editSubCategories.map((sub) => (
                            <span
                              key={sub}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#12231B] border border-gray-700 text-xs text-gray-300"
                            >
                              <span>{sub}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEditSubCategory(sub)}
                                className="text-gray-400 hover:text-red-400 ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Update Linked Vouchers Checkbox */}
                      {linkedCount > 0 && (
                        <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>
                              {linkedCount} historical voucher(s) currently reference this Account Head.
                            </span>
                          </div>
                          <label className="flex items-center gap-2 font-mono text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={updateLinkedVouchersOnRename}
                              onChange={(e) => setUpdateLinkedVouchersOnRename(e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-600 focus:ring-[#C8A96A]"
                            />
                            <span>Cascade name change to linked vouchers</span>
                          </label>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 text-xs font-semibold hover:bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(head)}
                          className="px-4 py-1.5 rounded-lg bg-[#1E6B3A] hover:bg-[#258247] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                {/* NORMAL CARD DISPLAY */}
                return (
                  <div
                    key={head.id}
                    className="p-4 rounded-xl bg-[#12231B] border border-[#2C5240] hover:border-[#396851] transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                            isExpense
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isExpense ? <ArrowUpRight className="w-3 h-3 text-amber-400" /> : <ArrowDownLeft className="w-3 h-3 text-emerald-400" />}
                          <span>{isExpense ? 'Expenditure Head' : 'Income Head'}</span>
                        </span>

                        {head.code && (
                          <span className="px-2 py-0.5 rounded bg-black/40 text-[#C8A96A] font-mono text-xs font-bold border border-white/10">
                            {head.code}
                          </span>
                        )}

                        <h4 className="font-heading font-bold text-sm text-white">
                          {head.name}
                        </h4>

                        {head.isDefault && (
                          <span className="px-1.5 py-0.2 rounded bg-white/10 text-gray-400 font-mono text-[9px]">
                            Statutory Default
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Edit/Rename & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] font-mono text-gray-400 mr-2">
                          {linkedCount} vouchers
                        </span>

                        <button
                          type="button"
                          onClick={() => handleStartEdit(head)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0A140F] hover:bg-[#1A3326] border border-[#2C5240] hover:border-emerald-500 text-gray-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit or Rename this Account Head"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                          <span>Edit / Rename</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingHead(head)}
                          className="p-1.5 rounded-lg bg-[#0A140F] hover:bg-rose-950/60 border border-[#2C5240] hover:border-rose-500/40 text-gray-400 hover:text-rose-300 transition-colors cursor-pointer"
                          title="Delete this Account Head"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {head.description && (
                      <p className="text-xs text-gray-300 font-['Open_Sans']">
                        {head.description}
                      </p>
                    )}

                    {/* Subcategories list pills */}
                    <div className="pt-1 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-mono uppercase text-gray-500 font-semibold mr-1">
                        Sub-categories ({head.subCategories.length}):
                      </span>
                      {head.subCategories.map((sub) => (
                        <span
                          key={sub}
                          className="inline-block px-2 py-0.5 rounded bg-[#0A140F] text-[11px] text-gray-300 border border-white/5 font-mono"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3 bg-[#0A140F] border-t border-[#2C5240] flex items-center justify-between text-xs shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-gray-400 hover:text-amber-400 font-mono text-[11px] transition-colors cursor-pointer"
            title="Restore default chart of accounts"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Statutory Defaults</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1E6B3A] hover:bg-[#258247] text-white font-bold text-xs shadow-md transition-all cursor-pointer font-['Montserrat']"
          >
            Done
          </button>
        </div>
      </div>

      {/* Delete Confirmation Sub-Modal */}
      {deletingHead && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 animate-fadeIn">
          <div className="bg-[#12231B] border-2 border-rose-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-heading font-bold text-base text-white">
                Delete Account Head?
              </h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed font-['Open_Sans']">
              Are you sure you want to delete the Account Head{' '}
              <strong className="text-white">&quot;{deletingHead.name}&quot;</strong>?
            </p>

            {getLinkedVoucherCount(deletingHead.name) > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>{getLinkedVoucherCount(deletingHead.name)} Voucher(s) Linked</span>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  Existing historical vouchers will maintain this head name in your financial ledger, but this head will no longer be available for future voucher entries.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeletingHead(null)}
                className="px-4 py-2 rounded-xl border border-gray-600 hover:bg-white/5 text-gray-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Confirm Delete Head
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
