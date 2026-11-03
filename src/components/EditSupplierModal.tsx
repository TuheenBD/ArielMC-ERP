'use client';

import React, { useState, useEffect } from 'react';
import { SupplierFactory, ProductSector, VendorClassification } from '@/types/erp';
import { Building2, X, Check, Save } from 'lucide-react';

interface EditSupplierModalProps {
  isOpen: boolean;
  factory: SupplierFactory | null;
  onClose: () => void;
  onSave: (updated: SupplierFactory) => void;
}

const ALL_SECTORS: { id: ProductSector; label: string }[] = [
  { id: 'LEATHER', label: 'Leather' },
  { id: 'JUTE', label: 'Jute' },
  { id: 'CERAMICS', label: 'Ceramics' },
  { id: 'POTTERY', label: 'Pottery' },
  { id: 'TEXTILE', label: 'Textile' },
];

export const EditSupplierModal: React.FC<EditSupplierModalProps> = ({
  isOpen,
  factory,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<SupplierFactory>>({});

  useEffect(() => {
    if (factory) {
      setFormData({
        ...factory,
        capacity: { ...factory.capacity },
        bankDetails: { ...factory.bankDetails },
        scorecard: { ...factory.scorecard },
        sectors: [...factory.sectors],
      });
    }
  }, [factory]);

  if (!isOpen || !factory) return null;

  const handleToggleSector = (sector: ProductSector) => {
    const current = formData.sectors || [];
    if (current.includes(sector)) {
      if (current.length === 1) return; // Keep at least one
      setFormData({ ...formData, sectors: current.filter((s) => s !== sector) });
    } else {
      setFormData({ ...formData, sectors: [...current, sector] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const updated: SupplierFactory = {
      ...factory,
      ...(formData as SupplierFactory),
      capacity: {
        ...factory.capacity,
        monthlyCapacityUnits: Number(formData.capacity?.monthlyCapacityUnits) || factory.capacity.monthlyCapacityUnits,
      },
      bankDetails: {
        ...factory.bankDetails,
        bankName: formData.bankDetails?.bankName || factory.bankDetails.bankName,
        branch: formData.bankDetails?.branch || factory.bankDetails.branch,
        routingNumber: formData.bankDetails?.routingNumber || factory.bankDetails.routingNumber,
      },
      leadTimeDays: Number(formData.leadTimeDays) || factory.leadTimeDays,
      minimumOrderQuantity: Number(formData.minimumOrderQuantity) || factory.minimumOrderQuantity,
    };

    onSave(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl p-6 text-[#1A1A1A] space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F3A2E] text-white">
              <Building2 className="w-5 h-5 text-[#C8A96A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F3A2E] font-heading">
                Edit Supplier / Factory Profile
              </h3>
              <p className="text-xs text-[#6B7269]">
                Updating credentials for <strong className="text-[#1F3A2E]">{factory.name}</strong> ({factory.code})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Company / Supplier Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-semibold focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Factory Sourcing Code *
              </label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono font-semibold focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 2: Entity Type & Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Vendor Classification
              </label>
              <select
                value={formData.vendorType || 'FULL_FLEDGED_FACTORY'}
                onChange={(e) => setFormData({ ...formData, vendorType: e.target.value as VendorClassification })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-semibold focus:outline-none focus:border-[#1F3A2E]"
              >
                <option value="FULL_FLEDGED_FACTORY">🏭 Full-Fledged Factory (Own Materials)</option>
                <option value="FACTORY">🏗️ Open-Market Factory</option>
                <option value="SUPPLIER">🏢 Supplier / Trader</option>
                <option value="FACTORY_CUM_SUPPLIER">🌿 Factory-cum-Supplier (Artisan & Workshop)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Supplier Compliance Tier
              </label>
              <select
                value={formData.tier || 'TIER_1_PREFERRED'}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-semibold focus:outline-none focus:border-[#1F3A2E]"
              >
                <option value="TIER_1_PREFERRED">⭐ Tier 1 Preferred (Certified Audit)</option>
                <option value="TIER_2_QUALIFIED">Qualified Partner</option>
                <option value="TIER_3_PROBATIONARY">Probationary / Trial Run</option>
              </select>
            </div>
          </div>

          {/* Sectors Multi-Select */}
          <div>
            <label className="block font-semibold text-[#1F3A2E] mb-1">
              Active Manufacturing Sectors
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {ALL_SECTORS.map((sec) => {
                const isSelected = (formData.sectors || []).includes(sec.id);
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleToggleSector(sec.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1F3A2E] text-white border-[#1F3A2E] shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96A]" />}
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Cluster & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Industrial Cluster Region
              </label>
              <input
                type="text"
                value={formData.cluster || ''}
                onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                placeholder="e.g. Savar, Hazaribagh, Gazipur..."
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Factory & Plant Address
              </label>
              <input
                type="text"
                value={formData.factoryAddress || ''}
                onChange={(e) => setFormData({ ...formData, factoryAddress: e.target.value })}
                placeholder="Full address of factory facility..."
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 4: Contact Person & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Key Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Shahrier Nyeem"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Director / Managing Partner"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 5: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Direct Mobile / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+880 1533-..."
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Official Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@company.com"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 6: Production & Commercial Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Production Lead Time (Days)
              </label>
              <input
                type="number"
                value={formData.leadTimeDays || 14}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Minimum Order Qty (MOQ)
              </label>
              <input
                type="number"
                value={formData.minimumOrderQuantity || 300}
                onChange={(e) => setFormData({ ...formData, minimumOrderQuantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Monthly Capacity (Units)
              </label>
              <input
                type="number"
                value={formData.capacity?.monthlyCapacityUnits || 25000}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: {
                      ...(formData.capacity || factory.capacity),
                      monthlyCapacityUnits: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 7: Payment Terms */}
          <div>
            <label className="block font-semibold text-[#1F3A2E] mb-1">
              Payment Terms & Settlement
            </label>
            <input
              type="text"
              value={formData.paymentTerms || ''}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              placeholder="e.g. 30% Advance | 50% FRI Pass | 20% Delivery NOC"
              className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {/* Row 8: Bank Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankDetails?.bankName || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...(formData.bankDetails || factory.bankDetails),
                      bankName: e.target.value,
                    },
                  })
                }
                placeholder="e.g. BRAC Bank PLC"
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                Branch Name
              </label>
              <input
                type="text"
                value={formData.bankDetails?.branch || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...(formData.bankDetails || factory.bankDetails),
                      branch: e.target.value,
                    },
                  })
                }
                placeholder="e.g. Tejgaon I/A Branch"
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
                Routing Number
              </label>
              <input
                type="text"
                value={formData.bankDetails?.routingNumber || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...(formData.bankDetails || factory.bankDetails),
                      routingNumber: e.target.value,
                    },
                  })
                }
                placeholder="9-digit routing"
                className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Form Action Footer */}
          <div className="pt-3 border-t border-[#DDE3DD] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1F3A2E] hover:bg-[#2C5240] text-white text-xs font-bold transition shadow-sm cursor-pointer border-b-2 border-[#C8A96A]"
            >
              <Save className="w-4 h-4 text-[#C8A96A]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
