import React from 'react';
import { Sparkles, Layers, Shield, Compass, ArrowRight } from 'lucide-react';

interface ArchitecturePhilosophyProps {
  currentLang: 'en' | 'ar';
  onExplorePortfolio: () => void;
  onLaunch3D: () => void;
}

export const ArchitecturePhilosophy: React.FC<ArchitecturePhilosophyProps> = ({
  currentLang,
  onExplorePortfolio,
  onLaunch3D
}) => {
  const isAr = currentLang === 'ar';

  const principles = [
    {
      num: '01',
      titleEn: 'Tactile Roman Travertine',
      titleAr: 'أحجار الترافرتين الرومانية الطبيعية',
      descEn: 'We source monolithic blocks with natural voids and vein patterns, bringing organic warmth and thousands of years of geological dignity.',
      descAr: 'نختار كتل الترافرتين الصلبة بعروقها الطبيعية لتمنح المسكن هيبة تاريخية ودفئاً حسياً يرتقي مع مرور الزمن.'
    },
    {
      num: '02',
      titleEn: 'Kinetic Solar Architecture',
      titleAr: 'العمارة الشمسية الديناميكية',
      descEn: 'Motorized brise-soleil timber louvers and recessed colonnades naturally temper desert and Mediterranean heat while sculpting living shadows.',
      descAr: 'كواسر شمسية خشبية وأروقة غائرة تخفف حرارة الصيف بصورة طبيعية، وتحوّل أشعة الشمس إلى لوحات ظل متحركة.'
    },
    {
      num: '03',
      titleEn: 'Acoustic & Biophilic Seclusion',
      titleAr: 'العزل الصوتي والاندماج البيئي',
      descEn: 'Triple-laminated acoustic curtain walls guarantee absolute interior stillness, enveloped by courtyard gardens and running water sanctuaries.',
      descAr: 'واجهات زجاجية معزولة صوتياً تضمن سكينة مطلقة في قلب المدينة، تتناغم مع خرير المياه في الأفنية الداخلية.'
    }
  ];

  return (
    <section id="architecture" className="w-full py-16 lg:py-24 bg-[#FBF9F5] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Headline */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C28E5C]">
            {isAr ? 'فلسفة التصميم المعماري' : 'The Sienna Ethos'}
          </span>
          <h2 className="text-3xl lg:text-5xl font-editorial font-medium text-[#1E1B18] tracking-tight [text-wrap:balance]">
            {isAr
              ? 'العمارة ليست مجرد جدران، بل تجسيد للخلود والهدوء الإنساني.'
              : 'Architecture that honors permanence, silence, and sculptural balance.'}
          </h2>
          <p className="text-base text-[#736B63] font-light leading-relaxed">
            {isAr
              ? 'تتبنى سيينا معايير صارمة في اختيار وتطوير المساكن، حيث تلتقي الهندسة المعاصرة مع المواد الطبيعية النادرة.'
              : 'Every residence curated by Sienna is an uncompromising study in spatial balance, raw tactile honesty, and acoustic serenity.'}
          </p>
        </div>

        {/* 2-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Visual Showcase Card 1 */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#1E1B18] relative group min-h-[420px] flex flex-col justify-end p-8 text-white shadow-lg">
            <img 
              src="/src/assets/images/villa_minimalist_travertine_1792256411913.jpg"
              alt="Travertine Minimalist Villa"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="relative z-10 space-y-3 max-w-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D8B48F]">
                {isAr ? 'الهندسة العضوية والتضاريس' : 'Organic Topography & Materials'}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-semibold">
                {isAr ? 'تناغم الخرسانة والترافرتين مع سكون الصحراء' : 'Monolithic Concrete & Desert Reflection Pools'}
              </h3>
              <p className="text-xs text-[#D6CEBE] leading-relaxed">
                {isAr
                  ? 'مباني صُممت لتندمج بسلاسة مع سفوح التلال وأشعة الغروب الذهبية.'
                  : 'Cantilevered slabs sculpted to shade outdoor living courts while maximizing panoramic horizons.'}
              </p>
              
              <div className="pt-2">
                <button
                  onClick={onLaunch3D}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#1E1B18] hover:bg-[#C28E5C] hover:text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تجربة المجسم ثلاثي الأبعاد' : 'Launch 3D Architectural Viewer'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card 2 */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[#E5E0D8] bg-[#1E1B18] relative group min-h-[420px] flex flex-col justify-end p-8 text-white shadow-lg">
            <img 
              src="/src/assets/images/coastal_architectural_residence_1792256412673.jpg"
              alt="Coastal Architectural Residence"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            <div className="relative z-10 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D8B48F]">
                {isAr ? 'الإقامات الساحلية المعاصرة' : 'Mediterranean Coastal Sanctuary'}
              </span>
              <h3 className="font-editorial text-2xl font-semibold">
                {isAr ? 'تراسات الحجر الجيري الأبيض والمجالس الغاطسة' : 'Limestone Amphitheaters & Sunken Fire Pits'}
              </h3>
              <p className="text-xs text-[#D6CEBE] leading-relaxed">
                {isAr
                  ? 'جلسات دائرية حول موقد النار على حافة البحر مع خصوصية كاملة.'
                  : 'Cascading natural stone terraces descending directly to private azure lagoons.'}
              </p>
            </div>
          </div>

        </div>

        {/* 3 Principles Horizontal List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-[#E5E0D8]">
          {principles.map((item) => (
            <div key={item.num} className="space-y-3">
              <span className="font-editorial text-2xl font-bold text-[#8B5E3C] font-mono tabular-nums">
                {item.num}.
              </span>
              <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                {isAr ? item.titleAr : item.titleEn}
              </h4>
              <p className="text-xs text-[#5A534B] leading-relaxed">
                {isAr ? item.descAr : item.descEn}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
