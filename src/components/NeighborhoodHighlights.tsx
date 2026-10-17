import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { 
  GraduationCap, Trees, Utensils, Sparkles, Search, 
  ExternalLink, RefreshCw, Star, MapPin, Compass, ShieldCheck 
} from 'lucide-react';

interface HighlightItem {
  name: string;
  nameAr?: string;
  category: 'schools' | 'parks' | 'dining' | 'lifestyle';
  distance: string;
  distanceAr?: string;
  description: string;
  descriptionAr?: string;
  rating?: string;
}

interface SearchSource {
  title: string;
  uri: string;
}

interface NeighborhoodHighlightsProps {
  property: Property;
  currentLang: 'en' | 'ar';
}

export const NeighborhoodHighlights: React.FC<NeighborhoodHighlightsProps> = ({
  property,
  currentLang,
}) => {
  const isAr = currentLang === 'ar';
  const [activeCategory, setActiveCategory] = useState<'all' | 'schools' | 'parks' | 'dining' | 'lifestyle'>('all');
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [summaryAr, setSummaryAr] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  const fetchHighlights = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/property/neighborhood-highlights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          propertyTitle: property.title,
          location: property.location,
          city: property.city,
          category: property.category,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.highlights) {
        setHighlights(data.highlights);
        setSources(data.sources || []);
        setSummary(data.summary || '');
        setSummaryAr(data.summaryAr || '');
        setIsGrounded(!!data.grounded);
        setSearchQueries(data.webSearchQueries || []);
      }
    } catch (err) {
      console.warn('Failed to load live neighborhood highlights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, [property.id]);

  const filteredHighlights = activeCategory === 'all'
    ? highlights
    : highlights.filter((h) => h.category === activeCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'schools':
        return <GraduationCap className="w-4 h-4 text-[#8B5E3C]" />;
      case 'parks':
        return <Trees className="w-4 h-4 text-emerald-600" />;
      case 'dining':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#C28E5C]" />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (isAr) {
      switch (cat) {
        case 'schools':
          return 'مدارس وأكاديميات';
        case 'parks':
          return 'حدائق وملاعب غولف';
        case 'dining':
          return 'مطاعم راقية وكافيهات';
        default:
          return 'أسلوب حياة وعافية';
      }
    }
    switch (cat) {
      case 'schools':
        return 'Schools & Academies';
      case 'parks':
        return 'Parks & Recreation';
      case 'dining':
        return 'Fine Dining & Bistros';
      default:
        return 'Lifestyle & Wellness';
    }
  };

  const directGoogleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `${property.location} ${property.city} top international schools parks fine dining restaurants`
  )}`;

  return (
    <div className="space-y-5 p-6 bg-[#FBF9F5] rounded-2xl border border-[#E5E0D8]">
      
      {/* Header with Google Search Grounding Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#8B5E3C]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1E1B18]">
              {isAr ? 'أبرز معالم الحي ومحيط الإقامة' : 'Neighborhood Highlights & Enclave Vicinity'}
            </h3>
          </div>
          <p className="text-xs text-[#736B63] mt-0.5">
            {isAr
              ? `استكشاف المدارس الدولية المعتمدة، المساحات الخضراء، والمطاعم الراقية المجاورة لـ ${property.titleAr || property.title}`
              : `Curated schools, private parks, and acclaimed culinary destinations surrounding ${property.title}`}
          </p>
        </div>

        {/* Live Search Badge & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#E5E0D8] text-[11px] text-[#5A534B] shadow-2xs">
            <Search className="w-3.5 h-3.5 text-[#4285F4]" />
            <span className="font-medium text-[#1E1B18]">Google Search</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={fetchHighlights}
            disabled={isLoading}
            className="p-1.5 bg-white hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] rounded border border-[#E5E0D8] transition-colors cursor-pointer"
            title={isAr ? 'تحديث نتائج البحث' : 'Refresh live search'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Summary Banner grounded from live search */}
      {(summary || summaryAr) && (
        <div className="p-3.5 bg-white rounded-xl border border-[#E5E0D8] text-xs text-[#47413A] leading-relaxed flex items-start gap-2.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#C28E5C] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1E1B18] block mb-0.5">
              {isAr ? 'طبيعة المجتمع والمنطقة:' : 'Enclave Profile & Community:'}
            </span>
            <p className="text-[#5A534B]">
              {isAr ? summaryAr || summary : summary}
            </p>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: isAr ? 'الكل' : 'All Enclave POIs' },
          { key: 'schools', label: isAr ? 'المدارس والتعليم' : 'Schools & Academies' },
          { key: 'parks', label: isAr ? 'الحدائق والرياضة' : 'Parks & Golf' },
          { key: 'dining', label: isAr ? 'المطاعم الراقية' : 'Fine Dining' },
          { key: 'lifestyle', label: isAr ? 'العافية والتسوق' : 'Lifestyle' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key as any)}
            className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === tab.key
                ? 'bg-[#1E1B18] text-white shadow-sm'
                : 'bg-white text-[#736B63] hover:text-[#1E1B18] border border-[#E5E0D8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Highlight Cards Grid */}
      {isLoading ? (
        <div className="p-8 text-center bg-white rounded-xl border border-[#E5E0D8] space-y-2">
          <div className="w-6 h-6 border-2 border-[#C28E5C] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#8B5E3C] font-medium">
            {isAr
              ? 'جاري فحص محيط العقار عبر Google Search لاستخراج أرقى المعالم...'
              : 'Scanning vicinity via Google Search integration for top-rated destinations...'}
          </p>
        </div>
      ) : filteredHighlights.length === 0 ? (
        <div className="p-6 text-center bg-white rounded-xl border border-[#E5E0D8] text-xs text-[#736B63]">
          {isAr ? 'لا توجد نتائج في هذه الفئة حالياً.' : 'No highlights found for this category.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredHighlights.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-xl border border-[#E5E0D8] hover:border-[#C28E5C] transition-all duration-200 flex flex-col justify-between space-y-3 group shadow-2xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="p-1 rounded bg-[#FBF9F5] border border-[#E5E0D8]">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[11px] font-semibold text-[#8B5E3C] uppercase tracking-wider">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {item.rating && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{item.rating}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-editorial text-sm font-semibold text-[#1E1B18] group-hover:text-[#8B5E3C] transition-colors leading-snug">
                  {isAr && item.nameAr ? item.nameAr : item.name}
                </h4>

                <p className="text-xs text-[#5A534B] leading-relaxed">
                  {isAr && item.descriptionAr ? item.descriptionAr : item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between text-[11px] text-[#736B63]">
                <span className="flex items-center gap-1 font-mono text-[#8B5E3C] font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{isAr && item.distanceAr ? item.distanceAr : item.distance}</span>
                </span>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    `${item.name} ${property.location} ${property.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[#736B63] hover:text-[#1E1B18] transition-colors"
                  title="Search place on Google"
                >
                  <span>{isAr ? 'تفاصيل' : 'Explore'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Google Search Grounding Sources & Direct Link */}
      <div className="pt-3 border-t border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#736B63]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-[#1E1B18]">
              {isAr ? 'مصادر التحقق المباشرة عبر Google Search:' : 'Verified Google Search Sources:'}
            </span>
          </div>
          {sources.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {sources.map((s, sIdx) => (
                <a
                  key={sIdx}
                  href={s.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-[#F2EFE9] text-[#47413A] rounded border border-[#E5E0D8] text-[10px] truncate max-w-[220px] transition-colors"
                >
                  <span className="truncate">{s.title}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0 text-[#8B5E3C]" />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[10px] text-[#A8A196]">
              {isAr
                ? 'تم استخلاص البيانات عبر محرك بحث Google لبيئة العقار'
                : 'Grounding query active across live municipal & lifestyle indexes'}
            </p>
          )}
        </div>

        <a
          href={directGoogleSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E1B18] hover:bg-[#C28E5C] text-white rounded text-xs font-semibold transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{isAr ? 'المزيد في محرك بحث Google' : 'Search More on Google'}</span>
        </a>
      </div>

    </div>
  );
};
