import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../types/finance';
import { financeService } from '../services/financeService';

export const Transactions: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    financeService.getDashboardData().then(setData);
  }, []);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Transações</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Nova Transação
        </button>
      </header>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="flex gap-4 p-4 border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
          {['Todos', 'Receitas', 'Despesas'].map(filter => (
            <button key={filter} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'Todos' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
              {filter}
            </button>
          ))}
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {data.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">{transaction.description}</p>
                <div className="flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{transaction.category}</span>
                  <span>&bull;</span>
                  <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
