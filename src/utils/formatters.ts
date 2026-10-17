import { CURRENCY_RATES } from '../data/properties';
import { CurrencyCode } from '../types';

export function formatPrice(amountUSD: number, currency: CurrencyCode = 'USD'): string {
  const config = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round(amountUSD * config.rate);

  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(converted);
  }

  if (currency === 'EGP') {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(converted)} EGP`;
  }

  if (currency === 'AED') {
    return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(converted)} AED`;
  }

  return `$${new Intl.NumberFormat('en-US').format(converted)}`;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}
