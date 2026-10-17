import React from 'react';
import { Database, Shield, Heart, ArrowUp } from 'lucide-react';
import { LuxuryMarketInsightsNewsletter } from './LuxuryMarketInsightsNewsletter';

interface FooterProps {
  currentLang: 'en' | 'ar';
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenPortal
}) => {
  const isAr = currentLang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#181614] text-[#FBF9F5] border-t border-[#332F2B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* Luxury Market Insights Newsletter Component */}
        <LuxuryMarketInsightsNewsletter currentLang={currentLang} />

        {/* Top Grid: Brand & Global Enclaves */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#2E2A26]">
          
          {/* Brand lockup */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block text-2xl font-editorial tracking-[0.25em] font-semibold text-white uppercase">
              SIENNA <span className="text-xs text-[#C28E5C] font-sans">Estates</span>
            </a>
            <p className="text-xs text-[#A8A196] max-w-sm leading-relaxed font-light">
              {isAr
                ? 'دار وساطة عقارية واستشارات معمارية متخصصة في الإقامات الأيقونية والقصور النادرة في مصر والعالم.'
                : 'Boutique architectural estate brokerage representing museum-grade residences and confidential acquisitions across prime global territories.'}
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenPortal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2A2622] hover:bg-[#8B5E3C] text-[#D6CEBE] hover:text-white rounded text-xs transition-colors cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isAr ? 'بوابة الوسطاء' : 'Advisor Portal'}</span>
              </button>
            </div>
          </div>

          {/* Discreet Global Offices */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D8B48F]">
              {isAr ? 'مكتب القاهرة' : 'Cairo Enclave'}
            </p>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              Katameya Heights, Road 90 South<br />
              New Cairo, Egypt<br />
              +20 2 2813 4900
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D8B48F]">
              {isAr ? 'مكتب دبي' : 'Dubai Private Office'}
            </p>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              Gate Precinct 4, Level 7<br />
              DIFC, Dubai, UAE<br />
              +971 4 820 9300
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#D8B48F]">
              {isAr ? 'مكتب لندن' : 'London Mayfair'}
            </p>
            <p className="text-xs text-[#A8A196] leading-relaxed">
              18 Berkeley Square<br />
              Mayfair, London W1J 6BD<br />
              +44 20 7946 0192
            </p>
          </div>

        </div>

        {/* Bottom row: Legal & Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736B63]">
          <p>© {new Date().getFullYear()} SIENNA Real Estate Group. All rights reserved. Confidential client discretion guaranteed.</p>
          
          <div className="flex items-center gap-6">
            <a href="#residences" className="hover:text-white transition-colors">{isAr ? 'المعروضات' : 'Residences'}</a>
            <a href="#architecture" className="hover:text-white transition-colors">{isAr ? 'الفلسفة المعمارية' : 'Architecture'}</a>
            <a href="#calculator" className="hover:text-white transition-colors">{isAr ? 'التمويل' : 'Mortgage'}</a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>{isAr ? 'الأعلى' : 'Top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
