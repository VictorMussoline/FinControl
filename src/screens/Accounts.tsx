import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../types/finance';
import { financeService } from '../services/financeService';

export const Accounts: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    financeService.getDashboardData().then(setData);
  }, []);

  if (!data) return null;

  const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Minhas Contas</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Nova Conta
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.contas.map(conta => (
          <div key={conta.id} className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{conta.nome}</h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {fmt(conta.valor)}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded font-medium transition-colors">Editar</button>
              <button className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2 rounded font-medium transition-colors">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
