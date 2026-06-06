import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";
import type { Language } from "../utils/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  formatDate: (dateString: string | Date) => string;
  formatCurrency: (val: number) => string;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("fincontrol_language");
    return (saved as Language) || "PT-BR";
  });

  useEffect(() => {
    localStorage.setItem("fincontrol_language", language);
    if (language === "EN-US") {
      document.documentElement.lang = "en";
    } else if (language === "ES") {
      document.documentElement.lang = "es";
    } else {
      document.documentElement.lang = "pt-BR";
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    if (language === "EN-US") {
      return `${month}/${day}/${year}`;
    }
    // PT-BR and ES
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (val: number) => {
    if (language === "EN-US") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val || 0);
    }
    if (language === "ES") {
      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
      }).format(val || 0);
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation key: ${key}`);
      return key;
    }
    return translation[language] || translation["PT-BR"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, formatDate, formatCurrency, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
