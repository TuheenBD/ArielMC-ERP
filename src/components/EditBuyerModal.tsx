'use client';

import React, { useState, useEffect } from 'react';
import { Building2, X, Save, ShieldCheck } from 'lucide-react';
import { BuyerPortfolio } from '@/types/buyerPortfolio';

export interface BuyerEditData {
  company: string;
  market: string;
  contact: string;
  phone?: string;
  email?: string;
  crmStatus?: string;
  commercialPaymentTerms?: string;
  courierImportAccount?: string;
  creditRating?: string;
}

interface EditBuyerModalProps {
  isOpen: boolean;
  buyer: BuyerEditData | null;
  onClose: () => void;
  onSave: (updated: BuyerEditData) => void;
}

export const EditBuyerModal: React.FC<EditBuyerModalProps> = ({
  isOpen,
  buyer,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<BuyerEditData>({
    company: '',
    market: 'UK',
    contact: '',
    phone: '',
    email: '',
    crmStatus: 'Range Planning Finalized • Commercial Quotation Active',
    commercialPaymentTerms: '50% Advance Deposit, 50% Against B/L Copy',
    courierImportAccount: '',
    creditRating: 'AAA Sovereign Verified',
  });

  useEffect(() => {
    if (buyer) {
      setFormData({
        company: buyer.company || '',
        market: buyer.market || 'UK',
        contact: buyer.contact || '',
        phone: buyer.phone || '',
        email: buyer.email || '',
        crmStatus: buyer.crmStatus || 'Range Planning Finalized • Commercial Quotation Active',
        commercialPaymentTerms: buyer.commercialPaymentTerms || '50% Advance Deposit, 50% Against B/L Copy',
        courierImportAccount: buyer.courierImportAccount || '',
        creditRating: buyer.creditRating || 'AAA Sovereign Verified',
      });
    }
  }, [buyer]);

  if (!isOpen || !buyer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white border border-[#DDE3DD] shadow-2xl p-6 text-[#1A1A1A] space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#DDE3DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F3A2E] text-white">
              <Building2 className="w-5 h-5 text-[#C8A96A]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1F3A2E] font-heading">
                Edit Buyer / Strategic Account Profile
              </h3>
              <p className="text-xs text-[#6B7269]">
                Updating procurement credentials for <strong className="text-[#1F3A2E]">{buyer.company}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Company Name & Market Station */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Buyer Enterprise / Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-bold focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Destination Market Station
              </label>
              <select
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-semibold focus:outline-none focus:border-[#1F3A2E]"
              >
                <option value="UK">🇬🇧 United Kingdom (Felixstowe / London Hub)</option>
                <option value="US">🇺🇸 United States (New York / Los Angeles Port)</option>
                <option value="EU">🇪🇺 European Union (Rotterdam / Hamburg Hub)</option>
                <option value="AU">🇦🇺 Australia (Sydney / Melbourne Hub)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Primary Buyer Contact & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Primary Buyer Contact Person & Title
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="e.g. Eleanor Vance (Senior Category Buyer)"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Direct Procurement Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+44 20 7946 0912"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 3: Email & Courier Import Account */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Procurement / Commercial Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="buyer@enterprise.com"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#1F3A2E] mb-1">
                Courier / Air-Freight Import Account
              </label>
              <input
                type="text"
                value={formData.courierImportAccount || ''}
                onChange={(e) => setFormData({ ...formData, courierImportAccount: e.target.value })}
                placeholder="e.g. DHL 964821039 / FedEx 49201948"
                className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-mono focus:outline-none focus:border-[#1F3A2E]"
              />
            </div>
          </div>

          {/* Row 4: CRM Pipeline Status */}
          <div>
            <label className="block font-semibold text-[#1F3A2E] mb-1">
              Active CRM Pipeline Status
            </label>
            <input
              type="text"
              value={formData.crmStatus || ''}
              onChange={(e) => setFormData({ ...formData, crmStatus: e.target.value })}
              placeholder="e.g. Range Planning Finalized • Commercial Quotation Active"
              className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs font-semibold focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {/* Row 5: Commercial Payment Terms */}
          <div>
            <label className="block font-semibold text-[#1F3A2E] mb-1">
              Commercial Payment Terms (30/50/20 NOC or 50/50 BL)
            </label>
            <input
              type="text"
              value={formData.commercialPaymentTerms || ''}
              onChange={(e) => setFormData({ ...formData, commercialPaymentTerms: e.target.value })}
              placeholder="e.g. 50% Advance Deposit, 50% Against B/L Copy"
              className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
            />
          </div>

          {/* Row 6: Sovereign Verified Credit Rating */}
          <div>
            <label className="block font-semibold text-[#1F3A2E] mb-1">
              Credit Rating & Verification Status
            </label>
            <input
              type="text"
              value={formData.creditRating || ''}
              onChange={(e) => setFormData({ ...formData, creditRating: e.target.value })}
              placeholder="e.g. AAA Sovereign Verified / Institutional AQL Tier 1"
              className="w-full px-3 py-2 rounded-lg border border-[#DDE3DD] bg-[#F8FAF8] text-xs focus:outline-none focus:border-[#1F3A2E]"
            />
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
              <span>Save Buyer Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
