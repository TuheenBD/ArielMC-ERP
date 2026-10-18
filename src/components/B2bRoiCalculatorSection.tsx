'use client';

import React, { useState, useMemo } from 'react';
import { ArielMC } from '@/lib/brand';
import { ThemeProfile } from '@/components/Sidebar';
import {
  Calculator,
  DollarSign,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Users,
  Building2,
  HelpCircle,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';

interface B2bRoiCalculatorSectionProps {
  theme?: ThemeProfile;
}

export const B2bRoiCalculatorSection: React.FC<B2bRoiCalculatorSectionProps> = ({
  theme = 'crm-green',
}) => {
  // =========================================================================
  // 1. DYNAMIC USER INPUTS (Column C Prospect Values)
  // =========================================================================
  const [numEmployees, setNumEmployees] = useState<number>(100); // N_emp (10 - 5000)
  const [hourlyWage, setHourlyWage] = useState<number>(48.0); // W_hr ($20 - $250)
  const [weeklyHours, setWeeklyHours] = useState<number>(4.5); // H_wk (1.0 - 25.0)
  const [legacySpend, setLegacySpend] = useState<number>(42000); // C_leg ($0 - $1,000,000)
  const [errorCost, setErrorCost] = useState<number>(30000); // E_err ($0 - $500,000)
  const [d2cUsers, setD2cUsers] = useState<number>(12); // N_d2c (0 - 500)

  // =========================================================================
  // 2. ADVANCED AUDIT ASSUMPTIONS (Editable or Locked CFO Haircuts)
  // =========================================================================
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [timeReduction, setTimeReduction] = useState<number>(0.31); // E_time (31%)
  const [productivityCapture, setProductivityCapture] = useState<number>(0.75); // R_adopt (75% Realized / 25% Haircut)
  const [errorReduction, setErrorReduction] = useState<number>(0.40); // E_qual (40%)
  const [d2cRetailPrice, setD2cRetailPrice] = useState<number>(450); // P_d2c ($450/yr)
  const [volumeDiscount, setVolumeDiscount] = useState<number>(0.30); // D_ent (30%)
  const [implementationFee, setImplementationFee] = useState<number>(5000); // C_imp ($5,000)

  // Lead capture state
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [slaTriggered, setSlaTriggered] = useState(false);

  // =========================================================================
  // 3. CORE MATHEMATICAL ENGINE
  // =========================================================================
  const calculations = useMemo(() => {
    // Step 1: Gross Annual Hours Reclaimed
    // H_saved = N_emp * H_wk * 50_weeks * E_time
    const hoursSaved = numEmployees * weeklyHours * 50 * timeReduction;

    // Step 2: Three-Pillar Financial Savings (B_total)
    // 1. Risk-Adjusted Labor Productivity Savings (S_prod)
    const laborSavings = hoursSaved * hourlyWage * productivityCapture;

    // 2. Legacy Vendor & Shadow D2C Consolidation Savings (S_cons)
    // (C_leg * 0.65) + (N_d2c * P_d2c * D_ent)
    const consolidationSavings = (legacySpend * 0.65) + (d2cUsers * d2cRetailPrice * volumeDiscount);

    // 3. Operational Error & Rework Mitigation Savings (S_err)
    // E_err * E_qual
    const errorSavings = errorCost * errorReduction;

    // TOTAL GROSS ANNUAL BENEFIT (B_total)
    const totalBenefit = laborSavings + consolidationSavings + errorSavings;

    // Step 3: Enterprise Investment, Net Return, Payback & 3-Year NPV
    // Annual Recurring Contract (ARR) = N_emp * P_d2c * (1 - D_ent)
    const discountedSeatPrice = d2cRetailPrice * (1 - volumeDiscount); // $315/seat
    const annualArr = numEmployees * discountedSeatPrice;

    // Year 1 Total Investment (I_yr1) = ARR + C_imp
    const year1Investment = annualArr + implementationFee;

    // Year 1 Net Financial Benefit
    const year1NetBenefit = totalBenefit - year1Investment;

    // Year 1 Net ROI (%)
    const netRoiPct = year1Investment > 0 ? (year1NetBenefit / year1Investment) * 100 : 0;

    // Investment Payback Period (Months) = I_yr1 / (B_total / 12)
    const monthlyBenefit = totalBenefit / 12;
    const paybackMonths = monthlyBenefit > 0 ? year1Investment / monthlyBenefit : 0;
    const paybackDays = Math.round(paybackMonths * 30);

    // 3-Year Net Present Value (NPV @ 10% Discount Rate)
    // Net_Yr1 = totalBenefit - year1Investment
    // Net_Yr2 = totalBenefit - annualArr
    // Net_Yr3 = totalBenefit - annualArr
    const netYr2 = totalBenefit - annualArr;
    const netYr3 = totalBenefit - annualArr;
    const npv3Year = (year1NetBenefit / Math.pow(1.10, 1)) + (netYr2 / Math.pow(1.10, 2)) + (netYr3 / Math.pow(1.10, 3));

    // Distribution percentages
    const pctLabor = totalBenefit > 0 ? (laborSavings / totalBenefit) * 100 : 0;
    const pctConsolidation = totalBenefit > 0 ? (consolidationSavings / totalBenefit) * 100 : 0;
    const pctError = totalBenefit > 0 ? (errorSavings / totalBenefit) * 100 : 0;

    return {
      hoursSaved,
      laborSavings,
      consolidationSavings,
      errorSavings,
      totalBenefit,
      discountedSeatPrice,
      annualArr,
      year1Investment,
      year1NetBenefit,
      netRoiPct,
      paybackMonths,
      paybackDays,
      npv3Year,
      pctLabor,
      pctConsolidation,
      pctError,
    };
  }, [
    numEmployees,
    hourlyWage,
    weeklyHours,
    legacySpend,
    errorCost,
    d2cUsers,
    timeReduction,
    productivityCapture,
    errorReduction,
    d2cRetailPrice,
    volumeDiscount,
    implementationFee,
  ]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail.trim()) return;
    setLeadSubmitted(true);
    if (numEmployees >= 100) {
      setSlaTriggered(true);
    }
  };

  const isRoyal = theme === 'royal-blue';
  const cardBg = isRoyal ? 'bg-[#1E293B] border-slate-700' : 'bg-slate-900 border-slate-800';

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-300">
      
      {/* Title & Framing Header */}
      <div className={`p-6 rounded-2xl ${cardBg} border shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight font-heading flex items-center gap-2">
              <ArielMC /> <span>Enterprise B2B ROI &amp; TCO Consolidation Engine</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Deliverable 1 &amp; Appendix D
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Mission-critical commercial bridge for top-of-funnel web conversion (<code className="text-amber-300">arielmc.com/roi</code>) and deal-desk discovery debriefs. Incorporates non-negotiable <strong>25% conservative CFO haircut</strong> (75% realized productivity factor) to insulate business cases against finance vetos.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setNumEmployees(100);
              setHourlyWage(48);
              setWeeklyHours(4.5);
              setLegacySpend(42000);
              setErrorCost(30000);
              setD2cUsers(12);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Main 60% / 40% Dual-Pane Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =====================================================================
            LEFT PANE (60% Width / 7 Cols): Dynamic Input Sliders & Controls
            ===================================================================== */}
        <div className={`lg:col-span-7 p-6 rounded-2xl ${cardBg} border shadow-xl space-y-6`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <span>1. Prospect Operational Input Variables</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust observable operating parameters to model prospective account savings
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Live Interactive Math
            </span>
          </div>

          <div className="space-y-5">
            {/* 1. Target Department Headcount (N_emp) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Target Department Headcount (Seats)</span>
                  <span className="text-[10px] text-slate-400 font-mono">(N_emp)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={10}
                    max={5000}
                    value={numEmployees}
                    onChange={(e) => setNumEmployees(Math.max(10, Math.min(5000, Number(e.target.value) || 10)))}
                    className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                  <span className="text-xs text-slate-400 font-semibold">Seats</span>
                </div>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={5}
                value={numEmployees}
                onChange={(e) => setNumEmployees(Number(e.target.value))}
                className="w-full accent-[#C8A96A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 Seats</span>
                <span>Default: 100</span>
                <span>1,000+ Seats</span>
              </div>
            </div>

            {/* 2. Average Fully Burdened Hourly Wage (W_hr) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Fully Burdened Hourly Wage (Salary + Benefits)</span>
                  <span className="text-[10px] text-slate-400 font-mono">(W_hr)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={20}
                    max={250}
                    step={1}
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Math.max(20, Math.min(250, Number(e.target.value) || 20)))}
                    className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                  <span className="text-xs text-slate-400 font-semibold">$/hr</span>
                </div>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={1}
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full accent-[#C8A96A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$20.00 / hr</span>
                <span>Default: $48.00 / hr</span>
                <span>$150.00+ / hr</span>
              </div>
            </div>

            {/* 3. Weekly Hours Spent on Legacy Manual Workflow (H_wk) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Weekly Manual Legacy Workflow Hours per User</span>
                  <span className="text-[10px] text-slate-400 font-mono">(H_wk)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1.0}
                    max={25.0}
                    step={0.5}
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Math.max(1.0, Math.min(25.0, Number(e.target.value) || 1.0)))}
                    className="w-20 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                  <span className="text-xs text-slate-400 font-semibold">hrs/wk</span>
                </div>
              </div>
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full accent-[#C8A96A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1.0 hr / wk</span>
                <span>Default: 4.5 hrs / wk</span>
                <span>15.0+ hrs / wk</span>
              </div>
            </div>

            {/* 4. Current Annual Legacy Software & Vendor Spend (C_leg) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Annual Legacy Software &amp; Vendor Spend</span>
                  <span className="text-[10px] text-slate-400 font-mono">(C_leg)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={1000000}
                    step={1000}
                    value={legacySpend}
                    onChange={(e) => setLegacySpend(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                  <span className="text-xs text-slate-400 font-semibold">$/yr</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={200000}
                step={2500}
                value={legacySpend}
                onChange={(e) => setLegacySpend(Number(e.target.value))}
                className="w-full accent-[#C8A96A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$0</span>
                <span>Default: $42,000 / yr</span>
                <span>$200,000+ / yr</span>
              </div>
            </div>

            {/* 5. Annual Operational Error, Rework or Attrition Costs (E_err) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Annual Operational Error, Rework &amp; Rework Costs</span>
                  <span className="text-[10px] text-slate-400 font-mono">(E_err)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={500000}
                    step={1000}
                    value={errorCost}
                    onChange={(e) => setErrorCost(Math.max(0, Number(e.target.value) || 0))}
                    className="w-24 px-2 py-1 rounded bg-slate-950 border border-slate-700 text-right font-mono text-xs font-bold text-white focus:outline-none focus:border-[#C8A96A]"
                  />
                  <span className="text-xs text-slate-400 font-semibold">$/yr</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={150000}
                step={2500}
                value={errorCost}
                onChange={(e) => setErrorCost(Number(e.target.value))}
                className="w-full accent-[#C8A96A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$0</span>
                <span>Default: $30,000 / yr</span>
                <span>$150,000+ / yr</span>
              </div>
            </div>

            {/* 6. Employees Expensing ArielMC D2C (N_d2c) - Trojan Horse Indicator */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <label className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Employees Already Expensing ArielMC Individually</span>
                    <span className="text-[10px] text-amber-400/80 font-mono">(N_d2c)</span>
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Bottom-Up Trojan Horse Signal (Organic end-user adoption expensed on corporate cards)
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={d2cUsers}
                    onChange={(e) => setD2cUsers(Math.max(0, Math.min(500, Number(e.target.value) || 0)))}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-amber-500/40 text-right font-mono text-xs font-bold text-amber-300 focus:outline-none"
                  />
                  <span className="text-xs text-slate-400 font-semibold">Users</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={1}
                value={d2cUsers}
                onChange={(e) => setD2cUsers(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* ===================================================================
              ADVANCED AUDIT ASSUMPTIONS (COLLAPSIBLE / CFO HAIRCUT ACCORDION)
              =================================================================== */}
          <div className="border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-white py-1.5 transition"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>[+] View Advanced Audit Assumptions (25% Conservative CFO Haircut)</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Workflow Time Reduction Factor:</span>
                    <span className="font-mono font-bold text-white">E_time = 0.31 (31% documented in Industry Report #1)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Realized Productivity Capture:</span>
                    <span className="font-mono font-bold text-emerald-400">R_adopt = 0.75 (Non-negotiable 25% CFO Haircut)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Operational Error Mitigation:</span>
                    <span className="font-mono font-bold text-white">E_qual = 0.40 (40% error reduction)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">D2C Retail Price per Seat:</span>
                    <span className="font-mono font-bold text-white">P_d2c = $450 / user / year</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Enterprise Volume Discount:</span>
                    <span className="font-mono font-bold text-amber-300">D_ent = 30% ($315/seat/year contract price)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Implementation &amp; Onboarding:</span>
                    <span className="font-mono font-bold text-white">C_imp = $5,000 (11-day rapid rollout)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            RIGHT PANE (40% Width / 5 Cols): Sticky Executive Scorecard & Lead Capture
            ===================================================================== */}
        <div className={`lg:col-span-5 p-6 rounded-2xl ${cardBg} border shadow-2xl space-y-6 lg:sticky lg:top-24`}>
          
          {/* Top Scorecard Header */}
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ArielMC Executive Scorecard
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <div>
                <span className="text-3xl font-black text-white font-mono tracking-tight">
                  ${Math.round(calculations.year1NetBenefit).toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 block">/ Year 1 Net Benefit</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {calculations.netRoiPct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-emerald-300/80 block uppercase font-bold">
                  Net Year 1 ROI
                </span>
              </div>
            </div>
          </div>

          {/* 3 Live Metric Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Payback Horizon</span>
              <span className="text-xs font-black text-amber-400 font-mono mt-0.5 block">
                {calculations.paybackMonths.toFixed(2)} Mo
              </span>
              <span className="text-[9px] text-slate-500 font-semibold block">({calculations.paybackDays} Days)</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9.5px] text-slate-400 uppercase font-bold block">Reclaimed Hours</span>
              <span className="text-xs font-black text-blue-400 font-mono mt-0.5 block">
                {Math.round(calculations.hoursSaved).toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold block">Hours / Year</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[9.5px] text-slate-400 uppercase font-bold block">3-Year NPV</span>
              <span className="text-xs font-black text-emerald-400 font-mono mt-0.5 block">
                ${Math.round(calculations.npv3Year).toLocaleString()}
              </span>
              <span className="text-[9px] text-slate-500 font-semibold block">@ 10% Disc</span>
            </div>
          </div>

          {/* Annual Savings Distribution (Segmented Bar) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                Annual Savings Distribution
              </span>
              <span className="text-xs font-mono font-bold text-white">
                ${Math.round(calculations.totalBenefit).toLocaleString()} Total
              </span>
            </div>

            {/* Segmented Visual Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden flex border border-slate-800">
              <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${calculations.pctLabor}%` }}
                title={`Reclaimed Labor: ${calculations.pctLabor.toFixed(1)}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${calculations.pctConsolidation}%` }}
                title={`Tech Consolidation: ${calculations.pctConsolidation.toFixed(1)}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${calculations.pctError}%` }}
                title={`Error Mitigation: ${calculations.pctError.toFixed(1)}%`}
              />
            </div>

            {/* Distribution Legend */}
            <div className="space-y-1 text-[11px] pt-1">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Labor Productivity ({calculations.pctLabor.toFixed(1)}%)</span>
                </span>
                <span className="font-mono font-semibold text-white">
                  ${Math.round(calculations.laborSavings).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Legacy &amp; Shadow D2C ({calculations.pctConsolidation.toFixed(1)}%)</span>
                </span>
                <span className="font-mono font-semibold text-white">
                  ${Math.round(calculations.consolidationSavings).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Error &amp; Attrition Mitigation ({calculations.pctError.toFixed(1)}%)</span>
                </span>
                <span className="font-mono font-semibold text-white">
                  ${Math.round(calculations.errorSavings).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Enterprise Investment Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Enterprise Subscription Investment
            </span>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>Annual Contract (ARR @ $315/seat):</span>
              <span className="font-mono font-bold text-white">${calculations.annualArr.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>One-Time Rapid Implementation:</span>
              <span className="font-mono font-bold text-white">${implementationFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-200 text-xs font-bold pt-1 border-t border-slate-800">
              <span>Year 1 Total Investment:</span>
              <span className="font-mono text-amber-400">${calculations.year1Investment.toLocaleString()}</span>
            </div>
          </div>

          {/* ===================================================================
              LEAD CAPTURE: GATED FORMAL AUDIT (HubSpot & SDR SLA)
              =================================================================== */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-blue-950/40 border border-blue-500/30 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Email Me the CFO-Ready PDF &amp; Excel Audit</span>
              </span>
              <p className="text-[11px] text-slate-300">
                Receive the unredacted mathematical model formatted for CFO deal-desk debriefs.
              </p>
            </div>

            {!leadSubmitted ? (
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C8A96A]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#C8A96A] hover:bg-[#b89552] text-[#0A1A2F] text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send My Bespoke Business Case</span>
                </button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Instant delivery • Zero spam guarantee</span>
                </div>
              </form>
            ) : (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Business Case Dispatched to {leadEmail}</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Custom financial model with {numEmployees} seats (${Math.round(calculations.year1NetBenefit).toLocaleString()} net savings) has been generated.
                </p>
                {slaTriggered && (
                  <div className="p-2 rounded bg-slate-900 border border-amber-500/30 text-[10.5px] text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span><strong>Enterprise Account Triggered (&ge;100 seats):</strong> Slack alert fired to assigned Enterprise AE (15-min SLA response).</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
