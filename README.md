<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Instituto_Federal_Marca_2015.svg/960px-Instituto_Federal_Marca_2015.svg.png" alt="Logo IFRJ" width="90" />

# AcervIF

**Repositório público de informações acadêmicas para os alunos de Engenharia do IFRJ Campus Niterói**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Firebase](https://img.shields.io/badge/backend-firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#contribuindo)
[![Made for IFRJ](https://img.shields.io/badge/feito%20para-IFRJ%20Niterói-007A33?style=flat-square)](https://www.ifrj.edu.br)

[Reportar bug](../../issues) · [Sugerir feature](../../issues)

</div>

---

## Sobre o projeto

**AcervIF** é uma plataforma web centralizada, criada por e para estudantes, que reúne materiais e informações essenciais dos cursos de **Engenharia de Computação** e **Engenharia de Produção** do **IFRJ Campus Niterói**: provas antigas, resumos, fluxogramas curriculares, calendário letivo, planejador de horários e um guia de comércios locais.

O objetivo é simples: reduzir a fricção que todo calouro (e nem tão calouro) sente ao procurar informação espalhada em grupos de WhatsApp, PDFs perdidos e print de conversa. Tudo em um só lugar, rápido e sem burocracia.

## Funcionalidades

| Módulo | Descrição |
| --- | --- |
| 📚 **Acervo** (`index.html`) | Repositório de posts, materiais e conteúdos em destaque, com busca e filtro por categoria |
| 🗺️ **Fluxogramas** (`fluxograma.html`) | Malha curricular interativa (kanban) de Eng. Computação e Eng. Produção, com filtros por núcleo de disciplinas |
| 📅 **Calendário** (`calendario.html`) | Calendário letivo do campus com legendas por tipo de evento (feriados, SIGAA, recessos, etc.) |
| 🕒 **Planejador de Horários** (`planejador_horarios.html`) | Montagem da grade horária do semestre, com exportação para **PDF** e **XLSX** |
| 🏪 **Comércios Locais** (`comercios.html`) | Guia de serviços e comércios próximos ao campus (xerox, lanches, etc.) |
| 🔐 **Painel Administrativo** (`admin.html`) | Terminal de gestão de conteúdo autenticado, para atualizar o acervo e os comércios |

Extras de UX presentes em toda a plataforma:

- 🌗 Tema claro / escuro / automático (persistido em `localStorage`)
- 🎨 Interface em *glassmorphism*, responsiva e com identidade visual do IFRJ
- 🔍 Busca e filtros em tempo real
- ⚡ Sem etapa de build — HTML, CSS e JS puros, deploy instantâneo

## Stack

- **Frontend:** HTML5, [Tailwind CSS](https://tailwindcss.com) (via CDN), JavaScript (ES Modules), [Lucide Icons](https://lucide.dev)
- **Backend / Dados:** [Firebase](https://firebase.google.com) (Firestore) para posts, categorias e comércios
- **Exportação:** [SheetJS](https://sheetjs.com) (XLSX) e [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (PDF) no planejador de horários
- **Servidor local:** [Express](https://expressjs.com) servindo os arquivos estáticos
- **Deploy:** [Vercel](https://vercel.com)

## Estrutura do projeto

```text
acervif/
├── index.html                 # Página inicial — acervo de materiais
├── fluxograma.html             # Malhas curriculares (Computação e Produção)
├── calendario.html             # Calendário letivo interativo
├── planejador_horarios.html    # Montador de grade horária + exportação
├── comercios.html               # Guia de comércios locais
├── admin.html                   # Painel administrativo (autenticado)
├── server.js                    # Servidor Express para desenvolvimento local
├── firestore.rules              # Regras de segurança do Firestore (leitura pública / escrita restrita a admins)
├── firebase.json                # Aponta as regras acima para o Firebase CLI
├── package.json
├── vercel.json                  # Configuração de deploy estático na Vercel
└── metadata.json
```

## Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18+.

```bash
# clone o repositório
git clone https://github.com/carlosmirandd/acervif.git
cd acervif

# instale as dependências
npm install

# suba o servidor local
npm run dev
```

O projeto ficará disponível em **http://localhost:3000**.

> Como é um site estático (sem etapa de build), você também pode simplesmente abrir os arquivos `.html` diretamente no navegador ou servi-los com qualquer servidor estático de sua preferência.

## Deploy

O projeto é publicado automaticamente na **Vercel** a cada push na branch principal. Por não usar nenhum framework, a saída é servida diretamente da raiz do projeto (`vercel.json#outputDirectory`).

## Segurança

Este é um projeto de código aberto e o arquivo `firebaseConfig` (com a `apiKey`) aparece exposto no HTML de todas as páginas — **isso é esperado e seguro por design**: no ecossistema Firebase, essa chave apenas identifica o projeto e não concede acesso a nada por si só ([documentação oficial](https://firebase.google.com/docs/projects/api-keys)).

A proteção real dos dados fica nas **[Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)**, versionadas aqui em [`firestore.rules`](firestore.rules):

- **Leitura pública** em todas as coleções — necessário para o site funcionar para qualquer visitante.
- **Escrita restrita** a contas presentes em uma allowlist de e-mail, e não apenas a "estar autenticado" (`request.auth != null`). Isso importa porque a `apiKey` pública permite que qualquer pessoa se autocadastre no Firebase Authentication a partir do navegador (o provedor Email/Password não tem como bloquear só o cadastro mantendo o login); uma conta assim, mesmo sem nunca ter passado pelo `admin.html`, também satisfaz `request.auth != null` — por isso a allowlist de e-mail é essencial, não opcional.

Para aplicar as regras no seu projeto Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

> ⚠️ Antes de publicar, edite a lista de e-mails admin em `firestore.rules` com as contas reais cadastradas no Firebase Authentication.

Camadas extras recomendadas (configuradas fora deste repositório, no Console do Google Cloud / Firebase):

- **Restringir a API key** por domínio (HTTP referrer) em *Google Cloud Console → Credenciais*, liberando apenas os domínios da Vercel e `localhost`.
- **Desabilitar o autocadastro** de novos usuários no provedor Email/Password do Firebase Authentication, mantendo apenas as contas administrativas criadas manualmente.
- Ativar o **[Firebase App Check](https://firebase.google.com/docs/app-check)** para bloquear tráfego que não venha do próprio site.

Encontrou uma vulnerabilidade? Abra uma [issue](../../issues) ou entre em contato diretamente com os mantenedores antes de divulgar publicamente.

## Contribuindo

Contribuições são muito bem-vindas — seja corrigindo um bug, adicionando uma disciplina que faltou no fluxograma ou sugerindo uma nova funcionalidade.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feat/minha-feature`)
3. Commit suas mudanças (`git commit -m 'feat: minha nova feature'`)
4. Push para a branch (`git push origin feat/minha-feature`)
5. Abra um Pull Request

---

<div align="center">

Feito com 💚 por e para a comunidade acadêmica do **IFRJ Campus Niterói**
Engenharia de Computação & Engenharia de Produção

</div>
