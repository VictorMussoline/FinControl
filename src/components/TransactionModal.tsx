import React, { useState, useEffect } from "react";
import type { Account, Category, Transaction } from "../types/finance";
import { financeService } from "../services/financeService";
import { useModal } from "../contexts/ModalContext";
import { CustomDatePicker } from "./CustomDatePicker";
import { useLanguage } from "../contexts/LanguageContext";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    transaction: Omit<
      Transaction,
      "id" | "category_name"
    >,
    id?: number,
  ) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  initialData?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accountId, setAccountId] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useModal();
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDescription(initialData.description);
        setAmount(initialData.amount.toString());
        setType(initialData.type);
        setCategoryId(initialData.category_id.toString());
        setDate(initialData.date.split("T")[0]);
        setAccountId(initialData.account_id.toString());
        setIsPaid(initialData.is_paid);
      } else {
        setDescription("");
        setAmount("");
        setType("expense");
        setDate(new Date().toISOString().split("T")[0]);
        setIsPaid(false);
        // Do not reset account/category if they already have defaults fetched,
        // they will be set correctly by the fetch logic if empty.
      }

      financeService
        .getAccounts()
        .then((accs) => {
          setAccounts(accs);
          if (accs.length > 0 && !accountId) {
            setAccountId(accs[0].id.toString());
          }
        })
        .catch(console.error);

      financeService
        .getCategories()
        .then((cats) => {
          setCategories(cats);
          if (cats.length > 0 && !categoryId) {
            setCategoryId(cats[0].id.toString());
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!description.trim()) {
        showAlert("A descrição é obrigatória.", "Atenção", true);
        setLoading(false);
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        showAlert("Por favor, insira um valor válido maior que zero.", "Atenção", true);
        setLoading(false);
        return;
      }

      if (!date) {
        showAlert("A data da transação é obrigatória.", "Atenção", true);
        setLoading(false);
        return;
      }

      if (!accountId) {
        showAlert("Por favor, selecione uma Conta de Destino/Origem.", "Atenção", true);
        setLoading(false);
        return;
      }

      if (!categoryId) {
        showAlert("Por favor, selecione uma Categoria.", "Atenção", true);
        setLoading(false);
        return;
      }

      await onSave(
        {
          description,
          amount: parseFloat(amount),
          type,
          category_id: parseInt(categoryId, 10),
          date: new Date(date).toISOString(), // Backend expects ISO format for now
          account_id: parseInt(accountId, 10),
          is_paid: isPaid,
        },
        initialData?.id,
      );
      onClose();
    } catch (error) {
      console.error(error);
      showAlert("Erro ao salvar transação", "Erro", true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ✕
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {initialData ? t("transactionModal.title.edit") : t("transactionModal.title.new")}
          </h2>
          {initialData && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(initialData.id)}
              className="text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md text-sm font-medium transition-colors mr-6"
            >
              {t("modal.delete")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("transactionModal.description")}
            </label>
            <input
              required
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: Conta de Luz"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("transactionModal.amount")}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2 text-gray-500 dark:text-gray-400">
                  R$
                </span>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("transactionModal.date")}
              </label>
              <CustomDatePicker value={date} onChange={setDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("transactionModal.type")}
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "income" | "expense")
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="expense">{t("transactionModal.type.expense")}</option>
                <option value="income">{t("transactionModal.type.income")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("transactionModal.category")}
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories
                  .filter((c) => c.type === type)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("transactionModal.account")}
              </label>
              <select
                required
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="" disabled>
                  {t("transactionModal.selectAccount")}
                </option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-3 cursor-pointer mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={isPaid}
                  onChange={(e) => setIsPaid(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {isPaid
                      ? t("transactionModal.status.paid")
                      : t("transactionModal.status.unpaid")}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Transações pendentes não alteram o saldo do Dashboard.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            {loading ? "..." : t("modal.save")}
          </button>
        </form>
      </div>
    </div>
  );
};
