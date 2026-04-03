// frontend/src/components/Price.tsx
'use client';

import React from 'react';
import { useCurrency } from '@/context/CurrencyContext';

type PriceProps = {
  amount: number;
  className?: string;
  showCurrencyCode?: boolean;
};

export default function Price({ amount, className = '', showCurrencyCode = false }: PriceProps) {
  const { formatPrice, currency, isLoading } = useCurrency();

  if (isLoading) {
    return <span className={className}>${amount.toLocaleString()}</span>;
  }

  return (
    <span className={className}>
      {formatPrice(amount)}
      {showCurrencyCode && <span className="ml-1 text-[0.8em] opacity-60 font-mono tracking-tight">{currency}</span>}
    </span>
  );
}
