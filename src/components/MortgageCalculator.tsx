import React, { useState, useMemo } from 'react';
import { CurrencyCode } from '../types';
import { formatPrice } from '../utils/formatters';
import { Calculator, DollarSign, Percent, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';

interface MortgageCalculatorProps {
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
  defaultHomePriceUSD?: number;
}

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  currency,
  currentLang,
  defaultHomePriceUSD = 4850000
}) => {
  const isAr = currentLang === 'ar';

  const [homePrice, setHomePrice] = useState<number>(defaultHomePriceUSD);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(6.5);

  const calculations = useMemo(() => {
    const downPaymentAmount = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;

    let monthlyPrincipalInterest = 0;
    if (monthlyInterestRate > 0) {
      monthlyPrincipalInterest =
        (loanAmount *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments))) /
        (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    } else {
      monthlyPrincipalInterest = loanAmount / numberOfPayments;
    }

    const monthlyPropertyTax = (homePrice * 0.008) / 12; // 0.8% annual
    const monthlyInsurance = (homePrice * 0.0035) / 12; // 0.35% annual
    const monthlyHOA = 1200; // Luxury community maintenance

    const totalMonthlyPayment =
      monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + monthlyHOA;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPrincipalInterest,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyHOA,
      totalMonthlyPayment
    };
  }, [homePrice, downPaymentPercent, loanTermYears, interestRate]);

  return (
    <section id="calculator" className="w-full py-16 lg:py-24 bg-[#FFFFFF] border-y border-[#E5E0D8] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C28E5C]">
            {isAr ? 'التحليل المالي والاستثماري' : 'Financial Architecture'}
          </span>
          <h2 className="text-3xl lg:text-4xl font-editorial font-medium text-[#1E1B18] tracking-tight">
            {isAr ? 'حاسبة التمويل والاستثمار العقاري' : 'Mortgage & Private Wealth Calculator'}
          </h2>
          <p className="text-sm text-[#736B63] leading-relaxed">
            {isAr
              ? 'احسب الدفعة الشهرية وهيكل التمويل الاستثماري لأي إقامة معمارية بحسابات الضرائب والصيانة الحصرية.'
              : 'Estimate debt servicing, equity structure, and monthly carrying costs for bespoke estate acquisitions.'}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sliders Input Column */}
          <div className="lg:col-span-7 bg-[#FBF9F5] p-6 sm:p-8 rounded-2xl border border-[#E5E0D8] space-y-6">
            
            {/* Property Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1E1B18]">
                <span className="text-[#736B63] uppercase tracking-wider">{isAr ? 'قيمة الإقامة المستهدفة' : 'Property Value'}</span>
                <span className="font-mono text-base font-bold text-[#8B5E3C]">{formatPrice(homePrice, currency)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="20000000"
                step="250000"
                value={homePrice}
                onChange={(e) => setHomePrice(parseFloat(e.target.value))}
                className="w-full accent-[#C28E5C] cursor-pointer"
              />
            </div>

            {/* Down Payment % and Amount */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1E1B18]">
                <span className="text-[#736B63] uppercase tracking-wider">
                  {isAr ? `الدفعة المقدمة (${downPaymentPercent}%)` : `Down Payment (${downPaymentPercent}%)`}
                </span>
                <span className="font-mono text-xs font-bold text-[#1E1B18]">
                  {formatPrice(calculations.downPaymentAmount, currency)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full accent-[#C28E5C] cursor-pointer"
              />
            </div>

            {/* Loan Term Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#736B63]">
                {isAr ? 'مدة سداد التمويل' : 'Loan Amortization Term'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 20, 25, 30].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLoanTermYears(term)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      loanTermYears === term
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                        : 'bg-white text-[#5A534B] border-[#E5E0D8] hover:border-[#C28E5C]'
                    }`}
                  >
                    {term} {isAr ? 'سنة' : 'Yrs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-[#1E1B18]">
                <span className="text-[#736B63] uppercase tracking-wider">{isAr ? 'سعر الفائدة السنوي المتوقع' : 'Estimated Annual Interest'}</span>
                <span className="font-mono text-sm font-bold text-[#8B5E3C]">{interestRate}%</span>
              </div>
              <input
                type="range"
                min="3.0"
                max="12.0"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                className="w-full accent-[#C28E5C] cursor-pointer"
              />
            </div>

          </div>

          {/* Breakdown & Results Column */}
          <div className="lg:col-span-5 bg-[#1E1B18] text-[#FBF9F5] p-6 sm:p-8 rounded-2xl border border-[#332F2B] shadow-xl space-y-6">
            
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D8B48F]">
                {isAr ? 'إجمالي السداد الشهري التقديري' : 'Total Estimated Monthly Carrying Cost'}
              </span>
              <p className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">
                {formatPrice(calculations.totalMonthlyPayment, currency)}
                <span className="text-xs font-normal text-[#A8A196] ml-2">/ month</span>
              </p>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#332F2B]">
              <div
                className="bg-[#C28E5C] h-full"
                style={{ width: `${(calculations.monthlyPrincipalInterest / calculations.totalMonthlyPayment) * 100}%` }}
                title="Principal & Interest"
              />
              <div
                className="bg-[#7A98A6] h-full"
                style={{ width: `${(calculations.monthlyPropertyTax / calculations.totalMonthlyPayment) * 100}%` }}
                title="Property Tax"
              />
              <div
                className="bg-[#B8A388] h-full"
                style={{ width: `${(calculations.monthlyInsurance / calculations.totalMonthlyPayment) * 100}%` }}
                title="Home Insurance"
              />
              <div
                className="bg-[#594F45] h-full"
                style={{ width: `${(calculations.monthlyHOA / calculations.totalMonthlyPayment) * 100}%` }}
                title="HOA & Concierge"
              />
            </div>

            {/* Detailed Line Items */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-[#332F2B]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C28E5C]" />
                  <span className="text-[#D6CEBE]">{isAr ? 'أصل التمويل والفائدة' : 'Principal & Interest'}</span>
                </div>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {formatPrice(calculations.monthlyPrincipalInterest, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#332F2B]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7A98A6]" />
                  <span className="text-[#D6CEBE]">{isAr ? 'الضرائب العقارية المقدرة' : 'Property Taxes'}</span>
                </div>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {formatPrice(calculations.monthlyPropertyTax, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#332F2B]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#B8A388]" />
                  <span className="text-[#D6CEBE]">{isAr ? 'التأمين الشامل على العقار' : 'Homeowners Insurance'}</span>
                </div>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {formatPrice(calculations.monthlyInsurance, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-[#332F2B]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#594F45]" />
                  <span className="text-[#D6CEBE]">{isAr ? 'رسوم الصيانة والأمن الخاص' : 'Estate Concierge & Maintenance'}</span>
                </div>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {formatPrice(calculations.monthlyHOA, currency)}
                </span>
              </div>
            </div>

            {/* Advisory note */}
            <p className="text-[11px] text-[#A8A196] leading-relaxed pt-2">
              {isAr
                ? '* الأرقام تقريبية مبنية على أسعار التمويل الائتماني المعتمدة لدى شركائنا في البنوك الاستثمارية.'
                : '* Calculations represent indicative sovereign-tier financing structures arranged through our private wealth partners.'}
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
