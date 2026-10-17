import React, { useState } from 'react';
import { Heart, Globe, BookmarkCheck, PhoneCall } from 'lucide-react';
import { CurrencyCode } from '../types';

interface HeaderProps {
  currentLang: 'en' | 'ar';
  onToggleLang: () => void;
  currency: CurrencyCode;
  onSelectCurrency: (c: CurrencyCode) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenScheduleViewing: () => void;
  onOpenDotNetBackend: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  currency,
  onSelectCurrency,
  wishlistCount,
  onOpenWishlist,
  onOpenScheduleViewing,
  onOpenDotNetBackend
}) => {
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const isAr = currentLang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FBF9F5]/90 backdrop-blur-md border-b border-subtle transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <a 
          href="#" 
          className="group flex items-baseline gap-2 text-2xl font-editorial tracking-[0.2em] font-semibold text-[#1E1B18] uppercase whitespace-nowrap shrink-0 hover:text-[#C28E5C] transition-colors"
        >
          <span>SIENNA</span>
          <span className="text-[10px] tracking-widest font-sans font-medium text-[#C28E5C] uppercase">Estates</span>
        </a>

        {/* Zone 2: 4–5 Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#5A534B]">
          <a 
            href="#residences" 
            className="hover:text-[#1E1B18] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E1B18]"
          >
            {isAr ? 'المعروضات العقارية' : 'Residences'}
          </a>
          <a 
            href="#architecture" 
            className="hover:text-[#1E1B18] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E1B18]"
          >
            {isAr ? 'الفلسفة المعمارية' : 'Architecture'}
          </a>
          <a 
            href="#calculator" 
            className="hover:text-[#1E1B18] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E1B18]"
          >
            {isAr ? 'حاسبة التمويل' : 'Mortgage'}
          </a>
          <a 
            href="#agents" 
            className="hover:text-[#1E1B18] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#1E1B18]"
          >
            {isAr ? 'المستشارون' : 'Advisors'}
          </a>

        </nav>

        {/* Zone 3: Primary Actions & Utilities */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="px-2.5 py-1 text-xs font-medium text-[#5A534B] hover:text-[#1E1B18] border border-[#E5E0D8] rounded hover:border-[#C28E5C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Change Currency"
            >
              {currency}
            </button>
            {currencyMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-[#FFFFFF] shadow-lg border border-[#E5E0D8] rounded py-1 z-50">
                {(['USD', 'EGP', 'AED'] as CurrencyCode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCurrency(c);
                      setCurrencyMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-[#FBF9F5] ${
                      currency === c ? 'font-bold text-[#C28E5C]' : 'text-[#5A534B]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#5A534B] hover:text-[#1E1B18] border border-[#E5E0D8] rounded hover:border-[#C28E5C] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
            title="Saved Residences"
            aria-label="Saved Residences"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-[#C28E5C] text-[#C28E5C]' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#1E1B18] text-[#FBF9F5] rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenScheduleViewing}
            className="px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-[#FBF9F5] bg-[#1E1B18] hover:bg-[#C28E5C] rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            {isAr ? 'حجز معاينة خاصة' : 'Book a Viewing'}
          </button>
        </div>

      </div>
    </header>
  );
};
