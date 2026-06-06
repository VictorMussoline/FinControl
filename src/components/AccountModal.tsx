import React, { useState } from "react";
import { useModal } from "../contexts/ModalContext";
import { useLanguage } from "../contexts/LanguageContext";
import { X } from "lucide-react";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: {
    name: string;
    type: "corrente" | "poupança" | "investimento";
    initial_balance: number;
    color: string;
  }, id?: number) => Promise<void>;
  initialData?: import("../types/finance").Account | null;
}

const COLORS = [
  { value: "#8A05BE", label: "Nubank" },
  { value: "#FF7A00", label: "Inter" },
  { value: "#CC092F", label: "Bradesco" },
  { value: "#00722D", label: "Safra" },
  { value: "#FFC107", label: "Ouro" },
  { value: "#1E1E1E", label: "Black" },
  { value: "#3B82F6", label: "Azul" },
  { value: "#10B981", label: "Esmeralda" }
];

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [type, setType] = useState<"corrente" | "poupança" | "investimento">("corrente");
  const [initialBalance, setInitialBalance] = useState("");
  const [color, setColor] = useState("#8A05BE");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useModal();

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setType(initialData.type || "corrente");
        setInitialBalance(initialData.initial_balance.toString());
        setColor(initialData.color);
      } else {
        setName("");
        setType("corrente");
        setInitialBalance("");
        setColor(COLORS[0].value);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name.trim()) {
        showAlert(t("accountModal.error.nameRequired"), t("modal.attention"), true);
        setLoading(false);
        return;
      }

      await onSave({
        name,
        type,
        initial_balance: parseFloat(initialBalance) || 0,
        color,
      }, initialData?.id);
      onClose();
    } catch (error) {
      console.error(error);
      showAlert(t("accountModal.error.save"), t("modal.error"), true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {initialData ? t("accountModal.title.edit") : t("accountModal.title.new")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("accountModal.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Nubank, Carteira"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("accountModal.type")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            >
              <option value="corrente">{t("accountModal.type.checking")}</option>
              <option value="poupança">{t("accountModal.type.savings")}</option>
              <option value="investimento">{t("accountModal.type.investment")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("accountModal.initialBalance")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500 dark:text-gray-400">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("accountModal.color")}
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c.value
                      ? "border-gray-900 dark:border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            >
              {t("modal.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? "..." : t("modal.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
