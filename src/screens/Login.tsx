import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { financeService } from "../services/financeService";
import { Mail, Lock, TrendingUp, ShieldCheck, PieChart, ArrowRight } from "lucide-react";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegistering) {
        await financeService.register(email, password);
        // After register, automatically login
      }
      await financeService.login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de autenticação");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-white font-sans selection:bg-blue-500/30">
      
      {/* Esquerda: Painel Artístico (Oculto no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-gray-900 via-[#111] to-black">
        {/* Abstract background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        
        <div className="absolute inset-0 flex flex-col justify-between p-16 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">FinControl</span>
          </div>

          <div className="space-y-6 max-w-lg animate-in slide-in-from-left-8 duration-1000">
            <h1 className="text-5xl font-bold leading-tight">
              Seu dinheiro sob <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">controle absoluto</span>.
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              Tome decisões financeiras mais inteligentes com nossa plataforma de gestão integrada. Simples, segura e direto ao ponto.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>Dados Criptografados</span>
            </div>
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-blue-500" />
              <span>Análises Precisas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direita: Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-8 transition-colors duration-300 relative overflow-hidden">
        
        {/* Subtle background glow for dark mode right panel */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[120px] hidden dark:block" />

        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-bottom-4 duration-700 relative z-10">
          
          <div className="text-center lg:text-left">
            {/* Header Mobile Only */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isRegistering ? "Criar nova conta" : "Acesse sua conta"}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {isRegistering ? "Preencha os dados para começar" : "Bem-vindo de volta! Sinta a tranquilidade."}
            </p>
          </div>

          <div className="bg-white/70 dark:bg-[#121212]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 dark:border-red-900/30 flex items-center gap-2 animate-in fade-in duration-300">
                  <span className="shrink-0">⚠️</span>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-transparent rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-[#222] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Senha
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-transparent rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:bg-white dark:focus:bg-[#222] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-white font-semibold text-base transition-all bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isRegistering ? "Criar Conta" : "Entrar na Plataforma"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {isRegistering ? "Já faz parte da nossa plataforma?" : "Ainda não tem o controle na mão?"}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError("");
                }}
                className="ml-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-500"
              >
                {isRegistering ? "Faça Login" : "Crie uma conta"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
