import type {
  DashboardData,
  Transaction,
  AuthToken,
  Account,
  Category,
} from "../types/finance";

const API_URL = "http://localhost:8000/api";

class FinanceService {
  private getHeaders() {
    const token = localStorage.getItem("fincontrol_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  public async login(email: string, password: string): Promise<AuthToken> {
    const formData = new URLSearchParams();
    formData.append("username", email); // OAuth2 expects 'username'
    formData.append("password", password);

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    if (!response.ok) throw new Error("Falha no login");
    const data = await response.json();
    localStorage.setItem("fincontrol_token", data.access_token);
    return data;
  }

  public async register(email: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Falha no cadastro");
  }

  public logout() {
    localStorage.removeItem("fincontrol_token");
  }

  public async getAccounts(): Promise<Account[]> {
    const response = await fetch(`${API_URL}/accounts`, {
      headers: this.getHeaders(),
    });
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
      throw new Error("Não autorizado");
    }
    if (!response.ok) throw new Error("Failed to fetch accounts");
    return response.json();
  }

  public async createAccount(account: Omit<Account, "id">): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(account),
    });
    if (!response.ok) throw new Error("Failed to create account");
    return response.json();
  }

  public async updateAccount(id: number, account: Omit<Account, "id">): Promise<Account> {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(account),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to update account");
    }
    return response.json();
  }

  public async deleteAccount(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/accounts/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to delete account");
    }
  }

  public async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_URL}/categories`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    return response.json();
  }

  public async getDashboardData(filter?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<DashboardData> {
    try {
      const [txResponse, accResponse, catResponse] = await Promise.all([
        fetch(`${API_URL}/transactions`, { headers: this.getHeaders() }),
        fetch(`${API_URL}/accounts`, { headers: this.getHeaders() }),
        fetch(`${API_URL}/categories`, { headers: this.getHeaders() }),
      ]);

      if (txResponse.status === 401 || accResponse.status === 401) {
        this.logout();
        window.location.href = "/login";
        throw new Error("Não autorizado");
      }

      if (!txResponse.ok || !accResponse.ok || !catResponse.ok)
        throw new Error("Failed to fetch data");

      const transactions: Transaction[] = await txResponse.json();
      const accounts: Account[] = await accResponse.json();
      const categories: Category[] = await catResponse.json();

      let totalIncome = 0;
      let totalExpense = 0;

      // Initialize account balances
      const accountBalances: Record<number, number> = {};
      accounts.forEach((acc) => {
        accountBalances[acc.id] = acc.initial_balance;
      });

      // Calculate totals and account balances ONLY FOR PAID TRANSACTIONS
      transactions.forEach((t) => {
        if (!t.is_paid) return;

        const tDate = new Date(t.date);
        const inRange =
          (!filter?.startDate || tDate >= filter.startDate) &&
          (!filter?.endDate || tDate <= filter.endDate);

        if (t.type === "income") {
          if (inRange) totalIncome += t.amount;
          if (accountBalances[t.account_id] !== undefined)
            accountBalances[t.account_id] += t.amount;
        } else if (t.type === "expense") {
          if (inRange) totalExpense += t.amount;
          if (accountBalances[t.account_id] !== undefined)
            accountBalances[t.account_id] -= t.amount;
        }
      });

      const saldoTotal =
        accounts.reduce((acc, curr) => acc + curr.initial_balance, 0) +
        transactions
          .filter((t) => t.is_paid && t.type === "income")
          .reduce((acc, curr) => acc + curr.amount, 0) -
        transactions
          .filter((t) => t.is_paid && t.type === "expense")
          .reduce((acc, curr) => acc + curr.amount, 0);

      // Update accounts with calculated balances
      const calculatedAccounts = accounts.map((acc) => ({
        ...acc,
        valor: accountBalances[acc.id],
      }));

      // Group by category for charts (only in range)
      const expensesByCategory: Record<string, number> = {};
      const incomesByCategory: Record<string, number> = {};

      const categoryMap: Record<number, string> = {};
      categories.forEach((c) => (categoryMap[c.id] = c.name));

      transactions.forEach((t) => {
        const tDate = new Date(t.date);
        const inRange =
          (!filter?.startDate || tDate >= filter.startDate) &&
          (!filter?.endDate || tDate <= filter.endDate);

        if (!inRange) return;

        const catName = categoryMap[t.category_id] || "Desconhecida";
        if (t.type === "expense") {
          expensesByCategory[catName] =
            (expensesByCategory[catName] || 0) + t.amount;
        } else {
          incomesByCategory[catName] =
            (incomesByCategory[catName] || 0) + t.amount;
        }
      });

      const graficoDespesas = Object.entries(expensesByCategory).map(
        ([name, value]) => ({ name, value }),
      );
      const graficoReceitas = Object.entries(incomesByCategory).map(
        ([name, value]) => ({ name, value }),
      );

      // Calculate evolucaoMensal (Cumulative Balance)
      const initialTotal = accounts.reduce(
        (acc, curr) => acc + curr.initial_balance,
        0,
      );
      let runningBalance = initialTotal;
      const monthlyBalances: Record<string, number> = {};

      const sortedTransactions = [...transactions]
        .filter((t) => t.is_paid)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      sortedTransactions.forEach((t) => {
        const dateObj = new Date(t.date);
        const monthYear = dateObj.toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit",
        });

        if (t.type === "income") runningBalance += t.amount;
        else if (t.type === "expense") runningBalance -= t.amount;

        // Continually overwrites to store the final balance of that month
        monthlyBalances[monthYear] = runningBalance;
      });

      // Extract unique months in chronological order
      const uniqueMonths = Array.from(
        new Set(
          sortedTransactions.map((t) => {
            const dateObj = new Date(t.date);
            return dateObj.toLocaleDateString("pt-BR", {
              month: "short",
              year: "2-digit",
            });
          }),
        ),
      );

      const evolucaoMensal = uniqueMonths.map((month) => ({
        name: month,
        valor: monthlyBalances[month],
      }));

      // Filter evolucaoMensal to only show points within the period (or adjacent)
      // Actually, comparing formatted strings is hard, let's filter transactions first if needed
      // But keeping the whole evolution is often better. Let's just return all for now or filter by unique months.
      // We will leave evolucaoMensal as all-time or let it be. Usually it's nice to see all time evolution.

      // Enrich transactions with category_name
      const enrichedTransactions = transactions.map((t) => ({
        ...t,
        category_name: categoryMap[t.category_id] || "Desconhecida",
      }));

      return {
        saldoTotal: saldoTotal,
        totalIncome: totalIncome,
        totalExpense: totalExpense,
        contas: calculatedAccounts.map((acc) => ({
          ...acc,
          balance: acc.valor,
        })),
        graficoDespesas: graficoDespesas,
        graficoReceitas: graficoReceitas,
        transactions: enrichedTransactions,
        evolucaoMensal:
          evolucaoMensal.length > 0
            ? evolucaoMensal
            : [{ name: "Atual", valor: saldoTotal }],
      };
    } catch (error) {
      console.error("Error fetching data", error);
      return {
        saldoTotal: 0,
        totalIncome: 0,
        totalExpense: 0,
        contas: [],
        graficoDespesas: [],
        graficoReceitas: [],
        transactions: [],
        evolucaoMensal: [],
      };
    }
  }

  public async createTransaction(
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
      throw new Error("Não autorizado");
    }
    if (!response.ok) throw new Error("Failed to create transaction");
    return response.json();
  }

  public async updateTransaction(
    id: number,
    transaction: Omit<Transaction, "id">,
  ): Promise<Transaction> {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(transaction),
    });
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
      throw new Error("Não autorizado");
    }
    if (!response.ok) throw new Error("Failed to update transaction");
    return response.json();
  }

  public async deleteTransaction(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
    if (response.status === 401) {
      this.logout();
      window.location.href = "/login";
      throw new Error("Não autorizado");
    }
    if (!response.ok) throw new Error("Failed to delete transaction");
  }
}

export const financeService = new FinanceService();
