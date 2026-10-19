'use client';

import React, { useState, useEffect } from 'react';
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
  StandardFactoryTechPack,
} from '@/types/erp';
import { INITIAL_COMPANIES, INITIAL_CURRENCIES, INITIAL_PRODUCTS } from '@/data/initialData';
import { INITIAL_FACTORIES } from '@/data/initialFactories';
import { INITIAL_SAMPLES } from '@/data/initialSamples';
import { INITIAL_ORDERS } from '@/data/initialOrders';
import crmLeadsData from '@/data/crmLeads.json';
import { Header } from '@/components/Header';
import { Sidebar, ActiveTab, ThemeProfile } from '@/components/Sidebar';
import { ExecutiveDashboard } from '@/components/ExecutiveDashboard';
import { EntityStationOverview } from '@/components/EntityStationOverview';
import { ProductCatalog } from '@/components/ProductCatalog';
import { FactoryManagement } from '@/components/FactoryManagement';
import { SampleManagement } from '@/components/SampleManagement';
import { OrderManagement } from '@/components/OrderManagement';
import { CrmPipeline } from '@/components/CrmPipeline';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { AddProductModal } from '@/components/AddProductModal';
import { StandardFactoryTechPackModal } from '@/components/StandardFactoryTechPackModal';
import { LogisticsManagement } from '@/components/LogisticsManagement';
import { FinanceManagement } from '@/components/FinanceManagement';
import { ExecutiveReportsSuite } from '@/components/ExecutiveReportsSuite';
import { InventoryManagement } from '@/components/InventoryManagement';
import { CommunicationsHub } from '@/components/CommunicationsHub';
import { DocumentPortal } from '@/components/DocumentPortal';
import { OmnichannelPosSuite } from '@/components/OmnichannelPosSuite';
import { MarketingManagement } from '@/components/MarketingManagement';
import { UtilitiesManagement } from '@/components/utilities/UtilitiesManagement';
import { OfficialDocumentCenter, DocumentType } from '@/components/OfficialDocumentCenter';
import { DatabaseSettingsModal } from '@/components/DatabaseSettingsModal';
import { AuthWelcomeModal } from '@/components/auth/AuthWelcomeModal';
import { ProfileControlModal } from '@/components/profile/ProfileControlModal';
import { ArielMCAICopilot } from '@/components/ai/ArielMCAICopilot';
import { UserGuideModal } from '@/components/UserGuideModal';
import { LiveExchangeRateModal } from '@/components/LiveExchangeRateModal';
import { ArielMcErpSystemBrand } from '@/lib/brand';
import {
  syncLiveExchangeRates,
  getCachedCurrencies,
  getCachedForexMeta,
  ForexSyncPayload,
} from '@/lib/forexSync';
import { PhaseRoadmapPreview } from '@/components/PhaseRoadmapPreview';
import { initialConsignments, securityBudgetPlan, recentSecurityAudits } from '@/data/initialLogistics';
import { UserProfile } from '@/types/auth';
import { INITIAL_USERS } from '@/data/initialUsers';
import {
  fetchProducts,
  persistProduct,
  fetchFactories,
  persistFactory,
  fetchSamples,
  persistSample,
  fetchOrders,
  persistOrder,
  testSupabaseHealth,
} from '@/lib/erpPersistence';
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
  const [companies, setCompanies] = useState<CompanyEntity[]>(INITIAL_COMPANIES);

  // Load and hydrate operating stations from localStorage
  React.useEffect(() => {
    try {
      const savedStations = localStorage.getItem('arielmc_erp_operating_stations_v1');
      if (savedStations) {
        const parsed = JSON.parse(savedStations);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompanies(parsed);
        }
      }
    } catch {}
  }, []);

  const handleUpdateCompaniesList = (updated: CompanyEntity[]) => {
    setCompanies(updated);
    try {
      localStorage.setItem('arielmc_erp_operating_stations_v1', JSON.stringify(updated));
    } catch {}
  };

  const handleAddCompany = (newCompany: CompanyEntity) => {
    const updated = [...companies, newCompany];
    handleUpdateCompaniesList(updated);
  };

  const handleEditCompany = (updatedCompany: CompanyEntity) => {
    const updated = companies.map((c) => (c.code === updatedCompany.code ? updatedCompany : c));
    handleUpdateCompaniesList(updated);
  };

  const handleDeleteCompany = (codeToDelete: EntityCode) => {
    if (companies.length <= 1) {
      alert('Cannot delete the only remaining operating station. At least one sovereign station must remain active.');
      return;
    }
    const updated = companies.filter((c) => c.code !== codeToDelete);
    if (activeEntityCode === codeToDelete && updated.length > 0) {
      setActiveEntityCode(updated[0].code);
    }
    handleUpdateCompaniesList(updated);
  };

  const handleResetCompanies = () => {
    handleUpdateCompaniesList(INITIAL_COMPANIES);
    setActiveEntityCode('ARIEL_BD');
  };

  const [activeEntityCode, setActiveEntityCode] = useState<EntityCode>('ARIEL_BD');
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(INITIAL_CURRENCIES);
  const [forexMeta, setForexMeta] = useState<ForexSyncPayload | null>(null);
  const [isForexSyncing, setIsForexSyncing] = useState(false);
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<string>('USD');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [factories, setFactories] = useState<SupplierFactory[]>(INITIAL_FACTORIES);
  const [samples, setSamples] = useState<SampleDevelopmentOrder[]>(INITIAL_SAMPLES);
  const [orders, setOrders] = useState<BuyerSalesOrder[]>(INITIAL_ORDERS);
  const [consignments, setConsignments] = useState<LogisticsConsignment[]>(initialConsignments);
  const [crmLeads] = useState<CrmLead[]>(crmLeadsData as CrmLead[]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('DASHBOARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<ThemeProfile>('crm-green');

  React.useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('arielmc_erp_theme') as ThemeProfile;
      const validThemes: ThemeProfile[] = [
        'crm-green',
        'royal-blue',
        'heritage-tan',
        'california-beaches',
        'mossy-hollow',
        'ink-wash',
        'fresh-peach',
        'stormy-morning'
      ];
      if (savedTheme && validThemes.includes(savedTheme)) {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectTheme = (newTheme: ThemeProfile) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('arielmc_erp_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
    } catch {
      // ignore
    }
  };

  // User Profile & Authentication State
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Load and persist users from localStorage
  React.useEffect(() => {
    try {
      const cachedUsers = localStorage.getItem('arielmc_erp_all_users_v1');
      if (cachedUsers) {
        setUsers(JSON.parse(cachedUsers));
      }
      const cachedCurrent = localStorage.getItem('arielmc_erp_current_user_v1');
      if (cachedCurrent) {
        setCurrentUser(JSON.parse(cachedCurrent));
      }
    } catch {}
  }, []);

  const handleUpdateCurrentUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    try {
      localStorage.setItem('arielmc_erp_current_user_v1', JSON.stringify(updated));
    } catch {}
  };

  const handleUpdateUserList = (updatedList: UserProfile[]) => {
    setUsers(updatedList);
    try {
      localStorage.setItem('arielmc_erp_all_users_v1', JSON.stringify(updatedList));
    } catch {}
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('arielmc_erp_current_user_v1', JSON.stringify(user));
    } catch {}
    setIsAuthModalOpen(false);
  };

  const handleRegisterUser = (newUser: UserProfile) => {
    const updated = [newUser, ...users];
    setUsers(updated);
    setCurrentUser(newUser);
    try {
      localStorage.setItem('arielmc_erp_all_users_v1', JSON.stringify(updated));
      localStorage.setItem('arielmc_erp_current_user_v1', JSON.stringify(newUser));
    } catch {}
  };

  const handleSignOut = () => {
    setIsProfileModalOpen(false);
    setIsAuthModalOpen(true);
  };

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTechPack, setViewingTechPack] = useState<StandardFactoryTechPack | null>(null);
  const [isDocCenterOpen, setIsDocCenterOpen] = useState(false);
  const [docCenterType, setDocCenterType] = useState<DocumentType>('COMMERCIAL_INVOICE');
  const [docCenterOrderId, setDocCenterOrderId] = useState<string | undefined>(undefined);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isUserGuideModalOpen, setIsUserGuideModalOpen] = useState(false);
  const [isForexModalOpen, setIsForexModalOpen] = useState(false);
  const [isArielAiOpen, setIsArielAiOpen] = useState(false);

  // Live Exchange Rate Sync Handler (Bangladesh Bank statutory rates & Interbank feeds)
  const handleRefreshForex = React.useCallback(async () => {
    setIsForexSyncing(true);
    try {
      const result = await syncLiveExchangeRates();
      if (result && result.currencies) {
        setCurrencies(result.currencies);
        setForexMeta(result.meta);
      }
    } catch (err) {
      console.error('Forex sync error:', err);
    } finally {
      setIsForexSyncing(false);
    }
  }, []);

  // Hydrate cached forex rates and trigger fresh live sync
  React.useEffect(() => {
    const cachedCurrs = getCachedCurrencies();
    const cachedMeta = getCachedForexMeta();
    if (cachedCurrs) setCurrencies(cachedCurrs);
    if (cachedMeta) setForexMeta(cachedMeta);

    handleRefreshForex();
  }, [handleRefreshForex]);

  // Persistent Storage Initial Hydration & Connection Ping
  const loadPersistentData = React.useCallback(async () => {
    try {
      const health = await testSupabaseHealth();
      setIsDbConnected(health.connected);

      const [persistedProds, persistedFacs, persistedSmps, persistedOrds] = await Promise.all([
        fetchProducts(),
        fetchFactories(),
        fetchSamples(),
        fetchOrders(),
      ]);

      if (persistedProds && persistedProds.length > 0) setProducts(persistedProds);
      if (persistedFacs && persistedFacs.length > 0) setFactories(persistedFacs);
      if (persistedSmps && persistedSmps.length > 0) setSamples(persistedSmps);
      if (persistedOrds && persistedOrds.length > 0) setOrders(persistedOrds);
    } catch (e) {
      console.warn('ArielMC ERP persistence hydration fallback active:', e);
    }
  }, []);

  React.useEffect(() => {
    loadPersistentData();
  }, [loadPersistentData]);

  const handleOpenDocCenter = (type?: DocumentType, orderId?: string) => {
    if (type) setDocCenterType(type);
    if (orderId) setDocCenterOrderId(orderId);
    setIsDocCenterOpen(true);
  };

  const activeEntity = companies.find((c) => c.code === activeEntityCode) || companies[0];
  const activeCurrency = currencies.find((c) => c.code === activeCurrencyCode) || currencies[0];

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    persistProduct(newProd).catch(console.error);
    if (newProd.standardTechPack) {
      setViewingTechPack(newProd.standardTechPack);
    }
  };

  const handleAddFactory = (newFactory: SupplierFactory) => {
    setFactories((prev) => [newFactory, ...prev]);
    persistFactory(newFactory).catch(console.error);
  };

  const handleAddSample = (newSample: SampleDevelopmentOrder) => {
    setSamples((prev) => [newSample, ...prev]);
    persistSample(newSample).catch(console.error);
    if (newSample.standardTechPack) {
      setViewingTechPack(newSample.standardTechPack);
    }
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
        persistSample(updated).catch(console.error);
        return updated;
      })
    );
  };

  const handleAdvanceSampleStage = (sdoId: string, nextStage: SampleStage) => {
    setSamples((prev) =>
      prev.map((s) => {
        if (s.id !== sdoId) return s;
        const updated: SampleDevelopmentOrder = {
          ...s,
          stage: nextStage,
          roundNumber: 1,
          status: 'TECH_PACK_SENT',
        };
        persistSample(updated).catch(console.error);
        return updated;
      })
    );
  };

  const handleAddOrder = (newOrder: BuyerSalesOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    persistOrder(newOrder).catch(console.error);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = { ...o, status: newStatus };
        persistOrder(updated).catch(console.error);
        return updated;
      })
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
        const updated = { ...o, timeAndAction: updatedTna };
        persistOrder(updated).catch(console.error);
        return updated;
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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const workspaceBg = 'bg-[#FAF9F5]';

  return (
    <div 
      id="arielmc-erp-root" 
      data-theme={theme} 
      className={`flex h-screen w-screen overflow-hidden ${workspaceBg} text-[#1A1A1A] selection:bg-[#C9A86A] selection:text-[#1F3A2E] transition-colors`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeEntity={activeEntity}
        theme={theme}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-[#FAF9F5]">
        {/* Global Header (Permanently pinned at top) */}
        <Header
          companies={companies}
          activeEntity={activeEntity}
          onSelectEntity={setActiveEntityCode}
          currencies={currencies}
          activeCurrency={activeCurrency}
          onSelectCurrency={setActiveCurrencyCode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onSelectTheme={handleSelectTheme}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenDocumentCenter={() => handleOpenDocCenter('COMMERCIAL_INVOICE')}
          onOpenDatabaseSettings={() => setIsDbModalOpen(true)}
          isDatabaseConnected={isDbConnected}
          currentUser={currentUser}
          onOpenProfileControl={() => setIsProfileModalOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenUserGuide={() => setIsUserGuideModalOpen(true)}
          onOpenArielAi={() => setIsArielAiOpen((prev) => !prev)}
          isArielAiOpen={isArielAiOpen}
          onOpenForexSync={() => setIsForexModalOpen(true)}
          isForexSyncing={isForexSyncing}
          onRefreshForex={handleRefreshForex}
        />

        {/* Dashboard Workspace (Independent Smooth Scroll) */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Active View Content */}
          {activeTab === 'DASHBOARD' && (
            <ExecutiveDashboard
              companies={companies}
              activeEntity={activeEntity}
              onSelectEntity={setActiveEntityCode}
              totalProducts={totalSkus}
              totalFactories={totalFactories}
              totalLeads={totalLeads}
              totalOrders={orders.length}
              onNavigate={setActiveTab}
              theme={theme}
              activeCurrency={activeCurrency}
            />
          )}
          {activeTab === 'STATIONS' && (
            <EntityStationOverview
              companies={companies}
              activeEntity={activeEntity}
              onSelectEntity={setActiveEntityCode}
              onAddCompany={handleAddCompany}
              onEditCompany={handleEditCompany}
              onDeleteCompany={handleDeleteCompany}
              onResetCompanies={handleResetCompanies}
              onNavigateToDocuments={() => setActiveTab('DOCUMENTS')}
              theme={theme}
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
            <CrmPipeline
              initialLeads={crmLeads}
              theme={theme}
              activeEntity={activeEntity}
              activeCurrency={activeCurrency}
              onNavigateTab={setActiveTab}
              onAddOrder={handleAddOrder}
              onAddSample={handleAddSample}
            />
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
              theme={theme}
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
              onOpenDocumentCenter={handleOpenDocCenter}
            />
          )}

          {activeTab === 'LOGISTICS' && (
            <LogisticsManagement
              consignments={consignments}
              securityBudget={securityBudgetPlan}
              securityIncidents={recentSecurityAudits}
              onAddConsignment={(newCng) => setConsignments((prev) => [newCng, ...prev])}
            />
          )}

          {activeTab === 'FINANCE' && (
            <FinanceManagement theme={theme} />
          )}

          {activeTab === 'REPORTS' && (
            <ExecutiveReportsSuite
              activeEntity={activeEntity}
              activeCurrency={activeCurrency}
              theme={theme}
            />
          )}

          {activeTab === 'INVENTORY' && (
            <InventoryManagement activeCurrency={activeCurrency} />
          )}

          {activeTab === 'COMMUNICATIONS' && (
            <CommunicationsHub />
          )}

          {activeTab === 'DOCUMENTS' && (
            <DocumentPortal
              companies={companies}
              activeEntity={activeEntity}
              theme={theme}
            />
          )}

          {activeTab === 'POS' && (
            <OmnichannelPosSuite
              products={products}
              theme={theme}
              onNavigateToOrders={() => setActiveTab('ORDERS')}
            />
          )}

          {activeTab === 'MARKETING' && (
            <MarketingManagement
              activeEntity={activeEntity}
              activeCurrency={activeCurrency}
              theme={theme}
              products={products}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'UTILITIES' && (
            <UtilitiesManagement
              activeEntity={activeEntity}
              activeCurrency={activeCurrency}
              theme={theme}
            />
          )}

          {activeTab !== 'STATIONS' &&
            activeTab !== 'DOCUMENTS' &&
            activeTab !== 'POS' &&
            activeTab !== 'PRODUCTS' &&
            activeTab !== 'FACTORIES' &&
            activeTab !== 'CRM' &&
            activeTab !== 'RND' &&
            activeTab !== 'ORDERS' &&
            activeTab !== 'LOGISTICS' &&
            activeTab !== 'FINANCE' &&
            activeTab !== 'REPORTS' &&
            activeTab !== 'INVENTORY' &&
            activeTab !== 'COMMUNICATIONS' &&
            activeTab !== 'MARKETING' &&
            activeTab !== 'UTILITIES' && (
              <PhaseRoadmapPreview
                activeTab={activeTab}
                onNavigateToProducts={() => setActiveTab('PRODUCTS')}
              />
            )}

          {/* Institutional Master System Footer */}
          <footer className="pt-8 pb-4 text-center border-t border-[#DDE3DD] mt-12 select-none">
            <ArielMcErpSystemBrand size="sm" align="center" showCopyright={true} />
          </footer>
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

      {/* Standard Factory Tech-Pack Official Document Modal */}
      <StandardFactoryTechPackModal
        isOpen={!!viewingTechPack}
        onClose={() => setViewingTechPack(null)}
        techPack={viewingTechPack}
      />

      {/* Official PDF Document Engine Modal */}
      <OfficialDocumentCenter
        isOpen={isDocCenterOpen}
        onClose={() => setIsDocCenterOpen(false)}
        initialDocumentType={docCenterType}
        initialOrderId={docCenterOrderId}
        activeEntity={activeEntity}
        activeCurrency={activeCurrency}
        theme={theme}
      />

      {/* Supabase PostgreSQL Database & Persistent Storage Modal */}
      <DatabaseSettingsModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDataSynced={loadPersistentData}
        theme={theme}
      />

      {/* Enterprise Authentication Gateway & Welcome Modal */}
      <AuthWelcomeModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        allUsers={users}
        onRegisterUser={handleRegisterUser}
      />

      {/* User Profile Control & 2SA Management Modal */}
      <ProfileControlModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateCurrentUser={handleUpdateCurrentUser}
        allUsers={users}
        onUpdateUserList={handleUpdateUserList}
        onSignOut={handleSignOut}
      />

      {/* Autonomous Enterprise AI Assistant "ArielMC" */}
      <ArielMCAICopilot
        activeEntity={activeEntity}
        activeCurrency={activeCurrency}
        products={products}
        factories={factories}
        samples={samples}
        orders={orders}
        consignments={consignments}
        crmLeads={crmLeads}
        theme={theme}
        isOpen={isArielAiOpen}
        onToggleOpen={setIsArielAiOpen}
        onNavigateTab={setActiveTab}
        onOpenDocumentCenter={() => handleOpenDocCenter('COMMERCIAL_INVOICE')}
        onOpenDatabaseSettings={() => setIsDbModalOpen(true)}
        onOpenUserGuide={() => setIsUserGuideModalOpen(true)}
        onOpenProfileControl={() => setIsProfileModalOpen(true)}
      />

      {/* Live Exchange Rate Sync & Bangladesh Bank Statutory Matrix Modal */}
      <LiveExchangeRateModal
        isOpen={isForexModalOpen}
        onClose={() => setIsForexModalOpen(false)}
        currencies={currencies}
        onCurrenciesUpdated={setCurrencies}
        forexMeta={forexMeta}
        onMetaUpdated={setForexMeta}
        theme={theme}
      />

      {/* ArielMC ERP Official User Guide Modal */}
      <UserGuideModal
        isOpen={isUserGuideModalOpen}
        onClose={() => setIsUserGuideModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
