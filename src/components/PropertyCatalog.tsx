import React, { useState, useMemo } from 'react';
import { Property, PropertyCategory, CurrencyCode, ListingType } from '../types';
import { formatPrice } from '../utils/formatters';
import { ArchitecturalMapView } from './ArchitecturalMapView';
import { Heart, Grid, Map, SlidersHorizontal, ArrowUpRight, Bed, Bath, Maximize, Calendar } from 'lucide-react';

interface PropertyCatalogProps {
  properties: Property[];
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleViewing: (property: Property) => void;
  initialCategory?: PropertyCategory;
}

export const PropertyCatalog: React.FC<PropertyCatalogProps> = ({
  properties,
  currency,
  currentLang,
  wishlistIds,
  onToggleWishlist,
  onSelectProperty,
  onScheduleViewing,
  initialCategory = 'all'
}) => {
  const isAr = currentLang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>(initialCategory);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft'>('featured');
  const [selectedListingType, setSelectedListingType] = useState<'all' | 'buy' | 'rent'>('all');

  // Categories config
  const categories: { id: PropertyCategory; labelEn: string; labelAr: string }[] = [
    { id: 'all', labelEn: 'All Residences', labelAr: 'جميع المعروضات' },
    { id: 'villas', labelEn: 'Signature Villas', labelAr: 'فيلات مميزة' },
    { id: 'penthouses', labelEn: 'Sky Penthouses', labelAr: 'بنتهاوس فاخر' },
    { id: 'coastal', labelEn: 'Coastal Estates', labelAr: 'إقامات شاطئية' },
    { id: 'mansions', labelEn: 'Historic Mansions', labelAr: 'قصور تاريخية' }
  ];

  // Filtered & sorted properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedListingType !== 'all' && p.listingType !== selectedListingType) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
        if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
        if (sortBy === 'sqft') return b.sqft - a.sqft;
        // default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [properties, selectedCategory, selectedListingType, sortBy]);

  return (
    <section id="residences" className="w-full py-16 lg:py-24 bg-[#FBF9F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E0D8]">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C28E5C]">
              {isAr ? 'المجموعة المنتقاة بعناية' : 'Curated Portfolio'}
            </span>
            <h2 className="text-3xl lg:text-4xl font-editorial font-medium text-[#1E1B18] tracking-tight">
              {isAr ? 'الإقامات المعمارية المتاحة' : 'Architectural Residences'}
            </h2>
          </div>

          {/* View Mode Toggle: Grid vs Map */}
          <div className="flex items-center gap-3">
            <div className="flex bg-[#F2EFE9] p-1 rounded-lg border border-[#E5E0D8]">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-sm font-semibold' : 'text-[#736B63] hover:text-[#1E1B18]'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>{isAr ? 'شبكة' : 'Grid'}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                  viewMode === 'map' ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-sm font-semibold' : 'text-[#736B63] hover:text-[#1E1B18]'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>{isAr ? 'الخريطة' : 'Map'}</span>
              </button>
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={isAr ? 'ترتيب النتائج' : 'Sort properties'}
                className="bg-[#FFFFFF] text-xs font-medium text-[#1E1B18] px-3 py-2 rounded-lg border border-[#E5E0D8] hover:border-[#C28E5C] outline-none cursor-pointer"
              >
                <option value="featured">{isAr ? 'المختارة أولاً' : 'Featured First'}</option>
                <option value="price-desc">{isAr ? 'الأعلى سعراً' : 'Price: High to Low'}</option>
                <option value="price-asc">{isAr ? 'الأقل سعراً' : 'Price: Low to High'}</option>
                <option value="sqft">{isAr ? 'الأكبر مساحة' : 'Largest Area'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Tabs / Segmented Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          {/* Typology tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-medium tracking-wide rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#1E1B18] text-[#FBF9F5] shadow-sm'
                      : 'bg-[#FFFFFF] text-[#5A534B] border border-[#E5E0D8] hover:border-[#C28E5C] hover:text-[#1E1B18]'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

          {/* Quick status count */}
          <div className="text-xs text-[#736B63]">
            {isAr
              ? `عرض ${filteredProperties.length} من إجمالي ${properties.length} إقامة`
              : `Showing ${filteredProperties.length} of ${properties.length} residences`}
          </div>
        </div>

        {/* Content Render: Grid or Map */}
        {viewMode === 'map' ? (
          <ArchitecturalMapView
            properties={filteredProperties}
            currency={currency}
            currentLang={currentLang}
            onSelectProperty={onSelectProperty}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop) => {
              const isWishlisted = wishlistIds.includes(prop.id);

              return (
                <article
                  key={prop.id}
                  className="group bg-[#FFFFFF] rounded-xl border border-[#E5E0D8] overflow-hidden flex flex-col hover:border-[#C28E5C] hover:shadow-xl transition-all duration-300"
                >
                  {/* Property Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE8E1]">
                    <img
                      src={prop.coverImage}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient Scrim for subtle contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(prop.id);
                      }}
                      className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-[#1E1B18] hover:text-[#C28E5C] shadow-sm transition-all cursor-pointer z-10"
                      title={isWishlisted ? 'Remove from wishlist' : 'Save residence'}
                      aria-label="Toggle wishlist"
                    >
                      <Heart
                        className={`w-4 h-4 ${isWishlisted ? 'fill-[#C28E5C] text-[#C28E5C]' : ''}`}
                      />
                    </button>

                    {/* Architectural Style Tag / Subtle unboxed marker */}
                    <div className="absolute bottom-3 left-3 text-[11px] font-medium tracking-wider uppercase text-white/95 px-2 py-1 bg-black/40 backdrop-blur-md rounded">
                      {isAr ? prop.architectAr : prop.architect}
                    </div>
                  </div>

                  {/* Property Information Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Location & Title */}
                    <div>
                      <p className="text-[11px] font-semibold tracking-wider uppercase text-[#8B5E3C] mb-1">
                        {isAr ? prop.locationAr : prop.location}
                      </p>
                      <h3 
                        onClick={() => onSelectProperty(prop)}
                        className="text-xl font-editorial font-semibold text-[#1E1B18] hover:text-[#C28E5C] cursor-pointer transition-colors leading-snug line-clamp-1"
                      >
                        {isAr ? prop.titleAr : prop.title}
                      </h3>
                      <p className="text-xs text-[#736B63] mt-1.5 line-clamp-2 leading-relaxed">
                        {isAr ? prop.taglineAr : prop.tagline}
                      </p>
                    </div>

                    {/* Zero-Pill Unboxed Key Specs with Typographic Dot Separators */}
                    <div className="flex items-center gap-2 text-xs text-[#5A534B] pt-2 border-t border-[#F2EFE9]">
                      <span>{prop.beds} {isAr ? 'غرف' : 'Beds'}</span>
                      <span aria-hidden="true" className="text-[#C28E5C]">·</span>
                      <span>{prop.baths} {isAr ? 'حمامات' : 'Baths'}</span>
                      <span aria-hidden="true" className="text-[#C28E5C]">·</span>
                      <span className="tabular-nums">{prop.sqft.toLocaleString()} sq.ft</span>
                    </div>

                    {/* Price & Primary Action Row */}
                    <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-[#8B5E3C] font-semibold">
                          {prop.listingType === 'rent' ? (isAr ? 'إيجار شهري' : 'Monthly Lease') : (isAr ? 'السعر المطلوب' : 'Asking Price')}
                        </p>
                        <p className="text-lg font-bold text-[#1E1B18] tabular-nums font-mono">
                          {formatPrice(
                            prop.listingType === 'rent' && prop.priceRentPerMonthUSD
                              ? prop.priceRentPerMonthUSD
                              : prop.priceUSD,
                            currency
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onScheduleViewing(prop)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#1E1B18] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded transition-colors cursor-pointer"
                          title="Schedule private viewing"
                        >
                          <Calendar className="w-3.5 h-3.5 inline mr-1" />
                          <span>{isAr ? 'معاينة' : 'Tour'}</span>
                        </button>
                        
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1E1B18] hover:bg-[#C28E5C] rounded transition-colors cursor-pointer shadow-sm"
                        >
                          <span>{isAr ? 'استكشف' : 'View'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
