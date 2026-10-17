'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Landmark,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe2,
  CreditCard,
  Building2,
  TrendingUp,
  Tag,
  Paperclip,
  Check,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { StandardVoucher, VoucherLineItem, VoucherCurrency, PhysicalAttachment } from '@/types/voucher';
import { AccountHead } from '@/types/accountHead';
import {
  STATION_BANK_ACCOUNTS,
  STATION_METADATA,
  PAYMENT_CHANNELS,
  StationBankAccount,
  getDefaultExchangeRate
} from '@/data/stationBankAccounts';
import { amountToWords } from '@/utils/numberToWords';

interface StationB2CPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePayment: (voucher: StandardVoucher) => void;
  accountHeads: AccountHead[];
  existingVouchersCount: number;
}

export const StationB2CPaymentModal: React.FC<StationB2CPaymentModalProps> = ({
  isOpen,
  onClose,
  onSavePayment,
  accountHeads,
  existingVouchersCount,
}) => {
  // Selected Station (defaults to UK Station since Barclays/Wise is a primary overseas station)
  const [selectedStation, setSelectedStation] = useState<'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | 'ARIEL_BD'>('ARIEL_UK');

  // Bank Accounts for the selected station
  const stationBanks = STATION_BANK_ACCOUNTS.filter((b) => b.stationCode === selectedStation);
  const [selectedBankId, setSelectedBankId] = useState<string>(stationBanks[0]?.id || 'ba-uk-01');

  // Active Bank object
  const activeBank = STATION_BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || stationBanks[0] || STATION_BANK_ACCOUNTS[0];

  // Channel
  const [selectedChannel, setSelectedChannel] = useState<string>('SHOPIFY');

  // Form Fields
  const [payerName, setPayerName] = useState<string>('Shopify UK D2C Daily Settlements');
  const [payerLocation, setPayerLocation] = useState<string>('London, United Kingdom');
  const [orderOrTxRef, setOrderOrTxRef] = useState<string>(`SH-UK-${Math.floor(10000 + Math.random() * 90000)}`);
  
  // Date & Time (Real-time default)
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [paymentTime, setPaymentTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Amounts & FX
  const [foreignAmount, setForeignAmount] = useState<number>(450.0);
  const [exchangeRate, setExchangeRate] = useState<number>(activeBank.defaultFxRateToBdt);
  const currency: VoucherCurrency = activeBank.currency;

  // Account Head
  const incomeHeads = accountHeads.filter((h) => h.type === 'INCOME');
  const defaultIncomeHead = incomeHeads.find((h) => h.name.includes('Retail') || h.name.includes('B2C')) || incomeHeads[0] || {
    id: 'head-inc-4',
    name: 'Retail & Showroom Commercial Sales (B2C)',
    subCategories: [
      'Shopify Global D2C: Station Bank Deposit (Barclays/Stripe/Wise)',
      'London Mayfair Showroom Client Card / POS Transaction',
      'Amazon Marketplace Payout: Overseas Station Settlement',
      'Direct Inward Wire / Faster Payments Settlement'
    ]
  };

  const [selectedHeadName, setSelectedHeadName] = useState<string>(defaultIncomeHead.name);
  const currentHeadObj = incomeHeads.find((h) => h.name === selectedHeadName) || defaultIncomeHead;
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>(
    currentHeadObj.subCategories?.[0] || 'Shopify Global D2C: Station Bank Deposit (Barclays/Stripe/Wise)'
  );

  // Description / Notes
  const [description, setDescription] = useState<string>('Full-Grain Heritage Leather Goods D2C Consumer Purchases');
  const [internalNotes, setInternalNotes] = useState<string>(
    'Real-time automated sync of daily B2C settlement from overseas station bank into ArielMC ERP ledger.'
  );

  // Attachment (Optional payment proof / bank SMS screenshot)
  const [attachment, setAttachment] = useState<PhysicalAttachment | null>(null);

  // When Station changes, update active bank and default FX rate
  const handleStationChange = (st: 'ARIEL_UK' | 'ARIEL_US' | 'ARIEL_EU' | 'ARIEL_AU' | 'ARIEL_BD') => {
    setSelectedStation(st);
    const newBanks = STATION_BANK_ACCOUNTS.filter((b) => b.stationCode === st);
    if (newBanks.length > 0) {
      setSelectedBankId(newBanks[0].id);
      setExchangeRate(newBanks[0].defaultFxRateToBdt);
      
      // Update location and payer preset
      const meta = STATION_METADATA[st];
      setPayerLocation(meta ? `${meta.country}` : 'Overseas');
      if (st === 'ARIEL_UK') {
        setPayerName('Shopify UK D2C Daily Settlements');
        setOrderOrTxRef(`SH-UK-${Math.floor(10000 + Math.random() * 90000)}`);
      } else if (st === 'ARIEL_US') {
        setPayerName('Stripe / Amazon US Daily Payout');
        setOrderOrTxRef(`AMZ-US-${Math.floor(10000 + Math.random() * 90000)}`);
      } else if (st === 'ARIEL_EU') {
        setPayerName('Shopify EU (iDEAL / Bancontact Inflows)');
        setOrderOrTxRef(`SEPA-EU-${Math.floor(10000 + Math.random() * 90000)}`);
      } else if (st === 'ARIEL_AU') {
        setPayerName('Shopify AU / Osko Instant Payout');
        setOrderOrTxRef(`AU-D2C-${Math.floor(10000 + Math.random() * 90000)}`);
      } else {
        setPayerName('Dhaka Showroom POS / EBL Walk-in');
        setOrderOrTxRef(`POS-DHK-${Math.floor(10000 + Math.random() * 90000)}`);
      }
    }
  };

  // When Bank changes, update FX rate
  const handleBankChange = (bankId: string) => {
    setSelectedBankId(bankId);
    const b = STATION_BANK_ACCOUNTS.find((item) => item.id === bankId);
    if (b) {
      setExchangeRate(b.defaultFxRateToBdt);
    }
  };

  // Calculated Total BDT
  const totalAmountBdt = Math.round(Number(foreignAmount || 0) * Number(exchangeRate || 1));

  // Attachment upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const att: PhysicalAttachment = {
      id: `att-stn-${Date.now()}`,
      fileName: file.name,
      fileUrl: fileUrl,
      fileType: file.type.includes('pdf') ? 'PDF' : file.type.includes('png') ? 'IMAGE_PNG' : 'IMAGE_JPG',
      fileSize: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      memoNumber: orderOrTxRef || `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      memoDate: paymentDate,
      supplierShopName: activeBank.bankName,
      notes: `Bank credit confirmation screenshot for ${activeBank.bankName} (${activeBank.accountNumberMask})`,
    };
    setAttachment(att);
  };

  // Submit Handler: Creates Official StandardVoucher
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!foreignAmount || foreignAmount <= 0) {
      alert('Please enter a valid received amount.');
      return;
    }

    const nextVoucherSeq = String(existingVouchersCount + 101).padStart(4, '0');
    const voucherNumber = `AMC - RCV - STN - 2026 - ${nextVoucherSeq}`;

    const lineItem: VoucherLineItem = {
      id: `item-stn-${Date.now()}`,
      sl: 1,
      description: `${description} via ${selectedChannel} [Station Account: ${activeBank.bankName} (${activeBank.accountNumberMask})] Ref: ${orderOrTxRef}`,
      amount: totalAmountBdt,
      foreignAmount: foreignAmount,
    };

    const newVoucher: StandardVoucher = {
      id: `vch-stn-${Date.now()}`,
      voucherNumber: voucherNumber,
      type: 'CASH_RECEIVE',
      date: paymentDate,
      mainAccountHead: selectedHeadName,
      subCategoryHead: selectedSubCategory,
      currency: currency,
      exchangeRateToBdt: exchangeRate,
      partyName: payerName,
      partyDetails: payerLocation,
      linkedOrderNumber: orderOrTxRef,
      buyerCountry: STATION_METADATA[selectedStation]?.country || 'Overseas',
      paymentMode: 'BEFTN_BANK',
      bankReference: `${activeBank.bankName} (${activeBank.accountNumberMask}) • Channel: ${selectedChannel} • Ref: ${orderOrTxRef}`,
      taxChalanRef: `STN-INFLOW-${Date.now().toString().slice(-6)}`,
      stationCode: selectedStation,
      stationBankName: activeBank.bankName,
      stationAccountNumber: activeBank.accountNumberMask,
      channel: selectedChannel,
      channelTransactionRef: orderOrTxRef,
      isStationB2CInflow: true,
      items: [lineItem],
      totalAmount: foreignAmount,
      totalAmountBdt: totalAmountBdt,
      amountInWords: amountToWords(totalAmountBdt, 'BDT'),
      preparedBy: 'Station Real-Time Gateway Terminal (Automated)',
      verifiedBy: 'Tanvir Hossain (Accounts / Finance Lead)',
      approvedBy: 'Syed Akramul Hassan (Managing Director / CEO)',
      claimantOrDepositor: `${payerName} (Settlement Credit)`,
      physicalAttachment: attachment || undefined,
      auditStatus: 'VERIFIED',
      isLocalValueAddition: true,
      notes: `${internalNotes} (Timestamp: ${paymentDate} ${paymentTime} UTC+6)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSavePayment(newVoucher);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="bg-[#12231B] border-2 border-[#2C5240] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white"
      >
        
        {/* =========================================================
            1. STICKY MODAL HEADER BAR
            ========================================================= */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#162B22] via-[#1F3A2E] to-[#12231B] border-b border-[#2C5240] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-md">
              <Landmark className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                  Record Station Bank B2C/D2C Inflow
                </h2>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  REAL-TIME ERP SYNC
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-['Open_Sans'] line-clamp-1 mt-0.5">
                Immediate double-entry ledger capture for daily B2C consumer payments received across overseas station bank accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* =========================================================
            2. SCROLLABLE FORM BODY
            ========================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* STEP 1: SELECT OVERSEAS / DOMESTIC STATION */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96A] font-bold flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              <span>1. Receiving Station Jurisdiction</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['ARIEL_UK', 'ARIEL_US', 'ARIEL_EU', 'ARIEL_AU', 'ARIEL_BD'] as const).map((code) => {
                const meta = STATION_METADATA[code];
                const isSelected = selectedStation === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleStationChange(code)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#1E6B3A] to-[#14512C] border-emerald-400 shadow-md text-white'
                        : 'bg-[#0A140F] border-[#2C5240] text-gray-400 hover:text-white hover:border-[#3d6e56]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-lg">{meta.flag}</span>
                      <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-black/30 text-gray-300">
                        {meta.defaultCurrency}
                      </span>
                    </div>
                    <div className="font-bold text-xs truncate text-white">
                      {code.replace('ARIEL_', '')} Station
                    </div>
                    <div className="text-[10px] text-gray-300 truncate">
                      {meta.country}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECT STATION BANK ACCOUNT & CHANNEL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Bank Account */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1.5 font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Station Bank Account</span>
              </label>
              <select
                value={selectedBankId}
                onChange={(e) => handleBankChange(e.target.value)}
                className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              >
                {stationBanks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} — [{b.currency} {b.accountNumberMask}]
                  </option>
                ))}
              </select>
              <div className="p-2 rounded-lg bg-[#0A140F]/80 border border-white/5 text-[10px] text-gray-400 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account Type:</span>
                  <span className="font-semibold text-gray-300">{activeBank.accountType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Routing / Sort Code:</span>
                  <span className="font-mono text-emerald-400">{activeBank.sortCodeOrRouting || activeBank.swiftBic || 'Direct Wire Rail'}</span>
                </div>
                <div className="text-[9px] text-gray-400 italic mt-0.5">
                  {activeBank.purpose}
                </div>
              </div>
            </div>

            {/* Payment Channel */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1.5 font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>D2C / B2C Inflow Channel</span>
              </label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono"
              >
                {PAYMENT_CHANNELS.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.label}
                  </option>
                ))}
              </select>

              {/* Quick Channel Pills */}
              <div className="flex flex-wrap gap-1 pt-0.5">
                {activeBank.supportedChannels.slice(0, 4).map((chName) => (
                  <button
                    key={chName}
                    type="button"
                    onClick={() => {
                      if (chName.includes('Shopify')) setSelectedChannel('SHOPIFY');
                      else if (chName.includes('POS')) setSelectedChannel('SHOWROOM_POS');
                      else if (chName.includes('Faster') || chName.includes('ACH')) setSelectedChannel('FASTER_PAYMENTS_ACH');
                      else if (chName.includes('Amazon')) setSelectedChannel('AMAZON');
                      else setSelectedChannel('BANK_TRANSFER');
                    }}
                    className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors"
                  >
                    + {chName}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3: TRANSACTION DETAILS & REAL-TIME TIMESTAMP */}
          <div className="p-3.5 rounded-xl bg-[#0A140F] border border-[#2C5240] space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#C8A96A] font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>2. Payer &amp; Transaction Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Payer / Customer Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono">Payer / Customer / Settlement Batch</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. Shopify UK Daily Settlement"
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono">Customer City &amp; Country</label>
                <input
                  type="text"
                  value={payerLocation}
                  onChange={(e) => setPayerLocation(e.target.value)}
                  placeholder="e.g. London, United Kingdom"
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Order / Reference */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono">Order # / Gateway Ref #</label>
                <input
                  type="text"
                  required
                  value={orderOrTxRef}
                  onChange={(e) => setOrderOrTxRef(e.target.value)}
                  placeholder="e.g. SH-UK-90412"
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-0.5">
              {/* Date */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C8A96A]" />
                  <span>Settlement Value Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              {/* Time */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Real-Time Inflow Timestamp (UTC+6)</span>
                </label>
                <input
                  type="time"
                  value={paymentTime}
                  onChange={(e) => setPaymentTime(e.target.value)}
                  className="w-full bg-[#12231B] border border-[#2C5240] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* STEP 4: FINANCIAL AMOUNTS & LIVE FX RATE CALCULATOR */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#12231B] to-[#1A3326] border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>3. Currency &amp; Real-Time BDT Exchange Rate</span>
              </div>
              <span className="text-[9px] font-mono text-gray-400">
                Bangladesh Bank AD Compliant Conversion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              {/* Foreign Amount */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-300 font-mono font-semibold flex items-center justify-between">
                  <span>Received in Station Bank</span>
                  <span className="text-emerald-400 font-bold">{currency}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-gray-400">
                    {currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'AUD' ? 'A$' : '৳'}
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={foreignAmount || ''}
                    onChange={(e) => setForeignAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Exchange Rate */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-300 font-mono font-semibold flex items-center justify-between">
                  <span>FX Rate to BDT (৳)</span>
                  <button
                    type="button"
                    onClick={() => setExchangeRate(activeBank.defaultFxRateToBdt)}
                    className="text-[9px] text-[#C8A96A] hover:underline"
                  >
                    Reset: {activeBank.defaultFxRateToBdt}
                  </button>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-mono font-bold text-gray-400">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={exchangeRate || ''}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 1)}
                    placeholder="1.00"
                    className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-[#C8A96A] focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Converted Total BDT Output Card */}
              <div className="p-2.5 rounded-lg bg-gradient-to-r from-emerald-950 to-[#12231B] border border-emerald-500/60 shadow-inner">
                <span className="text-[9px] font-mono uppercase text-emerald-300 block font-bold">
                  Total Ledger Credit (BDT)
                </span>
                <div className="text-lg font-bold font-mono text-emerald-300 mt-0.5">
                  ৳ {totalAmountBdt.toLocaleString()}
                </div>
                <div className="text-[9px] text-gray-400 font-mono truncate">
                  ≈ {foreignAmount} {currency} @ ৳{exchangeRate}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: STATUTORY ACCOUNT HEAD & SUB-CATEGORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1.5 font-semibold">
                <Tag className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>Statutory Account Head</span>
              </label>
              <select
                value={selectedHeadName}
                onChange={(e) => {
                  setSelectedHeadName(e.target.value);
                  const h = incomeHeads.find((head) => head.name === e.target.value);
                  if (h && h.subCategories?.length > 0) {
                    setSelectedSubCategory(h.subCategories[0]);
                  }
                }}
                className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-['Montserrat']"
              >
                {incomeHeads.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1.5 font-semibold">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sub-Category Classification</span>
              </label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-['Montserrat']"
              >
                {(currentHeadObj.subCategories || []).map((sub, idx) => (
                  <option key={idx} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 6: PARTICULARS & OPTIONAL MEMO SCAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 font-semibold">
                Goods / Commercial Particulars Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description e.g. Executive Laptop Sleeves & Cardholders"
                className="w-full bg-[#0A140F] border border-[#2C5240] rounded-lg p-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-['Open_Sans']"
              />
            </div>

            {/* Optional Attachment */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-[#C8A96A]" />
                  <span>Bank SMS / Merchant Statement Upload (Optional)</span>
                </span>
                {attachment && (
                  <span className="text-[9px] text-emerald-400 font-mono">
                    ✓ {attachment.fileName}
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#2C5240] hover:border-emerald-400 bg-[#0A140F] cursor-pointer text-xs text-gray-300 hover:text-white transition-all">
                  <Smartphone className="w-4 h-4 text-[#C8A96A]" />
                  <span>{attachment ? 'Replace Screenshot / PDF' : 'Upload Bank SMS / Receipt'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {attachment && (
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* =========================================================
            3. STICKY MODAL FOOTER ACTIONS (ALWAYS VISIBLE AT BOTTOM)
            ========================================================= */}
        <div className="px-5 py-3 bg-[#0A140F] border-t border-[#2C5240] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Real-Time Double Entry: <strong className="text-white">+৳ {totalAmountBdt.toLocaleString()}</strong> ({foreignAmount} {currency} @ ৳{exchangeRate})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer font-['Montserrat'] border border-emerald-400/40"
            >
              <Check className="w-4 h-4 text-[#C8A96A]" />
              <span>Save to ERP Ledger Real-Time</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
