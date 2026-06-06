import React, { useState } from "react";
import { useModal } from "../contexts/ModalContext";

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

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"corrente" | "poupança" | "investimento">("corrente");
  const [initialBalance, setInitialBalance] = useState("");
  const [color, setColor] = useState("#8A05BE");
  const [loading, setLoading] = useState(false);
  const { showAlert } = useModal();

  const PREDEFINED_COLORS = [
    "#8A05BE", // Nubank/Roxo
    "#FF7A00", // Inter/Laranja
    "#CC092F", // Bradesco/Vermelho
    "#00722D", // Safra/Verde
    "#FFC107", // Ouro/Amarelo
    "#1E1E1E", // Black
    "#3B82F6", // Azul padrão
    "#10B981"  // Esmeralda
  ];

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
        setColor(PREDEFINED_COLORS[0]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!name.trim()) {
        showAlert("O nome da conta é obrigatório.", "Atenção", true);
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
      showAlert("Erro ao salvar conta", "Erro", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl shadow-xl p-6 relative border border-gray-100 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {initialData ? "Editar Conta" : "Nova Conta"}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome da Conta
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
              Tipo de Conta
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="corrente">🏦 Conta Corrente</option>
              <option value="poupança">🌱 Conta Poupança</option>
              <option value="investimento">📈 Conta Investimento</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Saldo Inicial
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
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor da Conta
            </label>
            <div className="grid grid-cols-4 gap-3">
              {PREDEFINED_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-12 rounded-xl transition-all duration-200 flex items-center justify-center ${
                    color === c 
                      ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#1e1e1e] scale-110 shadow-lg" 
                      : "hover:scale-105 hover:shadow-md"
                  }`}
                  style={{ backgroundColor: c, "--tw-ring-color": c } as React.CSSProperties}
                >
                  {color === c && (
                    <div className="w-3 h-3 bg-white rounded-full opacity-90 shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {loading ? "Salvando..." : "Salvar Conta"}
          </button>
        </form>
      </div>
    </div>
  );
};
