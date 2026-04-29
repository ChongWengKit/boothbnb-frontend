'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import countryToCurrency from 'country-to-currency';
import { setCurrency } from '@/app/contexts/currency';

const fetchAndVerifyCurrency = async (code: string): Promise<string> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_DOMAIN;
  if (!baseUrl) {
    return 'USD';
  }

  try {
    const res = await fetch(`${baseUrl}/currency?currencyCode=${code}`);
    if (res.ok) {
      return code;
    } else {
      return 'USD';
    }
  } catch (error) {
    return 'USD';
  }
};

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
  const [currencyCode, setCurrencyCode] = useState(initialCurrencyCode || 'USD');

  const handleSetCurrencyCode = useCallback((code: string) => {
    fetchAndVerifyCurrency(code).then((verifiedCode) => {
      setCurrencyCode(verifiedCode);
      setCurrency(verifiedCode);
    })

  }, []);

  useEffect(() => {
    let isMounted = true;

    const determineAndVerifyInitialCurrency = async () => {
      let codeToVerify = '';
      if (initialCurrencyCode) {
        codeToVerify = initialCurrencyCode;
      } else if (initialCountryCode) {
        codeToVerify = countryToCurrency[initialCountryCode as keyof typeof countryToCurrency] || 'USD';
      } else {
        codeToVerify = 'USD';
      }

      const verifiedCode = await fetchAndVerifyCurrency(codeToVerify);

      if (isMounted && verifiedCode !== currencyCode) {
        handleSetCurrencyCode(verifiedCode);
      }
    };

    determineAndVerifyInitialCurrency();

    return () => {
      isMounted = false;
    };
  }, [initialCountryCode, initialCurrencyCode]);

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