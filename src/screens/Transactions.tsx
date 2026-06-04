import React, { useEffect, useState } from "react";
import type { DashboardData } from "../types/finance";
import { financeService } from "../services/financeService";
import { TransactionModal } from "../components/TransactionModal";

export const Transactions: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<import('../types/finance').Transaction | null>(null);

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

  const handleDeleteTransaction = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      await financeService.deleteTransaction(id);
      setIsModalOpen(false);
      loadData();
    }
  };

  const handleOpenModal = (transaction: import('../types/finance').Transaction | null = null) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Transações
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Nova Transação
        </button>
      </header>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {["Todos", "Receitas", "Despesas"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "Todos" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.transactions.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Nenhuma transação encontrada.
              </p>
            </div>
          ) : (
            data.transactions.map((transaction) => (
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
                        Pago
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                        Pendente
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{transaction.category_name}</span>
                    <span>&bull;</span>
                    <span>
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
                <div
                  className={`text-lg font-semibold ${transaction.type === "income" ? "text-emerald-500" : "text-rose-500"} ${!transaction.is_paid ? "opacity-50" : ""}`}
                >
                  {transaction.type === "income" ? "+" : "-"} R${" "}
                  {transaction.amount.toFixed(2)}
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
    </div>
  );
};
