'use client';

import React, { useState, useMemo } from 'react';
import { SupplierFactory, ProductSector } from '@/types/erp';
import {
  Factory,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Sparkles,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Percent,
  X,
  FileCheck2,
  Building,
  ArrowRight
} from 'lucide-react';

interface FactoryManagementProps {
  factories: SupplierFactory[];
  onAddFactory: (newFactory: SupplierFactory) => void;
}

export const FactoryManagement: React.FC<FactoryManagementProps> = ({
  factories,
  onAddFactory,
}) => {
  const [selectedSector, setSelectedSector] = useState<ProductSector | 'ALL'>('ALL');
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactory, setSelectedFactory] = useState<SupplierFactory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding Factory
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSector, setNewSector] = useState<ProductSector>('LEATHER');
  const [newCluster, setNewCluster] = useState('Hemayetpur Tannery Estate, Savar');
  const [newAddress, setNewAddress] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCapacity, setNewCapacity] = useState(50000);
  const [newLeadTime, setNewLeadTime] = useState(45);
  const [newMoq, setNewMoq] = useState(300);

  // Filter factories
  const filteredFactories = useMemo(() => {
    return factories.filter((fac) => {
      const matchesSector = selectedSector === 'ALL' || fac.sectors.includes(selectedSector);
      const matchesCluster = selectedCluster === 'ALL' || fac.cluster.toLowerCase().includes(selectedCluster.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.cluster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.capacity.machineryList.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSector && matchesCluster && matchesSearch;
    });
  }, [factories, selectedSector, selectedCluster, searchQuery]);

  // Aggregate stats
  const totalCapacity = factories.reduce((acc, f) => acc + f.capacity.monthlyCapacityUnits, 0);
  const totalAllocated = factories.reduce((acc, f) => acc + f.capacity.allocatedUnits, 0);
  const avgUtilization = ((totalAllocated / (totalCapacity || 1)) * 100).toFixed(1);
  const avgAqlRate = (factories.reduce((acc, f) => acc + f.scorecard.aqlPassRatePct, 0) / factories.length).toFixed(1);

  // Upcoming audit expiries (within 60 days)
  const expiringAudits = useMemo(() => {
    const list: { factory: SupplierFactory; auditName: string; validUntil: string; daysLeft: number }[] = [];
    const today = new Date('2026-10-16');

    factories.forEach((fac) => {
      fac.complianceAudits.forEach((aud) => {
        const auditDate = new Date(aud.validUntil);
        const diffTime = auditDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 60) {
          list.push({
            factory: fac,
            auditName: aud.standardName,
            validUntil: aud.validUntil,
            daysLeft: diffDays,
          });
        }
      });
    });
    return list.sort((a, b) => a.daysLeft - b.daysLeft);
  }, [factories]);

  const handleCreateFactory = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SupplierFactory = {
      id: `fac_${Date.now()}`,
      code: newCode || `FAC-BD-${Math.floor(10 + Math.random() * 90)}`,
      name: newName,
      sectors: [newSector],
      cluster: newCluster,
      factoryAddress: newAddress || `${newCluster}, Bangladesh`,
      contactPerson: newContact || 'Commercial Representative',
      designation: 'General Manager',
      phone: newPhone || '+880 1711-000000',
      email: newEmail || 'compliance@factory-bd.com',
      tradeLicenseNo: 'TRAD/BD/2026/0991',
      binNumber: '003928174-0101',
      tinNumber: '9281729384',
      epbRegistrationNo: 'EPB-REG-2026-BD',
      tier: 'TIER_2_QUALIFIED',
      capacity: {
        monthlyCapacityUnits: newCapacity,
        allocatedUnits: Math.floor(newCapacity * 0.6),
        activeLines: 6,
        machineryList: ['Standard Automatic Stitching & Assembling Lines', 'Inspection & Packaging Lines'],
      },
      scorecard: {
        onTimeDeliveryPct: 96.0,
        aqlPassRatePct: 98.0,
        ratingScore: 4.8,
        priceCompetitiveness: 4.8,
      },
      complianceAudits: [
        {
          id: `aud_${Date.now()}`,
          standardName: 'BSCI Social Compliance / EPB Verified',
          status: 'VALID',
          ratingGrade: 'Grade A',
          auditBody: 'SGS Bangladesh',
          validUntil: '2027-10-01',
          reportNumber: 'SGS-BD-VERIFIED',
        },
      ],
      leadTimeDays: newLeadTime,
      minimumOrderQuantity: newMoq,
      paymentTerms: '30% Advance, 70% against BL or LC',
      bankDetails: {
        bankName: 'Eastern Bank PLC',
        branch: 'Dhaka SME Branch',
        routingNumber: '090260012',
      },
      associatedSkus: [],
    };

    onAddFactory(created);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Strip */}
      <div className="rounded-2xl bg-white border border-[#DDE3DD] p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] border border-[#C8A96A] font-bold">
                PHASE 2: SOURCING ECOSYSTEM
              </span>
              <span className="text-xs text-[#6B7269]">Bangladesh Manufacturing Hubs</span>
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#1F3A2E] mt-1 flex items-center gap-2.5">
              <span>Bangladesh Factory Sourcing & Compliance</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-bold">
                {factories.length} Partner Facilities
              </span>
            </h1>
            <p className="text-xs text-[#6B7269] mt-1 max-w-2xl leading-relaxed">
              Industrial cluster tracking across Savar, Gazipur, Narsingdi, and Dhamrai. Audited for BSCI, SEDEX, LWG, GOTS, and FDA food-contact standards.
            </p>
          </div>

          <button
            id="register-factory-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4 text-[#C8A96A]" />
            <span>Register Partner Factory</span>
          </button>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#DDE3DD]">
          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Total Monthly Capacity</span>
            <span className="text-xl font-bold font-mono text-[#1F3A2E] mt-0.5 block">
              {(totalCapacity / 1000).toFixed(0)}k <span className="text-xs text-[#6B7269] font-sans font-normal">Units/mo</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Capacity Utilization</span>
            <span className="text-xl font-bold font-mono text-[#8A6D3B] mt-0.5 block">
              {avgUtilization}%
            </span>
            <span className="text-[10px] text-[#6B7269]">{(100 - Number(avgUtilization)).toFixed(0)}% available for new orders</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Average AQL Pass Rate</span>
            <span className="text-xl font-bold font-mono text-[#14512C] mt-0.5 block">
              {avgAqlRate}%
            </span>
            <span className="text-[10px] text-[#6B7269]">AQL 1.5/2.5 export standard</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD]">
            <span className="text-[11px] text-[#6B7269] block font-medium">Expiring Audits (60 Days)</span>
            <span className="text-xl font-bold font-mono text-[#8A1515] mt-0.5 block flex items-center gap-1.5">
              <span>{expiringAudits.length} Audits</span>
              <AlertTriangle className="w-4 h-4 text-[#8A1515] inline" />
            </span>
            <span className="text-[10px] text-[#6B7269]">Scheduled for renewal</span>
          </div>
        </div>
      </div>

      {/* Proactive Compliance Expiry Alert Banner */}
      {expiringAudits.length > 0 && (
        <div className="p-4 rounded-xl bg-[#FDF2F2] border border-[#F8B4B4] text-xs space-y-2">
          <div className="flex items-center gap-2 text-[#8A1515] font-semibold">
            <AlertTriangle className="w-4 h-4 text-[#8A1515] shrink-0" />
            <span>Compliance Alert: {expiringAudits.length} International Audits Require Scheduled Re-Inspection</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            {expiringAudits.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-white border border-[#F8B4B4] text-[11px] flex items-center justify-between shadow-xs"
              >
                <div>
                  <div className="font-semibold text-[#1A1A1A] truncate max-w-[170px]">{item.factory.name}</div>
                  <div className="text-[#6B7269] text-[10px]">{item.auditName}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#FDEAEA] text-[#8A1515] font-mono text-[10px] font-bold border border-[#F7C0C0]">
                  {item.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs by Sector & Cluster */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#DDE3DD] pb-4">
        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSector === 'ALL'
                ? 'bg-[#1F3A2E] text-white shadow-sm'
                : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border border-[#DDE3DD]'
            }`}
          >
            All Factories ({factories.length})
          </button>
          {(['LEATHER', 'JUTE', 'TEXTILE', 'CERAMICS'] as ProductSector[]).map((sec) => {
            const count = factories.filter((f) => f.sectors.includes(sec)).length;
            const isSelected = selectedSector === sec;
            const icon = sec === 'LEATHER' ? '👞' : sec === 'JUTE' ? '🌾' : sec === 'TEXTILE' ? '🧵' : '🏺';

            return (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-sm'
                    : 'bg-white text-[#1A1A1A] hover:bg-[#F0F4F1] border-[#DDE3DD]'
                }`}
              >
                <span>{icon}</span>
                <span>{sec}</span>
                <span className={`text-[10px] font-mono px-1.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F0F4F1] text-[#1A1A1A]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cluster Filter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7269]" />
            <input
              type="text"
              placeholder="Search factories, machinery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg focus:outline-none focus:border-[#1F3A2E] w-56 shadow-sm"
            />
          </div>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-white border border-[#DDE3DD] text-xs text-[#1A1A1A] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#1F3A2E] shadow-sm"
          >
            <option value="ALL">All Industrial Clusters</option>
            <option value="Savar">Savar Tannery Park</option>
            <option value="Narsingdi">Narsingdi Jute Mills</option>
            <option value="Gazipur">Gazipur Textile & Ceramic Park</option>
            <option value="Dhamrai">Dhamrai Pottery Belt</option>
          </select>
        </div>
      </div>

      {/* Factory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFactories.map((fac) => {
          const utilPct = ((fac.capacity.allocatedUnits / fac.capacity.monthlyCapacityUnits) * 100).toFixed(0);

          return (
            <div
              key={fac.id}
              className="group rounded-xl bg-white border border-[#DDE3DD] hover:border-[#C8A96A] flex flex-col justify-between overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-[#1A1A1A]"
            >
              <div className="p-5 space-y-4">
                {/* Header: Code & Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF5EC] text-[#8A6D3B] font-semibold border border-[#C8A96A]/40">
                      {fac.code}
                    </span>
                    <span className="text-[11px] font-medium text-[#6B7269]">{fac.sectors.join(', ')}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] border border-[#BBE3C7] font-semibold">
                    {fac.tier.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Name & Cluster */}
                <div>
                  <h3 className="text-base font-bold font-heading text-[#1F3A2E] group-hover:text-[#8A6D3B] transition-colors">
                    {fac.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7269] mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6D3B] shrink-0" />
                    <span className="truncate">{fac.cluster}</span>
                  </div>
                </div>

                {/* Capacity Allocation Meter */}
                <div className="p-3 rounded-xl bg-[#F8FAF8] border border-[#DDE3DD] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7269]">Monthly Capacity Allocation:</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">{utilPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E5EAE5] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        Number(utilPct) > 80 ? 'bg-[#8A1515]' : 'bg-[#1F3A2E]'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B7269]">
                    <span>
                      Allocated: <strong className="text-[#1A1A1A]">{(fac.capacity.allocatedUnits / 1000).toFixed(0)}k</strong>
                    </span>
                    <span>
                      Max: <strong className="text-[#1A1A1A]">{(fac.capacity.monthlyCapacityUnits / 1000).toFixed(0)}k units</strong>
                    </span>
                  </div>
                </div>

                {/* Compliance Audits Pills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-[#6B7269] uppercase tracking-wider flex items-center justify-between font-heading">
                    <span>Verified Audit Standards:</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14512C]" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.complianceAudits.map((aud, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F0FA] text-[#17456F] border border-[#C5D7ED] flex items-center gap-1 font-medium"
                        title={`Valid until: ${aud.validUntil} (${aud.ratingGrade})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17456F]" />
                        <span>{aud.standardName.split(' ')[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DDE3DD] text-xs">
                  <div className="p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block">On-Time Delivery</span>
                    <span className="font-mono font-bold text-[#1F3A2E]">{fac.scorecard.onTimeDeliveryPct}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#F8FAF8] border border-[#DDE3DD]">
                    <span className="text-[10px] text-[#6B7269] block">FRI AQL Pass Rate</span>
                    <span className="font-mono font-bold text-[#14512C]">{fac.scorecard.aqlPassRatePct}%</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-[#DDE3DD] bg-[#F8FAF8] flex items-center justify-between">
                <div className="text-[11px] text-[#6B7269]">
                  Lead Time: <strong className="text-[#1A1A1A]">{fac.leadTimeDays}d</strong> • MOQ: <strong className="text-[#1A1A1A]">{fac.minimumOrderQuantity}</strong>
                </div>

                <button
                  onClick={() => setSelectedFactory(fac)}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#1F3A2E] hover:text-[#8A6D3B] transition-colors"
                >
                  <span>Inspect Audits & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Factory Detail View */}
      {selectedFactory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b-[3px] border-[#C8A96A] bg-[#1F3A2E] text-white flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-[#C8A96A] text-[#1F3A2E] font-bold">
                    {selectedFactory.code}
                  </span>
                  <span className="text-xs text-emerald-100 font-medium">{selectedFactory.cluster}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5 font-['Montserrat']">{selectedFactory.name}</h2>
                <div className="text-xs text-white/80 mt-0.5 font-['Open_Sans']">{selectedFactory.factoryAddress}</div>
              </div>

              <button
                onClick={() => setSelectedFactory(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs bg-[#F4F6F4]">
              {/* Compliance Audit Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#1F3A2E] uppercase tracking-wider text-[11px] font-['Montserrat'] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audit Certificates & Validity Registry</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-[#DDE3DD] bg-white shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#1F3A2E] text-white text-[10px] uppercase font-semibold border-b border-[#1F3A2E]">
                      <tr>
                        <th className="py-2.5 px-3">Audit Standard</th>
                        <th className="py-2.5 px-3">Rating / Grade</th>
                        <th className="py-2.5 px-3">Auditing Body</th>
                        <th className="py-2.5 px-3">Valid Until</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8EFE8] text-[#1A1A1A]">
                      {selectedFactory.complianceAudits.map((aud) => (
                        <tr key={aud.id} className="hover:bg-[#F4F6F4]">
                          <td className="py-2.5 px-3 font-semibold text-[#1F3A2E]">{aud.standardName}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{aud.ratingGrade}</td>
                          <td className="py-2.5 px-3 text-gray-600">{aud.auditBody}</td>
                          <td className="py-2.5 px-3 font-mono text-gray-800">{aud.validUntil}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-[#E4F3E9] text-[#14512C] text-[10px] font-mono border border-[#BBE3C7] font-semibold">
                              {aud.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Machinery & Technology Profile */}
              <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                  Industrial Machinery & Automation Profile
                </span>
                <ul className="space-y-1.5 pt-1 text-gray-700">
                  {selectedFactory.capacity.machineryList.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-[#C8A96A] font-bold">▹</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Banking Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                    Commercial Contact Officer
                  </span>
                  <div className="space-y-1 text-gray-700">
                    <div className="font-semibold text-[#1F3A2E]">{selectedFactory.contactPerson}</div>
                    <div className="text-[11px] text-gray-500">{selectedFactory.designation}</div>
                    <div className="text-[11px] font-mono text-gray-800 pt-1">Phone: {selectedFactory.phone}</div>
                    <div className="text-[11px] text-emerald-700 font-medium">Email: {selectedFactory.email}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#DDE3DD] shadow-sm space-y-2">
                  <span className="font-bold text-[#1F3A2E] block text-[11px] uppercase tracking-wider font-['Montserrat']">
                    Statutory & Banking Credentials
                  </span>
                  <div className="space-y-1 text-gray-700 text-[11px]">
                    <div>BIN: <span className="font-mono text-[#1F3A2E] font-semibold">{selectedFactory.binNumber}</span></div>
                    <div>EPB Reg: <span className="font-mono text-[#1F3A2E] font-semibold">{selectedFactory.epbRegistrationNo}</span></div>
                    <div>Bank: <span className="text-[#1F3A2E] font-medium">{selectedFactory.bankDetails.bankName}</span></div>
                    <div>Routing: <span className="font-mono text-gray-600">{selectedFactory.bankDetails.routingNumber}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#DDE3DD] bg-white flex items-center justify-between">
              <span className="text-xs text-gray-600">
                Payment Terms: <strong className="text-[#1F3A2E]">{selectedFactory.paymentTerms}</strong>
              </span>

              <button
                onClick={() => setSelectedFactory(null)}
                className="px-4 py-2 rounded-lg bg-[#E8EFE8] hover:bg-[#DDE3DD] text-[#1F3A2E] text-xs font-semibold transition-colors"
              >
                Close Audit Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Factory */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-[#DDE3DD] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b-[3px] border-[#C8A96A] bg-[#1F3A2E] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C8A96A] text-[#1F3A2E] flex items-center justify-center font-bold">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Montserrat']">Register Bangladesh Partner Factory</h3>
                  <p className="text-xs text-white/80 font-['Open_Sans']">Onboard vendor facility into ArielMC compliance directory</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFactory} className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs bg-[#F4F6F4]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Factory Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Meghna Leather Works Limited"
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Manufacturing Sector</label>
                  <select
                    value={newSector}
                    onChange={(e: any) => setNewSector(e.target.value)}
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  >
                    <option value="LEATHER">Leather Goods</option>
                    <option value="JUTE">Jute & Diversified</option>
                    <option value="TEXTILE">Home Textiles</option>
                    <option value="CERAMICS">Ceramics & Pottery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Industrial Cluster</label>
                  <input
                    type="text"
                    value={newCluster}
                    onChange={(e) => setNewCluster(e.target.value)}
                    placeholder="e.g. Savar Tannery Estate / Gazipur"
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Monthly Capacity (Units)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Managing Director / QA"
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+880 1711-xxxxxx"
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="export@factory.com"
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Production Lead Time (Days)</label>
                  <input
                    type="number"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(Number(e.target.value))}
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#1A1A1A] font-semibold block mb-1">Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={newMoq}
                    onChange={(e) => setNewMoq(Number(e.target.value))}
                    className="w-full bg-white border border-[#DDE3DD] focus:border-[#C8A96A] rounded-lg p-2 text-[#1A1A1A] font-mono outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDE3DD] bg-white -mx-6 -mb-6 p-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#E8EFE8] hover:bg-[#DDE3DD] text-[#1F3A2E] font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1F3A2E] hover:bg-[#2C5240] text-white font-semibold border-b-2 border-[#C8A96A] transition-colors"
                >
                  Save & Register Factory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
