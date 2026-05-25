import React, { createContext, useContext, useState } from 'react';
import { Lang, translations, Translations } from '../i18n/translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ru',
  setLang: () => {},
  t: translations.ru,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) as Lang | null;
  const [lang, setLangState] = useState<Lang>(stored ?? 'ru');

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
