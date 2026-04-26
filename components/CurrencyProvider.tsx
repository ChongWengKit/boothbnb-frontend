'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import countryToCurrency from 'country-to-currency';
import { setCurrency } from '@/app/contexts/currency';

interface CurrencyContextType {
  currencyCode: string;
  handleSetCurrencyCode: (code: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({
  children,
  initialCountryCode,
  initialCurrencyCode
}: {
  children: React.ReactNode;
  initialCountryCode?: string | null;
  initialCurrencyCode?: string | null;
}) => {
  const [currencyCode, setCurrencyCode] = useState('');

  const handleSetCurrencyCode = (code: string) => {
    setCurrencyCode(code);
    setCurrency(code);
  };

  useEffect(() => {
    if (!initialCurrencyCode) {
      if (initialCountryCode) {
        const code = countryToCurrency[initialCountryCode as keyof typeof countryToCurrency];
        if (code) {
          fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/currency?currencyCode=${code}`)
            .then(async (res) => {
              if (res.ok) {
                handleSetCurrencyCode(code);
              } else {
                handleSetCurrencyCode('USD');
              }
            })
            .catch(() => handleSetCurrencyCode('USD'));
        }
        else {
          handleSetCurrencyCode('USD');
        }
      }
      else {
        handleSetCurrencyCode('USD');
      }
    }
    else {
      handleSetCurrencyCode(initialCurrencyCode);
    }
  }, [initialCountryCode]);

  return (
    <CurrencyContext.Provider value={{ currencyCode, handleSetCurrencyCode }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export default CurrencyProvider;