'use client';

import React, { useState, useEffect } from 'react';
import {
  Users2,
  Search,
  Plus,
  Mail,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  Tag,
  Download,
  Printer,
  Copy,
  Check,
  Briefcase,
  UserCheck,
  ExternalLink,
  ShieldCheck,
  X,
  Edit2,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react';
import { EnterpriseContact, ContactCategory } from '@/types/utilities';
import { INITIAL_ENTERPRISE_CONTACTS } from '@/data/initialUtilitiesData';
import { fetchEnterpriseContacts, persistEnterpriseContacts } from '@/lib/erpPersistence';

export const ContactsDirectoryUtility: React.FC = () => {
  const [contacts, setContacts] = useState<EnterpriseContact[]>(INITIAL_ENTERPRISE_CONTACTS);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ContactCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EnterpriseContact | null>(null);

  // Selection state
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  // Load persisted contacts on mount
  useEffect(() => {
    fetchEnterpriseContacts().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setContacts(loaded);
      }
    });
  }, []);

  // New Contact Form State
  const [newContact, setNewContact] = useState<Partial<EnterpriseContact>>({
    name: '',
    company: '',
    role: '',
    category: 'BUYER',
    station: 'Dhaka HQ',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    taxOrVatId: '',
    notes: '',
    leadTimeOrCapacity: '',
  });

  const handleCopyDetails = (contact: EnterpriseContact) => {
    const text = `${contact.name} (${contact.role}) - ${contact.company}\nStation: ${contact.station}\nEmail: ${contact.email}\nPhone: ${contact.phone}${contact.whatsapp ? `\nWhatsApp: ${contact.whatsapp}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(contact.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateContact = () => {
    if (!newContact.name || !newContact.company) return;
    const created: EnterpriseContact = {
      id: `CNT-${Date.now().toString().slice(-4)}`,
      name: newContact.name,
      company: newContact.company,
      role: newContact.role || 'Partner Representative',
      category: newContact.category || 'BUYER',
      station: newContact.station || 'Global Station',
      email: newContact.email || '',
      phone: newContact.phone || '',
      whatsapp: newContact.whatsapp || '',
      address: newContact.address || '',
      taxOrVatId: newContact.taxOrVatId || '',
      notes: newContact.notes || '',
      leadTimeOrCapacity: newContact.leadTimeOrCapacity || '',
    };
    const next = [created, ...contacts];
    setContacts(next);
    persistEnterpriseContacts(next);
    setIsAddModalOpen(false);
    setNewContact({
      name: '',
      company: '',
      role: '',
      category: 'BUYER',
      station: 'Dhaka HQ',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      taxOrVatId: '',
      notes: '',
      leadTimeOrCapacity: '',
    });
  };

  const handleSaveEditedContact = () => {
    if (!editingContact || !editingContact.name || !editingContact.company) return;
    const next = contacts.map(c => c.id === editingContact.id ? editingContact : c);
    setContacts(next);
    persistEnterpriseContacts(next);
    setEditingContact(null);
  };

  const handleDeleteContact = (id: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete contact "${name}"?`)) {
      const next = contacts.filter(c => c.id !== id);
      setContacts(next);
      persistEnterpriseContacts(next);
      setSelectedContactIds(prev => prev.filter(cId => cId !== id));
    }
  };

  const handleBatchDeleteContacts = () => {
    if (selectedContactIds.length === 0) return;
    if (window.confirm(`Are you sure you want to permanently delete the ${selectedContactIds.length} selected contacts?`)) {
      const next = contacts.filter(c => !selectedContactIds.includes(c.id));
      setContacts(next);
      persistEnterpriseContacts(next);
      setSelectedContactIds([]);
    }
  };

  const toggleSelectContact = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllContacts = () => {
    if (selectedContactIds.length === filteredContacts.length && filteredContacts.length > 0) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const handleExportCsv = () => {
    const headers = ['Category', 'Name', 'Company', 'Role', 'Station', 'Email', 'Phone', 'WhatsApp', 'Address', 'Tax/VAT ID', 'Notes'];
    const rows = contacts.map(c => [
      c.category,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.company.replace(/"/g, '""')}"`,
      `"${c.role.replace(/"/g, '""')}"`,
      `"${c.station}"`,
      c.email,
      c.phone,
      c.whatsapp || '',
      `"${c.address || ''}"`,
      c.taxOrVatId || '',
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArielMC_Enterprise_Contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredContacts = contacts
    .filter(c => (selectedCategory === 'ALL' ? true : c.category === selectedCategory))
    .filter(c =>
      searchQuery
        ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const getCategoryBadgeStyle = (category: ContactCategory) => {
    switch (category) {
      case 'BUYER':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      case 'SUPPLIER':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'FACTORY':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'EMPLOYEE':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/40';
    }
  };

  const isAllSelected = filteredContacts.length > 0 && selectedContactIds.length === filteredContacts.length;

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-200">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96A]/30 pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold font-heading text-[#1F3A2E] flex items-center gap-2">
            <Users2 className="w-5 h-5 text-[#C8A96A]" />
            Enterprise Master Contacts Directory
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Single repository for all corporate stakeholders: International Buyers, Sourcing Suppliers, Partner Factories, and Internal Staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="p-2 rounded-xl bg-white border border-[#DDE3DD] text-[#1F3A2E] hover:bg-[#F4F6F4] shadow-xs cursor-pointer transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white border border-[#DDE3DD] text-[#1F3A2E] hover:bg-[#F4F6F4] shadow-xs cursor-pointer transition-colors"
            title="Print Directory"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12241b] border border-[#2b5540]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, email, role, or station..."
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-[#183225] border border-[#2e5d45] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C8A96A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: 'ALL', label: 'All Contacts', count: contacts.length },
            { id: 'BUYER', label: '🛍️ Buyers', count: contacts.filter(c => c.category === 'BUYER').length },
            { id: 'SUPPLIER', label: '🧵 Suppliers', count: contacts.filter(c => c.category === 'SUPPLIER').length },
            { id: 'FACTORY', label: '🏭 Factories', count: contacts.filter(c => c.category === 'FACTORY').length },
            { id: 'EMPLOYEE', label: '👥 Employees', count: contacts.filter(c => c.category === 'EMPLOYEE').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                selectedCategory === tab.id
                  ? 'bg-[#C8A96A] text-slate-950 font-bold'
                  : 'bg-[#183225] text-slate-300 hover:text-white border border-[#2e5d45]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === tab.id ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Select & Batch Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#F0F5F2] border border-[#DDE3DD] rounded-xl text-xs font-medium">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-[#1F3A2E] font-bold">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAllContacts}
              className="w-4 h-4 rounded text-[#1F3A2E] border-slate-300 focus:ring-[#1F3A2E] cursor-pointer"
            />
            <span>Select All ({filteredContacts.length})</span>
          </label>

          {selectedContactIds.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#1F3A2E] text-white font-mono text-[11px] font-bold">
              {selectedContactIds.length} Selected
            </span>
          )}
        </div>

        {selectedContactIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBatchDeleteContacts}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedContactIds.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedContactIds([])}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs transition cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => {
          const isSelected = selectedContactIds.includes(contact.id);
          return (
            <div
              key={contact.id}
              className={`rounded-xl border p-5 space-y-4 transition-all shadow-lg flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#14281f] border-[#C8A96A] ring-2 ring-[#C8A96A]/40'
                  : 'bg-[#0f1f18] border-[#254d37] hover:border-[#3d7a59]'
              }`}
            >
              <div className="space-y-3">
                {/* Checkbox, Category & Station Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectContact(contact.id)}
                      className="w-4 h-4 rounded text-[#C8A96A] border-emerald-600 focus:ring-[#C8A96A] cursor-pointer"
                      title="Select Contact"
                    />
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${getCategoryBadgeStyle(contact.category)}`}>
                      {contact.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                    {contact.station}
                  </span>
                </div>

                {/* Name & Company */}
                <div>
                  <h4 className="text-base font-bold text-white">{contact.name}</h4>
                  <div className="text-xs font-semibold text-[#C8A96A]">{contact.role}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {contact.company}
                  </div>
                </div>

                {/* Direct Communications Links */}
                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors truncate font-mono text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </a>
                  )}
                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors font-mono text-[11px]"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{contact.phone}</span>
                    </a>
                  )}
                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors font-mono text-[11px]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp: {contact.whatsapp}</span>
                    </a>
                  )}
                </div>

                {/* Notes / Specialization */}
                {contact.notes && (
                  <div className="p-2.5 rounded-lg bg-[#14281f] border border-[#254d37] text-[11px] text-slate-300 line-clamp-2">
                    {contact.notes}
                  </div>
                )}

                {contact.leadTimeOrCapacity && (
                  <div className="text-[10px] text-cyan-300 font-mono">
                    ⚡ {contact.leadTimeOrCapacity}
                  </div>
                )}
              </div>

              {/* Card Footer Actions: Copy, Edit, Delete */}
              <div className="pt-3 border-t border-[#234534] flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  {contact.taxOrVatId || 'Verified Record'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyDetails(contact)}
                    className="p-1.5 rounded bg-[#183225] hover:bg-[#204231] text-[11px] font-mono text-[#C8A96A] border border-[#2e5d45] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy Contact Details"
                  >
                    {copiedId === contact.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingContact({ ...contact })}
                    className="p-1.5 rounded bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-600/50 text-xs transition cursor-pointer"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDeleteContact(contact.id, contact.name, e)}
                    className="p-1.5 rounded bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-600/50 text-xs transition cursor-pointer"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1f18] border-2 border-[#C8A96A]/60 shadow-2xl p-6 space-y-4 text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users2 className="w-4 h-4 text-[#C8A96A]" />
                Enlist New Master Contact
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Name *:</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={e => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="e.g. Arthur Pendelton"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category *:</label>
                  <select
                    value={newContact.category}
                    onChange={e => setNewContact({ ...newContact, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="BUYER">Buyer / Retailer</option>
                    <option value="SUPPLIER">Raw Material Supplier</option>
                    <option value="FACTORY">Partner Factory</option>
                    <option value="EMPLOYEE">Internal Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company / Mill *:</label>
                  <input
                    type="text"
                    value={newContact.company}
                    onChange={e => setNewContact({ ...newContact, company: e.target.value })}
                    placeholder="e.g. Selfridges & Co."
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role / Designation:</label>
                  <input
                    type="text"
                    value={newContact.role}
                    onChange={e => setNewContact({ ...newContact, role: e.target.value })}
                    placeholder="e.g. Senior Category Buyer"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={e => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+880 / +44 ..."
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp Direct:</label>
                  <input
                    type="tel"
                    value={newContact.whatsapp}
                    onChange={e => setNewContact({ ...newContact, whatsapp: e.target.value })}
                    placeholder="+8801819..."
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Station / Location:</label>
                  <input
                    type="text"
                    value={newContact.station}
                    onChange={e => setNewContact({ ...newContact, station: e.target.value })}
                    placeholder="e.g. London, UK / Dhaka HQ"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Operational Notes / Terms:</label>
                <textarea
                  rows={2}
                  value={newContact.notes}
                  onChange={e => setNewContact({ ...newContact, notes: e.target.value })}
                  placeholder="Payment terms, special instructions, fabric capabilities..."
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#234534] flex items-center justify-end gap-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                disabled={!newContact.name || !newContact.company}
                className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50 cursor-pointer"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1f18] border-2 border-amber-500/70 shadow-2xl p-6 space-y-4 text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                Edit Enterprise Contact: {editingContact.name}
              </h3>
              <button
                onClick={() => setEditingContact(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Contact Name *:</label>
                  <input
                    type="text"
                    value={editingContact.name}
                    onChange={e => setEditingContact({ ...editingContact, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category *:</label>
                  <select
                    value={editingContact.category}
                    onChange={e => setEditingContact({ ...editingContact, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="BUYER">Buyer / Retailer</option>
                    <option value="SUPPLIER">Raw Material Supplier</option>
                    <option value="FACTORY">Partner Factory</option>
                    <option value="EMPLOYEE">Internal Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Company / Mill *:</label>
                  <input
                    type="text"
                    value={editingContact.company}
                    onChange={e => setEditingContact({ ...editingContact, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Role / Designation:</label>
                  <input
                    type="text"
                    value={editingContact.role}
                    onChange={e => setEditingContact({ ...editingContact, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address:</label>
                  <input
                    type="email"
                    value={editingContact.email}
                    onChange={e => setEditingContact({ ...editingContact, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    value={editingContact.phone}
                    onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">WhatsApp Direct:</label>
                  <input
                    type="tel"
                    value={editingContact.whatsapp || ''}
                    onChange={e => setEditingContact({ ...editingContact, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Station / Location:</label>
                  <input
                    type="text"
                    value={editingContact.station}
                    onChange={e => setEditingContact({ ...editingContact, station: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Operational Notes / Terms:</label>
                <textarea
                  rows={2}
                  value={editingContact.notes || ''}
                  onChange={e => setEditingContact({ ...editingContact, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#234534] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingContact(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedContact}
                disabled={!editingContact.name || !editingContact.company}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
