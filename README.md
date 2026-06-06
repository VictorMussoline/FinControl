# 📊 FinControl

![FinControl Banner](https://i.ibb.co/FLLqZQw5/Gemini-Generated-Image-x8aykux8aykux8ay.png)

<div align="center">
  <p>
    <strong>O seu dinheiro sob controle absoluto.</strong><br>
    Um sistema completo de Gestão Financeira Pessoal com Dashboard analítico, gestão de contas, transações e suporte a múltiplos idiomas.
  </p>

  <p>
    <a href="#-tecnologias">Tecnologias</a> •
    <a href="#-funcionalidades">Funcionalidades</a> •
    <a href="#-arquitetura">Arquitetura</a> •
    <a href="#-como-executar">Como Executar</a>
  </p>
</div>

## 🚀 Tecnologias

Este projeto foi desenvolvido com uma stack moderna e robusta, visando alta performance e excelente experiência de desenvolvimento (DX).

### Frontend
- **React 18** com **Vite** (Build ultra-rápido)
- **TypeScript** (Tipagem estática e segurança)
- **Tailwind CSS** (Estilização utilitária e responsividade)
- **Recharts** (Gráficos interativos)
- **Lucide React** (Ícones modernos)
- **Context API** (Gerenciamento de estado Global)

### Backend
- **Python 3.10+** com **FastAPI** (Alta performance e rotas assíncronas)
- **SQLModel** & **SQLAlchemy** (ORM elegante e validação de dados com Pydantic)
- **PostgreSQL** (Banco de Dados Relacional)
- **Passlib & JWT** (Autenticação e Criptografia de senhas)

### Infraestrutura & Deploy
- **Frontend Host:** Vercel
- **Backend Host:** Vercel (Serverless Functions)
- **Database:** Supabase (PostgreSQL Gerenciado)

---

## ✨ Funcionalidades

- **🔒 Autenticação Segura:** Login e Registro com JWT (JSON Web Tokens) e senhas criptografadas (bcrypt).
- **📈 Dashboard Analítico:** Visão geral do saldo, receitas, despesas, gráficos de pizza por categoria e gráfico de evolução mensal do patrimônio.
- **🏦 Gestão de Contas:** Criação de diferentes contas (Corrente, Poupança, Investimento) com cores personalizáveis e saldos individuais.
- **💸 Controle de Transações:** Registro de receitas e despesas, filtro por período, classificação por categoria e status de pagamento (Pago/Pendente).
- **🌍 Internacionalização (i18n):** Suporte nativo e instantâneo para Português (BR), Inglês (US) e Espanhol (ES).
- **🌓 Tema Claro/Escuro:** Alternância de temas com salvamento no cache (Local Storage) e prevenção de FOUC (Flash of Unstyled Content).
- **📱 Design Responsivo:** Interface fluida, com menu lateral retrátil e componentes que se adaptam perfeitamente a dispositivos móveis.
- **⏳ Loading States:** Uso de Skeletons animados durante o carregamento de dados da API, evitando saltos de layout.

---

## 🏗 Arquitetura

O projeto adota uma arquitetura **Monorepo** simplificada:
- `/` (Root): Contém a aplicação Web em React.
- `/backend`: Contém a API em FastAPI.

A comunicação entre o cliente e o servidor ocorre via chamadas RESTful utilizando a API nativa `fetch`, com os tokens JWT trafegados via *Authorization Headers*.

---

## 💻 Como Executar (Ambiente de Desenvolvimento)

### Pré-requisitos
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL (Local ou na Nuvem, ex: Supabase)

### 1. Clonando o Repositório
```bash
git clone https://github.com/VictorMussoline/FinControl.git
cd FinControl
```

### 2. Configurando o Backend (API)
```bash
cd backend

# Crie e ative um ambiente virtual
python -m venv venv
# No Windows:
venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Crie o arquivo .env
cp .env.example .env
# Edite o arquivo .env com a URL do seu Banco de Dados PostgreSQL (DATABASE_URL)

# Inicie o servidor local
uvicorn main:app --reload
```
A API estará rodando em: `http://localhost:8000` e a documentação interativa do Swagger em `http://localhost:8000/docs`.

### 3. Configurando o Frontend (Web)
Abra um novo terminal e volte para a raiz do projeto:
```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
O Frontend estará rodando em: `http://localhost:5173`

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se à vontade para usá-lo como inspiração, estudar o código ou adaptá-lo!

---
*Desenvolvido com dedicação por Victor Mussoline.* 🚀
