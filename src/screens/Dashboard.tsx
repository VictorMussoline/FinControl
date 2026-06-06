import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { DashboardData } from "../types/finance";
import { financeService } from "../services/financeService";
import { TransactionModal } from "../components/TransactionModal";
import { CustomDateModal } from "../components/CustomDateModal";
import { AccountModal } from "../components/AccountModal";
import { useModal } from "../contexts/ModalContext";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  PieChart as PieChartIcon,
  Landmark,
  TrendingUp,
  Calendar,
  ChevronDown,
} from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1919",
];

type Period =
  | "current_month"
  | "last_24h"
  | "last_week"
  | "last_month"
  | "last_year"
  | "all_time"
  | "custom";

const fmt = (val: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val || 0);

interface TooltipPayload {
  name: string;
  value: number;
  payload: { fill: string };
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          {payload[0].name}
        </p>
        <p
          className="text-md font-bold"
          style={{ color: payload[0].payload.fill }}
        >
          {fmt(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("current_month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCustomDateModalOpen, setIsCustomDateModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const { showConfirm, showAlert } = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const periodLabels: Record<Period, string> = {
    current_month: "Mês atual",
    last_24h: "Últimas 24h",
    last_week: "Última semana",
    last_month: "Último mês",
    last_year: "Último ano",
    all_time: "Todo o tempo",
    custom: "Tempo específico",
  };

  const loadData = async () => {
    try {
      setLoading(true);
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      const now = new Date();

      if (period === "current_month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
        );
      } else if (period === "last_24h") {
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (period === "last_week") {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (period === "last_month") {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate(),
        );
      } else if (period === "last_year") {
        startDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate(),
        );
      } else if (period === "custom") {
        if (customStart) startDate = new Date(customStart + "T00:00:00");
        if (customEnd) endDate = new Date(customEnd + "T23:59:59");
      }

      const dashboardData = await financeService.getDashboardData({
        startDate,
        endDate,
      });
      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customStart, customEnd]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveTransaction = async (transaction: Omit<import('../types/finance').Transaction, 'id' | 'category_name'>) => {
    await financeService.createTransaction(transaction);
    await loadData(); // Refresh data
  };

  const handleSaveAccount = async (accountData: any) => {
    await financeService.createAccount(accountData);
    await loadData();
    showAlert("Conta criada com sucesso!", "Sucesso", false);
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-xl font-semibold text-gray-500 animate-pulse">
          Carregando FinControl...
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 shadow-sm w-full sm:w-48 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <div className="flex items-center gap-2">
                <Calendar
                  size={18}
                  className="text-gray-500 dark:text-gray-400"
                />
                <span className="text-sm font-medium">
                  {periodLabels[period]}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <ul className="py-1">
                  {Object.entries(periodLabels).map(([key, label]) => (
                    <li key={key}>
                      <button
                        onClick={() => {
                          if (key === "custom") {
                            setIsCustomDateModalOpen(true);
                          } else {
                            setPeriod(key as Period);
                          }
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          period === key
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (data.contas.length === 0) {
                showConfirm(
                  "Você precisa de uma conta antes de adicionar transações. Deseja criar uma agora?",
                  () => setIsAccountModalOpen(true),
                  "Criar Conta"
                );
              } else {
                setIsModalOpen(true);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            + Adicionar Transação
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Saldo Total */}
        <section className="relative overflow-hidden p-6 rounded-xl shadow-lg border border-transparent bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-emerald-700 dark:to-teal-900 transition-shadow hover:shadow-xl text-white">
          <Wallet className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
          <h3 className="text-lg font-medium text-blue-100 dark:text-emerald-100 border-b border-white/20 pb-3 mb-4 flex items-center gap-2">
            <Wallet size={20} /> Saldo Total
          </h3>
          <div className="text-4xl font-bold text-white relative z-10">
            {fmt(data.saldoTotal)}
          </div>
        </section>

        {/* 2. Minhas Contas */}
        <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Landmark size={20} /> Minhas Contas
            </h3>
            <button
              onClick={() => navigate("/accounts")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Gerenciar
            </button>
          </div>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.contas.length === 0 ? (
              <li className="py-3 text-gray-500 text-sm text-center">
                Nenhuma conta cadastrada.
              </li>
            ) : (
              data.contas.map((conta) => (
                <li key={conta.id} className="flex justify-between py-3">
                  <span className="text-gray-800 dark:text-gray-200">
                    {conta.name}
                  </span>
                  <strong className="text-gray-900 dark:text-white">
                    {fmt(conta.balance || 0)}
                  </strong>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* 3. Despesas por Categoria */}
        <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
            <PieChartIcon size={20} /> Despesas por Categoria
          </h3>
          <div className="h-[250px] w-full flex justify-center items-center">
            {data.graficoDespesas.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Nenhuma despesa registrada.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.graficoDespesas}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {data.graficoDespesas.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {data.graficoDespesas.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {data.graficoDespesas.map((d, i) => (
                <div
                  key={d.name}
                  className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  ></span>
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 4. Receitas por Categoria */}
        <section className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-shadow hover:shadow-md">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
            <PieChartIcon size={20} /> Receitas por Categoria
          </h3>
          <div className="h-[250px] w-full flex justify-center items-center">
            {data.graficoReceitas.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Nenhuma receita registrada.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.graficoReceitas}
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={6}
                  >
                    {data.graficoReceitas.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#00C49F", "#0088FE", "#FFBB28"][index % 3]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {data.graficoReceitas.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {data.graficoReceitas.map((d, i) => (
                <div
                  key={d.name}
                  className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: ["#00C49F", "#0088FE", "#FFBB28"][i % 3],
                    }}
                  ></span>
                  {d.name}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Evolução Mensal */}
        <section className="md:col-span-2 relative overflow-hidden rounded-xl shadow-lg transition-shadow hover:shadow-xl dark:bg-[#1a1a2e] bg-white border border-gray-100 dark:border-gray-800">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-[#00D9FF] dark:to-[#00FFA3] z-10"></div>
          <div className="p-6 relative z-20">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Evolução Mensal
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.evolucaoMensal}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    className="text-gray-100 dark:text-gray-800"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                    tick={{ fill: "currentColor" }}
                  />
                  <YAxis
                    stroke="currentColor"
                    className="text-gray-500 dark:text-gray-400"
                    tick={{ fill: "currentColor" }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      borderColor: "#333",
                      color: "#fff",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [fmt(value as number), "Saldo"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#00D9FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValor)"
                    activeDot={{
                      r: 8,
                      fill: "#00FFA3",
                      stroke: "#fff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setIsCustomDateModalOpen(false)}
        onApply={(start, end) => {
          setCustomStart(start);
          setCustomEnd(end);
          setPeriod("custom");
          setIsCustomDateModalOpen(false);
        }}
        initialStart={customStart}
        initialEnd={customEnd}
      />

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
};
