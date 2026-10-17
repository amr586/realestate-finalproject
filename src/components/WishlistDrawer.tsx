import React from 'react';
import { Property, CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { X, Heart, Trash2, ArrowUpRight, Share2, FileText, Calendar } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  onRemoveFromWishlist: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onScheduleViewing: (property: Property) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  currency,
  currentLang,
  onRemoveFromWishlist,
  onSelectProperty,
  onScheduleViewing
}) => {
  if (!isOpen) return null;
  const isAr = currentLang === 'ar';

  const totalPortfolioValueUSD = savedProperties.reduce((acc, p) => acc + p.priceUSD, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fade-in flex justify-end">
      <div 
        className="relative w-full max-w-md bg-[#FFFFFF] h-full shadow-2xl border-l border-[#E5E0D8] text-[#1E1B18] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Drawer Header */}
        <div className="p-6 bg-[#FBF9F5] border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-[#C28E5C] text-[#C28E5C]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1E1B18]">
              {isAr ? 'المحفظة المحفوظة' : 'Saved Portfolio'}
            </h3>
            <span className="text-xs text-[#736B63] font-mono">({savedProperties.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portfolio Valuation Strip */}
        {savedProperties.length > 0 && (
          <div className="px-6 py-3 bg-[#1E1B18] text-white flex items-center justify-between text-xs">
            <span className="text-[#D6CEBE]">{isAr ? 'القيمة الإجمالية للمجموعة:' : 'Total Collection Value:'}</span>
            <span className="font-mono font-bold text-[#D8B48F] tabular-nums">
              {formatPrice(totalPortfolioValueUSD, currency)}
            </span>
          </div>
        )}

        {/* Items List */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {savedProperties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <Heart className="w-12 h-12 text-[#D6CEBE]" />
              <h4 className="font-editorial text-lg font-semibold text-[#1E1B18]">
                {isAr ? 'لم تحفظ أي عقارات بعد' : 'Your portfolio is empty'}
              </h4>
              <p className="text-xs text-[#736B63] max-w-xs leading-relaxed">
                {isAr
                  ? 'اضغط على رمز القلب في أي إقامة معمارية لإضافتها إلى مجموعتك الخاصة هنا.'
                  : 'Tap the heart icon on any residence to save it to your private acquisition shortlist.'}
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div 
                key={prop.id}
                className="p-3.5 rounded-xl border border-[#E5E0D8] bg-[#FBF9F5] hover:border-[#C28E5C] transition-colors flex gap-3 group relative"
              >
                <img 
                  src={prop.coverImage} 
                  alt={prop.title} 
                  className="w-20 h-20 rounded-lg object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectProperty(prop);
                  }}
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#8B5E3C]">{prop.city}</span>
                    <h5 
                      onClick={() => {
                        onClose();
                        onSelectProperty(prop);
                      }}
                      className="font-editorial text-sm font-semibold text-[#1E1B18] truncate cursor-pointer hover:text-[#C28E5C]"
                    >
                      {isAr ? prop.titleAr : prop.title}
                    </h5>
                    <p className="text-xs font-bold font-mono text-[#1E1B18] tabular-nums mt-0.5">
                      {formatPrice(prop.priceUSD, currency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onScheduleViewing(prop);
                      }}
                      className="text-[11px] font-semibold text-[#8B5E3C] hover:text-[#1E1B18] flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>{isAr ? 'حجز جولة' : 'Book Tour'}</span>
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(prop.id)}
                      className="p-1 text-[#736B63] hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {savedProperties.length > 0 && (
          <div className="p-6 bg-[#FBF9F5] border-t border-[#E5E0D8] space-y-2 shrink-0">
            <button
              onClick={() => {
                alert(isAr ? 'تم إرسال ملف المحفظة الكامل إلى بريدك الإلكتروني بصيغة PDF المشفرة!' : 'Complete confidential portfolio dossier dispatched to your verified email!');
              }}
              className="w-full py-2.5 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? 'طلب ملف المحفظة (Dossier PDF)' : 'Request Portfolio Dossier'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
