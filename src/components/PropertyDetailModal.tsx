import React, { useState } from 'react';
import { Property, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { 
  X, MapPin, Bed, Bath, Maximize, Calendar, ShieldCheck, 
  Phone, Mail, CheckCircle2, ChevronRight, Compass, Layers, 
  ExternalLink, Share2, Heart, Sparkles, Building2
} from 'lucide-react';
import { PropertyPriceTrendChart } from './PropertyPriceTrendChart';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  onClose: () => void;
  onScheduleViewing: (property: Property) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currency,
  currentLang,
  onClose,
  onScheduleViewing,
  isWishlisted,
  onToggleWishlist
}) => {
  if (!property) return null;
  const isAr = currentLang === 'ar';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Fallback image array guarantee
  const allImages = property.galleryImages?.length > 0 
    ? property.galleryImages 
    : [property.coverImage];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#E5E0D8] text-[#1E1B18] my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Header Bar */}
        <div className="px-6 py-4 border-b border-[#E5E0D8] bg-[#FBF9F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C]">
              {isAr ? property.category : property.category}
            </span>
            <span aria-hidden="true" className="text-[#C28E5C]">·</span>
            <span className="text-xs text-[#736B63]">{property.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(property.id)}
              className="p-2 rounded-lg border border-[#E5E0D8] hover:border-[#C28E5C] text-[#5A534B] hover:text-[#C28E5C] transition-colors cursor-pointer"
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C28E5C] text-[#C28E5C]' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-10">
          
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#1E1B18]">
              <img
                src={allImages[activeImageIndex] || property.coverImage}
                alt={property.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white">
                {activeImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#C28E5C] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Asking Price & Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-[#E5E0D8]">
            <div className="lg:col-span-2 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#8B5E3C]">
                {isAr ? 'العمارة والتصميم الداخلي' : 'Architectural Landmark'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-editorial font-semibold text-[#1E1B18] leading-tight">
                {isAr ? property.titleAr : property.title}
              </h2>
              <p className="text-sm text-[#736B63] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C28E5C] shrink-0" />
                <span>{property.address}, {isAr ? property.cityAr : property.city}</span>
              </p>
              <p className="text-base text-[#47413A] leading-relaxed pt-2">
                {isAr ? property.descriptionAr : property.description}
              </p>
            </div>

            {/* Price & Immediate Action Box */}
            <div className="bg-[#FBF9F5] rounded-xl p-6 border border-[#E5E0D8] flex flex-col justify-between space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C]">
                  {property.listingType === 'rent' ? (isAr ? 'الإيجار الشهري' : 'Monthly Lease') : (isAr ? 'السعر التقديري' : 'Investment Value')}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-[#1E1B18] font-mono tabular-nums mt-1">
                  {formatPrice(
                    property.listingType === 'rent' && property.priceRentPerMonthUSD
                      ? property.priceRentPerMonthUSD
                      : property.priceUSD,
                    currency
                  )}
                </p>
                <p className="text-xs text-[#736B63] mt-1">
                  {isAr ? 'معاملة خاصة عبر مكتب سيينا السري' : 'Confidential direct broker transaction'}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    onScheduleViewing(property);
                  }}
                  className="w-full py-3 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isAr ? 'جدولة موعد معاينة خاصة' : 'Schedule Private Viewing'}</span>
                </button>

                <a
                  href={`tel:${property.agent.phone}`}
                  className="w-full py-2.5 bg-white border border-[#E5E0D8] hover:border-[#1E1B18] text-[#1E1B18] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C28E5C]" />
                  <span>{isAr ? 'اتصال بالمستشار الخاص' : 'Call Lead Advisor'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Architectural Key Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1E1B18]">
              {isAr ? 'المواصفات الهندسية والمعمارية' : 'Architectural Specifications'}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'غرف النوم' : 'Bedrooms'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.beds}</p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'الحمامات' : 'Bathrooms'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.baths}</p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'المساحة الداخلية' : 'Interior Area'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.sqft.toLocaleString()} sq.ft</p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'مساحة الأرض' : 'Plot Size'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.lotSqft.toLocaleString()} sq.ft</p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'سنة الإنجاز' : 'Year Built'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.yearBuilt}</p>
              </div>
              <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                <p className="text-xs text-[#736B63]">{isAr ? 'مرآب السيارات' : 'Garage'}</p>
                <p className="text-lg font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{property.garageSpaces} Vehicles</p>
              </div>
            </div>
          </div>

          {/* Architectural Notes & Philosophy */}
          {property.architecturalNotes && (
            <div className="p-6 bg-[#1E1B18] text-[#FBF9F5] rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D8B48F]">
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'ملاحظات المعماري والمواد الإنشائية' : 'Materiality & Structural Notes'}</span>
              </div>
              <p className="text-sm font-light leading-relaxed text-[#D6CEBE]">
                {isAr ? property.architecturalNotesAr : property.architecturalNotes}
              </p>
              <p className="text-xs text-[#C28E5C] font-mono pt-1">
                {isAr ? `توقيع: ${property.architectAr}` : `Design by: ${property.architect}`}
              </p>
            </div>
          )}

          {/* Amenities & Luxury Inclusions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1E1B18]">
              {isAr ? 'المزايا والتجهيزات الاستثنائية' : 'Curated Amenities & Inclusions'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(isAr ? property.amenitiesAr : property.amenities).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg border border-[#E5E0D8] bg-[#FFFFFF] text-xs font-medium text-[#47413A]">
                  <CheckCircle2 className="w-4 h-4 text-[#8B5E3C] shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Price Trends & Valuation Recharts Visualization */}
          <PropertyPriceTrendChart
            basePriceUSD={property.priceUSD}
            currency={currency}
            currentLang={currentLang}
            propertyTitle={isAr ? property.titleAr : property.title}
          />

          {/* Dedicated Advisor & Inquiry Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
            {/* Advisor profile */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C]">
                {isAr ? 'المستشار العقاري المعتمد' : 'Exclusive Portfolio Advisor'}
              </span>
              
              <div className="flex items-center gap-4">
                <img 
                  src={property.agent.avatar} 
                  alt={property.agent.name} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#C28E5C]"
                />
                <div>
                  <h4 className="font-editorial text-lg font-semibold text-[#1E1B18]">
                    {isAr ? property.agent.nameAr : property.agent.name}
                  </h4>
                  <p className="text-xs text-[#736B63]">{isAr ? property.agent.roleAr : property.agent.role}</p>
                  <p className="text-xs text-[#8B5E3C] font-mono mt-0.5">{property.agent.phone}</p>
                </div>
              </div>

              <div className="text-xs text-[#736B63] space-y-1">
                <p><strong>{isAr ? 'اللغات:' : 'Languages:'}</strong> {property.agent.languages.join(', ')}</p>
                <p><strong>{isAr ? 'البريد المباشر:' : 'Direct Mail:'}</strong> {property.agent.email}</p>
              </div>
            </div>

            {/* Direct Instant Inquiry Form */}
            <div>
              {inquirySubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                  <h4 className="font-editorial text-lg font-semibold text-emerald-900">
                    {isAr ? 'تم استلام طلبك بنجاح' : 'Inquiry Received'}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    {isAr ? 'سيتواصل معك المستشار خلال ساعتين مع ملف الإقامة السري.' : 'Our advisor will contact you within 2 hours with the private prospectus.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]">
                    {isAr ? 'إرسال استفسار مباشر وسري' : 'Confidential Direct Inquiry'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full bg-white text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full bg-white text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder={isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  />
                  <textarea
                    rows={2}
                    placeholder={isAr ? 'استفسارك أو الموعد المفضل للمعاينة...' : 'Your inquiry or specific requirements...'}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full bg-white text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                  >
                    {isAr ? 'إرسال الاستفسار' : 'Submit Private Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
