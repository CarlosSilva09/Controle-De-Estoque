# Sistema de Controle de Estoque

Um sistema moderno para gerenciamento de estoque, desenvolvido com Next.js 15, TypeScript e ShadCN UI.

## ✨ Principais Funcionalidades

- **Dashboard Interativo:** Estatísticas em tempo real, gráficos de movimentação, alertas de estoque baixo e visão geral dos produtos.
- **Gestão Completa de Produtos:** CRUD com validações, geração automática de SKU, campos detalhados e filtros avançados.
- **Movimentações de Estoque:** Registro de entradas, saídas e ajustes, histórico completo e prevenção de inconsistências.
- **Exportação de Dados:** Suporte a CSV e JSON para produtos, movimentações ou backup total.
- **Relatórios e Análises:** Resumos por categoria, status de estoque, movimentações recentes e sugestões de reposição.
- **Experiência do Usuário:** Interface responsiva, notificações toast, carregamento progressivo e navegação intuitiva.

## 🛠️ Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **ShadCN UI**
- **Recharts** (gráficos)
- **Sonner** (notificações)
- **Date-fns** (datas)
- **Lucide React** (ícones)
- **Tailwind CSS**

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
   ```bash
   git clone <repository-url>
   cd testeprojeto
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
4. Acesse `http://localhost:3000` no navegador.

## 📂 Estrutura de Pastas

```
testeprojeto/
├── app/                # Páginas e layouts principais
│   └── dashboard/      # Dashboard principal
├── components/         # Componentes reutilizáveis (UI, gráficos, formulários, filtros, etc)
├── lib/                # Tipos, dados mock, utilitários
└── public/             # Arquivos estáticos
```

## 🏗️ Próximos Passos

- Integração com backend e banco de dados (REST/GraphQL, PostgreSQL/MySQL/MongoDB)
- Autenticação e autorização de usuários
- Leitura de código de barras/QR code
- Relatórios avançados e exportação para PDF
- Aplicativo mobile (React Native ou PWA)
- Funcionalidades offline e notificações automáticas

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

**Desenvolvido com Next.js, TypeScript e ShadCN UI**
