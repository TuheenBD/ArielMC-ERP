'use client';

import React, { useState } from 'react';
import {
  CompanyEntity,
  CurrencyRate,
  EntityCode,
  ProductItem,
  CrmLead,
  SupplierFactory,
  SampleDevelopmentOrder,
  SampleStage,
  SampleStatus,
  BuyerSalesOrder,
  OrderStatus,
  LogisticsConsignment,
} from '@/types/erp';
import { INITIAL_COMPANIES, INITIAL_CURRENCIES, INITIAL_PRODUCTS } from '@/data/initialData';
import { INITIAL_FACTORIES } from '@/data/initialFactories';
import { INITIAL_SAMPLES } from '@/data/initialSamples';
import { INITIAL_ORDERS } from '@/data/initialOrders';
import crmLeadsData from '@/data/crmLeads.json';
import { Header } from '@/components/Header';
import { Sidebar, ActiveTab } from '@/components/Sidebar';
import { EntityStationOverview } from '@/components/EntityStationOverview';
import { ProductCatalog } from '@/components/ProductCatalog';
import { FactoryManagement } from '@/components/FactoryManagement';
import { SampleManagement } from '@/components/SampleManagement';
import { OrderManagement } from '@/components/OrderManagement';
import { CrmPipeline } from '@/components/CrmPipeline';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { AddProductModal } from '@/components/AddProductModal';
import { LogisticsManagement } from '@/components/LogisticsManagement';
import { PhaseRoadmapPreview } from '@/components/PhaseRoadmapPreview';
import { initialConsignments, securityBudgetPlan, recentSecurityAudits } from '@/data/initialLogistics';
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
  Users2,
  FlaskConical,
  Repeat,
} from 'lucide-react';

export default function Home() {
  const [companies] = useState<CompanyEntity[]>(INITIAL_COMPANIES);
  const [activeEntityCode, setActiveEntityCode] = useState<EntityCode>('ARIEL_BD');
  const [currencies] = useState<CurrencyRate[]>(INITIAL_CURRENCIES);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<string>('USD');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [factories, setFactories] = useState<SupplierFactory[]>(INITIAL_FACTORIES);
  const [samples, setSamples] = useState<SampleDevelopmentOrder[]>(INITIAL_SAMPLES);
  const [orders, setOrders] = useState<BuyerSalesOrder[]>(INITIAL_ORDERS);
  const [consignments, setConsignments] = useState<LogisticsConsignment[]>(initialConsignments);
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

  const handleAddFactory = (newFactory: SupplierFactory) => {
    setFactories((prev) => [newFactory, ...prev]);
  };

  const handleAddSample = (newSample: SampleDevelopmentOrder) => {
    setSamples((prev) => [newSample, ...prev]);
  };

  const handleUpdateSampleStatus = (
    sdoId: string,
    newStatus: SampleStatus,
    feedbackComments?: string
  ) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.id !== sdoId) return s;
        const updated: SampleDevelopmentOrder = { ...s, status: newStatus };
        if (feedbackComments) {
          updated.feedbacks = [
            ...s.feedbacks,
            {
              id: `fb-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              reviewedBy: `${s.buyerCompany} Commercial Team`,
              verdict:
                newStatus === 'APPROVED' || newStatus === 'APPROVED_WITH_COMMENTS'
                  ? 'APPROVED'
                  : 'REVISE_SAMPLE',
              aestheticScore: newStatus === 'APPROVED' ? 9 : 7,
              workmanshipScore: newStatus === 'APPROVED' ? 9 : 7,
              dimensionalAccuracyScore: newStatus === 'APPROVED' ? 9 : 7,
              comments: feedbackComments,
            },
          ];
        }
        return updated;
      })
    );
  };

  const handleAdvanceSampleStage = (sdoId: string, nextStage: SampleStage) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.id !== sdoId) return s;
        return {
          ...s,
          stage: nextStage,
          roundNumber: 1,
          status: 'TECH_PACK_SENT',
        };
      })
    );
  };

  const handleAddOrder = (newOrder: BuyerSalesOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleUpdateMilestoneStatus = (
    orderId: string,
    milestoneId: string,
    newStatus: 'COMPLETED' | 'ON_TRACK' | 'AT_RISK' | 'DELAYED'
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedTna = o.timeAndAction.map((m) =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        );
        return { ...o, timeAndAction: updatedTna };
      })
    );
  };

  // Quick Stats
  const totalSkus = products.length;
  const totalLeads = crmLeads.length;
  const totalFactories = factories.length;
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
                <span>Partner Factories</span>
                <Factory className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                {totalFactories} <span className="text-xs text-slate-400 font-sans font-normal">Facilities</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                <span>Savar, Gazipur, Narsingdi, Dhamrai</span>
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

          {activeTab === 'FACTORIES' && (
            <FactoryManagement
              factories={factories}
              onAddFactory={handleAddFactory}
            />
          )}

          {activeTab === 'CRM' && (
            <CrmPipeline initialLeads={crmLeads} />
          )}

          {activeTab === 'RND' && (
            <SampleManagement
              samples={samples}
              factories={factories}
              products={products}
              crmLeads={crmLeads}
              onAddSample={handleAddSample}
              onUpdateSampleStatus={handleUpdateSampleStatus}
              onAdvanceSampleStage={handleAdvanceSampleStage}
            />
          )}

          {activeTab === 'ORDERS' && (
            <OrderManagement
              orders={orders}
              factories={factories}
              products={products}
              crmLeads={crmLeads}
              onAddOrder={handleAddOrder}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateMilestoneStatus={handleUpdateMilestoneStatus}
            />
          )}

          {activeTab === 'LOGISTICS' && (
            <LogisticsManagement
              consignments={consignments}
              securityBudget={securityBudgetPlan}
              securityIncidents={recentSecurityAudits}
            />
          )}

          {activeTab !== 'STATIONS' &&
            activeTab !== 'PRODUCTS' &&
            activeTab !== 'FACTORIES' &&
            activeTab !== 'CRM' &&
            activeTab !== 'RND' &&
            activeTab !== 'ORDERS' &&
            activeTab !== 'LOGISTICS' && (
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
