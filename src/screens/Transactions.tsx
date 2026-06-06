import React, { useEffect, useState } from "react";
import type { DashboardData } from "../types/finance";
import { financeService } from "../services/financeService";
import { TransactionModal } from "../components/TransactionModal";
import { AccountModal } from "../components/AccountModal";
import { useModal } from "../contexts/ModalContext";
import { useLanguage } from "../contexts/LanguageContext";

export const Transactions: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<import('../types/finance').Transaction | null>(null);
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { showConfirm, showAlert } = useModal();
  const { formatDate, formatCurrency, t } = useLanguage();

  const loadData = () => {
    financeService.getDashboardData().then(setData);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveTransaction = async (transaction: Omit<import('../types/finance').Transaction, 'id' | 'category_name'>, id?: number) => {
    if (id) {
      await financeService.updateTransaction(id, transaction);
    } else {
      await financeService.createTransaction(transaction);
    }
    loadData(); // Refresh data after saving
  };

  const handleSaveAccount = async (accountData: any) => {
    await financeService.createAccount(accountData);
    await loadData();
    showAlert("Conta criada com sucesso!", "Sucesso", false);
  };

  const handleDeleteTransaction = async (id: number) => {
    showConfirm(t("transactions.confirmDelete.title"), async () => {
      await financeService.deleteTransaction(id);
      setIsModalOpen(false);
      loadData();
    });
  };

  const handleOpenModal = (transaction: import('../types/finance').Transaction | null = null) => {
    if (!transaction && data?.contas && data.contas.length === 0) {
      showConfirm(
        t("transactions.needAccount.msg"),
        () => setIsAccountModalOpen(true),
        t("accounts.createAccount")
      );
      return;
    }
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (!data) {
    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-4">
          <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          {t("transactions.title")}
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {t("transactions.newTransaction")}
        </button>
      </header>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {[
            { key: "Todos", label: t("transactions.filter.all") },
            { key: "Receitas", label: t("transactions.filter.incomes") },
            { key: "Despesas", label: t("transactions.filter.expenses") }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === filter.key ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.transactions.filter(t => {
            if (activeFilter === "Receitas") return t.type === "income";
            if (activeFilter === "Despesas") return t.type === "expense";
            return true;
          }).length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t("transactions.noTransactions")}
              </p>
            </div>
          ) : (
            data.transactions.filter(t => {
              if (activeFilter === "Receitas") return t.type === "income";
              if (activeFilter === "Despesas") return t.type === "expense";
              return true;
            }).map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => handleOpenModal(transaction)}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {transaction.description}
                    </p>
                    {transaction.is_paid ? (
                      <span className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        {t("transactions.status.paid")}
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        {t("transactions.status.pending")}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{transaction.category_name}</span>
                    <span>&bull;</span>
                    <span>
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"} ${!transaction.is_paid ? "opacity-50" : ""}`}
                >
                  {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        onDelete={handleDeleteTransaction}
        initialData={selectedTransaction}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
};
