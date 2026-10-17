import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { PropertyCategory, ListingType } from '../types';

interface HeroProps {
  currentLang: 'en' | 'ar';
  onFilterSubmit: (filters: {
    listingType: ListingType;
    category: PropertyCategory;
    city: string;
    maxPriceUSD?: number;
  }) => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentLang,
  onFilterSubmit,
  onExploreClick
}) => {
  const isAr = currentLang === 'ar';
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [category, setCategory] = useState<PropertyCategory>('all');
  const [city, setCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let maxPriceUSD: number | undefined;
    if (priceRange === 'under-5m') maxPriceUSD = 5000000;
    if (priceRange === 'under-8m') maxPriceUSD = 8000000;
    if (priceRange === 'under-15m') maxPriceUSD = 15000000;

    onFilterSubmit({
      listingType,
      category,
      city,
      maxPriceUSD
    });

    const el = document.getElementById('residences');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full pt-6 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Hero Container with Editorial Layout */}
        <div className="relative rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#1E1B18] text-[#FBF9F5] shadow-xl min-h-[580px] flex flex-col justify-end p-8 md:p-14 lg:p-16">
          
          {/* Background Photography with Measured Scrim */}
          <img 
            src="/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg"
            alt="Sienna Luxury Architectural Estate" 
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-[#181614]/50 to-black/20" />

          {/* Hero Content Block */}
          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Editorial Kicker */}
            <div className="flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-[#D8B48F] font-medium">
              <span>{isAr ? 'العمارة الخالدة والمعايير العالمية' : 'Timeless Architecture & Global Estates'}</span>
              <span aria-hidden="true">·</span>
              <span>{isAr ? 'نسخة سيينا الحصرية' : 'The Sienna Collection'}</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-medium tracking-tight text-white leading-[1.1] [text-wrap:balance]">
              {isAr 
                ? 'منازل استثنائية صُممت لتدوم عبر الأجيال.' 
                : 'Extraordinary residences sculpted for discerning architectural collectors.'}
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg text-[#D6CEBE] max-w-2xl font-light leading-relaxed">
              {isAr
                ? 'نوفّر لك إمكانية الوصول إلى أفخم القصور والفيلات المعمارية والبنتهاوس الفاخر في القاهرة الجديدة، الزمالك، الساحل الشمالي، والمدن العالمية.'
                : 'Representing a rarefied portfolio of monumental villas, sky penthouses, and coastal estates spanning New Cairo, Zamalek Nilefront, Ras El Hekma, and global capitals.'}
            </p>

            {/* CTA action row */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#1E1B18] bg-[#FBF9F5] hover:bg-[#C28E5C] hover:text-white rounded transition-colors cursor-pointer shadow-md"
              >
                <span>{isAr ? 'استكشف المعروضات' : 'Explore Portfolio'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FBF9F5] border border-[#FBF9F5]/30 hover:border-[#FBF9F5] rounded transition-colors"
              >
                {isAr ? 'عن فلسفة سيينا' : 'The Sienna Ethos'}
              </a>
            </div>

          </div>

          {/* Interactive Search Bar overlay at base of Hero */}
          <div className="relative z-10 mt-10 w-full bg-[#FFFFFF]/95 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-2xl border border-[#E5E0D8] text-[#1E1B18]">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              
              {/* Buy / Rent Segmented Control */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'نوع المعاملة' : 'Listing Mode'}
                </label>
                <div className="flex bg-[#F2EFE9] p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setListingType('buy')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                      listingType === 'buy' ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-sm font-semibold' : 'text-[#736B63]'
                    }`}
                  >
                    {isAr ? 'شراء' : 'Purchase'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('rent')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                      listingType === 'rent' ? 'bg-[#FFFFFF] text-[#1E1B18] shadow-sm font-semibold' : 'text-[#736B63]'
                    }`}
                  >
                    {isAr ? 'إيجار' : 'Lease'}
                  </button>
                </div>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'الموقع الجغرافي' : 'Location'}
                </label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F2EFE9] text-xs font-medium text-[#1E1B18] px-3 py-2.5 rounded-lg border border-transparent focus:border-[#C28E5C] focus:bg-white outline-none cursor-pointer appearance-none"
                  >
                    <option value="all">{isAr ? 'جميع المواقع' : 'All Prime Locations'}</option>
                    <option value="Cairo">{isAr ? 'القاهرة الجديدة والزمالك' : 'New Cairo & Zamalek'}</option>
                    <option value="North Coast">{isAr ? 'الساحل الشمالي (رأس الحكمة)' : 'North Coast (Ras El Hekma)'}</option>
                    <option value="El Gouna">{isAr ? 'الجونة والبحر الأحمر' : 'El Gouna, Red Sea'}</option>
                    <option value="Dubai">{isAr ? 'دبي ونخلة جميرا' : 'Dubai & Palm Jumeirah'}</option>
                  </select>
                  <MapPin className="w-3.5 h-3.5 absolute right-3 top-3 text-[#736B63] pointer-events-none" />
                </div>
              </div>

              {/* Property Category */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'التصنيف المعماري' : 'Typology'}
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    className="w-full bg-[#F2EFE9] text-xs font-medium text-[#1E1B18] px-3 py-2.5 rounded-lg border border-transparent focus:border-[#C28E5C] focus:bg-white outline-none cursor-pointer appearance-none"
                  >
                    <option value="all">{isAr ? 'كل الفئات المعمارية' : 'All Architectural Types'}</option>
                    <option value="villas">{isAr ? 'فيلات مميزة' : 'Signature Villas'}</option>
                    <option value="penthouses">{isAr ? 'بنتهاوس سماوي' : 'Sky Penthouses'}</option>
                    <option value="coastal">{isAr ? 'إقامات شاطئية وبحرية' : 'Coastal Residences'}</option>
                    <option value="mansions">{isAr ? 'قصور تاريخية' : 'Historic Mansions'}</option>
                  </select>
                  <Home className="w-3.5 h-3.5 absolute right-3 top-3 text-[#736B63] pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'النطاق السعري' : 'Price Ceiling'}
                </label>
                <div className="relative">
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full bg-[#F2EFE9] text-xs font-medium text-[#1E1B18] px-3 py-2.5 rounded-lg border border-transparent focus:border-[#C28E5C] focus:bg-white outline-none cursor-pointer appearance-none"
                  >
                    <option value="all">{isAr ? 'أي ميزانية' : 'No Limit / Custom'}</option>
                    <option value="under-5m">{isAr ? 'أقل من $5,000,000' : 'Under $5,000,000'}</option>
                    <option value="under-8m">{isAr ? 'أقل من $8,000,000' : 'Under $8,000,000'}</option>
                    <option value="under-15m">{isAr ? 'أقل من $15,000,000' : 'Under $15,000,000'}</option>
                  </select>
                  <DollarSign className="w-3.5 h-3.5 absolute right-3 top-3 text-[#736B63] pointer-events-none" />
                </div>
              </div>

              {/* Submit Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full h-[38px] bg-[#1E1B18] hover:bg-[#C28E5C] text-[#FBF9F5] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isAr ? 'عرض النتائج' : 'Filter Search'}</span>
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Full-width 4-Column Proof & KPI Row directly below Hero */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-[#FFFFFF] border border-[#E5E0D8] rounded-xl text-center">
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-editorial font-bold text-[#1E1B18] tabular-nums">$1.4B+</p>
            <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'حجم المعاملات الحصرية' : 'Curated Volume'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-editorial font-bold text-[#1E1B18] tabular-nums">180+</p>
            <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'تحف معمارية مسجلة' : 'Masterpiece Estates'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-editorial font-bold text-[#1E1B18] tabular-nums">14</p>
            <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'جوائز معمارية عالمية' : 'Architectural Awards'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl lg:text-3xl font-editorial font-bold text-[#1E1B18] tabular-nums">99.4%</p>
            <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'معدل السرية ورضا العملاء' : 'Discretion Index'}</p>
          </div>
        </div>

      </div>
    </section>
  );
};
