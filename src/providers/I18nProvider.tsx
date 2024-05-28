'use client';

import { type PropsWithChildren, useEffect, useState } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from '@/i18n/en/common.json';
import { I18nextProvider } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common
    }
  },
  lng: 'en',
  defaultNS: 'common',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

type I18nProviderProps = PropsWithChildren;

const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [isInitialized, setInitialized] = useState(false);

  useEffect(() => {
    i18n.init().then(() => {
      setInitialized(true);
    });
  }, []);

  if (!isInitialized) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export { I18nProvider };
