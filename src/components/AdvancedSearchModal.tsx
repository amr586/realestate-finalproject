import React from 'react';
import { Property, CurrencyCode, SearchFilterState, PropertyCategory } from '../types';
import { formatPrice } from '../utils/formatters';
import { X, Search, SlidersHorizontal, RotateCcw, Check, MapPin, Bed, Bath, Home } from 'lucide-react';

interface AdvancedSearchModalProps {
  currentLang: 'en' | 'ar';
  currency: CurrencyCode;
  filters: SearchFilterState;
  onFilterChange: (filters: SearchFilterState) => void;
  onResetFilters: () => void;
  onClose: () => void;
  matchingCount: number;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  currentLang,
  currency,
  filters,
  onFilterChange,
  onResetFilters,
  onClose,
  matchingCount
}) => {
  const isAr = currentLang === 'ar';

  const luxuryAmenitiesList = [
    { id: 'pool', labelEn: 'Infinity Pool', labelAr: 'مسبح إنفينيتي' },
    { id: 'cellar', labelEn: 'Wine Cellar', labelAr: 'سرداب مقتنيات' },
    { id: 'spa', labelEn: 'Private Spa & Sauna', labelAr: 'سبا وساونا خاصة' },
    { id: 'elevator', labelEn: 'Biometric Elevator', labelAr: 'مصعد بيومتري' },
    { id: 'smart', labelEn: 'Smart Automation', labelAr: 'تحكم ذكي متكامل' },
    { id: 'waterfront', labelEn: 'Waterfront / Marina', labelAr: 'إطلالة بحرية ومرسى' }
  ];

  const handleAmenityToggle = (id: string) => {
    const next = filters.amenities.includes(id)
      ? filters.amenities.filter((a) => a !== id)
      : [...filters.amenities, id];
    onFilterChange({ ...filters, amenities: next });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#E5E0D8] text-[#1E1B18] my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FBF9F5] border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-4 h-4 text-[#C28E5C]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1E1B18]">
              {isAr ? 'البحث المعماري المتقدم وفلترة المواصفات' : 'Advanced Architectural Search & Filters'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Form Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
              {isAr ? 'البحث بالكلمات المفتاحية أو المعماري' : 'Keywords, Architect or Enclave'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
                placeholder={isAr ? 'مثال: ترافرتين، زها حديد، الزمالك، رأس الحكمة...' : 'e.g. Travertine, Foster, Zamalek, Ras El Hekma...'}
                className="w-full text-xs bg-[#FBF9F5] px-3.5 py-2.5 rounded-lg border border-[#E5E0D8] focus:border-[#C28E5C] focus:bg-white outline-none"
              />
              <Search className="w-4 h-4 text-[#736B63] absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Typology / Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
              {isAr ? 'التصنيف المعماري' : 'Architectural Typology'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'all', en: 'All Types', ar: 'الكل' },
                { id: 'villas', en: 'Villas', ar: 'فيلات' },
                { id: 'penthouses', en: 'Penthouses', ar: 'بنتهاوس' },
                { id: 'coastal', en: 'Coastal', ar: 'ساحلية' },
                { id: 'mansions', en: 'Mansions', ar: 'قصور' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, category: cat.id as PropertyCategory })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    filters.category === cat.id
                      ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                      : 'bg-[#FBF9F5] text-[#5A534B] border-[#E5E0D8] hover:border-[#C28E5C]'
                  }`}
                >
                  {isAr ? cat.ar : cat.en}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1E1B18]">
              <span className="text-[#736B63] uppercase tracking-wider">
                {isAr ? 'الحد الأقصى للسعر:' : 'Maximum Price Ceiling:'}
              </span>
              <span className="font-mono text-sm text-[#8B5E3C] font-bold">
                {formatPrice(filters.maxPrice, currency)}
              </span>
            </div>
            <input
              type="range"
              min="2000000"
              max="20000000"
              step="500000"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: parseFloat(e.target.value) })}
              className="w-full accent-[#C28E5C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#736B63] font-mono">
              <span>$2,000,000</span>
              <span>$10,000,000</span>
              <span>$20,000,000+</span>
            </div>
          </div>

          {/* Bedrooms & Bathrooms Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                {isAr ? 'الحد الأدنى لغرف النوم' : 'Minimum Bedrooms'}
              </label>
              <div className="flex gap-1.5">
                {[0, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, minBeds: num })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      filters.minBeds === num
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                        : 'bg-white text-[#5A534B] border-[#E5E0D8]'
                    }`}
                  >
                    {num === 0 ? (isAr ? 'الكل' : 'Any') : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                {isAr ? 'الحد الأدنى للحمامات' : 'Minimum Bathrooms'}
              </label>
              <div className="flex gap-1.5">
                {[0, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, minBaths: num })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                      filters.minBaths === num
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                        : 'bg-white text-[#5A534B] border-[#E5E0D8]'
                    }`}
                  >
                    {num === 0 ? (isAr ? 'الكل' : 'Any') : `${num}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Geographic Location Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
              {isAr ? 'الموقع الجغرافي والمدينة' : 'Prime Destination'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: isAr ? 'كل المواقع' : 'All Regions' },
                { id: 'Cairo', label: isAr ? 'القاهرة والزمالك' : 'Cairo / Zamalek' },
                { id: 'North Coast', label: isAr ? 'الساحل الشمالي' : 'North Coast' },
                { id: 'El Gouna', label: isAr ? 'الجونة' : 'El Gouna' }
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, city: loc.id })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors cursor-pointer text-center ${
                    filters.city === loc.id
                      ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                      : 'bg-white text-[#5A534B] border-[#E5E0D8]'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Amenities Filter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
              {isAr ? 'التجهيزات والمرافق الحصرية' : 'Exclusive Inclusions'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {luxuryAmenitiesList.map((item) => {
                const active = filters.amenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAmenityToggle(item.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-left ${
                      active
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                        : 'bg-white text-[#5A534B] border-[#E5E0D8] hover:border-[#C28E5C]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      active ? 'bg-[#C28E5C] border-[#C28E5C] text-white' : 'border-[#E5E0D8]'
                    }`}>
                      {active && <Check className="w-3 h-3" />}
                    </div>
                    <span>{isAr ? item.labelAr : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer with Dynamic Result Count & Action Buttons */}
        <div className="px-6 py-4 bg-[#FBF9F5] border-t border-[#E5E0D8] flex items-center justify-between">
          <button
            type="button"
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs font-medium text-[#736B63] hover:text-[#1E1B18] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isAr ? 'إعادة تعيين الفلاتر' : 'Reset All'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
          >
            {isAr
              ? `عرض ${matchingCount} إقامة مطابقة`
              : `Show ${matchingCount} Matching Residences`}
          </button>
        </div>

      </div>
    </div>
  );
};
