import React from 'react';
import { Property, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { 
  X, Check, Minus, Bed, Bath, Maximize, Calendar, 
  Sparkles, Layers, ShieldCheck, ArrowRight, ExternalLink, 
  Trash2, Plus, Phone, MessageCircle, Building2, MapPin
} from 'lucide-react';

interface PropertyComparisonModalProps {
  properties: Property[];
  allProperties: Property[];
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  onClose: () => void;
  onRemoveProperty: (id: string) => void;
  onAddProperty: (property: Property) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleViewing: (property: Property) => void;
  onClearAll: () => void;
}

export const PropertyComparisonModal: React.FC<PropertyComparisonModalProps> = ({
  properties,
  allProperties,
  currency,
  currentLang,
  onClose,
  onRemoveProperty,
  onAddProperty,
  onSelectProperty,
  onScheduleViewing,
  onClearAll
}) => {
  const isAr = currentLang === 'ar';

  // Available properties to add (those not already in comparison, max 3)
  const availableToAdd = allProperties.filter(
    (p) => !properties.some((selected) => selected.id === p.id)
  );

  // Compute best values for highlight indicators
  const bestPricePerSqft = properties.length > 1 
    ? Math.min(...properties.map(p => p.priceUSD / p.sqft)) 
    : null;

  const largestSqft = properties.length > 1
    ? Math.max(...properties.map(p => p.sqft))
    : null;

  const mostBeds = properties.length > 1
    ? Math.max(...properties.map(p => p.beds))
    : null;

  // Aggregate all unique amenities across selected properties
  const allUniqueAmenities = Array.from(
    new Set(properties.flatMap((p) => (isAr ? p.amenitiesAr || p.amenities : p.amenities)))
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-6xl bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#E5E0D8] text-[#1E1B18] my-6 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="px-6 py-4 bg-[#FBF9F5] border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1E1B18] text-[#C28E5C] rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg md:text-xl font-semibold text-[#1E1B18]">
                  {isAr ? 'مقارنة الإقامات المعمارية جنباً إلى جنب' : 'Side-by-Side Architectural Comparison'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#8B5E3C]/10 text-[#8B5E3C]">
                  {properties.length} / 3 {isAr ? 'عقارات' : 'Residences'}
                </span>
              </div>
              <p className="text-xs text-[#736B63] mt-0.5 font-light">
                {isAr 
                  ? 'قارن المواصفات الهندسية، الأسعار، والمرافق الحصرية لاختيار إقامتك المثالية.'
                  : 'Evaluate structural metrics, asking valuations, and bespoke amenities across selected estates.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {properties.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs text-[#8B5E3C] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'مسح الكل' : 'Clear All'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Content */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          
          {properties.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Layers className="w-12 h-12 text-[#C28E5C] mx-auto opacity-50" />
              <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                {isAr ? 'لم يتم اختيار أي عقار للمقارنة بعد' : 'No Residences Selected for Comparison'}
              </h4>
              <p className="text-xs text-[#736B63] max-w-md mx-auto">
                {isAr 
                  ? 'اختر حتى 3 عقارات من القائمة لتتمكن من مقارنتها ومراجعة المواصفات والأسعار بدقة.'
                  : 'Select up to 3 luxury residences from our catalog to compare architectural specifications and features.'}
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1E1B18] text-[#FBF9F5] hover:bg-[#C28E5C] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? 'استعراض العقارات' : 'Browse Residences'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px]">
                
                {/* 1. Cards Top Row */}
                <div className="grid grid-cols-4 gap-4 pb-6 border-b border-[#E5E0D8]">
                  <div className="p-4 flex flex-col justify-end">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8B5E3C]">
                      {isAr ? 'الإقامات المختارة' : 'Selected Residences'}
                    </span>
                    <p className="text-xs text-[#736B63] mt-1">
                      {isAr ? 'تصل إلى 3 إقامات معمارية' : 'Up to 3 signature estates'}
                    </p>
                  </div>

                  {properties.map((prop) => (
                    <div 
                      key={prop.id} 
                      className="bg-[#FBF9F5] rounded-xl border border-[#E5E0D8] p-4 flex flex-col justify-between space-y-3 relative group hover:border-[#C28E5C] transition-colors"
                    >
                      <button
                        onClick={() => onRemoveProperty(prop.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-[#736B63] hover:text-red-600 rounded-full shadow-sm transition-colors z-10 cursor-pointer"
                        title={isAr ? 'إزالة من المقارنة' : 'Remove from comparison'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-2">
                        <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-[#ECE8E1]">
                          <img
                            src={prop.coverImage}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8B5E3C]">
                            {prop.category} · {isAr ? prop.cityAr : prop.city}
                          </span>
                          <h4 
                            onClick={() => {
                              onClose();
                              onSelectProperty(prop);
                            }}
                            className="text-sm font-editorial font-bold text-[#1E1B18] hover:text-[#C28E5C] cursor-pointer line-clamp-1 transition-colors"
                          >
                            {isAr ? prop.titleAr : prop.title}
                          </h4>
                          <p className="text-[11px] text-[#736B63] line-clamp-1 mt-0.5">
                            {isAr ? prop.locationAr : prop.location}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[#E5E0D8]">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProperty(prop);
                          }}
                          className="w-full py-1.5 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-[11px] font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                        >
                          {isAr ? 'عرض التفاصيل' : 'View Details'}
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onScheduleViewing(prop);
                          }}
                          className="w-full py-1.5 bg-white hover:bg-[#F2EFE9] border border-[#E5E0D8] text-[#1E1B18] text-[11px] font-semibold rounded transition-colors cursor-pointer"
                        >
                          {isAr ? 'طلب معاينة' : 'Schedule Tour'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slot Card if less than 3 */}
                  {properties.length < 3 && (
                    <div className="bg-[#FAF8F5] border-2 border-dashed border-[#D6CEBE] rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
                      <div className="p-3 bg-[#F0EAE1] text-[#8B5E3C] rounded-full">
                        <Plus className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1E1B18]">
                          {isAr ? 'أضف عقاراً آخر' : 'Add Residence'}
                        </p>
                        <p className="text-[10px] text-[#736B63] mt-0.5">
                          {isAr ? 'قارن حتى 3 عقارات معاً' : 'Compare up to 3 simultaneously'}
                        </p>
                      </div>

                      {availableToAdd.length > 0 && (
                        <div className="w-full">
                          <select
                            onChange={(e) => {
                              const found = availableToAdd.find(p => p.id === e.target.value);
                              if (found) {
                                onAddProperty(found);
                                e.target.value = '';
                              }
                            }}
                            defaultValue=""
                            className="w-full text-xs px-2 py-1.5 bg-white border border-[#D6CEBE] rounded text-[#1E1B18] outline-none cursor-pointer"
                          >
                            <option value="" disabled>
                              {isAr ? '+ اختر عقاراً للإضافة' : '+ Select property...'}
                            </option>
                            {availableToAdd.map((p) => (
                              <option key={p.id} value={p.id}>
                                {isAr ? p.titleAr : p.title} ({formatPrice(p.priceUSD, currency)})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If 1 property selected, leave the 3rd placeholder column empty/aligned */}
                  {properties.length === 1 && (
                    <div className="bg-transparent border border-transparent rounded-xl hidden lg:block" />
                  )}
                </div>

                {/* 2. Financial Metrics Row Group */}
                <div className="py-4 border-b border-[#E5E0D8] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">
                    {isAr ? 'المؤشرات المالية والقيمة' : 'Financial Valuations'}
                  </h5>

                  {/* Asking Price */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 bg-[#FBF9F5] rounded-lg px-3">
                    <span className="font-semibold text-[#1E1B18]">{isAr ? 'السعر المطلوب' : 'Asking Price'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-mono font-bold text-sm text-[#1E1B18]">
                        {formatPrice(prop.priceUSD, currency)}
                      </div>
                    ))}
                  </div>

                  {/* Price per Sq.Ft */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'سعر القدم المربع' : 'Price / sq.ft'}</span>
                    {properties.map((prop) => {
                      const pps = Math.round(prop.priceUSD / prop.sqft);
                      const isBest = bestPricePerSqft !== null && (prop.priceUSD / prop.sqft) === bestPricePerSqft;
                      return (
                        <div key={prop.id} className="font-mono text-xs">
                          <span>${pps.toLocaleString()}</span>
                          {isBest && (
                            <span className="ml-2 text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {isAr ? 'أفضل قيمة' : 'Best Value'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Listing Type */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3 bg-[#FBF9F5] rounded-lg">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'نوع الطرح' : 'Listing Mode'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="uppercase text-[11px] font-semibold text-[#8B5E3C]">
                        {prop.listingType === 'buy' ? (isAr ? 'تمليك حر' : 'Freehold Sale') : (isAr ? 'إيجار فندقي' : 'Lease')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Architectural Specifications Row Group */}
                <div className="py-4 border-b border-[#E5E0D8] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">
                    {isAr ? 'المواصفات الهندسية والمساحات' : 'Architectural Metrics'}
                  </h5>

                  {/* Bedrooms */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3 bg-[#FBF9F5] rounded-lg">
                    <span className="font-semibold text-[#1E1B18] flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>{isAr ? 'غرف النوم' : 'Bedrooms'}</span>
                    </span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-bold text-sm">
                        {prop.beds} {isAr ? 'أجنحة' : 'Suites'}
                        {mostBeds !== null && prop.beds === mostBeds && (
                          <span className="ml-2 text-[10px] text-[#C28E5C] font-normal">
                            ({isAr ? 'الأكثر' : 'Max'})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bathrooms */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3">
                    <span className="font-semibold text-[#5A534B] flex items-center gap-1.5">
                      <Bath className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>{isAr ? 'الحمامات' : 'Bathrooms'}</span>
                    </span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-semibold">
                        {prop.baths} {isAr ? 'حمامات' : 'Baths'}
                      </div>
                    ))}
                  </div>

                  {/* Interior Sq.Ft */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3 bg-[#FBF9F5] rounded-lg">
                    <span className="font-semibold text-[#1E1B18] flex items-center gap-1.5">
                      <Maximize className="w-3.5 h-3.5 text-[#8B5E3C]" />
                      <span>{isAr ? 'المساحة الداخلية' : 'Interior Area'}</span>
                    </span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-mono font-bold">
                        {prop.sqft.toLocaleString()} sq.ft
                        {largestSqft !== null && prop.sqft === largestSqft && (
                          <span className="ml-2 text-[10px] font-sans font-semibold text-[#8B5E3C] bg-[#8B5E3C]/10 px-1.5 py-0.5 rounded">
                            {isAr ? 'الأكبر مساحة' : 'Largest'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Plot / Lot Sq.Ft */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'مساحة الأرض' : 'Plot Size'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-mono">
                        {prop.lotSqft.toLocaleString()} sq.ft
                      </div>
                    ))}
                  </div>

                  {/* Year Built */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3 bg-[#FBF9F5] rounded-lg">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'سنة الإنجاز' : 'Year Built'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-mono">
                        {prop.yearBuilt}
                      </div>
                    ))}
                  </div>

                  {/* Garage Spaces */}
                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-2 px-3">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'مرآب السيارات' : 'Garage'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id}>
                        {prop.garageSpaces} {isAr ? 'مركبات' : 'Vehicles'}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Architecture & Design */}
                <div className="py-4 border-b border-[#E5E0D8] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">
                    {isAr ? 'المعماري وفلسفة التصميم' : 'Architecture & Signature'}
                  </h5>

                  <div className="grid grid-cols-4 gap-4 items-start text-xs py-2 px-3 bg-[#FBF9F5] rounded-lg">
                    <span className="font-semibold text-[#1E1B18]">{isAr ? 'المعماري المصمم' : 'Architect'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="font-medium text-[#8B5E3C]">
                        {isAr ? prop.architectAr : prop.architect}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-4 items-start text-xs py-2 px-3">
                    <span className="font-semibold text-[#5A534B]">{isAr ? 'المواد المعمارية' : 'Materiality'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="text-[#736B63] text-[11px] leading-relaxed">
                        {isAr ? prop.architecturalNotesAr : prop.architecturalNotes}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Bespoke Amenities Matrix */}
                <div className="py-4 border-b border-[#E5E0D8] space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">
                    {isAr ? 'مصفوفة المرافق الحصرية' : 'Bespoke Amenities Matrix'}
                  </h5>

                  <div className="space-y-1">
                    {allUniqueAmenities.map((amenity, idx) => (
                      <div 
                        key={idx} 
                        className={`grid grid-cols-4 gap-4 items-center text-xs py-2 px-3 rounded-lg ${
                          idx % 2 === 0 ? 'bg-[#FBF9F5]' : 'bg-transparent'
                        }`}
                      >
                        <span className="font-medium text-[#1E1B18]">{amenity}</span>
                        {properties.map((prop) => {
                          const hasAmenity = (isAr ? prop.amenitiesAr : prop.amenities)?.some(
                            a => a.toLowerCase().trim() === amenity.toLowerCase().trim()
                          ) || prop.amenities.some(
                            a => a.toLowerCase().trim() === amenity.toLowerCase().trim()
                          );

                          return (
                            <div key={prop.id} className="flex items-center">
                              {hasAmenity ? (
                                <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isAr ? 'متاح' : 'Included'}</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center text-[#A8A196]">
                                  <Minus className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. Lead Advisor Row */}
                <div className="pt-4 space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#8B5E3C]">
                    {isAr ? 'المستشار العقاري المعتمد' : 'Assigned Senior Advisor'}
                  </h5>

                  <div className="grid grid-cols-4 gap-4 items-center text-xs py-3 px-3 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                    <span className="font-semibold text-[#1E1B18]">{isAr ? 'المكتب الخاص' : 'Private Advisory'}</span>
                    {properties.map((prop) => (
                      <div key={prop.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={prop.agent.avatar}
                            alt={prop.agent.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#C28E5C]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-xs text-[#1E1B18]">
                              {isAr ? prop.agent.nameAr : prop.agent.name}
                            </p>
                            <p className="text-[10px] text-[#736B63]">{prop.agent.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${prop.agent.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              isAr 
                                ? `مرحباً، أود الاستفسار عن إقامة ${prop.titleAr || prop.title}`
                                : `Hello, I would like to inquire about ${prop.title}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-[#25D366] text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow-sm hover:bg-[#20ba59] transition-colors"
                          >
                            <MessageCircle className="w-3 h-3 fill-white text-[#25D366]" />
                            <span>WhatsApp</span>
                          </a>

                          <a
                            href={`tel:${prop.agent.phone}`}
                            className="px-2.5 py-1 bg-white border border-[#E5E0D8] text-[#1E1B18] rounded text-[10px] font-semibold flex items-center gap-1 hover:border-[#1E1B18] transition-colors"
                          >
                            <Phone className="w-3 h-3 text-[#C28E5C]" />
                            <span>{isAr ? 'اتصال' : 'Call'}</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Bar */}
        <div className="px-6 py-3 bg-[#FBF9F5] border-t border-[#E5E0D8] flex items-center justify-between shrink-0 text-xs text-[#736B63]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8B5E3C]" />
            <span>{isAr ? 'بيانات معتمدة وموثقة من دار سيينا للعقارات' : 'SIENNA Verified Architectural Portfolio Data'}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1E1B18] hover:bg-[#C28E5C] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            {isAr ? 'إغلاق المقارنة' : 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
};
