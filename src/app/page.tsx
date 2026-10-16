'use client';

import React, { useState } from 'react';
import { CompanyEntity, CurrencyRate, EntityCode, ProductItem, CrmLead } from '@/types/erp';
import { INITIAL_COMPANIES, INITIAL_CURRENCIES, INITIAL_PRODUCTS } from '@/data/initialData';
import crmLeadsData from '@/data/crmLeads.json';
import { Header } from '@/components/Header';
import { Sidebar, ActiveTab } from '@/components/Sidebar';
import { EntityStationOverview } from '@/components/EntityStationOverview';
import { ProductCatalog } from '@/components/ProductCatalog';
import { CrmPipeline } from '@/components/CrmPipeline';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { AddProductModal } from '@/components/AddProductModal';
import { PhaseRoadmapPreview } from '@/components/PhaseRoadmapPreview';
import {
  Building2,
  Package,
  Factory,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Percent,
  CheckCircle2,
  Layers,
  Users2
} from 'lucide-react';

export default function Home() {
  const [companies] = useState<CompanyEntity[]>(INITIAL_COMPANIES);
  const [activeEntityCode, setActiveEntityCode] = useState<EntityCode>('ARIEL_BD');
  const [currencies] = useState<CurrencyRate[]>(INITIAL_CURRENCIES);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<string>('USD');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [crmLeads] = useState<CrmLead[]>(crmLeadsData as CrmLead[]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('PRODUCTS');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeEntity = companies.find((c) => c.code === activeEntityCode) || companies[0];
  const activeCurrency = currencies.find((c) => c.code === activeCurrencyCode) || currencies[0];

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  // Quick Stats
  const totalSkus = products.length;
  const totalLeads = crmLeads.length;
  const avgMargin = (
    products.reduce((acc, curr) => acc + curr.costing.arielSourcingMarginPct, 0) / (totalSkus || 1)
  ).toFixed(1);

  return (
    <div className="flex min-h-screen bg-[#070b14] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeEntity={activeEntity}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <Header
          companies={companies}
          activeEntity={activeEntity}
          onSelectEntity={setActiveEntityCode}
          currencies={currencies}
          activeCurrency={activeCurrency}
          onSelectCurrency={setActiveCurrencyCode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dashboard Workspace */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Top Key KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Operating Stations</span>
                <Globe2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                5 <span className="text-xs text-slate-400 font-sans font-normal">Entities</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <span>🇧🇩 BD, 🇬🇧 UK, 🇺🇸 US, 🇪🇺 EU, 🇦🇺 AU</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Master Product SKUs</span>
                <Package className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-white mt-1">
                {totalSkus} <span className="text-xs text-slate-400 font-sans font-normal">Registered</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <span>Leather, Jute, Textiles, Ceramics</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Global B2B Leads</span>
                <Users2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-purple-300 mt-1">
                {totalLeads} <span className="text-xs text-slate-400 font-sans font-normal">Accounts</span>
              </div>
              <div className="text-[11px] text-purple-400 mt-1">
                <span>UK (96), EU (57), USA (56), AU (45)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-md">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Avg Sourcing Margin</span>
                <Percent className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {avgMargin}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <span>Locked Back-to-Back Export Spread</span>
              </div>
            </div>
          </div>

          {/* Active View Content */}
          {activeTab === 'STATIONS' && (
            <EntityStationOverview
              companies={companies}
              activeEntity={activeEntity}
              onSelectEntity={setActiveEntityCode}
            />
          )}

          {activeTab === 'PRODUCTS' && (
            <ProductCatalog
              products={products}
              activeCurrency={activeCurrency}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onSelectProduct={setSelectedProduct}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'CRM' && (
            <CrmPipeline initialLeads={crmLeads} />
          )}

          {activeTab !== 'STATIONS' && activeTab !== 'PRODUCTS' && activeTab !== 'CRM' && (
            <PhaseRoadmapPreview
              activeTab={activeTab}
              onNavigateToProducts={() => setActiveTab('PRODUCTS')}
            />
          )}
        </main>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        activeCurrency={activeCurrency}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Add New Master Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
