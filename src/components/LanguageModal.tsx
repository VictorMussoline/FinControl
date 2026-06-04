import React from "react";
import { X, Check } from "lucide-react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div
        className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Selecionar Idioma
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
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
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                currentLanguage === lang.code
                  ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 text-blue-700 dark:text-blue-400 font-semibold"
                  : "bg-gray-50 dark:bg-[#252525] border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
              {currentLanguage === lang.code && (
                <Check size={20} className="text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
