import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle2, Sparkles, FileText, 
  ShieldCheck, Lock, Users, ArrowRight 
} from 'lucide-react';

interface NewsletterProps {
  currentLang: 'en' | 'ar';
}

interface NewsletterStats {
  subscriberCount: number;
  latestIssues: {
    month: string;
    monthAr: string;
    title: string;
    titleAr: string;
    pages: number;
  }[];
}

export const LuxuryMarketInsightsNewsletter: React.FC<NewsletterProps> = ({ currentLang }) => {
  const isAr = currentLang === 'ar';
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'architectural-trends',
    'off-market-prospectus'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'already' | 'error'>('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [stats, setStats] = useState<NewsletterStats>({
    subscriberCount: 1430,
    latestIssues: [
      {
        month: 'October 2026',
        monthAr: 'أكتوبر 2026',
        title: 'Travertine Monoliths & Subterranean Wellness Pavilions',
        titleAr: 'عمارة الترافرتين المتجانسة وأجنحة العافية تحت الأرض',
        pages: 28,
      }
    ]
  });

  // Fetch stats on mount
  useEffect(() => {
    fetch('/api/newsletter/stats')
      .then(res => res.json())
      .then(data => {
        if (data.subscriberCount) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setStatus('idle');
    setFeedbackMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          preferences: selectedTopics
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      if (data.alreadySubscribed) {
        setStatus('already');
        setFeedbackMessage(isAr ? data.messageAr : data.message);
      } else {
        setStatus('success');
        setFeedbackMessage(isAr ? data.messageAr : data.message);
        if (data.subscriberCount) {
          setStats(prev => ({ ...prev, subscriberCount: data.subscriberCount }));
        }
      }
    } catch (err: any) {
      setStatus('error');
      setFeedbackMessage(
        err?.message || (isAr ? 'عذراً، حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.' : 'Unable to complete subscription. Please try again.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const topics = [
    {
      id: 'architectural-trends',
      label: isAr ? 'الاتجاهات المعمارية الفاخرة' : 'Architectural Trends & Materials',
      desc: isAr ? 'تقارير المواد النادرة والتصميم البيوفيلي' : 'Travertine, charred cedar & bioclimatic glass'
    },
    {
      id: 'off-market-prospectus',
      label: isAr ? 'فرص وإعلانات خاصة سرية' : 'Off-Market Private Acquisitions',
      desc: isAr ? 'إقامات أيقونية قبل إعلانها بالسوق' : 'Discreet collector transactions & prime estates'
    },
    {
      id: 'yield-reports',
      label: isAr ? 'مؤشرات العائد ورأس المال' : 'Quarterly Capital Growth Indexes',
      desc: isAr ? 'تحليلات صفقات القاهرة الجديدة والساحل ودبي' : 'Comparative yield metrics across prime enclaves'
    }
  ];

  return (
    <div className="relative rounded-2xl bg-[#1F1C19] border border-[#3A3530] p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
      
      {/* Background Architectural Accent Lines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(194,142,92,0.4) 0%, transparent 60%),
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Intelligence Header & Dossier Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#C28E5C]/15 text-[#D8B48F] text-[10px] font-semibold uppercase tracking-widest border border-[#C28E5C]/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C28E5C]" />
              <span>{isAr ? 'نشرة سيينا الاستشارية الخاصة' : 'Sienna Private Dispatch'}</span>
            </span>

            <span className="text-xs text-[#A8A196] flex items-center gap-1 font-mono">
              <Users className="w-3.5 h-3.5 text-[#C28E5C]" />
              <span>{stats.subscriberCount.toLocaleString()} {isAr ? 'عضو مسجل' : 'Subscribers'}</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-3xl font-editorial font-semibold text-[#FBF9F5] leading-tight">
            {isAr 
              ? 'رؤى السوق الفاخر والاتجاهات المعمارية الشهرية' 
              : 'Luxury Market Insights & Architectural Trends'}
          </h3>

          <p className="text-xs sm:text-sm text-[#A8A196] max-w-xl leading-relaxed font-light">
            {isAr
              ? 'انضم إلى نخبة المستثمرين والمهندسين المعماريين لتلقي ملف سيينا الشهري السري: تغطية شاملة لابتكارات مواد البناء المستدامة، صفقات القصور غير المعلنة، ومؤشرات العائد الاستثماري عبر القاهرة، الساحل الشمالي، ودبي.'
              : 'A curated monthly intelligence briefing dispatched to private wealth collectors and architects. Gain confidential analysis of off-market acquisitions, material monographs (travertine, cedar, acoustic glass), and capital appreciation forecasts.'}
          </p>

          {/* Current Issue Monograph Callout */}
          {stats.latestIssues?.[0] && (
            <div className="p-3 bg-[#282420] rounded-xl border border-[#3E3832] flex items-center justify-between gap-3 max-w-lg">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded bg-[#181614] text-[#C28E5C] shrink-0 border border-[#3A3530]">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-[10px] font-semibold text-[#C28E5C] uppercase tracking-wider block">
                    {isAr ? `إصدار ${stats.latestIssues[0].monthAr}` : `Current Dossier: ${stats.latestIssues[0].month}`}
                  </span>
                  <p className="text-xs text-[#E6E1D8] font-editorial truncate">
                    {isAr ? stats.latestIssues[0].titleAr : stats.latestIssues[0].title}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[#A8A196] shrink-0 px-2 py-0.5 rounded bg-[#1E1B18] border border-white/5">
                {stats.latestIssues[0].pages} {isAr ? 'صفحة' : 'Pages'}
              </span>
            </div>
          )}

          {/* Topic Checkboxes */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#D8B48F] block">
              {isAr ? 'الموضوعات والملفات المشمولة:' : 'Curated Research Streams:'}
            </span>
            <div className="flex flex-wrap gap-2">
              {topics.map(topic => {
                const isChecked = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isChecked 
                        ? 'bg-[#C28E5C]/20 border-[#C28E5C] text-white shadow-2xs' 
                        : 'bg-[#282420] border-[#3E3832] text-[#A8A196] hover:text-white'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-[#C28E5C]' : 'bg-[#736B63]'}`} />
                    <span className="font-medium">{topic.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Form */}
        <div className="lg:col-span-5 bg-[#26221E] rounded-xl p-6 border border-[#3E3832] space-y-4 shadow-lg">
          <div>
            <h4 className="font-editorial text-lg font-semibold text-white">
              {isAr ? 'طلب اشتراك في النشرة الشهرية' : 'Request Dossier Subscription'}
            </h4>
            <p className="text-xs text-[#A8A196] mt-0.5">
              {isAr ? 'يتم حفظ بريدك في خادم سيينا لإرسال الملفات مطلع كل شهر.' : 'Stored securely on our dedicated backend for monthly dispatch.'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-center animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h5 className="font-editorial text-base font-semibold text-emerald-200">
                {isAr ? 'تم تأكيد الاشتراك بنجاح' : 'Subscription Confirmed'}
              </h5>
              <p className="text-xs text-emerald-300 leading-relaxed">
                {feedbackMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                }}
                className="text-[11px] text-emerald-400 hover:text-white underline pt-1 cursor-pointer"
              >
                {isAr ? 'تسجيل بريد إلكتروني آخر' : 'Register another email address'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#D6CEBE] block font-medium">
                  {isAr ? 'البريد الإلكتروني للعميل / المستثمر' : 'Confidential Email Address'}
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#C28E5C] absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAr ? 'advisors@privatewealth.com' : 'partner@familyoffice.com'}
                    disabled={isSubmitting}
                    className="w-full bg-[#181614] border border-[#3E3832] focus:border-[#C28E5C] text-xs text-white rounded-lg pl-9 pr-3 py-3 outline-none transition-all placeholder-[#736B63]"
                  />
                </div>
              </div>

              {status === 'already' && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{feedbackMessage}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300">
                  {feedbackMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full py-3 bg-[#C28E5C] hover:bg-[#A37345] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'جاري حفظ البريد في الخادم...' : 'Registering in Server...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isAr ? 'اشتراك في النشرة المعمارية' : 'Subscribe to Insights'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[10px] text-[#A8A196] pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#C28E5C]" />
                  <span>{isAr ? 'خصوصية مشفرة وسرية تامة' : 'Bank-grade discrete data storage'}</span>
                </span>
                <span>{isAr ? 'إلغاء بنقرة واحدة' : 'No spam · 1-click opt out'}</span>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
