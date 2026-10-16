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
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                PHASE 2: SOURCING ECOSYSTEM
              </span>
              <span className="text-xs text-slate-400">Bangladesh Manufacturing Hubs</span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1 flex items-center gap-2.5">
              <span>Bangladesh Factory Sourcing & Compliance</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {factories.length} Partner Facilities
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Industrial cluster tracking across Savar, Gazipur, Narsingdi, and Dhamrai. Audited for BSCI, SEDEX, LWG, GOTS, and FDA food-contact standards.
            </p>
          </div>

          <button
            id="register-factory-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Partner Factory</span>
          </button>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Total Monthly Capacity</span>
            <span className="text-xl font-bold font-mono text-white mt-0.5 block">
              {(totalCapacity / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-sans font-normal">Units/mo</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Capacity Utilization</span>
            <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">
              {avgUtilization}%
            </span>
            <span className="text-[10px] text-slate-500">{(100 - Number(avgUtilization)).toFixed(0)}% available for new orders</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Average AQL Pass Rate</span>
            <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {avgAqlRate}%
            </span>
            <span className="text-[10px] text-slate-500">AQL 1.5/2.5 export standard</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Expiring Audits (60 Days)</span>
            <span className="text-xl font-bold font-mono text-red-400 mt-0.5 block flex items-center gap-1.5">
              <span>{expiringAudits.length} Audits</span>
              <AlertTriangle className="w-4 h-4 text-amber-400 inline" />
            </span>
            <span className="text-[10px] text-slate-500">Scheduled for renewal</span>
          </div>
        </div>
      </div>

      {/* Proactive Compliance Expiry Alert Banner */}
      {expiringAudits.length > 0 && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-semibold">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Compliance Alert: {expiringAudits.length} International Audits Require Scheduled Re-Inspection</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
            {expiringAudits.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-900/90 border border-red-500/20 text-[11px] flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white truncate max-w-[170px]">{item.factory.name}</div>
                  <div className="text-slate-400 text-[10px]">{item.auditName}</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] font-bold">
                  {item.daysLeft}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs by Sector & Cluster */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Sector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSector('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedSector === 'ALL'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
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
                    ? 'bg-slate-800 text-white border-amber-500 shadow-sm ring-1 ring-amber-500/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800'
                }`}
              >
                <span>{icon}</span>
                <span>{sec}</span>
                <span className="text-[10px] font-mono px-1.5 rounded-full bg-slate-800 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cluster Filter & Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search factories, machinery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 text-xs text-white rounded-lg focus:outline-none focus:border-amber-500 w-56"
            />
          </div>

          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
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
              className="group rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/5"
            >
              <div className="p-5 space-y-4">
                {/* Header: Code & Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                      {fac.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">{fac.sectors.join(', ')}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {fac.tier.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Name & Cluster */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {fac.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{fac.cluster}</span>
                  </div>
                </div>

                {/* Capacity Allocation Meter */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Monthly Capacity Allocation:</span>
                    <span className="font-mono font-bold text-white">{utilPct}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        Number(utilPct) > 80 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-emerald-400'
                      }`}
                      style={{ width: `${utilPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Allocated: <strong className="text-slate-200">{(fac.capacity.allocatedUnits / 1000).toFixed(0)}k</strong>
                    </span>
                    <span>
                      Max: <strong className="text-slate-200">{(fac.capacity.monthlyCapacityUnits / 1000).toFixed(0)}k units</strong>
                    </span>
                  </div>
                </div>

                {/* Compliance Audits Pills */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Verified Audit Standards:</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.complianceAudits.map((aud, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80 flex items-center gap-1"
                        title={`Valid until: ${aud.validUntil} (${aud.ratingGrade})`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{aud.standardName.split(' ')[0]}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">On-Time Delivery</span>
                    <span className="font-mono font-bold text-white">{fac.scorecard.onTimeDeliveryPct}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">FRI AQL Pass Rate</span>
                    <span className="font-mono font-bold text-emerald-400">{fac.scorecard.aqlPassRatePct}%</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Lead Time: <strong className="text-slate-200">{fac.leadTimeDays}d</strong> • MOQ: <strong className="text-slate-200">{fac.minimumOrderQuantity}</strong>
                </div>

                <button
                  onClick={() => setSelectedFactory(fac)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {selectedFactory.code}
                  </span>
                  <span className="text-xs text-slate-400">{selectedFactory.cluster}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5">{selectedFactory.name}</h2>
                <div className="text-xs text-slate-400 mt-0.5">{selectedFactory.factoryAddress}</div>
              </div>

              <button
                onClick={() => setSelectedFactory(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Compliance Audit Table */}
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Audit Certificates & Validity Registry</span>
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Audit Standard</th>
                        <th className="py-2.5 px-3">Rating / Grade</th>
                        <th className="py-2.5 px-3">Auditing Body</th>
                        <th className="py-2.5 px-3">Valid Until</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {selectedFactory.complianceAudits.map((aud) => (
                        <tr key={aud.id}>
                          <td className="py-2.5 px-3 font-semibold text-white">{aud.standardName}</td>
                          <td className="py-2.5 px-3 font-mono text-emerald-400">{aud.ratingGrade}</td>
                          <td className="py-2.5 px-3 text-slate-400">{aud.auditBody}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-200">{aud.validUntil}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
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
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                  Industrial Machinery & Automation Profile
                </span>
                <ul className="space-y-1.5 pt-1 text-slate-300">
                  {selectedFactory.capacity.machineryList.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-amber-400">▹</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Banking Credentials */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                    Commercial Contact Officer
                  </span>
                  <div className="space-y-1 text-slate-300">
                    <div className="font-semibold text-white">{selectedFactory.contactPerson}</div>
                    <div className="text-[11px] text-slate-400">{selectedFactory.designation}</div>
                    <div className="text-[11px] font-mono text-slate-300 pt-1">Phone: {selectedFactory.phone}</div>
                    <div className="text-[11px] text-blue-400">Email: {selectedFactory.email}</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-200 block text-[11px] uppercase tracking-wider">
                    Statutory & Banking Credentials
                  </span>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>BIN: <span className="font-mono text-white">{selectedFactory.binNumber}</span></div>
                    <div>EPB Reg: <span className="font-mono text-white">{selectedFactory.epbRegistrationNo}</span></div>
                    <div>Bank: <span className="text-white">{selectedFactory.bankDetails.bankName}</span></div>
                    <div>Routing: <span className="font-mono text-slate-400">{selectedFactory.bankDetails.routingNumber}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Payment Terms: <strong className="text-white">{selectedFactory.paymentTerms}</strong>
              </span>

              <button
                onClick={() => setSelectedFactory(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close Audit Sheet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Factory */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <Factory className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Register Bangladesh Partner Factory</h3>
                  <p className="text-xs text-slate-400">Onboard vendor facility into ArielMC compliance directory</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFactory} className="p-6 space-y-4 overflow-y-auto max-h-[75vh] text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Factory Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Meghna Leather Works Limited"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Manufacturing Sector</label>
                  <select
                    value={newSector}
                    onChange={(e: any) => setNewSector(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
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
                  <label className="text-slate-300 font-medium block mb-1">Industrial Cluster</label>
                  <input
                    type="text"
                    value={newCluster}
                    onChange={(e) => setNewCluster(e.target.value)}
                    placeholder="e.g. Savar Tannery Estate / Gazipur"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Monthly Capacity (Units)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="Managing Director / QA"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Mobile / WhatsApp</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+880 1711-xxxxxx"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="export@factory.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Production Lead Time (Days)</label>
                  <input
                    type="number"
                    value={newLeadTime}
                    onChange={(e) => setNewLeadTime(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={newMoq}
                    onChange={(e) => setNewMoq(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
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
