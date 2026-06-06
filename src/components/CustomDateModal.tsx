import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { useModal } from "../contexts/ModalContext";
import { useLanguage } from "../contexts/LanguageContext";

interface CustomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (start: string, end: string) => void;
  initialStart: string;
  initialEnd: string;
}

export const CustomDateModal: React.FC<CustomDateModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStart,
  initialEnd,
}) => {
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const { showAlert } = useModal();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setStart(initialStart);
      setEnd(initialEnd);
    }
  }, [isOpen, initialStart, initialEnd]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!start || !end) {
      showAlert("Por favor, selecione as duas datas.", "Atenção", true);
      return;
    }
    if (start > end) {
      showAlert("A data inicial não pode ser maior que a data final.", "Atenção", true);
      return;
    }
    onApply(start, end);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl shadow-xl p-6 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
          <Calendar size={20} className="text-blue-500" />
          {t("customDateModal.title")}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("customDateModal.start")}
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("customDateModal.end")}
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {t("customDateModal.apply")}
          </button>
        </div>
      </div>
    </div>
  );
};
