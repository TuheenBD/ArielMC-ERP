'use client';

import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { EnterpriseContact, ContactCategory } from '@/types/utilities';
import { INITIAL_ENTERPRISE_CONTACTS } from '@/data/initialUtilitiesData';

export const ContactsDirectoryUtility: React.FC = () => {
  const [contacts, setContacts] = useState<EnterpriseContact[]>(INITIAL_ENTERPRISE_CONTACTS);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ContactCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setContacts(prev => [created, ...prev]);
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

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-[#C8A96A]" />
            Enterprise Master Contacts Directory
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Single repository for all corporate stakeholders: International Buyers, Sourcing Suppliers, Partner Factories, and Internal Staff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="p-2 rounded-xl bg-[#14281f] border border-[#2b5540] text-slate-300 hover:text-white transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-[#14281f] border border-[#2b5540] text-slate-300 hover:text-white transition-colors"
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

      {/* Contacts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            className="rounded-xl bg-[#0f1f18] border border-[#254d37] p-5 space-y-4 hover:border-[#3d7a59] transition-all shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category & Station Header */}
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${getCategoryBadgeStyle(contact.category)}`}>
                  {contact.category}
                </span>
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

            {/* Card Footer Actions */}
            <div className="pt-3 border-t border-[#234534] flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">
                {contact.taxOrVatId || 'Verified Record'}
              </span>

              <button
                onClick={() => handleCopyDetails(contact)}
                className="px-2.5 py-1 rounded bg-[#183225] hover:bg-[#204231] text-[11px] font-mono text-[#C8A96A] border border-[#2e5d45] flex items-center gap-1 transition-colors"
              >
                {copiedId === contact.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === contact.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
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
                className="p-1 rounded-lg text-slate-400 hover:text-white"
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
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                disabled={!newContact.name || !newContact.company}
                className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
