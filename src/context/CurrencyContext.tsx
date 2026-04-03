// frontend/src/context/CurrencyContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  formatPrice: (amount: number) => string;
  convertPrice: (amount: number) => { amount: number; symbol: string; code: string };
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_CONFIG: Record<string, { symbol: string; locale: string }> = {
  USD: { symbol: '$', locale: 'en-US' },
  GHS: { symbol: 'GH₵', locale: 'en-GH' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  CAD: { symbol: 'CA$', locale: 'en-CA' },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState('USD');
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('user-currency');
    if (saved && CURRENCY_CONFIG[saved]) {
      setCurrencyState(saved);
    }

    // Fetch Rates
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates) {
          setRates(data.rates);
        }
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('user-currency', newCurrency);
  };

  const convertPrice = (amount: number) => {
    const rate = rates[currency] || 1;
    const converted = amount * rate;
    return {
      amount: converted,
      symbol: CURRENCY_CONFIG[currency]?.symbol || '$',
      code: currency
    };
  };

  const formatPrice = (amount: number) => {
    const { amount: converted, symbol, code } = convertPrice(amount);
    
    return new Intl.NumberFormat(CURRENCY_CONFIG[currency]?.locale || 'en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
