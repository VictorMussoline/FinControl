export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  is_paid: boolean;
  category_id: number;
  account_id: number;
  category_name?: string;
}

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
}

export interface Account {
  id: number;
  name: string;
  initial_balance: number;
  color: string;
  balance?: number;
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

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface AuthUser {
  id: number;
  email: string;
}
