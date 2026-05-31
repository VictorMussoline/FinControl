export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

export interface Account {
  id: string;
  nome: string;
  valor: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface EvolutionData {
  name: string;
  valor: number;
}

export interface DashboardData {
  saldoTotal: number;
  totalIncome: number;
  totalExpense: number;
  contas: Account[];
  graficoDespesas: ChartData[];
  graficoReceitas: ChartData[];
  evolucaoMensal: EvolutionData[];
  transactions: Transaction[];
}
