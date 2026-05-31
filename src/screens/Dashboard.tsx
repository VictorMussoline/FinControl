import React, { useEffect, useState } from 'react';
import type { DashboardData } from '../types/finance';
import { financeService } from '../services/financeService';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await financeService.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">Carregando FinControl...</div>
      </div>
    );
  }

  const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:flex hidden">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Adicionar Transação
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Saldo Total */}
        <section className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Saldo Total</h3>
          <div className="text-center text-4xl font-bold text-green-500 dark:text-green-400">
            {fmt(data.saldoTotal)}
          </div>
        </section>

        {/* 2. Minhas Contas */}
        <section className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Minhas Contas</h3>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">Gerenciar</button>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.contas.map(conta => (
              <li key={conta.id} className="flex justify-between py-3">
                <span className="text-gray-800 dark:text-gray-200">{conta.nome}</span>
                <strong className="text-gray-900 dark:text-white">{fmt(conta.valor)}</strong>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Despesas por Categoria */}
        <section className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Despesas por Categoria</h3>
          <div className="h-[250px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.graficoDespesas} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {data.graficoDespesas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 4. Receitas por Categoria */}
        <section className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Receitas por Categoria</h3>
          <div className="h-[250px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.graficoReceitas} innerRadius={60} outerRadius={80} dataKey="value" stroke="none">
                  {data.graficoReceitas.map((_, i) => <Cell key={i} fill={['#00C49F', '#0088FE', '#FFBB28'][i % 3]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 5. Evolução Mensal */}
        <section className="md:col-span-2 relative overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl dark:bg-gradient-to-br dark:from-[#1a1a2e] dark:to-[#16213e] bg-white border border-gray-100 dark:border-[#333] group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D9FF] to-[#00FFA3] z-10"></div>
          <div className="p-6 relative z-20">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Evolução Mensal</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.evolucaoMensal} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
                  <XAxis dataKey="name" stroke="currentColor" className="text-gray-500 dark:text-gray-400" tick={{ fill: 'currentColor' }} />
                  <YAxis stroke="currentColor" className="text-gray-500 dark:text-gray-400" tick={{ fill: 'currentColor' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
