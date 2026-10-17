/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PropertyCatalog } from './components/PropertyCatalog';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyComparisonModal } from './components/PropertyComparisonModal';
import { ThreePropertyViewer } from './components/ThreePropertyViewer';
import { MortgageCalculator } from './components/MortgageCalculator';
import { ArchitecturePhilosophy } from './components/ArchitecturePhilosophy';
import { UserAgentDashboardModal } from './components/UserAgentDashboardModal';
import { AdvancedSearchModal } from './components/AdvancedSearchModal';
import { ScheduleViewingModal } from './components/ScheduleViewingModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { DotNetBackendModal } from './components/DotNetBackendModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { 
  Property, CurrencyCode, PropertyCategory, ListingType, SearchFilterState 
} from './types';
import { 
  SlidersHorizontal, Sparkles, Building, Database, 
  Shield, Check, Search, Calendar, Heart 
} from 'lucide-react';

function RealEstateApp() {
  const { properties, userRole, currentUser } = useAuth();

  // Language & Localization State
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>('ar');
  const isAr = currentLang === 'ar';

  // Currency State
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Wishlist State (persisted)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sienna_wishlist');
    return saved ? JSON.parse(saved) : ['sienna-01', 'sienna-03'];
  });

  useEffect(() => {
    localStorage.setItem('sienna_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Update HTML Dir for Arabic / English
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang, isAr]);

  // Modal / Drawer visibility states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [viewingTargetProperty, setViewingTargetProperty] = useState<Property | null>(null);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isDotNetBackendOpen, setIsDotNetBackendOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const comparisonProperties = properties.filter((property) => comparisonIds.includes(property.id));
  const toggleComparison = (property: Property) => {
    setComparisonIds((current) => current.includes(property.id)
      ? current.filter((id) => id !== property.id)
      : current.length < 3 ? [...current, property.id] : current);
  };

  // Advanced Search Filter State
  const [filters, setFilters] = useState<SearchFilterState>({
    searchTerm: '',
    listingType: 'all',
    category: 'all',
    city: 'all',
    minPrice: 0,
    maxPrice: 20000000,
    minBeds: 0,
    minBaths: 0,
    minSqft: 0,
    amenities: []
  });

  const toggleWishlist = (id: string) => {
    setWishlistIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleOpenScheduleViewing = (prop?: Property) => {
    const target = prop || selectedProperty || properties[0];
    setViewingTargetProperty(target);
    setIsViewingModalOpen(true);
  };

  // Filter properties based on active filters
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Search term
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(term) || (p.titleAr && p.titleAr.includes(term));
        const matchLocation = p.location.toLowerCase().includes(term) || (p.locationAr && p.locationAr.includes(term));
        const matchArch = p.architect.toLowerCase().includes(term);
        if (!matchTitle && !matchLocation && !matchArch) return false;
      }

      // Listing Type
      if (filters.listingType !== 'all' && p.listingType !== filters.listingType) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }

      // City
      if (filters.city !== 'all') {
        const c = p.city.toLowerCase();
        const target = filters.city.toLowerCase();
        if (!c.includes(target)) return false;
      }

      // Price
      if (p.priceUSD > filters.maxPrice) return false;

      // Beds
      if (filters.minBeds > 0 && p.beds < filters.minBeds) return false;

      // Baths
      if (filters.minBaths > 0 && p.baths < filters.minBaths) return false;

      // Amenities filter
      if (filters.amenities.length > 0) {
        const pAmenitiesJoined = p.amenities.join(' ').toLowerCase();
        for (const am of filters.amenities) {
          if (!pAmenitiesJoined.includes(am)) return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  const savedPropertiesList = useMemo(() => {
    return properties.filter(p => wishlistIds.includes(p.id));
  }, [properties, wishlistIds]);

  return (
    <div className={`min-h-screen bg-[#FBF9F5] text-[#1E1B18] flex flex-col ${isAr ? 'font-ar' : 'font-modern'}`}>
      
      {/* Top Banner: Quick Access to .NET 9 API, 3D Spatial Model & Portal */}
      <div className="bg-[#1E1B18] text-[#FBF9F5] py-2 px-6 text-xs border-b border-[#332F2B]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#D8B48F]">
              {isAr ? 'منصة سيينا العقارية الحصرية' : 'SIENNA Architectural Estates'}
            </span>
            <span aria-hidden="true" className="text-[#736B63]">·</span>
            <span className="text-[#A8A196]">
              {isAr ? 'مستوحى من تصميم قالب Webflow الفاخر' : 'Inspired by the Sienna Webflow Luxury Template'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="text-[#D8B48F] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'المستشار الذكي (Gemini AI)' : 'AI Advisor'}</span>
            </button>

            <button
              onClick={() => setIs3DViewerOpen(true)}
              className="text-[#D8B48F] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Building className="w-3.5 h-3.5" />
              <span>{isAr ? 'مجسم 3D المعماري' : '3D Spatial'}</span>
            </button>

            <button
              onClick={() => setIsDashboardOpen(true)}
              className="text-[#D8B48F] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAr ? `لوحة الإدارة (${userRole === 'agent' ? '��سيط' : 'عميل'})` : `Portal (${userRole})`}</span>
            </button>

            <button
              onClick={() => setIsDotNetBackendOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Database className="w-3 h-3" />
              <span>.NET 9 & SQL Server Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <Header
        currentLang={currentLang}
        onToggleLang={() => setCurrentLang(prev => (prev === 'en' ? 'ar' : 'en'))}
        currency={currency}
        onSelectCurrency={setCurrency}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenScheduleViewing={() => handleOpenScheduleViewing()}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        currentLang={currentLang}
        onFilterSubmit={({ listingType, category, city, maxPriceUSD }) => {
          setFilters(prev => ({
            ...prev,
            listingType,
            category,
            city,
            maxPriceUSD: maxPriceUSD || 20000000
          }));
        }}
        onExploreClick={() => {
          const el = document.getElementById('residences');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Filter Bar Quick Access Banner */}
      <div className="max-w-7xl mx-auto px-6 w-full -mt-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-[#E5E0D8] shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#5A534B]">
            <span className="font-semibold text-[#1E1B18]">
              {isAr ? 'تصفية وبحث متقدم:' : 'Live Filter Criteria:'}
            </span>
            <span>
              {filters.category !== 'all' ? filters.category : (isAr ? 'كل الفئات' : 'All Typologies')} · {filters.city !== 'all' ? filters.city : (isAr ? 'كل المدن' : 'All Regions')}
            </span>
            {filters.amenities.length > 0 && (
              <span className="text-[#8B5E3C]">({filters.amenities.length} amenities selected)</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdvancedSearchOpen(true)}
              className="px-4 py-2 bg-[#F2EFE9] hover:bg-[#E5E0D8] text-[#1E1B18] text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#8B5E3C]" />
              <span>{isAr ? 'فتح الفلاتر المتقدمة (سعر، غرف، مرافق)' : 'Advanced Search & Filters'}</span>
            </button>

            <button
              onClick={() => setIs3DViewerOpen(true)}
              className="px-4 py-2 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Building className="w-3.5 h-3.5" />
              <span>{isAr ? 'جولة معمارية 3D' : '3D Spatial View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Residences Catalog (Grid & Map Views) */}
      <PropertyCatalog
        properties={filteredProperties}
        currency={currency}
        currentLang={currentLang}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
        onSelectProperty={setSelectedProperty}
        onScheduleViewing={handleOpenScheduleViewing}
        comparisonIds={comparisonIds}
        onToggleComparison={toggleComparison}
        onOpenComparison={() => setIsComparisonOpen(true)}
        initialCategory={filters.category}
      />

      {/* Architectural Philosophy Section */}
      <ArchitecturePhilosophy
        currentLang={currentLang}
        onExplorePortfolio={() => {
          const el = document.getElementById('residences');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onLaunch3D={() => setIs3DViewerOpen(true)}
      />

      {/* Mortgage & Private Wealth Calculator Section */}
      <MortgageCalculator
        currency={currency}
        currentLang={currentLang}
        defaultHomePriceUSD={selectedProperty ? selectedProperty.priceUSD : 4850000}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenPortal={() => setIsDashboardOpen(true)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* MODAL 1: Detailed Property View Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          currency={currency}
          currentLang={currentLang}
          onClose={() => setSelectedProperty(null)}
          onScheduleViewing={handleOpenScheduleViewing}
          isWishlisted={wishlistIds.includes(selectedProperty.id)}
          onToggleWishlist={toggleWishlist}
          currentUserEmail={currentUser?.email || ''}
        />
      )}

      {isComparisonOpen && (
        <PropertyComparisonModal
          properties={comparisonProperties}
          allProperties={properties}
          currency={currency}
          currentLang={currentLang}
          onClose={() => setIsComparisonOpen(false)}
          onRemoveProperty={(id) => setComparisonIds((current) => current.filter((item) => item !== id))}
          onAddProperty={toggleComparison}
          onSelectProperty={(property) => { setIsComparisonOpen(false); setSelectedProperty(property); }}
          onScheduleViewing={(property) => { setIsComparisonOpen(false); handleOpenScheduleViewing(property); }}
          onClearAll={() => setComparisonIds([])}
        />
      )}

      {/* MODAL 2: Interactive Three.js 3D Architectural Scene Modal */}
      {is3DViewerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div 
            className="relative w-full max-w-6xl bg-[#1E1B18] rounded-2xl overflow-hidden border border-[#3A3530] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <ThreePropertyViewer
              currentLang={currentLang}
              propertyTitle={selectedProperty ? selectedProperty.title : 'The Travertine Sanctuary (New Cairo)'}
              onClose={() => setIs3DViewerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MODAL 3: Schedule Viewing Modal */}
      {isViewingModalOpen && viewingTargetProperty && (
        <ScheduleViewingModal
          property={viewingTargetProperty}
          currentLang={currentLang}
          currency={currency}
          onClose={() => {
            setIsViewingModalOpen(false);
            setViewingTargetProperty(null);
          }}
        />
      )}

      {/* MODAL 4: User & Agent Management Portal */}
      {isDashboardOpen && (
        <UserAgentDashboardModal
          currentLang={currentLang}
          currency={currency}
          onClose={() => setIsDashboardOpen(false)}
          onViewProperty={(p) => {
            setIsDashboardOpen(false);
            setSelectedProperty(p);
          }}
        />
      )}

      {/* MODAL 5: Advanced Search & Filter Modal */}
      {isAdvancedSearchOpen && (
        <AdvancedSearchModal
          currentLang={currentLang}
          currency={currency}
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => {
            setFilters({
              searchTerm: '',
              listingType: 'all',
              category: 'all',
              city: 'all',
              minPrice: 0,
              maxPrice: 20000000,
              minBeds: 0,
              minBaths: 0,
              minSqft: 0,
              amenities: []
            });
          }}
          onClose={() => setIsAdvancedSearchOpen(false)}
          matchingCount={filteredProperties.length}
        />
      )}

      {/* MODAL 6: Saved Residences Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        savedProperties={savedPropertiesList}
        currency={currency}
        currentLang={currentLang}
        onRemoveFromWishlist={toggleWishlist}
        onSelectProperty={setSelectedProperty}
        onScheduleViewing={handleOpenScheduleViewing}
      />

      {/* MODAL 7: ASP.NET Core 9 Web API & MS SQL Server Suite Explorer */}
      {isDotNetBackendOpen && (
        <DotNetBackendModal
          currentLang={currentLang}
          onClose={() => setIsDotNetBackendOpen(false)}
        />
      )}

      {/* MODAL 8: AI-Powered Real Estate Assistant Drawer (Gemini API) */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        properties={properties}
        currency={currency}
        currentLang={currentLang}
        onSelectProperty={setSelectedProperty}
        onScheduleViewing={handleOpenScheduleViewing}
      />

      {/* Floating AI Advisor Trigger Button */}
      <button
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#1E1B18] hover:bg-[#C28E5C] text-[#FBF9F5] px-4 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2.5 cursor-pointer transition-all hover:scale-105 group"
        title={isAr ? 'مستشار سيينا العقاري الذكي (Gemini AI)' : 'Sienna AI Advisor (Gemini)'}
      >
        <Sparkles className="w-4 h-4 text-[#D8B48F] group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold tracking-wider uppercase">
          {isAr ? 'المستشار الذكي (AI)' : 'AI Advisor'}
        </span>
      </button>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RealEstateApp />
    </AuthProvider>
  );
}
