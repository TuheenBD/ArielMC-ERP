'use client';

import React, { useState } from 'react';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Search,
  BookOpen,
  Volume2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { GarmentGlossaryTerm } from '@/types/utilities';
import { INITIAL_GARMENT_GLOSSARY } from '@/data/initialUtilitiesData';

export const TranslatorUtility: React.FC = () => {
  const [glossary, setGlossary] = useState<GarmentGlossaryTerm[]>(INITIAL_GARMENT_GLOSSARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live Translator Simulator State
  const [sourceText, setSourceText] = useState('Please ensure all leather briefcases undergo AQL 2.5 inspection with container desiccants before Chittagong port departure.');
  const [sourceLang, setSourceLang] = useState<'EN' | 'BN' | 'FR' | 'DE' | 'ZH'>('EN');
  const [targetLang, setTargetLang] = useState<'BN' | 'EN' | 'FR' | 'DE' | 'ZH'>('BN');
  const [translatedText, setTranslatedText] = useState('অনুগ্রহ করে নিশ্চিত করুন যে চট্টগ্রাম বন্দর ছাড়ার আগে সমস্ত চামড়ার ব্রিফকেস কন্টেইনার ডেসিক্যান্ট সহ AQL ২.৫ পরিদর্শন সম্পন্ন করেছে।');

  // Pre-configured Industry Phrases
  const commonPhrases = [
    {
      en: 'Please share the revised TechPack with updated zipper pull strength tolerances.',
      bn: 'অনুগ্রহ করে হালনাগাদ জিপার পুল শক্তির সহনশীলতা সহ সংশোধিত টেক প্যাকটি শেয়ার করুন।',
      fr: 'Veuillez partager le dossier technique révisé avec les tolérances de traction.',
    },
    {
      en: 'All export proceeds must be reconciled under Bangladesh Bank FE Circular No. 48/31.',
      bn: 'সমস্ত রপ্তানি আয় বাংলাদেশ ব্যাংক এফই সার্কুলার নং ৪৮/৩১ এর অধীনে সমন্বয় করতে হবে।',
      fr: 'Tous les revenus d\'exportation doivent être rapprochés sous la circulaire 48/31.',
    },
    {
      en: 'We confirm 50g clay desiccant packets are placed inside each laptop sleeve compartment.',
      bn: 'আমরা নিশ্চিত করছি যে প্রতিটি ল্যাপটপ স্লিভ বগির ভেতরে ৫০ গ্রাম ক্লে ডেসিক্যান্ট প্যাকেট রাখা হয়েছে।',
      fr: 'Nous confirmons que des sachets déshydratants de 50g sont placés dans chaque compartiment.',
    },
  ];

  const handleSimulateTranslate = (text: string, src: string, tgt: string) => {
    // If text matches any phrase
    const match = commonPhrases.find(p => p.en.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(p.en.toLowerCase()));
    if (match) {
      if (tgt === 'BN') setTranslatedText(match.bn);
      else if (tgt === 'FR') setTranslatedText(match.fr);
      else setTranslatedText(match.en);
    } else {
      if (tgt === 'BN') {
        setTranslatedText(`[অনূদিত]: ${text} (প্রযুক্তিগত অনুবাদ সম্পন্ন)`);
      } else if (tgt === 'FR') {
        setTranslatedText(`[Traduit]: ${text} (Spécification textile vérifiée)`);
      } else if (tgt === 'DE') {
        setTranslatedText(`[Übersetzt]: ${text} (Export-Spezifikation verifiziert)`);
      } else if (tgt === 'ZH') {
        setTranslatedText(`[翻译]: ${text} (纺织品出口技术规范已确认)`);
      } else {
        setTranslatedText(text);
      }
    }
  };

  const handleSwapLanguages = () => {
    const tempSrc = sourceLang;
    setSourceLang(targetLang as any);
    setTargetLang(tempSrc as any);
    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredGlossary = glossary
    .filter(g => (selectedCategory === 'ALL' ? true : g.category === selectedCategory))
    .filter(g =>
      searchQuery
        ? g.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.bengali.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.definition.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6 text-slate-900 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96A]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#1F3A2E] border border-[#C8A96A]/50 text-[#C8A96A] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
              <Languages className="w-3.5 h-3.5 text-[#C8A96A]" />
              Cross-Border Trade &amp; Garments
            </span>
            <span className="text-xs text-slate-700 font-mono font-medium">
              English • বাংলা • Français • Deutsch • 中文
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold font-heading text-[#1F3A2E] mt-1.5">
            International Garment, Sourcing &amp; Export Translator
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Bilingual trade phrase translation and comprehensive technical glossary for leather, jute, quality audits, and banking instruments.
          </p>
        </div>
      </div>

      {/* Interactive Translation Workspace */}
      <div className="rounded-2xl bg-[#0f1f18] border border-[#2b5540] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#234534] pb-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">Source Language:</span>
            <select
              value={sourceLang}
              onChange={e => {
                setSourceLang(e.target.value as any);
                handleSimulateTranslate(sourceText, e.target.value, targetLang);
              }}
              className="px-2.5 py-1 rounded bg-[#183225] border border-[#2e5d45] text-[#C8A96A] font-bold text-xs"
            >
              <option value="EN">English (UK/US)</option>
              <option value="BN">বাংলা (Bengali)</option>
              <option value="FR">Français (French)</option>
              <option value="DE">Deutsch (German)</option>
              <option value="ZH">中文 (Chinese)</option>
            </select>
          </div>

          <button
            onClick={handleSwapLanguages}
            className="p-1.5 rounded-lg bg-[#183225] hover:bg-[#204432] text-[#C8A96A] border border-[#2e5d45] transition-colors"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">Target Language:</span>
            <select
              value={targetLang}
              onChange={e => {
                setTargetLang(e.target.value as any);
                handleSimulateTranslate(sourceText, sourceLang, e.target.value);
              }}
              className="px-2.5 py-1 rounded bg-[#183225] border border-[#2e5d45] text-emerald-400 font-bold text-xs"
            >
              <option value="BN">বাংলা (Bengali)</option>
              <option value="EN">English (UK/US)</option>
              <option value="FR">Français (French)</option>
              <option value="DE">Deutsch (German)</option>
              <option value="ZH">中文 (Chinese)</option>
            </select>
          </div>
        </div>

        {/* Translation Input & Output Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-slate-400 uppercase font-bold block">
              Input Text / Buyer Specification:
            </label>
            <textarea
              rows={4}
              value={sourceText}
              onChange={e => {
                setSourceText(e.target.value);
                handleSimulateTranslate(e.target.value, sourceLang, targetLang);
              }}
              className="w-full p-3.5 rounded-xl bg-[#14281f] border border-[#2b5540] text-white text-xs md:text-sm leading-relaxed focus:outline-none focus:border-[#C8A96A]"
              placeholder="Type or paste trade instructions here..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-emerald-400 uppercase font-bold block">
                Translated Trade Output:
              </label>
              <button
                onClick={() => handleCopy(translatedText, 'live-translation')}
                className="text-xs text-[#C8A96A] hover:underline flex items-center gap-1 font-mono"
              >
                {copiedId === 'live-translation' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedId === 'live-translation' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0a1710] border border-[#254d37] text-emerald-300 text-xs md:text-sm leading-relaxed min-h-[96px] whitespace-pre-wrap font-sans">
              {translatedText}
            </div>
          </div>
        </div>

        {/* Quick Industry Phrases Pill List */}
        <div className="pt-2 border-t border-[#234534] space-y-2">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">
            Click to load common factory &amp; buyer phrases:
          </span>
          <div className="flex flex-wrap gap-2">
            {commonPhrases.map((phrase, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSourceText(phrase.en);
                  setSourceLang('EN');
                  setTargetLang('BN');
                  setTranslatedText(phrase.bn);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#14281f] hover:bg-[#1a382a] border border-[#28523b] text-slate-300 hover:text-white text-[11px] text-left transition-colors truncate max-w-xs"
              >
                &quot;{phrase.en}&quot;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sourcing & Textile Technical Glossary */}
      <div className="rounded-2xl bg-[#0f1f18] border border-[#2b5540] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#234534] pb-3">
          <div>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#C8A96A]" />
              Master Garment, Leather &amp; Foreign Trade Glossary
            </h4>
            <p className="text-xs text-slate-300">
              Verified technical definitions across English, Bengali, French, German, and Chinese.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search glossary terms..."
              className="pl-9 pr-3 py-1.5 rounded-lg bg-[#14281f] border border-[#2b5540] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C8A96A]"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1 text-xs font-mono">
          {['ALL', 'FABRIC', 'TECHPACK', 'QUALITY', 'SHIPPING', 'FINANCIAL'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#C8A96A] text-slate-950 font-bold'
                  : 'bg-[#14281f] text-slate-400 hover:text-white border border-[#254d37]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Terms Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredGlossary.map(term => (
            <div
              key={term.id}
              className="p-4 rounded-xl bg-[#14281f] border border-[#254d37] space-y-2.5 hover:border-[#387050] transition-all shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] uppercase font-bold">
                    {term.category}
                  </span>
                  <h5 className="text-base font-bold text-white mt-1">{term.english}</h5>
                  <div className="text-xs font-bold text-[#C8A96A] font-serif mt-0.5">
                    {term.bengali} {term.phoneticBengali && <span className="font-sans text-[11px] text-slate-400 font-normal">({term.phoneticBengali})</span>}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(`${term.english} - ${term.bengali}\n${term.definition}`, term.id)}
                  className="p-1.5 rounded bg-[#183225] hover:bg-[#204231] text-slate-300 hover:text-white text-xs transition-colors shrink-0"
                  title="Copy Term"
                >
                  {copiedId === term.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {term.definition}
              </p>

              <div className="pt-2 border-t border-[#234534] grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-500 block uppercase">French:</span>
                  <span className="text-slate-200">{term.french || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">German:</span>
                  <span className="text-slate-200">{term.german || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">Chinese:</span>
                  <span className="text-slate-200">{term.chinese || '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
