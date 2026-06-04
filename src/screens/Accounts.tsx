import React, { useEffect, useState } from "react";
import type { Account } from "../types/finance";
import { financeService } from "../services/financeService";
import { AccountModal } from "../components/AccountModal";

export const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadAccounts = async () => {
    try {
      const data = await financeService.getDashboardData();
      setAccounts(data.contas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSaveAccount = async (account: Omit<Account, "id">) => {
    await financeService.createAccount(account);
    await loadAccounts();
  };

  const handleDeleteAccount = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
      try {
        await financeService.deleteAccount(id);
        await loadAccounts();
      } catch (error: any) {
        alert(
          error.message ||
            "Erro ao excluir conta. Verifique se existem transações vinculadas a ela.",
        );
      }
    }
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val || 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Minhas Contas
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Nova Conta
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 border-dashed">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
              Nenhuma conta cadastrada ainda.
              <br />
              Crie sua primeira conta para começar a registrar transações.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Criar Conta
            </button>
          </div>
        ) : (
          accounts.map((conta) => (
            <div
              key={conta.id}
              className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: conta.color || "#3B82F6" }}
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 mt-2">
                {conta.name}
              </h3>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {fmt(conta.balance || 0)}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded font-medium transition-colors">
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAccount(conta.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2 rounded font-medium transition-colors"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
};
