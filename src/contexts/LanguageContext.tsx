import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "PT-BR" | "EN-US" | "ES";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  formatDate: (dateString: string | Date) => string;
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, formatDate }}>
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
