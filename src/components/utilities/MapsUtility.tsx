'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Globe2,
  Navigation,
  Building2,
  Anchor,
  Plane,
  Clock,
  Phone,
  User,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SupplyChainMapPin, MapPinType } from '@/types/utilities';
import { INITIAL_SUPPLY_CHAIN_PINS } from '@/data/initialUtilitiesData';

export const MapsUtility: React.FC = () => {
  const [pins, setPins] = useState<SupplyChainMapPin[]>(INITIAL_SUPPLY_CHAIN_PINS);
  const [selectedPin, setSelectedPin] = useState<SupplyChainMapPin>(pins[0]);
  const [selectedType, setSelectedType] = useState<'ALL' | MapPinType>('ALL');

  const filteredPins = pins.filter(p =>
    selectedType === 'ALL' ? true : p.type === selectedType
  );

  const getPinIcon = (type: MapPinType) => {
    switch (type) {
      case 'STATION':
        return <Building2 className="w-4 h-4 text-emerald-400" />;
      case 'FACTORY':
        return <Navigation className="w-4 h-4 text-amber-400" />;
      case 'SUPPLIER':
        return <MapPin className="w-4 h-4 text-[#C8A96A]" />;
      case 'PORT':
        return <Anchor className="w-4 h-4 text-blue-400" />;
      case 'AIRPORT':
        return <Plane className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#234534] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
              Global Supply Chain Geography
            </span>
            <span className="text-xs text-[#C8A96A] font-mono">
              Chittagong Port ⇄ Suez Canal ⇄ UK Felixstowe
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Globe2 className="w-6 h-6 text-[#C8A96A]" />
            ArielMC Global Station, Factory &amp; Maritime Port Maps
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Geographic directory mapping Dhaka HQ, London Subsidiary, Savar/Narayanganj manufacturing clusters, and international cargo gateways.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-[#12241b] border border-[#2b5540] text-xs font-mono">
          {[
            { id: 'ALL', label: 'All Hubs' },
            { id: 'STATION', label: '🏢 Sovereign Stations' },
            { id: 'FACTORY', label: '🏭 Partner Factories' },
            { id: 'SUPPLIER', label: '🧵 Tanneries & Mills' },
            { id: 'PORT', label: '⚓ Sea Ports' },
            { id: 'AIRPORT', label: '✈️ Air Cargo' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                selectedType === tab.id
                  ? 'bg-[#C8A96A] text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#183225]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Map Stage (7 cols) + Selected Hub Dossier (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive SVG Schematic Map */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-b from-[#0a1710] to-[#060e0a] border-2 border-[#2b5540] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          <div className="flex items-center justify-between border-b border-[#1c382a] pb-3 text-xs font-mono">
            <span className="text-slate-400 font-bold">CROSS-BORDER MARITIME &amp; FLIGHT CORRIDORS</span>
            <span className="text-emerald-400">7 Verified Global Pins</span>
          </div>

          {/* Stylized Geo Schematic Visualizer */}
          <div className="relative w-full h-80 my-4 flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3c2d_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* Maritime Route Arc (Chittagong -> Bay of Bengal -> London Felixstowe) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 620,240 Q 400,120 180,80"
                fill="none"
                stroke="#C8A96A"
                strokeWidth="2"
                strokeDasharray="6,6"
                className="animate-pulse"
              />
              <path
                d="M 640,220 Q 420,100 180,80"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            </svg>

            {/* Interactive Pins Floating across Schematic Coordinates */}
            {filteredPins.map(pin => {
              const isSelected = selectedPin.id === pin.id;
              // Map simulated coordinates based on city
              let left = '50%';
              let top = '50%';
              if (pin.city.includes('London')) { left = '20%'; top = '22%'; }
              if (pin.city.includes('Dhaka')) { left = '75%'; top = '62%'; }
              if (pin.city.includes('Savar')) { left = '70%'; top = '56%'; }
              if (pin.city.includes('Narayanganj')) { left = '78%'; top = '68%'; }
              if (pin.city.includes('Chattogram')) { left = '84%'; top = '78%'; }

              return (
                <div
                  key={pin.id}
                  onClick={() => setSelectedPin(pin)}
                  style={{ left, top }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                  }`}
                >
                  <div className={`p-2.5 rounded-full border-2 shadow-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#C8A96A] text-slate-950 border-white shadow-emerald-500/30'
                      : 'bg-[#12261c] text-[#C8A96A] border-[#2e5d45] hover:border-[#C8A96A]'
                  }`}>
                    {getPinIcon(pin.type)}
                  </div>

                  <span className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                    isSelected
                      ? 'bg-white text-slate-950 opacity-100'
                      : 'bg-[#102219] text-slate-300 border border-[#2b5540] opacity-90 group-hover:opacity-100'
                  }`}>
                    {pin.city}: {pin.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Route Legend */}
          <div className="pt-3 border-t border-[#1c382a] flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#C8A96A] inline-block" />
              Ocean Route: Chittagong ⇄ Felixstowe (28 Days)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <span className="w-3 h-0.5 bg-[#38bdf8] inline-block" />
              Air Express: DAC ⇄ LHR Heathrow (4 Days)
            </span>
          </div>
        </div>

        {/* Right Hub Inspection Dossier (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0f1f18] border-2 border-[#2b5540] p-6 shadow-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#234534] pb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1e3c2d] text-emerald-300 border border-[#2d5942] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                {getPinIcon(selectedPin.type)}
                {selectedPin.type}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                {selectedPin.status.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h4 className="text-xl font-bold text-white">{selectedPin.name}</h4>
              <div className="text-xs text-[#C8A96A] font-semibold flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {selectedPin.city}, {selectedPin.country}
              </div>
            </div>

            {/* Address & Details Box */}
            <div className="p-4 rounded-xl bg-[#14281f] border border-[#28523c] space-y-2.5 text-xs text-slate-300">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Facility Address:</span>
                <span className="font-sans text-slate-200">{selectedPin.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#214232] font-mono text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block">GPS Coordinates:</span>
                  <span className="text-slate-200">{selectedPin.lat.toFixed(4)}°N, {selectedPin.lng.toFixed(4)}°E</span>
                </div>
                {selectedPin.operatingHours && (
                  <div>
                    <span className="text-[10px] text-slate-400 block">Operating Hours:</span>
                    <span className="text-slate-200">{selectedPin.operatingHours}</span>
                  </div>
                )}
              </div>

              {selectedPin.leadTimeDays && (
                <div className="pt-2 border-t border-[#214232] flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400">Transit / Manufacturing Lead Time:</span>
                  <span className="font-bold text-cyan-300">{selectedPin.leadTimeDays} Days</span>
                </div>
              )}
            </div>

            {/* Personnel & Contact */}
            {selectedPin.contactPerson && (
              <div className="p-3.5 rounded-xl bg-[#12241b] border border-[#234835] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Site Director / Lead:</span>
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#C8A96A]" />
                    {selectedPin.contactPerson}
                  </span>
                </div>

                {selectedPin.contactPhone && (
                  <a
                    href={`tel:${selectedPin.contactPhone}`}
                    className="px-3 py-1.5 rounded-lg bg-[#183326] hover:bg-[#204432] text-emerald-300 font-mono text-xs font-bold border border-[#2d5942] flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk</span>
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#234534] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ArielMC Sovereign Station Network</span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedPin.lat},${selectedPin.lng}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#C8A96A] hover:underline flex items-center gap-1 font-bold"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
