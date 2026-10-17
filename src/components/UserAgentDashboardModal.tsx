import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Property, CurrencyCode, PropertyCategory, ListingType } from '../types';
import { formatPrice } from '../utils/formatters';
import { 
  X, User, Shield, Building, Plus, Trash2, Edit3, MessageSquare, 
  Calendar, CheckCircle, Clock, Send, LogOut, KeyRound, Sparkles, AlertCircle
} from 'lucide-react';

interface DashboardModalProps {
  currentLang: 'en' | 'ar';
  currency: CurrencyCode;
  onClose: () => void;
  onViewProperty: (property: Property) => void;
}

export const UserAgentDashboardModal: React.FC<DashboardModalProps> = ({
  currentLang,
  currency,
  onClose,
  onViewProperty
}) => {
  const isAr = currentLang === 'ar';
  const { 
    currentUser, 
    userRole, 
    properties, 
    inquiries, 
    bookings, 
    loginAs, 
    registerUser, 
    logout, 
    addProperty, 
    deleteProperty, 
    replyToInquiry 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'add-property' | 'inquiries' | 'bookings' | 'auth'>('overview');
  
  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'client' | 'agent'>('client');
  const [regSuccess, setRegSuccess] = useState(false);

  // Agent reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // New Property Form State
  const [newProp, setNewProp] = useState({
    title: '',
    titleAr: '',
    tagline: '',
    taglineAr: '',
    category: 'villas' as PropertyCategory,
    listingType: 'buy' as ListingType,
    priceUSD: 5000000,
    location: 'New Cairo, Al-Rehab Heights',
    locationAr: 'القاهرة الجديدة، مرتفعات الرحاب',
    city: 'Cairo',
    cityAr: 'القاهرة',
    address: 'Plot 12, Exclusive Enclave',
    beds: 5,
    baths: 6,
    sqft: 7500,
    lotSqft: 20000,
    yearBuilt: 2025,
    garageSpaces: 3,
    architect: 'Zaha Hadid Design',
    architectAr: 'زها حديد للتصميم',
    featured: true,
    coverImage: '/src/assets/images/hero_sienna_luxury_villa_1792256412232.jpg',
    description: 'An architectural sculpture boasting travertine terraces and subterranean wellness amenities.',
    descriptionAr: 'منحوتة معمارية تضم تراسات من الترافرتين ومرافق عافية متكاملة تحت الأرض.',
    amenities: ['Private Spa', 'Infinity Pool', 'Smart Automation', 'Wine Cellar'],
    amenitiesAr: ['سبا خاص', 'مسبح إنفينيتي', 'تحكم ذكي', 'سرداب مقتنيات']
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    registerUser(regName, regEmail, regRole, regPhone);
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setActiveTab('overview');
    }, 1200);
  };

  const handleAddPropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProperty({
      ...newProp,
      galleryImages: [newProp.coverImage],
      coordinates: { lat: 30.015, lng: 31.428 }
    });
    alert(isAr ? 'تمت إضافة الإقامة بنجاح إلى المحفظة العقارية!' : 'Residence added successfully to active portfolio!');
    setActiveTab('overview');
  };

  const handleSendReply = (inqId: string) => {
    const text = replyTextMap[inqId];
    if (!text) return;
    replyToInquiry(inqId, text);
    setReplyTextMap(prev => ({ ...prev, [inqId]: '' }));
  };

  const isAgent = userRole === 'agent';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl border border-[#E5E0D8] text-[#1E1B18] my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#FBF9F5] border-b border-[#E5E0D8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isAgent ? 'bg-[#8B5E3C] text-white' : 'bg-[#1E1B18] text-[#FBF9F5]'}`}>
              {isAgent ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-lg font-semibold text-[#1E1B18]">
                  {currentUser ? (isAr ? currentUser.nameAr || currentUser.name : currentUser.name) : (isAr ? 'بوابة إدارة الأعضاء والوسطاء' : 'Member & Advisor Portal')}
                </h3>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                  isAgent ? 'bg-[#8B5E3C]/10 text-[#8B5E3C]' : 'bg-slate-100 text-slate-700'
                }`}>
                  {isAgent ? (isAr ? 'وسيط معتمد' : 'Licensed Advisor') : (isAr ? 'عميل خاص' : 'Private Collector')}
                </span>
              </div>
              <p className="text-xs text-[#736B63]">
                {currentUser?.email || 'sienna-residences.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Role Switcher for instant testing */}
            <div className="hidden sm:flex items-center gap-1 bg-[#F2EFE9] p-1 rounded-lg border border-[#E5E0D8] text-xs">
              <button
                onClick={() => loginAs('client')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'client' ? 'bg-white font-semibold text-[#1E1B18] shadow-sm' : 'text-[#736B63]'
                }`}
              >
                {isAr ? 'عميل' : 'Client Mode'}
              </button>
              <button
                onClick={() => loginAs('agent')}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  userRole === 'agent' ? 'bg-[#8B5E3C] text-white font-semibold shadow-sm' : 'text-[#736B63]'
                }`}
              >
                {isAr ? 'وسيط' : 'Agent Mode'}
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-[#E5E0D8] hover:bg-[#F2EFE9] text-[#5A534B] hover:text-[#1E1B18] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#E5E0D8] bg-[#FFFFFF] flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#C28E5C] text-[#C28E5C]'
                : 'border-transparent text-[#736B63] hover:text-[#1E1B18]'
            }`}
          >
            {isAr ? 'نظرة عامة' : 'Dashboard Overview'}
          </button>

          {isAgent && (
            <button
              onClick={() => setActiveTab('add-property')}
              className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'add-property'
                  ? 'border-[#C28E5C] text-[#C28E5C]'
                  : 'border-transparent text-[#736B63] hover:text-[#1E1B18]'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAr ? 'إدراج إقامة جديدة' : 'Add New Residence'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-[#C28E5C] text-[#C28E5C]'
                : 'border-transparent text-[#736B63] hover:text-[#1E1B18]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isAr ? `الاستفسارات (${inquiries.length})` : `Inquiries (${inquiries.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'border-[#C28E5C] text-[#C28E5C]'
                : 'border-transparent text-[#736B63] hover:text-[#1E1B18]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isAr ? `المعاينات (${bookings.length})` : `Tours & Bookings (${bookings.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('auth')}
            className={`py-3 px-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'auth'
                ? 'border-[#C28E5C] text-[#C28E5C]'
                : 'border-transparent text-[#736B63] hover:text-[#1E1B18]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل حساب جديد' : 'Register / Accounts'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                  <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'الإقامات المسجلة' : 'Listed Properties'}</p>
                  <p className="text-2xl font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{properties.length}</p>
                </div>
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                  <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'استفسارات العملاء' : 'Active Inquiries'}</p>
                  <p className="text-2xl font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{inquiries.length}</p>
                </div>
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                  <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'معاينات مجدولة' : 'Confirmed Tours'}</p>
                  <p className="text-2xl font-bold text-[#1E1B18] font-mono tabular-nums mt-1">{bookings.length}</p>
                </div>
                <div className="p-4 bg-[#FBF9F5] rounded-xl border border-[#E5E0D8]">
                  <p className="text-xs text-[#736B63] uppercase tracking-wider">{isAr ? 'حالة الحساب' : 'Account Status'}</p>
                  <p className="text-sm font-bold text-emerald-700 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{isAr ? 'موثق ومعتمد' : 'Verified VIP'}</span>
                  </p>
                </div>
              </div>

              {/* Listed Properties Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                    {isAgent ? (isAr ? 'إدارة العقارات المعروضة للوسيط' : 'Manage Listed Residences') : (isAr ? 'المعروضات المتاحة لك' : 'Portfolio Catalog')}
                  </h4>
                  {isAgent && (
                    <button
                      onClick={() => setActiveTab('add-property')}
                      className="px-3 py-1.5 bg-[#1E1B18] hover:bg-[#8B5E3C] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة عقار جديد' : 'New Listing'}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {properties.map((prop) => (
                    <div 
                      key={prop.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-[#E5E0D8] hover:border-[#C28E5C] transition-all gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={prop.coverImage} 
                          alt={prop.title} 
                          className="w-16 h-16 rounded-lg object-cover shrink-0" 
                        />
                        <div>
                          <p className="text-[10px] font-semibold text-[#8B5E3C] uppercase">{prop.city} · {prop.category}</p>
                          <h5 className="font-editorial text-base font-semibold text-[#1E1B18]">{prop.title}</h5>
                          <p className="text-xs font-bold text-[#1E1B18] font-mono tabular-nums">{formatPrice(prop.priceUSD, currency)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onViewProperty(prop);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-[#1E1B18] bg-[#F2EFE9] hover:bg-[#E5E0D8] rounded transition-colors cursor-pointer"
                        >
                          {isAr ? 'عرض' : 'Inspect'}
                        </button>

                        {isAgent && (
                          <button
                            onClick={() => {
                              if (confirm(isAr ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Are you sure you want to delete this listing?')) {
                                deleteProperty(prop.id);
                              }
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Delete property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ADD PROPERTY (AGENT ONLY) */}
          {activeTab === 'add-property' && (
            <form onSubmit={handleAddPropertySubmit} className="space-y-6">
              <div className="space-y-1">
                <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                  {isAr ? 'إدراج تحفة معمارية جديدة في محفظة سيينا' : 'List a New Architectural Masterpiece'}
                </h4>
                <p className="text-xs text-[#736B63]">
                  {isAr ? 'أدخل البيانات المعمارية والمواصفات وسيتم نشرها فوراً في الواجهة وقاعدة البيانات.' : 'Fill in architectural specifications to publish immediately to the live catalog & database.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">Residence Title (English)</label>
                  <input
                    type="text"
                    required
                    value={newProp.title}
                    onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="The Obsidian Pavilion"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">اسم العقار (بالعربية)</label>
                  <input
                    type="text"
                    required
                    value={newProp.titleAr}
                    onChange={(e) => setNewProp({ ...newProp, titleAr: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="قصر الأوبسيديان المعماري"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">Typology / Category</label>
                  <select
                    value={newProp.category}
                    onChange={(e) => setNewProp({ ...newProp, category: e.target.value as PropertyCategory })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none bg-white"
                  >
                    <option value="villas">Signature Villa</option>
                    <option value="penthouses">Sky Penthouse</option>
                    <option value="coastal">Coastal Estate</option>
                    <option value="mansions">Historic Mansion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    required
                    value={newProp.priceUSD}
                    onChange={(e) => setNewProp({ ...newProp, priceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">Location / District</label>
                  <input
                    type="text"
                    required
                    value={newProp.location}
                    onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newProp.city}
                    onChange={(e) => setNewProp({ ...newProp, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A534B] mb-1">Beds</label>
                    <input
                      type="number"
                      value={newProp.beds}
                      onChange={(e) => setNewProp({ ...newProp, beds: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs px-2 py-2 rounded border border-[#E5E0D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A534B] mb-1">Baths</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newProp.baths}
                      onChange={(e) => setNewProp({ ...newProp, baths: parseFloat(e.target.value) || 1 })}
                      className="w-full text-xs px-2 py-2 rounded border border-[#E5E0D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5A534B] mb-1">Sq.Ft</label>
                    <input
                      type="number"
                      value={newProp.sqft}
                      onChange={(e) => setNewProp({ ...newProp, sqft: parseInt(e.target.value) || 1000 })}
                      className="w-full text-xs px-2 py-2 rounded border border-[#E5E0D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">Lead Architect</label>
                  <input
                    type="text"
                    value={newProp.architect}
                    onChange={(e) => setNewProp({ ...newProp, architect: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A534B] mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={newProp.coverImage}
                  onChange={(e) => setNewProp({ ...newProp, coverImage: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5A534B] mb-1">Architectural Description</label>
                <textarea
                  rows={3}
                  value={newProp.description}
                  onChange={(e) => setNewProp({ ...newProp, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1B18] hover:bg-[#8B5E3C] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
              >
                {isAr ? 'نشر الإقامة فوراً' : 'Publish Residence to Portfolio'}
              </button>
            </form>
          )}

          {/* TAB 3: INQUIRIES INBOX */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                  {isAr ? 'صندوق استفسارات العملاء والردود' : 'Client Inquiries & Prospectus Requests'}
                </h4>
                <span className="text-xs text-[#736B63]">{inquiries.length} total</span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center text-[#736B63] border border-dashed rounded-xl">
                  {isAr ? 'لا توجد استفسارات جديدة حالياً.' : 'No active inquiries at this moment.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      className="p-5 rounded-xl border border-[#E5E0D8] bg-[#FBF9F5] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#8B5E3C] tracking-wider">
                            {inq.propertyTitle}
                          </span>
                          <h5 className="font-bold text-sm text-[#1E1B18]">{inq.fullName}</h5>
                          <p className="text-xs text-[#736B63]">{inq.email} · {inq.phone}</p>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          inq.status === 'replied' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {inq.status}
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-[#E5E0D8] text-xs text-[#47413A] italic">
                        "{inq.message}"
                      </div>

                      {inq.replyMessage && (
                        <div className="p-3 bg-[#EFECE6] rounded-lg border border-[#DCD5C9] text-xs text-[#1E1B18]">
                          <strong className="text-[#8B5E3C]">{isAr ? 'رد المستشار:' : 'Advisor Response:'}</strong> {inq.replyMessage}
                        </div>
                      )}

                      {/* Agent Response Box */}
                      {isAgent && (
                        <div className="pt-2 flex gap-2">
                          <input
                            type="text"
                            placeholder={isAr ? 'اكتب رداً رسمياً على العميل...' : 'Type advisor response to send to client...'}
                            value={replyTextMap[inq.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [inq.id]: e.target.value })}
                            className="flex-1 text-xs px-3 py-2 bg-white rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                          />
                          <button
                            onClick={() => handleSendReply(inq.id)}
                            className="px-4 py-2 bg-[#8B5E3C] hover:bg-[#1E1B18] text-white text-xs font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isAr ? 'رد' : 'Reply'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BOOKINGS / TOURS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h4 className="font-editorial text-xl font-semibold text-[#1E1B18]">
                {isAr ? 'جدول مواعيد المعاينات الخاصة' : 'Private Viewing Appointments'}
              </h4>

              <div className="space-y-3">
                {bookings.map((bk) => (
                  <div key={bk.id} className="p-4 bg-white rounded-xl border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-semibold text-[#8B5E3C]">{bk.tourType}</p>
                      <h5 className="font-editorial text-base font-semibold text-[#1E1B18]">{bk.propertyTitle}</h5>
                      <p className="text-xs text-[#736B63]">
                        {bk.fullName} ({bk.email} · {bk.phone})
                      </p>
                      {bk.notes && <p className="text-xs text-[#5A534B] italic">Note: {bk.notes}</p>}
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <p className="text-xs font-bold text-[#1E1B18]">{bk.date}</p>
                      <p className="text-xs text-[#8B5E3C]">{bk.timeSlot}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {bk.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REGISTER / SWITCH ACCOUNTS */}
          {activeTab === 'auth' && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h4 className="font-editorial text-2xl font-semibold text-[#1E1B18]">
                  {isAr ? 'تسجيل عضو جديد أو وسيط معتمد' : 'Create Member or Advisor Account'}
                </h4>
                <p className="text-xs text-[#736B63]">
                  {isAr ? 'انضم إلى شبكة سيينا الحصرية للعقارات الفاخرة.' : 'Join the exclusive Sienna private estate network.'}
                </p>
              </div>

              {regSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs rounded text-center">
                  {isAr ? 'تم إنشاء الحساب بنجاح! جاري تحويلك...' : 'Account registered successfully! Redirecting...'}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="e.g. Mariam Mansour"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="name@domain.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded border border-[#E5E0D8] focus:border-[#C28E5C] outline-none"
                    placeholder="+20 100 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5A534B] mb-1">
                    {isAr ? 'نوع الحساب' : 'Account Type'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegRole('client')}
                      className={`p-2.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        regRole === 'client' ? 'bg-[#1E1B18] text-white border-[#1E1B18]' : 'bg-white text-[#5A534B] border-[#E5E0D8]'
                      }`}
                    >
                      {isAr ? 'عميل خاص (Collector)' : 'Private Client'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('agent')}
                      className={`p-2.5 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        regRole === 'agent' ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]' : 'bg-white text-[#5A534B] border-[#E5E0D8]'
                      }`}
                    >
                      {isAr ? 'وسيط معتمد (Advisor)' : 'Licensed Broker'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1E1B18] hover:bg-[#8B5E3C] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer"
                >
                  {isAr ? 'إنشاء الحساب' : 'Register Account'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
