export type Language = "PT-BR" | "EN-US" | "ES";

type TranslationDictionary = {
  [key: string]: {
    "PT-BR": string;
    "EN-US": string;
    "ES": string;
  };
};

export const translations: TranslationDictionary = {
  // Sidebar
  "sidebar.dashboard": { "PT-BR": "Dashboard", "EN-US": "Dashboard", "ES": "Tablero" },
  "sidebar.transactions": { "PT-BR": "Transações", "EN-US": "Transactions", "ES": "Transacciones" },
  "sidebar.accounts": { "PT-BR": "Contas", "EN-US": "Accounts", "ES": "Cuentas" },
  "sidebar.language": { "PT-BR": "Idioma", "EN-US": "Language", "ES": "Idioma" },
  "sidebar.lightMode": { "PT-BR": "Modo Claro", "EN-US": "Light Mode", "ES": "Modo Claro" },
  "sidebar.darkMode": { "PT-BR": "Modo Escuro", "EN-US": "Dark Mode", "ES": "Modo Oscuro" },
  "sidebar.logout": { "PT-BR": "Sair", "EN-US": "Logout", "ES": "Salir" },

  // Dashboard
  "dashboard.title": { "PT-BR": "Dashboard", "EN-US": "Dashboard", "ES": "Tablero" },
  "dashboard.period.current_month": { "PT-BR": "Mês atual", "EN-US": "Current month", "ES": "Mes actual" },
  "dashboard.period.last_24h": { "PT-BR": "Últimas 24h", "EN-US": "Last 24h", "ES": "Últimas 24h" },
  "dashboard.period.last_week": { "PT-BR": "Última semana", "EN-US": "Last week", "ES": "Última semana" },
  "dashboard.period.last_month": { "PT-BR": "Último mês", "EN-US": "Last month", "ES": "Último mes" },
  "dashboard.period.last_year": { "PT-BR": "Último ano", "EN-US": "Last year", "ES": "Último año" },
  "dashboard.period.all_time": { "PT-BR": "Todo o tempo", "EN-US": "All time", "ES": "Todo el tiempo" },
  "dashboard.period.custom": { "PT-BR": "Tempo específico", "EN-US": "Custom time", "ES": "Tiempo específico" },
  "dashboard.newTransaction": { "PT-BR": "+ Adicionar Transação", "EN-US": "+ Add Transaction", "ES": "+ Añadir Transacción" },
  "dashboard.totalBalance": { "PT-BR": "Saldo Total", "EN-US": "Total Balance", "ES": "Saldo Total" },
  "dashboard.myAccounts": { "PT-BR": "Minhas Contas", "EN-US": "My Accounts", "ES": "Mis Cuentas" },
  "dashboard.manage": { "PT-BR": "Gerenciar", "EN-US": "Manage", "ES": "Gestionar" },
  "dashboard.noAccounts": { "PT-BR": "Nenhuma conta cadastrada.", "EN-US": "No accounts registered.", "ES": "No hay cuentas registradas." },
  "dashboard.expensesByCategory": { "PT-BR": "Despesas por Categoria", "EN-US": "Expenses by Category", "ES": "Gastos por Categoría" },
  "dashboard.incomesByCategory": { "PT-BR": "Receitas por Categoria", "EN-US": "Incomes by Category", "ES": "Ingresos por Categoría" },
  "dashboard.noExpenses": { "PT-BR": "Nenhuma despesa registrada.", "EN-US": "No expenses registered.", "ES": "No hay gastos registrados." },
  "dashboard.noIncomes": { "PT-BR": "Nenhuma receita registrada.", "EN-US": "No incomes registered.", "ES": "No hay ingresos registrados." },
  "dashboard.monthlyEvolution": { "PT-BR": "Evolução Mensal", "EN-US": "Monthly Evolution", "ES": "Evolución Mensual" },

  // Accounts
  "accounts.title": { "PT-BR": "Minhas Contas", "EN-US": "My Accounts", "ES": "Mis Cuentas" },
  "accounts.newAccount": { "PT-BR": "Nova Conta", "EN-US": "New Account", "ES": "Nueva Cuenta" },
  "accounts.noAccountsYet": { "PT-BR": "Nenhuma conta cadastrada ainda.", "EN-US": "No accounts registered yet.", "ES": "Aún no hay cuentas registradas." },
  "accounts.createFirstAccount": { "PT-BR": "Crie sua primeira conta para começar a registrar transações.", "EN-US": "Create your first account to start tracking transactions.", "ES": "Cree su primera cuenta para comenzar a registrar transacciones." },
  "accounts.createAccount": { "PT-BR": "Criar Conta", "EN-US": "Create Account", "ES": "Crear Cuenta" },
  "accounts.edit": { "PT-BR": "Editar", "EN-US": "Edit", "ES": "Editar" },
  "accounts.delete": { "PT-BR": "Excluir", "EN-US": "Delete", "ES": "Eliminar" },
  "accounts.type.checking": { "PT-BR": "🏦 Conta Corrente", "EN-US": "🏦 Checking Account", "ES": "🏦 Cuenta Corriente" },
  "accounts.type.savings": { "PT-BR": "🌱 Conta Poupança", "EN-US": "🌱 Savings Account", "ES": "🌱 Cuenta de Ahorros" },
  "accounts.type.investment": { "PT-BR": "📈 Investimento", "EN-US": "📈 Investment", "ES": "📈 Inversión" },
  "accounts.type.default": { "PT-BR": "🏦 Conta", "EN-US": "🏦 Account", "ES": "🏦 Cuenta" },
  "accounts.confirmDelete.title": { "PT-BR": "Excluir Conta e Transações?", "EN-US": "Delete Account and Transactions?", "ES": "¿Eliminar Cuenta y Transacciones?" },
  "accounts.confirmDelete.msg": { "PT-BR": "Esta ação é IRREVERSÍVEL. Todas as transações vinculadas a esta conta também serão permanentemente excluídas.", "EN-US": "This action is IRREVERSIBLE. All transactions linked to this account will also be permanently deleted.", "ES": "Esta acción es IRREVERSIBLE. Todas las transacciones vinculadas a esta cuenta también se eliminarán permanentemente." },
  "accounts.success.created": { "PT-BR": "Conta criada com sucesso!", "EN-US": "Account created successfully!", "ES": "¡Cuenta creada con éxito!" },
  "accounts.success.deleted": { "PT-BR": "A conta '{name}' foi excluída com sucesso!", "EN-US": "Account '{name}' deleted successfully!", "ES": "¡Cuenta '{name}' eliminada con éxito!" },

  // Transactions
  "transactions.title": { "PT-BR": "Transações", "EN-US": "Transactions", "ES": "Transacciones" },
  "transactions.newTransaction": { "PT-BR": "Nova Transação", "EN-US": "New Transaction", "ES": "Nueva Transacción" },
  "transactions.filter.all": { "PT-BR": "Todos", "EN-US": "All", "ES": "Todos" },
  "transactions.filter.incomes": { "PT-BR": "Receitas", "EN-US": "Incomes", "ES": "Ingresos" },
  "transactions.filter.expenses": { "PT-BR": "Despesas", "EN-US": "Expenses", "ES": "Gastos" },
  "transactions.noTransactions": { "PT-BR": "Nenhuma transação encontrada para este filtro.", "EN-US": "No transactions found for this filter.", "ES": "No se encontraron transacciones para este filtro." },
  "transactions.status.paid": { "PT-BR": "Pago", "EN-US": "Paid", "ES": "Pagado" },
  "transactions.status.pending": { "PT-BR": "Pendente", "EN-US": "Pending", "ES": "Pendiente" },
  "transactions.confirmDelete.title": { "PT-BR": "Tem certeza que deseja excluir esta transação?", "EN-US": "Are you sure you want to delete this transaction?", "ES": "¿Está seguro de que desea eliminar esta transacción?" },
  "transactions.needAccount.msg": { "PT-BR": "Você precisa de uma conta antes de adicionar transações. Deseja criar uma agora?", "EN-US": "You need an account before adding transactions. Do you want to create one now?", "ES": "Necesitas una cuenta antes de agregar transacciones. ¿Quieres crear una ahora?" },

  // Login
  "login.title.login": { "PT-BR": "Acesse sua conta", "EN-US": "Access your account", "ES": "Accede a tu cuenta" },
  "login.title.register": { "PT-BR": "Criar nova conta", "EN-US": "Create new account", "ES": "Crear nueva cuenta" },
  "login.subtitle.login": { "PT-BR": "Bem-vindo de volta! Sinta a tranquilidade.", "EN-US": "Welcome back! Feel the peace of mind.", "ES": "¡Bienvenido de nuevo! Siente la tranquilidad." },
  "login.subtitle.register": { "PT-BR": "Preencha os dados para começar", "EN-US": "Fill in the details to start", "ES": "Completa los datos para comenzar" },
  "login.email": { "PT-BR": "Email", "EN-US": "Email", "ES": "Correo electrónico" },
  "login.password": { "PT-BR": "Senha", "EN-US": "Password", "ES": "Contraseña" },
  "login.btn.login": { "PT-BR": "Entrar na Plataforma", "EN-US": "Enter Platform", "ES": "Entrar a la Plataforma" },
  "login.btn.register": { "PT-BR": "Criar Conta", "EN-US": "Create Account", "ES": "Crear Cuenta" },
  "login.switch.toRegister": { "PT-BR": "Ainda não tem o controle na mão?", "EN-US": "Don't have control yet?", "ES": "¿Aún no tienes el control?" },
  "login.switch.toLogin": { "PT-BR": "Já faz parte da nossa plataforma?", "EN-US": "Already part of our platform?", "ES": "¿Ya eres parte de nuestra plataforma?" },
  "login.switch.btn.toRegister": { "PT-BR": "Crie uma conta", "EN-US": "Create an account", "ES": "Crea una cuenta" },
  "login.switch.btn.toLogin": { "PT-BR": "Faça Login", "EN-US": "Log in", "ES": "Iniciar sesión" },
  "login.slogan": { "PT-BR": "Seu dinheiro sob controle absoluto.", "EN-US": "Your money under absolute control.", "ES": "Tu dinero bajo control absoluto." },
  "login.description": { "PT-BR": "Tome decisões financeiras mais inteligentes com nossa plataforma de gestão integrada. Simples, segura e direto ao ponto.", "EN-US": "Make smarter financial decisions with our integrated management platform. Simple, secure, and straight to the point.", "ES": "Toma decisiones financieras más inteligentes con nuestra plataforma de gestión integrada. Simple, segura y directa al grano." },
  "login.encrypted": { "PT-BR": "Dados Criptografados", "EN-US": "Encrypted Data", "ES": "Datos Encriptados" },
  "login.analysis": { "PT-BR": "Análises Precisas", "EN-US": "Accurate Analysis", "ES": "Análisis Precisos" },

  // Modals shared
  "modal.save": { "PT-BR": "Salvar", "EN-US": "Save", "ES": "Guardar" },
  "modal.cancel": { "PT-BR": "Cancelar", "EN-US": "Cancel", "ES": "Cancelar" },
  "modal.delete": { "PT-BR": "Excluir", "EN-US": "Delete", "ES": "Eliminar" },
  "modal.confirm": { "PT-BR": "Confirmar", "EN-US": "Confirm", "ES": "Confirmar" },
  "modal.close": { "PT-BR": "Fechar", "EN-US": "Close", "ES": "Cerrar" },

  // Account Modal
  "accountModal.title.new": { "PT-BR": "Nova Conta", "EN-US": "New Account", "ES": "Nueva Cuenta" },
  "accountModal.title.edit": { "PT-BR": "Editar Conta", "EN-US": "Edit Account", "ES": "Editar Cuenta" },
  "accountModal.name": { "PT-BR": "Nome da Conta", "EN-US": "Account Name", "ES": "Nombre de la Cuenta" },
  "accountModal.type": { "PT-BR": "Tipo de Conta", "EN-US": "Account Type", "ES": "Tipo de Cuenta" },
  "accountModal.type.checking": { "PT-BR": "Conta Corrente", "EN-US": "Checking Account", "ES": "Cuenta Corriente" },
  "accountModal.type.savings": { "PT-BR": "Conta Poupança", "EN-US": "Savings Account", "ES": "Cuenta de Ahorros" },
  "accountModal.type.investment": { "PT-BR": "Investimento", "EN-US": "Investment", "ES": "Inversión" },
  "accountModal.initialBalance": { "PT-BR": "Saldo Inicial", "EN-US": "Initial Balance", "ES": "Saldo Inicial" },
  "accountModal.color": { "PT-BR": "Cor de Identificação", "EN-US": "Identification Color", "ES": "Color de Identificación" },

  // Transaction Modal
  "transactionModal.title.new": { "PT-BR": "Nova Transação", "EN-US": "New Transaction", "ES": "Nueva Transacción" },
  "transactionModal.title.edit": { "PT-BR": "Editar Transação", "EN-US": "Edit Transaction", "ES": "Editar Transacción" },
  "transactionModal.type": { "PT-BR": "Tipo", "EN-US": "Type", "ES": "Tipo" },
  "transactionModal.type.expense": { "PT-BR": "Despesa", "EN-US": "Expense", "ES": "Gasto" },
  "transactionModal.type.income": { "PT-BR": "Receita", "EN-US": "Income", "ES": "Ingreso" },
  "transactionModal.amount": { "PT-BR": "Valor", "EN-US": "Amount", "ES": "Valor" },
  "transactionModal.description": { "PT-BR": "Descrição", "EN-US": "Description", "ES": "Descripción" },
  "transactionModal.account": { "PT-BR": "Conta", "EN-US": "Account", "ES": "Cuenta" },
  "transactionModal.selectAccount": { "PT-BR": "Selecione uma conta", "EN-US": "Select an account", "ES": "Seleccione una cuenta" },
  "transactionModal.category": { "PT-BR": "Categoria", "EN-US": "Category", "ES": "Categoría" },
  "transactionModal.selectCategory": { "PT-BR": "Selecione uma categoria", "EN-US": "Select a category", "ES": "Seleccione una categoría" },
  "transactionModal.date": { "PT-BR": "Data", "EN-US": "Date", "ES": "Fecha" },
  "transactionModal.status": { "PT-BR": "Status", "EN-US": "Status", "ES": "Estado" },
  "transactionModal.status.paid": { "PT-BR": "Pago", "EN-US": "Paid", "ES": "Pagado" },
  "transactionModal.status.unpaid": { "PT-BR": "Não Pago", "EN-US": "Unpaid", "ES": "No Pagado" },

  // Custom Date Modal
  "customDateModal.title": { "PT-BR": "Selecionar Período", "EN-US": "Select Period", "ES": "Seleccionar Período" },
  "customDateModal.start": { "PT-BR": "Data Inicial", "EN-US": "Start Date", "ES": "Fecha Inicial" },
  "customDateModal.end": { "PT-BR": "Data Final", "EN-US": "End Date", "ES": "Fecha Final" },
  "customDateModal.apply": { "PT-BR": "Aplicar Filtro", "EN-US": "Apply Filter", "ES": "Aplicar Filtro" },

  // Language Modal
  "languageModal.title": { "PT-BR": "Selecione o Idioma", "EN-US": "Select Language", "ES": "Seleccionar Idioma" },
  "languageModal.portuguese": { "PT-BR": "Português", "EN-US": "Portuguese", "ES": "Portugués" },
  "languageModal.english": { "PT-BR": "Inglês", "EN-US": "English", "ES": "Inglés" },
  "languageModal.spanish": { "PT-BR": "Espanhol", "EN-US": "Spanish", "ES": "Español" },

  // Logout Modal
  "logoutModal.title": { "PT-BR": "Confirmar Saída", "EN-US": "Confirm Logout", "ES": "Confirmar Salida" },
  "logoutModal.msg": { "PT-BR": "Tem certeza que deseja sair do sistema?", "EN-US": "Are you sure you want to log out of the system?", "ES": "¿Está seguro de que desea salir del sistema?" },
  "logoutModal.logout": { "PT-BR": "Sair", "EN-US": "Logout", "ES": "Salir" },

  // Categories
  "category.Alimentação": { "PT-BR": "Alimentação", "EN-US": "Food", "ES": "Alimentación" },
  "category.Moradia": { "PT-BR": "Moradia", "EN-US": "Housing", "ES": "Vivienda" },
  "category.Transporte": { "PT-BR": "Transporte", "EN-US": "Transport", "ES": "Transporte" },
  "category.Lazer": { "PT-BR": "Lazer", "EN-US": "Leisure", "ES": "Ocio" },
  "category.Saúde": { "PT-BR": "Saúde", "EN-US": "Health", "ES": "Salud" },
  "category.Salário": { "PT-BR": "Salário", "EN-US": "Salary", "ES": "Salario" },
  "category.Investimentos": { "PT-BR": "Investimentos", "EN-US": "Investments", "ES": "Inversiones" },
  "category.Outros": { "PT-BR": "Outros", "EN-US": "Others", "ES": "Otros" }
};
