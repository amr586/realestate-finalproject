import React, { useState } from 'react';
import { Property, CurrencyCode } from '../types';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Car, Shield, CheckCircle2, Sparkles, MapPin } from 'lucide-react';

interface ScheduleViewingModalProps {
  property: Property | null;
  currentLang: 'en' | 'ar';
  currency: CurrencyCode;
  onClose: () => void;
}

export const ScheduleViewingModal: React.FC<ScheduleViewingModalProps> = ({
  property,
  currentLang,
  currency,
  onClose
}) => {
  if (!property) return null;
  const isAr = currentLang === 'ar';
  const { currentUser, addBooking } = useAuth();

  const [date, setDate] = useState('2026-10-25');
  const [timeSlot, setTimeSlot] = useState('16:00 - 18:00 (Sunset Viewing)');
  const [tourType, setTourType] = useState<'in-person' | 'private-chauffeur' | 'virtual-3d'>('private-chauffeur');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    addBooking({
      propertyId: property.id,
      propertyTitle: property.title,
      fullName,
      email,
      phone,
      date,
      timeSlot,
      tourType,
      notes
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#E5E0D8] text-[#1E1B18] my-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FBF9F5] border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#C28E5C]" />
            <h3 className="font-editorial text-lg font-semibold text-[#1E1B18]">
              {isAr ? 'حجز موعد معاينة معمارية خاصة' : 'Reserve Private Architectural Viewing'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-editorial text-2xl font-semibold text-emerald-900">
              {isAr ? 'تم تأكيد حجز المعاينة بنجاح' : 'Private Viewing Confirmed'}
            </h4>
            <p className="text-xs text-[#5A534B] max-w-sm mx-auto leading-relaxed">
              {isAr
                ? `تم تسجيل موعدك لمعاينة ${property.titleAr}. سيتواصل معك مستشارك الخاص لتأكيد تصريح الدخول وترتيب سيارة الاستقبال.`
                : `Your private appointment for ${property.title} has been scheduled. Our concierge advisor will contact you to coordinate arrival protocols.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Selected Property Banner */}
            <div className="flex items-center gap-4 p-3.5 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
              <img 
                src={property.coverImage} 
                alt={property.title} 
                className="w-16 h-16 rounded-lg object-cover shrink-0" 
              />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-semibold text-[#8B5E3C] tracking-wider">{property.city}</span>
                <h4 className="font-editorial text-base font-semibold text-[#1E1B18] truncate">
                  {isAr ? property.titleAr : property.title}
                </h4>
                <p className="text-xs text-[#736B63] truncate">{property.address}</p>
              </div>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'تاريخ المعاينة' : 'Preferred Date'}
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                  {isAr ? 'الفترة الزمنية' : 'Curated Time Slot'}
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-lg border border-[#E5E0D8] focus:border-[#C28E5C] outline-none bg-white"
                >
                  <option value="10:00 - 12:00 (Morning Natural Light)">10:00 - 12:00 (Morning Natural Light)</option>
                  <option value="13:00 - 15:00 (Midday Architecture Walk)">13:00 - 15:00 (Midday Architecture Walk)</option>
                  <option value="16:00 - 18:00 (Sunset Viewing)">16:00 - 18:00 (Sunset Viewing)</option>
                  <option value="19:00 - 21:00 (Twilight Illuminations)">19:00 - 21:00 (Twilight Illuminations)</option>
                </select>
              </div>
            </div>

            {/* Tour Type */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63] mb-1.5">
                {isAr ? 'نمط المعاينة والخدمة' : 'Tour Experience Style'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'private-chauffeur', labelEn: 'Chauffeur VIP', labelAr: 'سائق خاص VIP' },
                  { id: 'in-person', labelEn: 'Direct Arrival', labelAr: 'وصول مباشر' },
                  { id: 'virtual-3d', labelEn: 'Virtual 3D', labelAr: 'جولة ثلاثية الأبعاد' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setTourType(type.id as any)}
                    className={`p-2.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer text-center ${
                      tourType === type.id
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                        : 'bg-[#FBF9F5] text-[#5A534B] border-[#E5E0D8]'
                    }`}
                  >
                    {isAr ? type.labelAr : type.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'الاسم بالكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="e.g. Tarek Mansour"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                  {isAr ? 'رقم الهاتف للتنسيق السري' : 'Phone / WhatsApp'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  placeholder="+20 100 000 0000"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                  {isAr ? 'ملاحظات خاصة (أمن، هبوط طائرة، خصوصية عائلية)' : 'Special Requests or Discretion Notes'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isAr ? 'أي متطلبات إضافية...' : 'Any security clearance or private entourage needs...'}
                  className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1E1B18] hover:bg-[#C28E5C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
            >
              {isAr ? 'تأكيد حجز المعاينة' : 'Confirm Private Tour Reservation'}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
