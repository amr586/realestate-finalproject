import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
}

const roles = [
  { value: 'client', label: 'مشتري' },
  { value: 'agent', label: 'بائع' },
  { value: 'client', label: 'مستشار قانوني' },
  { value: 'client', label: 'مالك' }
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'login', onClose }) => {
  const { loginAs, registerUser } = useAuth();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'client', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const passwordValid = form.password.length >= 8 && /[A-Z]/.test(form.password) && /\d/.test(form.password) && /[^A-Za-z0-9]/.test(form.password);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    if (mode === 'forgot') {
      setMessage('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.');
      return;
    }
    if (mode === 'register') {
      if (!form.name || !form.email || !form.phone || !passwordValid || form.password !== form.confirmPassword) {
        setMessage('يرجى مراجعة البيانات والتأكد من شروط كلمة المرور.');
        return;
      }
      registerUser(form.name, form.email, form.role as 'client' | 'agent', `+213 ${form.phone}`);
      onClose();
      return;
    }
    if (!form.email || !form.password) {
      setMessage('أدخل البريد الإلكتروني وكلمة المرور.');
      return;
    }
    loginAs('client');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1E1B18]/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-[#FBF9F5] shadow-2xl" dir="rtl">
        <button onClick={onClose} className="absolute left-5 top-5 z-10 rounded-full p-2 text-[#5A534B] transition hover:bg-[#F2EFE9]" aria-label="إغلاق"><X className="h-5 w-5" /></button>
        <div className="grid min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden flex-col justify-between bg-[#1E1B18] p-10 text-[#FBF9F5] md:flex">
            <div><p className="font-editorial text-3xl tracking-[0.2em] text-[#D8B48F]">SIENNA</p><p className="mt-2 text-xs tracking-[0.3em] text-[#A8A196]">ESTATES</p></div>
            <div><p className="mb-5 text-sm leading-8 text-[#D8D1C8]">مساحتك الخاصة لاكتشاف العقارات الاستثنائية وإدارة رحلتك العقارية بثقة.</p><div className="h-px w-20 bg-[#C28E5C]" /></div>
          </div>
          <div className="p-6 sm:p-10 md:p-14">
            <div className="mb-8"><p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#C28E5C]">SIENNA ESTATES</p><h2 id="auth-title" className="text-3xl font-bold text-[#1E1B18]">{mode === 'login' ? 'مرحباً بعودتك' : mode === 'register' ? 'أنشئ حسابك' : 'نسيت كلمة المرور؟'}</h2><p className="mt-2 text-sm text-[#736B63]">{mode === 'login' ? 'سجّل الدخول لمتابعة رحلتك العقارية.' : mode === 'register' ? 'انضم إلى مجتمع سيينا العقاري.' : 'أدخل بريدك الإلكتروني لاستلام رابط الاستعادة.'}</p></div>
            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && <><label className="block text-sm font-semibold text-[#3B3530]">الاسم الكامل<div className="relative mt-2"><UserRound className="absolute right-3 top-3 h-4 w-4 text-[#A8A196]" /><input value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-lg border border-[#E5E0D8] bg-white py-3 pr-10 pl-3 outline-none focus:border-[#C28E5C]" placeholder="اكتب اسمك الكامل" /></div></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-[#3B3530]">رقم الهاتف<div className="mt-2 flex"><span className="rounded-r-lg border border-l-0 border-[#E5E0D8] bg-[#F2EFE9] px-3 py-3 text-sm text-[#5A534B]">+213</span><input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="min-w-0 flex-1 rounded-l-lg border border-[#E5E0D8] bg-white py-3 px-3 outline-none focus:border-[#C28E5C]" placeholder="555 12 34 56" /></div></label><label className="block text-sm font-semibold text-[#3B3530]">أنا<div className="relative mt-2"><select value={form.role} onChange={(e) => update('role', e.target.value)} className="w-full appearance-none rounded-lg border border-[#E5E0D8] bg-white py-3 px-3 outline-none focus:border-[#C28E5C]">{roles.map((role) => <option key={role.label} value={role.value}>{role.label}</option>)}</select></div></label></div></>}
              <label className="block text-sm font-semibold text-[#3B3530]">البريد الإلكتروني<div className="relative mt-2"><Mail className="absolute right-3 top-3 h-4 w-4 text-[#A8A196]" /><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="w-full rounded-lg border border-[#E5E0D8] bg-white py-3 pr-10 pl-3 text-left outline-none focus:border-[#C28E5C]" placeholder="name@example.com" dir="ltr" /></div></label>
              {mode !== 'forgot' && <><label className="block text-sm font-semibold text-[#3B3530]">كلمة المرور<div className="relative mt-2"><LockKeyhole className="absolute right-3 top-3 h-4 w-4 text-[#A8A196]" /><input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} className="w-full rounded-lg border border-[#E5E0D8] bg-white py-3 pr-10 pl-11 outline-none focus:border-[#C28E5C]" placeholder="••••••••" dir="ltr" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-2.5 text-[#736B63]" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></label>{mode === 'register' && <><p className="text-xs text-[#736B63]">8 أحرف على الأقل، رمز، رقم، وحرف كبير.</p><label className="block text-sm font-semibold text-[#3B3530]">تأكيد كلمة السر<input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} className="mt-2 w-full rounded-lg border border-[#E5E0D8] bg-white py-3 px-3 outline-none focus:border-[#C28E5C]" dir="ltr" /></label></>}</>}
              {mode !== 'forgot' && <label className="flex items-center gap-2 text-sm text-[#5A534B]"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#C28E5C]" />تذكرني لمدة 3 أشهر</label>}
              {message && <p className="rounded-lg bg-[#F8EBDD] p-3 text-sm text-[#8B5E3C]">{message}</p>}
              <button type="submit" className="w-full rounded-lg bg-[#1E1B18] py-3.5 text-sm font-semibold text-white transition hover:bg-[#C28E5C]">{mode === 'login' ? 'تسجيل الدخول' : mode === 'register' ? 'إنشاء حساب' : 'إرسال رابط الاستعادة'}</button>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#736B63]">{mode === 'login' && <button onClick={() => setMode('forgot')} className="text-[#8B5E3C] underline">نسيت كلمة المرور؟</button>}{mode === 'forgot' && <button onClick={() => setMode('login')} className="text-[#8B5E3C] underline">العودة لتسجيل الدخول</button>}{mode !== 'forgot' && <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="font-semibold text-[#8B5E3C]">{mode === 'login' ? 'إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}</button>}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
