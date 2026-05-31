import type { DashboardData } from '../types/finance';

export const mockDashboardData: DashboardData = {
  saldoTotal: 3200.50,
  totalIncome: 5000.00,
  totalExpense: 1799.50,
  contas: [
    { id: '1', nome: 'Carteira', valor: 200.50 },
    { id: '2', nome: 'Banco Nubank', valor: 3000.00 },
  ],
  graficoDespesas: [
    { name: 'Moradia', value: 1500 },
    { name: 'Alimentação', value: 299.50 },
  ],
  graficoReceitas: [
    { name: 'Salário', value: 5000 },
  ],
  evolucaoMensal: [
    { name: 'Jan', valor: 1200 },
    { name: 'Fev', valor: 2100 },
    { name: 'Mar', valor: 1800 },
    { name: 'Abr', valor: 2500 },
    { name: 'Mai', valor: 3200 },
  ],
  transactions: [
    {
      id: 't1',
      description: 'Salário Mensal',
      amount: 5000.00,
      type: 'income',
      category: 'Salário',
      date: '2026-05-05T10:00:00Z',
    },
    {
      id: 't2',
      description: 'Aluguel',
      amount: 1500.00,
      type: 'expense',
      category: 'Moradia',
      date: '2026-05-10T14:30:00Z',
    },
    {
      id: 't3',
      description: 'Mercado',
      amount: 299.50,
      type: 'expense',
      category: 'Alimentação',
      date: '2026-05-12T18:45:00Z',
    }
  ]
};
