import React, { useEffect, useState } from "react";
import type { Account } from "../types/finance";
import { financeService } from "../services/financeService";
import { AccountModal } from "../components/AccountModal";
import { useModal } from "../contexts/ModalContext";
import { useLanguage } from "../contexts/LanguageContext";

export const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const { showAlert, showConfirm } = useModal();
  const { formatCurrency } = useLanguage();

  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await financeService.getDashboardData();
      setAccounts(data.contas);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) {
    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 dark:bg-[#1e1e1e]/80 rounded-xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between h-48 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
              <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSaveAccount = async (account: Omit<Account, "id">, id?: number) => {
    try {
      if (id) {
        await financeService.updateAccount(id, account);
      } else {
        await financeService.createAccount(account);
      }
      await loadAccounts();
    } catch (error: any) {
      showAlert(error.message || "Erro ao salvar conta", "Erro", true);
    }
  };

  const handleDeleteAccount = (conta: Account) => {
    showConfirm(
      "Esta ação é IRREVERSÍVEL. Todas as transações vinculadas a esta conta também serão permanentemente excluídas.",
      async () => {
        try {
          await financeService.deleteAccount(conta.id);
          await loadAccounts();
          showAlert(`A conta "${conta.name}" foi excluída com sucesso!`, "Sucesso", false);
        } catch (error: any) {
          showAlert(
            error.message ||
              "Erro ao excluir conta.",
            "Erro na Exclusão",
            true
          );
        }
      },
      "Excluir Conta e Transações?",
      conta.name
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Minhas Contas
        </h1>
        <button
          onClick={() => {
            setSelectedAccount(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Nova Conta
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl border border-gray-100 dark:border-gray-800 border-dashed">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
              Nenhuma conta cadastrada ainda.
              <br />
              Crie sua primeira conta para começar a registrar transações.
            </p>
            <button
              onClick={() => {
                setSelectedAccount(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Criar Conta
            </button>
          </div>
        ) : (
          accounts.map((conta) => (
            <div
              key={conta.id}
              className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: conta.color || "#3B82F6" }}
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-2">
                {conta.name}
              </h3>
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {conta.type === 'corrente' && '🏦 Conta Corrente'}
                  {conta.type === 'poupança' && '🌱 Conta Poupança'}
                  {conta.type === 'investimento' && '📈 Investimento'}
                  {!conta.type && '🏦 Conta'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {formatCurrency(conta.balance || 0)}
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedAccount(conta);
                    setIsModalOpen(true);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded font-medium transition-colors">
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteAccount(conta)}
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
        initialData={selectedAccount}
      />
    </div>
  );
};
