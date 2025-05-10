# 🚚 FastFeet API

API REST para controle de encomendas de uma transportadora fictícia, desenvolvida com Node.js, Prisma e PostgreSQL. A aplicação permite gerenciar entregadores, destinatários e encomendas, além de rastrear status e enviar notificações.

---

## 📋 Funcionalidades

- Autenticação via CPF e senha
- CRUD de:
  - Entregadores (admin)
  - Destinatários (admin)
  - Encomendas (admin)
- Marcar encomendas como:
  - Aguardando retirada
  - Retirada
  - Entregue (com foto obrigatória)
- Listagem de encomendas próximas ao local do entregador
- Entregador pode listar apenas suas entregas
- Alteração de senha (somente admin)
- Notificação ao destinatário a cada alteração de status

---

## 🛠 Tecnologias

- **Node.js**
- **Nest.js**
- **Fastify**
- **Prisma ORM**
- **PostgreSQL**
- **SWC** (compilador TypeScript)
- **JWT** (autenticação)
- **bcryptjs** (hash de senhas)
- **Multer** (upload de fotos)
- **Nodemailer** (notificações por e-mail)

---

## ⚙️ Instalação

```bash
# Clone o repositório
git clone https://github.com/bfukumori/fast-feet.git

# Acesse a pasta do projeto
cd fast-feet

# Instale as dependências
pnpm install

# Renomeie o .env.example para .env
mv .env.example .env

# Rode a aplicação e o banco com o Docker Compose
docker compose up -d

# Rode as migrations para criar as tabelas e o seed inicial
pnpm prisma migrate dev
```
