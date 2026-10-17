import React, { useState } from 'react';
import { Property, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { MapPin, Navigation, ArrowUpRight, Bed, Bath, Maximize } from 'lucide-react';

interface MapViewProps {
  properties: Property[];
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  onSelectProperty: (property: Property) => void;
}

export const ArchitecturalMapView: React.FC<MapViewProps> = ({
  properties,
  currency,
  currentLang,
  onSelectProperty
}) => {
  const isAr = currentLang === 'ar';
  const [selectedPin, setSelectedPin] = useState<Property | null>(properties[0] || null);

  // Geographic bounds simulated layout representation for high aesthetics
  // Cairo / Egypt / Mediterranean regional coordinates mapped to SVG relative space
  const getMapPosition = (lat: number, lng: number) => {
    // Normalization mapping for Egypt/Middle East luxury clusters
    // Lat range: 25 to 32, Lng range: 27 to 35
    const x = ((lng - 27.5) / (34.5 - 27.5)) * 80 + 10;
    const y = ((32.0 - lat) / (32.0 - 26.5)) * 75 + 12;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(10, Math.min(88, y))
    };
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#1E1B18] shadow-lg min-h-[520px]">
      
      {/* Map Styling / Canvas Overlay */}
      <div className="absolute inset-0 bg-[#161412] opacity-95">
        {/* Subtle architectural grid pattern */}
        <div 
          className="w-full h-full opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, #E5E0D8 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Abstract Stylized Coastline / Waterways */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          {/* Mediterranean top coast */}
          <path d="M 0,110 Q 250,90 500,120 T 1000,105 L 1000,0 L 0,0 Z" fill="#4A6B82" />
          {/* River Nile stylized curve */}
          <path d="M 520,115 Q 535,260 515,380 T 545,550" stroke="#4A6B82" strokeWidth="8" fill="none" opacity="0.6" />
          {/* Red Sea branch */}
          <path d="M 720,320 Q 780,420 840,550" stroke="#4A6B82" strokeWidth="16" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* Map Top Bar Controls */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between border-b border-[#332F2B] bg-[#1E1B18]/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-medium text-[#C28E5C] uppercase tracking-wider">
          <Navigation className="w-4 h-4" />
          <span>{isAr ? 'خريطة المواقع المعمارية الحصرية' : 'Prime Geographical Coordinates'}</span>
        </div>
        <span className="text-xs text-[#A8A196]">
          {isAr ? `${properties.length} موقع مسجل` : `${properties.length} Active Residences Mapped`}
        </span>
      </div>

      {/* Interactive Map Area with Pins */}
      <div className="relative z-10 w-full h-[460px] p-4">
        {properties.map((prop) => {
          const pos = getMapPosition(prop.coordinates.lat, prop.coordinates.lng);
          const isSelected = selectedPin?.id === prop.id;

          return (
            <div
              key={prop.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => setSelectedPin(prop)}
            >
              <div className="relative group">
                {/* Pin Head */}
                <div 
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border flex items-center gap-1.5 shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-[#C28E5C] text-white border-white scale-110 ring-4 ring-[#C28E5C]/30' 
                      : 'bg-[#2A2622] text-[#FBF9F5] border-[#4A433D] hover:border-[#C28E5C]'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span className="whitespace-nowrap font-mono tabular-nums">
                    {formatPrice(prop.priceUSD, currency)}
                  </span>
                </div>

                {/* Pulsing indicator beneath pin */}
                <div className={`w-2 h-2 mx-auto rounded-full mt-1 ${isSelected ? 'bg-[#C28E5C]' : 'bg-[#736B63]'}`} />
              </div>
            </div>
          );
        })}

        {/* Selected Property Quick Card Overlay */}
        {selectedPin && (
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-[380px] bg-[#FFFFFF] rounded-xl p-4 shadow-2xl border border-[#E5E0D8] z-30 animate-fade-in text-[#1E1B18]">
            <div className="flex gap-4">
              <img 
                src={selectedPin.coverImage} 
                alt={selectedPin.title} 
                className="w-24 h-24 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#8B5E3C]">
                  {isAr ? selectedPin.cityAr : selectedPin.city}
                </p>
                <h4 className="font-editorial text-base font-semibold text-[#1E1B18] truncate">
                  {isAr ? selectedPin.titleAr : selectedPin.title}
                </h4>
                <p className="text-sm font-semibold text-[#1E1B18] mt-1 tabular-nums">
                  {formatPrice(selectedPin.priceUSD, currency)}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#736B63] mt-1">
                  <span>{selectedPin.beds} Beds</span>
                  <span>·</span>
                  <span>{selectedPin.baths} Baths</span>
                  <span>·</span>
                  <span>{selectedPin.sqft.toLocaleString()} sq.ft</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#F2EFE9] flex items-center justify-between">
              <span className="text-[11px] text-[#8B5E3C] font-medium truncate max-w-[200px]">
                {isAr ? selectedPin.architectAr : selectedPin.architect}
              </span>
              <button
                onClick={() => onSelectProperty(selectedPin)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-[#1E1B18] hover:bg-[#C28E5C] text-white rounded transition-colors cursor-pointer"
              >
                <span>{isAr ? 'تفاصيل الإقامة' : 'View Residence'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
