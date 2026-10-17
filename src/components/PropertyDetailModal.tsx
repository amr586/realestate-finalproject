import React, { useState } from 'react';
import { Property, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { 
  X, MapPin, Bed, Bath, Maximize, Calendar, ShieldCheck, 
  Phone, Mail, CheckCircle2, ChevronRight, Compass, Layers, 
  ExternalLink, Share2, Heart, Sparkles, Building2, MessageCircle, Navigation,
  FileDown, Loader2, Bell
} from 'lucide-react';
import { PropertyPriceTrendChart } from './PropertyPriceTrendChart';
import { NeighborhoodHighlights } from './NeighborhoodHighlights';
import { generatePropertyBrochurePDF } from '../utils/generateBrochurePDF';

interface PropertyDetailModalProps {
  property: Property | null;
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  onClose: () => void;
  onScheduleViewing: (property: Property) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
  currentUserEmail?: string;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  currency,
  currentLang,
  onClose,
  onScheduleViewing,
  isWishlisted,
  onToggleWishlist,
  currentUserEmail = ''
  }) => {
  if (!property) return null;
  const isAr = currentLang === 'ar';
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [alertThreshold, setAlertThreshold] = useState('');
  const [alertEmail, setAlertEmail] = useState(currentUserEmail);
  const [alertStatus, setAlertStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [alertMessage, setAlertMessage] = useState('');

  const handlePriceAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertStatus('saving');
    try {
      const response = await fetch('/api/v1/price-alerts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id, propertyTitle: property.title, propertyTitleAr: property.titleAr, propertyCoverImage: property.coverImage, propertyLocation: property.location, currentPriceUSD: property.priceUSD, thresholdPriceUSD: Number(alertThreshold), email: alertEmail, currency: 'USD' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to set alert');
      setAlertStatus('success'); setAlertMessage(isAr ? data.messageAr : data.message);
    } catch (error) { setAlertStatus('error'); setAlertMessage(error instanceof Error ? error.message : 'Unable to set alert'); }
  };
  
  // Fallback image array guarantee
  const allImages = property.galleryImages?.length > 0 
    ? property.galleryImages 
    : [property.coverImage];

  // Pre-populate WhatsApp message with property title and agent phone
  const cleanPhone = property.agent?.phone?.replace(/[^0-9]/g, '') || '201008924100';
  const prePopulatedMessage = isAr
    ? `مرحباً، أود الاستفسار عن إقامة "${property.titleAr || property.title}" المعروضة في سيينا للعقارات.`
    : `Hello, I am interested in inquiring about "${property.title}" listed in Sienna Real Estate.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(prePopulatedMessage)}`;

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownloadBrochure = async () => {
    if (!property || isGeneratingPDF) return;
    try {
      setIsGeneratingPDF(true);
      await generatePropertyBrochurePDF({
        property,
        currency,
        currentLang
      });
    } catch (error) {
      console.error('Failed to generate brochure PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
              onClick={handleDownloadBrochure}
              disabled={isGeneratingPDF}
              className="px-3 py-1.5 rounded-lg border border-[#E5E0D8] hover:border-[#C28E5C] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#8B5E3C] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={isAr ? 'تحميل الكتيب والملف المعماري للعقار بصيغة PDF' : 'Download formatted architectural PDF brochure'}
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#C28E5C]" />
              ) : (
                <FileDown className="w-4 h-4 text-[#8B5E3C]" />
              )}
              <span className="hidden sm:inline">
                {isGeneratingPDF
                  ? (isAr ? 'جاري التجهيز...' : 'Generating...')
                  : (isAr ? 'تحميل البروشور (PDF)' : 'Download Brochure')}
              </span>
            </button>

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
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  title={isAr ? 'محادثة مباشرة عبر واتساب مع المستشار مع تضمين اسم العقار تلقائياً' : 'Chat directly with agent on WhatsApp with pre-populated property title'}
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>{isAr ? 'محادثة واتساب مع المستشار' : 'Chat with Agent on WhatsApp'}</span>
                </a>

                <a
                  href={`tel:${property.agent.phone}`}
                  className="w-full py-2 bg-white border border-[#E5E0D8] hover:border-[#1E1B18] text-[#1E1B18] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#C28E5C]" />
                  <span>{isAr ? 'اتصال بالمستشار الخاص' : 'Call Lead Advisor'}</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadBrochure}
                  disabled={isGeneratingPDF}
                  className="w-full py-2.5 bg-[#FBF9F5] hover:bg-[#F2EFE9] border border-[#C28E5C] text-[#8B5E3C] hover:text-[#5c3e27] text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                  title={isAr ? 'تحميل كتيب العقار بصيغة PDF عالية الدقة' : 'Download high-resolution PDF property brochure'}
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#C28E5C]" />
                  ) : (
                    <FileDown className="w-4 h-4 text-[#8B5E3C]" />
                  )}
                  <span>
                    {isGeneratingPDF
                      ? (isAr ? 'جاري تجهيز الكتيب (PDF)...' : 'Compiling Dossier PDF...')
                      : (isAr ? 'تحميل كتيب العقار الرسمي (PDF)' : 'Download Property Brochure (PDF)')}
                  </span>
                </button>
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

          {/* Location on an Architectural Map */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#1E1B18] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C28E5C]" />
                  <span>{isAr ? 'الموقع الجغرافي وخريطة المحيط' : 'Location on Map & Enclave Geography'}</span>
                </h3>
                <p className="text-xs text-[#736B63] mt-0.5">
                  {property.address}, {isAr ? property.cityAr : property.city}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#8B5E3C] bg-[#FBF9F5] px-2.5 py-1 rounded border border-[#E5E0D8]">
                  {property.coordinates.lat.toFixed(4)}° N, {property.coordinates.lng.toFixed(4)}° E
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{isAr ? 'توجيهات الملاحة' : 'Get Directions'}</span>
                </a>
              </div>
            </div>

            {/* Architectural Cartographic Display */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#1E1B18] shadow-inner flex items-center justify-center">
              {/* Subtle architectural grid background */}
              <div 
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 50% 50%, rgba(194,142,92,0.3) 0%, transparent 60%),
                    linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: '100% 100%, 32px 32px, 32px 32px'
                }}
              />

              {/* Geographic Contour Curves */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50%" cy="50%" r="80" fill="none" stroke="#C28E5C" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="50%" cy="50%" r="130" fill="none" stroke="#C28E5C" strokeWidth="1" strokeDasharray="6 6" />
                <path d="M 0 100 Q 250 80 500 120 T 1000 90" fill="none" stroke="#E5E0D8" strokeWidth="1" />
                <path d="M 0 200 Q 300 240 600 180 T 1000 220" fill="none" stroke="#E5E0D8" strokeWidth="1" />
              </svg>

              {/* Surrounding Landmark Markers */}
              <div className="absolute top-6 left-8 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 hidden sm:block">
                📍 {isAr ? 'النادي الدبلوماسي (8 دقائق)' : 'Diplomatic Enclave (8 min)'}
              </div>
              <div className="absolute bottom-6 left-8 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 hidden sm:block">
                ✈️ {isAr ? 'المطار الدولي (20 دقيقة)' : 'Intl. Airport (20 min)'}
              </div>
              <div className="absolute top-6 right-8 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 hidden sm:block">
                ⛳ {isAr ? 'ملعب الغولف الدولي (5 دقائق)' : 'Championship Golf (5 min)'}
              </div>
              <div className="absolute bottom-6 right-8 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-white/90 border border-white/10 hidden sm:block">
                ⚓ {isAr ? 'مارينا اليخوت الخاصة (12 دقيقة)' : 'Private Yacht Marina (12 min)'}
              </div>

              {/* Pulsing Active Residence Pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-[#C28E5C]/30 animate-ping" />
                  <div className="w-10 h-10 rounded-full bg-[#C28E5C] border-2 border-white flex items-center justify-center text-white shadow-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-2 px-3 py-1 bg-white text-[#1E1B18] rounded-full shadow-lg border border-[#E5E0D8] text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{isAr ? property.titleAr : property.title}</span>
                </div>
                <span className="text-[10px] text-[#D8B48F] mt-1 font-mono">
                  {property.location}
                </span>
              </div>

              {/* Bottom Right Map Legend */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] text-white/80 border border-white/10 flex items-center gap-1.5">
                <Compass className="w-3 h-3 text-[#C28E5C]" />
                <span>WGS84 GPS True North</span>
              </div>
            </div>
          </div>

          {/* Neighborhood Highlights using Google Search Integration */}
          <NeighborhoodHighlights
            property={property}
            currentLang={currentLang}
          />

          {/* Historical Price Trends & Valuation Recharts Visualization */}
          <PropertyPriceTrendChart
            basePriceUSD={property.priceUSD}
            currency={currency}
            currentLang={currentLang}
            propertyTitle={isAr ? property.titleAr : property.title}
          />

      <form onSubmit={handlePriceAlert} className="mb-8 rounded-xl border border-[#D8B48F] bg-[#1E1B18] p-5 text-[#FBF9F5]">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-[#D8B48F]" />
          <div className="flex-1">
            <p className="text-sm font-semibold">{isAr ? 'تنبيه انخفاض السعر' : 'Set a price alert'}</p>
            <p className="mt-1 text-xs text-[#C8C0B7]">{isAr ? 'سنرسل لك بريداً إلكترونياً عندما ينخفض السعر عن الحد الذي تحدده.' : 'We&apos;ll email you when this residence drops below your target.'}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input required type="number" min="1" max={property.priceUSD - 1} value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} placeholder={isAr ? 'السعر المستهدف بالدولار' : 'Target price (USD)'} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs outline-none placeholder:text-[#A8A196] focus:border-[#D8B48F]" />
              <input required type="email" value={alertEmail} onChange={(e) => setAlertEmail(e.target.value)} placeholder="Email address" className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs outline-none placeholder:text-[#A8A196] focus:border-[#D8B48F]" />
              <button disabled={alertStatus === 'saving'} className="rounded-lg bg-[#D8B48F] px-4 py-2 text-xs font-semibold text-[#1E1B18] hover:bg-white disabled:opacity-60 cursor-pointer">{alertStatus === 'saving' ? 'Saving…' : isAr ? 'تفعيل التنبيه' : 'Activate alert'}</button>
            </div>
            {alertMessage && <p className={`mt-3 text-xs ${alertStatus === 'error' ? 'text-red-300' : 'text-emerald-300'}`}>{alertMessage}</p>}
          </div>
        </div>
      </form>

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

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                  <span>{isAr ? `محادثة واتساب: ${property.agent.nameAr || property.agent.name}` : `WhatsApp ${property.agent.name}`}</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadBrochure}
                  disabled={isGeneratingPDF}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white hover:bg-[#F2EFE9] border border-[#E5E0D8] hover:border-[#C28E5C] text-[#1E1B18] rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-60"
                  title={isAr ? 'تحميل كتيب العقار بصيغة PDF' : 'Download Brochure PDF'}
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C28E5C]" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  )}
                  <span>{isAr ? 'تحميل الكتيب (PDF)' : 'Dossier (PDF)'}</span>
                </button>
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
