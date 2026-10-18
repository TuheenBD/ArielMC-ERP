'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Landmark,
  ShieldCheck,
  Copy,
  Check,
  Download,
  Printer,
  Plus,
  ExternalLink,
  Lock,
  PhoneCall,
  AlertTriangle,
  Building2,
  DollarSign,
  X
} from 'lucide-react';
import { BankWalletAccount } from '@/types/utilities';
import { INITIAL_BANK_WALLET_ACCOUNTS } from '@/data/initialUtilitiesData';

export const WalletBankingUtility: React.FC = () => {
  const [accounts, setAccounts] = useState<BankWalletAccount[]>(INITIAL_BANK_WALLET_ACCOUNTS);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Account Form State
  const [newAccount, setNewAccount] = useState<Partial<BankWalletAccount>>({
    station: 'ARIEL_UK',
    bankName: '',
    accountName: 'Ariel Marketing & Communications Limited',
    accountNumber: '',
    sortCodeOrRouting: '',
    swiftBic: '',
    iban: '',
    currency: 'GBP (£)',
    branchAddress: '',
    notes: '',
    isPrimarySettlement: false,
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyFullWireInstruction = (acc: BankWalletAccount) => {
    const text = `ARIELMC OFFICIAL B2B WIRE INSTRUCTIONS
Beneficiary: ${acc.accountName}
Bank: ${acc.bankName}
Account Number: ${acc.accountNumber}
Sort Code / Routing: ${acc.sortCodeOrRouting}
SWIFT / BIC: ${acc.swiftBic}
${acc.iban ? `IBAN: ${acc.iban}\n` : ''}${acc.erqAccountNumber ? `ERQ Ref: ${acc.erqAccountNumber}\n` : ''}Branch Address: ${acc.branchAddress}
Currency: ${acc.currency}
SECURITY NOTICE: ArielMC never alters bank settlement details via email alone. Always verify via phone (+880 2410 811 91) or video call.`;

    navigator.clipboard.writeText(text);
    setCopiedKey(`full-${acc.id}`);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCreateAccount = () => {
    if (!newAccount.bankName || !newAccount.accountNumber) return;
    const created: BankWalletAccount = {
      id: `WAL-${Date.now().toString().slice(-4)}`,
      station: newAccount.station || 'ARIEL_UK',
      bankName: newAccount.bankName,
      accountName: newAccount.accountName || 'Ariel Marketing & Communications Limited',
      accountNumber: newAccount.accountNumber,
      sortCodeOrRouting: newAccount.sortCodeOrRouting || '',
      swiftBic: newAccount.swiftBic || '',
      iban: newAccount.iban || '',
      currency: newAccount.currency || 'USD ($)',
      branchAddress: newAccount.branchAddress || '',
      notes: newAccount.notes || '',
      isPrimarySettlement: newAccount.isPrimarySettlement || false,
    };
    setAccounts(prev => [...prev, created]);
    setIsAddModalOpen(false);
  };

  const filteredAccounts = accounts.filter(acc =>
    selectedStation === 'ALL' ? true : acc.station === selectedStation
  );

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-200">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96A]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#1F3A2E] border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
              Sovereign Banking Vault
            </span>
            <span className="text-xs text-slate-700 font-mono font-medium">
              Zero Local Card Storage (PCI-DSS)
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-heading text-[#1F3A2E] mt-1.5 flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-[#C8A96A]" />
            Enterprise Banking Wallet &amp; Settlement Vault
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Store and generate verified wire instructions for Wise UK, Dhaka AD Bank (Bangladesh Bank ERQ), US Chase, and EU SEPA rails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C8A96A] text-[#1F3A2E] font-bold text-xs flex items-center gap-2 hover:bg-[#d4b97d] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Account</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-white border border-[#DDE3DD] text-[#1F3A2E] hover:bg-[#F4F6F4] shadow-xs cursor-pointer transition-colors"
            title="Print Bank Schedule"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block font-bold">Anti-BEC Dual-Signatory Mandate (SOP-SEC-2026-V1):</strong>
          <p className="text-[11px] text-amber-300/90 leading-relaxed">
            ArielMC banking details are immutable via unverified email. Any buyer receiving an instruction to alter settlement rails
            must contact the Dhaka Lead (<span className="font-mono font-bold">+880 2410 811 91</span>) or Managing Director via direct video conference prior to releasing funds.
          </p>
        </div>
      </div>

      {/* Station Filter Pills */}
      <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#12241b] border border-[#2b5540] text-xs font-mono">
        {[
          { id: 'ALL', label: 'All Global Stations' },
          { id: 'ARIEL_UK', label: '🇬🇧 ArielMC UK (Wise GBP)' },
          { id: 'ARIEL_BD', label: '🇧🇩 Dhaka HQ (City Bank / Sonali ERQ)' },
          { id: 'ARIEL_US', label: '🇺🇸 ArielMC US (Chase USD)' },
          { id: 'ARIEL_EU', label: '🇪🇺 ArielMC Europe (Deutsche Bank EUR)' },
          { id: 'ARIEL_AU', label: '🇦🇺 ArielMC Australia (CBA AUD)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStation(tab.id)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              selectedStation === tab.id
                ? 'bg-[#C8A96A] text-slate-950 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#183225]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredAccounts.map(acc => (
          <div
            key={acc.id}
            className="rounded-2xl bg-gradient-to-br from-[#12261d] via-[#0f2119] to-[#0c1a13] border-2 border-[#2b5540] p-6 space-y-5 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8A96A]/5 rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] text-[10px] font-mono font-bold">
                    {acc.station.replace('_', ' ')}
                  </span>
                  {acc.isPrimarySettlement && (
                    <span className="px-2 py-0.5 rounded bg-[#C8A96A]/20 text-[#C8A96A] border border-[#C8A96A]/40 text-[9px] font-mono font-bold uppercase">
                      Primary Settlement
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white">{acc.bankName}</h4>
                <p className="text-xs text-slate-400 font-mono">{acc.branchAddress}</p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-[#1e3c2d] border border-[#2d5942] flex items-center justify-center text-[#C8A96A] shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
            </div>

            {/* Banking Details Grid */}
            <div className="p-4 rounded-xl bg-[#0a1610]/80 border border-[#214232] space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#1c382a] pb-2">
                <span className="text-slate-400 text-[11px]">Beneficiary Name:</span>
                <span className="font-bold text-slate-100">{acc.accountName}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#1c382a] pb-2">
                <span className="text-slate-400 text-[11px]">Account Number:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-400 text-sm tracking-wider">{acc.accountNumber}</span>
                  <button
                    onClick={() => handleCopy(acc.accountNumber, `acct-${acc.id}`)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy Account Number"
                  >
                    {copiedKey === `acct-${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-[#1c382a] pb-2">
                <span className="text-slate-400 text-[11px]">Sort Code / Routing:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{acc.sortCodeOrRouting}</span>
                  <button
                    onClick={() => handleCopy(acc.sortCodeOrRouting, `sort-${acc.id}`)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy Code"
                  >
                    {copiedKey === `sort-${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-[#1c382a] pb-2">
                <span className="text-slate-400 text-[11px]">SWIFT / BIC Code:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-300">{acc.swiftBic}</span>
                  <button
                    onClick={() => handleCopy(acc.swiftBic, `swift-${acc.id}`)}
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy SWIFT"
                  >
                    {copiedKey === `swift-${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {acc.iban && (
                <div className="flex justify-between items-center border-b border-[#1c382a] pb-2">
                  <span className="text-slate-400 text-[11px]">IBAN:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#C8A96A] text-[11px] truncate max-w-[200px]">{acc.iban}</span>
                    <button
                      onClick={() => handleCopy(acc.iban!, `iban-${acc.id}`)}
                      className="p-1 text-slate-400 hover:text-white"
                      title="Copy IBAN"
                    >
                      {copiedKey === `iban-${acc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {acc.erqAccountNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">ERQ Foreign Quota:</span>
                  <span className="font-bold text-purple-300 text-[11px]">{acc.erqAccountNumber}</span>
                </div>
              )}
            </div>

            {/* Operational Notes */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {acc.notes}
            </p>

            {/* Bottom Copy Full Sheet Button */}
            <div className="pt-2 border-t border-[#234534] flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Operating Currency: {acc.currency}
              </span>

              <button
                onClick={() => handleCopyFullWireInstruction(acc)}
                className="px-3 py-1.5 rounded-lg bg-[#183225] hover:bg-[#204231] text-xs font-mono text-[#C8A96A] border border-[#2e5d45] flex items-center gap-1.5 transition-colors"
              >
                {copiedKey === `full-${acc.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === `full-${acc.id}` ? 'Copied Full Wire Sheet' : 'Copy Wire Instructions'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#0f1f18] border-2 border-[#C8A96A]/60 shadow-2xl p-6 space-y-4 text-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-[#C8A96A]" />
                Enlist Sovereign Bank Account
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Station *:</label>
                  <select
                    value={newAccount.station}
                    onChange={e => setNewAccount({ ...newAccount, station: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  >
                    <option value="ARIEL_UK">ArielMC UK (London)</option>
                    <option value="ARIEL_BD">Dhaka HQ (Bangladesh)</option>
                    <option value="ARIEL_US">ArielMC US (USA)</option>
                    <option value="ARIEL_EU">ArielMC Europe (EU)</option>
                    <option value="ARIEL_AU">ArielMC Australia (AU)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Currency *:</label>
                  <input
                    type="text"
                    value={newAccount.currency}
                    onChange={e => setNewAccount({ ...newAccount, currency: e.target.value })}
                    placeholder="e.g. GBP (£) or BDT (৳)"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bank Name *:</label>
                <input
                  type="text"
                  value={newAccount.bankName}
                  onChange={e => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  placeholder="e.g. Wise Business UK / Standard Chartered"
                  className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-bold focus:outline-none focus:border-[#C8A96A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Account Number *:</label>
                  <input
                    type="text"
                    value={newAccount.accountNumber}
                    onChange={e => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                    placeholder="e.g. 89201948"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Sort Code / Routing:</label>
                  <input
                    type="text"
                    value={newAccount.sortCodeOrRouting}
                    onChange={e => setNewAccount({ ...newAccount, sortCodeOrRouting: e.target.value })}
                    placeholder="e.g. 23-14-70"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">SWIFT / BIC Code:</label>
                  <input
                    type="text"
                    value={newAccount.swiftBic}
                    onChange={e => setNewAccount({ ...newAccount, swiftBic: e.target.value })}
                    placeholder="e.g. WISEGB2L"
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">IBAN (if applicable):</label>
                  <input
                    type="text"
                    value={newAccount.iban}
                    onChange={e => setNewAccount({ ...newAccount, iban: e.target.value })}
                    placeholder="GB29WISE..."
                    className="w-full px-3 py-2 rounded-lg bg-[#183326] border border-[#2e5d45] text-white font-mono focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Branch Address:</label>
                <input
                  type="text"
                  value={newAccount.branchAddress}
                  onChange={e => setNewAccount({ ...newAccount, branchAddress: e.target.value })}
                  placeholder="e.g. 56 Shoreditch High St, London E1 6JJ"
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
                onClick={handleCreateAccount}
                disabled={!newAccount.bankName || !newAccount.accountNumber}
                className="px-5 py-2 rounded-xl bg-[#C8A96A] text-slate-950 font-bold text-xs hover:bg-[#d4b97d] transition-colors disabled:opacity-50"
              >
                Save Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
