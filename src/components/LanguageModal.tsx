import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

const languages = [
  { code: "PT-BR", name: "Português (BR)", flag: "🇧🇷" },
  { code: "EN-US", name: "English (US)", flag: "🇺🇸" },
  { code: "ES", name: "Español", flag: "🇪🇸" },
];

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {t("languageModal.title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelectLanguage(lang.code);
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                currentLanguage === lang.code
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                  : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex flex-col items-start">
                <span className="font-medium">
                  {lang.code === "PT-BR" ? t("languageModal.portuguese") : lang.code === "EN-US" ? t("languageModal.english") : t("languageModal.spanish")}
                </span>
                <span className="text-xs opacity-70">{lang.code}</span>
              </div>
              {currentLanguage === lang.code && (
                <div className="ml-auto w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
