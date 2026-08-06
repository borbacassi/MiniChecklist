# Lista de Dates

Uma checklist interativa de "dates para fazer antes do casório" — criada como presente para minha namorada, e também como projeto de estudo prático de React, Next.js e Supabase.

**🔗 [Ver o site no ar](https://SEU-LINK-AQUI.pages.dev)** <!-- troque pelo link real do deploy -->

![status](https://img.shields.io/badge/status-em%20desenvolvimento-ff69b4)

---

## 📌 Sobre o projeto

Cada item da lista representa um encontro/date que queremos viver juntos. É possível marcar como concluído, adicionar uma descrição, anexar fotos de memória e remover itens — tudo salvo em um banco de dados real, então nada se perde ao recarregar a página.

Além do propósito pessoal, este projeto foi minha porta de entrada para aprender **React** e **Next.js** na prática: montei tudo do zero, entendendo cada conceito (state, props, efeitos, formulários controlados, integração com backend) antes de escrever o código, em vez de copiar soluções prontas.

## ✨ Funcionalidades

- ✅ Criar, marcar como concluído e remover "dates" (CRUD completo)
- 💾 Persistência de dados em banco Postgres (via Supabase)
- 🔒 Controle de acesso a nível de linha (Row Level Security)
- 📱 Layout responsivo
- 🎨 Identidade visual customizada
- 🖼️ Upload de fotos por date *(em desenvolvimento)*
- 📅 Calendário dos encontros + contador de tempo juntos *(em desenvolvimento)*

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) + React |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Backend / Banco de dados | [Supabase](https://supabase.com/) (Postgres) |
| Hospedagem | Cloudflare Pages/Workers (deploy estático via `next export`) |
| Versionamento | Git + GitHub |

## 🚀 Rodando localmente

Pré-requisitos: [Node.js](https://nodejs.org/) instalado e uma conta gratuita no [Supabase](https://supabase.com/).

```bash
# clona o repositório
git clone https://github.com/borbacassi/MiniChecklist.git
cd MiniChecklist

# instala as dependências
npm install
```

Cria um arquivo `.env.local` na raiz do projeto com suas próprias credenciais do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

Depois, roda o servidor de desenvolvimento:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no navegador.

### Estrutura do banco de dados

A tabela principal (`datecards`) tem a seguinte estrutura:

```sql
create table datecards (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  feito boolean,
  descricao text,
  data text,
  imgs text[] default '{}'
);
```

Com **Row Level Security** habilitado e políticas de leitura/escrita configuradas (veja `/supabase` se você adicionar os arquivos de migração, ou configure manualmente pelo painel do Supabase).

## 📂 Estrutura do projeto

```
app/
  page.tsx           → página principal, gerencia o estado e a comunicação com o Supabase
  components/
    Card.tsx          → componente visual de cada "date"
    Doodles.tsx        → elementos decorativos laterais
  globals.css          → estilos globais e identidade visual
types/
  dateCard.ts          → definição de tipos TypeScript
lib/
  supabase.ts           → configuração do cliente Supabase
```

## 🧠 O que aprendi construindo isso

- Diferença entre **componentes de servidor e de cliente** no App Router do Next.js
- Gerenciamento de estado com `useState` e "lifting state up"
- Busca e sincronização de dados assíncronos com `useEffect`
- Formulários controlados em React
- Modelagem de dados e escrita de queries SQL no Postgres
- Configuração de políticas de segurança (RLS) no Supabase
- Deploy de uma aplicação Next.js como site estático no Cloudflare

## 🗺️ Próximos passos

- [ ] Upload de fotos via Supabase Storage
- [ ] Calendário visual dos dates marcados
- [ ] Contador de tempo de relacionamento (anos/meses/dias)
- [ ] Domínio próprio

---

Feito com carinho (e bastante debug) por [borbacassi](https://github.com/borbacassi)