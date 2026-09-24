<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Instituto_Federal_Marca_2015.svg/960px-Instituto_Federal_Marca_2015.svg.png" alt="Logo IFRJ" width="90" />

# AcervIF

**Repositório público de informações acadêmicas para os alunos de Engenharia do IFRJ Campus Niterói**

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Firebase](https://img.shields.io/badge/backend-firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/docs/Web/HTML)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#contribuindo)
[![Made for IFRJ](https://img.shields.io/badge/feito%20para-IFRJ%20Niterói-007A33?style=flat-square)](https://www.ifrj.edu.br)

[Reportar bug](../../issues) · [Sugerir feature](../../issues)

</div>

---

## Sobre o projeto

**AcervIF** é uma plataforma web centralizada, criada por e para estudantes, que reúne materiais e informações essenciais dos cursos de **Engenharia de Computação** e **Engenharia de Produção** do **IFRJ Campus Niterói**: provas antigas, resumos, fluxogramas curriculares, calendário letivo, planejador de horários, diretório de contatos e um guia de comércios locais.

O objetivo é simples: reduzir a fricção que todo calouro (e nem tão calouro) sente ao procurar informação espalhada em grupos de WhatsApp, PDFs perdidos e print de conversa. Tudo em um só lugar, rápido, instalável como app e sem burocracia.

## Funcionalidades

| Módulo | Descrição |
| --- | --- |
| 📚 **Acervo** (`index.html`) | Repositório de posts e materiais em destaque, com busca unificada (cruza Acervo, Comércios e Alunos), filtro por categoria, favoritos ("Meus Salvos") e notificação push de novos posts |
| 🗺️ **Fluxogramas** (`fluxograma.html`) | Malha curricular interativa (kanban) de Eng. Computação e Eng. Produção, com filtros por núcleo de disciplinas |
| 📅 **Calendário** (`calendario.html`) | Calendário letivo do campus com legendas por tipo de evento e exportação para `.ics` (Google/Apple Calendar) |
| 🕒 **Planejador de Horários** (`planejador_horarios.html`) | Montagem da grade horária do semestre, com exportação para **PDF** e **XLSX** |
| 🏪 **Comércios Locais** (`comercios.html`) | Guia de serviços e comércios próximos ao campus, com contato direto por WhatsApp e link do Google Maps |
| 🎓 **Alunos Ativos** (`alunos.html`) | Lista consultável de discentes ativos, por curso e período |
| 📇 **Diretório de Contatos** (`contatos.html`) | E-mails de docentes, coordenações e setores do campus, gerenciável pelo admin |
| 🔐 **Painel Administrativo** (`admin.html`) | Terminal de gestão de conteúdo autenticado: acervo, comércios, calendário e diretório de contatos |
| 🚫 **Página 404** (`404.html`) | Página de erro personalizada, com a identidade visual do site |

Extras de UX presentes em toda a plataforma:

- 🌗 Tema claro / escuro / automático (persistido em `localStorage`), com **escuro como padrão**
- 🎨 Interface em *glassmorphism*, responsiva e com identidade visual do IFRJ
- 🔍 Busca e filtros em tempo real, com busca unificada entre módulos
- 📱 **PWA instalável** (Android e iOS), com atalhos rápidos (Horários, Fluxogramas, Calendário) e sem Service Worker de cache — para nunca prender o usuário numa versão antiga do site
- 🔔 **Notificações push** (Firebase Cloud Messaging) para novos posts e lembretes de eventos do calendário do dia seguinte
- 🔗 Open Graph / Twitter Card para preview correto ao compartilhar links
- ⚡ Sem etapa de build no frontend — HTML, CSS e JS puros, deploy instantâneo

## Stack

- **Frontend:** HTML5, [Tailwind CSS](https://tailwindcss.com) (via CDN), JavaScript (ES Modules), [Lucide Icons](https://lucide.dev)
- **Backend / Dados:** [Firebase](https://firebase.google.com) (Firestore) para posts, categorias, comércios, eventos e diretório de contatos
- **Notificações:** [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging) + [Vercel Serverless Functions](https://vercel.com/docs/functions) (`api/`) com o Firebase Admin SDK
- **Exportação:** [SheetJS](https://sheetjs.com) (XLSX), [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) (PDF) e iCalendar (`.ics`) nativo
- **Servidor local:** [Express](https://expressjs.com) servindo os arquivos estáticos
- **Deploy:** [Vercel](https://vercel.com), incluindo um [Cron Job](https://vercel.com/docs/cron-jobs) diário para lembretes de calendário

## Estrutura do projeto

```text
acervif/
├── index.html                   # Página inicial — acervo de materiais
├── fluxograma.html               # Malhas curriculares (Computação e Produção)
├── calendario.html               # Calendário letivo interativo + exportação .ics
├── planejador_horarios.html      # Montador de grade horária + exportação PDF/XLSX
├── comercios.html                 # Guia de comércios locais
├── alunos.html                    # Lista de alunos ativos
├── contatos.html                  # Diretório de contatos (docentes/setores)
├── admin.html                     # Painel administrativo (autenticado)
├── 404.html                       # Página de erro personalizada
├── manifest.json                  # Manifesto da PWA (ícones, atalhos)
├── firebase-messaging-sw.js       # Service Worker exclusivo para push (sem cache)
├── api/
│   ├── send-notification.js       # Function: notifica inscritos sobre um novo post
│   └── notify-upcoming-events.js  # Function (cron diário): avisa eventos do dia seguinte
├── icons/                          # Ícones da PWA e favicon
├── server.js                       # Servidor Express para desenvolvimento local
├── firestore.rules                 # Regras de segurança do Firestore
├── firebase.json                   # Aponta as regras acima para o Firebase CLI
├── package.json
└── vercel.json                     # Configuração de deploy e do Cron Job na Vercel
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

> Como é um site estático (sem etapa de build), você também pode simplesmente abrir os arquivos `.html` diretamente no navegador ou servi-los com qualquer servidor estático de sua preferência. As funções em `api/` (notificações push) só rodam de fato num deploy na Vercel — localmente elas ficam inativas.

## Deploy

O projeto é publicado automaticamente na **Vercel** a cada push na branch principal. Por não usar nenhum framework, a saída é servida diretamente da raiz do projeto (`vercel.json#outputDirectory`). As funções em `api/` são detectadas automaticamente pela Vercel como Serverless Functions.

### Configurando as notificações push

As notificações push dependem de duas configurações que não ficam neste repositório (por segurança):

1. **VAPID key** — gere em *Firebase Console → Configurações do Projeto → Cloud Messaging → Configuração da Web → Gerar par de chaves* e cole no lugar da constante `VAPID_KEY` em `index.html`.
2. **Conta de serviço do Firebase** — gere em *Firebase Console → Configurações do Projeto → Contas de serviço → Gerar nova chave privada* e cole o JSON inteiro como variável de ambiente `FIREBASE_SERVICE_ACCOUNT` no painel do projeto na Vercel.

Sem essas duas configurações, o site funciona normalmente — só o botão de notificações fica inativo.

## Segurança

Este é um projeto de código aberto e o arquivo `firebaseConfig` (com a `apiKey`) aparece exposto no HTML de todas as páginas — **isso é esperado e seguro por design**: no ecossistema Firebase, essa chave apenas identifica o projeto e não concede acesso a nada por si só ([documentação oficial](https://firebase.google.com/docs/projects/api-keys)).

A proteção real dos dados fica nas **[Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)**, versionadas aqui em [`firestore.rules`](firestore.rules):

- **Leitura pública** na maioria das coleções — necessário para o site funcionar para qualquer visitante.
- **Escrita restrita** a quem estiver cadastrado na coleção `admins`, e não apenas a "estar autenticado" (`request.auth != null`). Isso importa porque a `apiKey` pública permite que qualquer pessoa se autocadastre no Firebase Authentication a partir do navegador (o provedor Email/Password não tem como bloquear só o cadastro mantendo o login); uma conta assim, mesmo sem nunca ter passado pelo `admin.html`, também satisfaz `request.auth != null`.
- **Exceção:** a coleção `pushSubscriptions` permite escrita pública, pois qualquer visitante precisa poder se inscrever/descadastrar das notificações por conta própria, sem precisar de login de admin. O envio das notificações em si é feito só pelo Admin SDK (nas funções da Vercel), que ignora as regras do Firestore.

**Gerenciando administradores:** cada admin é um documento na coleção `admins`, cujo ID é o e-mail da pessoa. Para promover ou remover alguém, basta criar/apagar esse documento em *Firebase Console → Firestore Database → `admins`* — não é necessário editar código nem reimplantar as regras. A própria coleção `admins` é bloqueada para leitura/escrita via app, o que não afeta o Console nem o Admin SDK.

Para aplicar as regras no seu projeto Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

Ou, mais simples: cole o conteúdo de [`firestore.rules`](firestore.rules) diretamente em *Firebase Console → Firestore Database → Regras → Publicar*.

Camadas extras recomendadas (configuradas fora deste repositório, no Console do Google Cloud / Firebase):

- **Restringir a API key** por domínio (HTTP referrer) em *Google Cloud Console → Credenciais*, liberando apenas os domínios da Vercel e `localhost`.
- **Desabilitar o autocadastro** de novos usuários no provedor Email/Password do Firebase Authentication, mantendo apenas as contas administrativas criadas manualmente.
- Ativar o **[Firebase App Check](https://firebase.google.com/docs/app-check)** para bloquear tráfego que não venha do próprio site.

A conta de serviço usada pelas funções em `api/` (variável `FIREBASE_SERVICE_ACCOUNT`) tem privilégios de administrador no Firebase — nunca a coloque em um arquivo versionado, só como variável de ambiente na Vercel.

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
