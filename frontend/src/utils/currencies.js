// frontend/src/utils/currencies.js

export const CURRENCY_INFO = {
  USD: { name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  EUR: { name: 'Euro', flag: '🇪🇺', symbol: '€' },
  GBP: { name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'CA$' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭', symbol: 'CHF' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  INR: { name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', symbol: 'NZ$' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽', symbol: 'MX$' },
  BRL: { name: 'Brazilian Real', flag: '🇧🇷', symbol: 'R$' },
  ZAR: { name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
  AED: { name: 'UAE Dirham', flag: '🇦🇪', symbol: 'AED' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰', symbol: 'HK$' },
  SEK: { name: 'Swedish Krona', flag: '🇸🇪', symbol: 'kr' },
  NOK: { name: 'Norwegian Krone', flag: '🇳🇴', symbol: 'kr' },
  KRW: { name: 'South Korean Won', flag: '🇰🇷', symbol: '₩' },
  TRY: { name: 'Turkish Lira', flag: '🇹🇷', symbol: '₺' },
  THB: { name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
  IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
  MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
  PHP: { name: 'Philippine Peso', flag: '🇵🇭', symbol: '₱' },
  PLN: { name: 'Polish Zloty', flag: '🇵🇱', symbol: 'zł' },
  DKK: { name: 'Danish Krone', flag: '🇩🇰', symbol: 'kr' },
  HUF: { name: 'Hungarian Forint', flag: '🇭🇺', symbol: 'Ft' },
  CZK: { name: 'Czech Koruna', flag: '🇨🇿', symbol: 'Kč' },
  ILS: { name: 'Israeli Shekel', flag: '🇮🇱', symbol: '₪' },
  CLP: { name: 'Chilean Peso', flag: '🇨🇱', symbol: 'CLP$' },
  COP: { name: 'Colombian Peso', flag: '🇨🇴', symbol: 'COL$' },
  SAR: { name: 'Saudi Riyal', flag: '🇸🇦', symbol: 'SR' }
};

export function getCurrencyInfo(code) {
  return CURRENCY_INFO[code] || {
    name: code,
    flag: '🌐',
    symbol: code
  };
}

