# Relatório: login, gestão de usuários, comprador e produtos

Este relatório descreve o que foi implementado no backend e no frontend para o login com JWT, a criação de contas pelo admin e a área do comprador (dados + produtos). Também explica como testar.

## Tecnologias

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query.
- **Backend:** Express, Sequelize, MySQL, JWT (`jsonwebtoken`) e `bcryptjs`.
- **Compose:** o `frontend` encaminha `/api` para `http://backend:3000`. O backend usa `APP_HOST`, `APP_PORT`, variáveis do MySQL, `JWT_SECRET` e `JWT_EXPIRES_IN`.

A busca pública (CEP, lista de compradores e detalhes) continua sem login.

## O que foi feito no backend

### Modelos

- `User`: campos `name` (obrigatório) e `mustChangePassword` (boolean, padrão `false`).
- `Product`: campo `ownerId` com associação `belongsTo` o comprador (`as: 'owner'`, `onDelete: CASCADE`). O preço continua na tabela `Offer` (uma oferta por produto, a do dono).

### Autenticação e usuários

- `POST /auth/login` e `GET /auth/me` devolvem `name` e `mustChangePassword`.
- `POST /auth/change-password` (autenticada) recebe `{ currentPassword, newPassword }` (mínimo 6 caracteres), grava o hash e marca `mustChangePassword = false`.
- `POST /users` recebe `{ name, email, password, role }`. Se o papel for `BUYER`, cria o `Buyer` com o mesmo nome e e-mail e vincula o `BuyerId`. O usuário nasce com `mustChangePassword: true`. O front não envia mais `buyerId`.
- `PUT /users/:id` aceita só `{ role }`. A redefinição de senha pelo admin saiu.
  - Tornar comprador: se o usuário não tem `BuyerId`, cria o `Buyer` com o nome e o e-mail da conta.
  - Travas: não pode mudar o próprio papel nem rebaixar o último admin.
- `DELETE /users/:id`: se houver `BuyerId`, apaga também o comprador; produtos e ofertas saem em cascata.
- `GET /users` passa a devolver `name`.

### Produtos

- `GET /products` (público): cada item vem com `owner { id, name }` e `price` (da oferta do dono).
- `POST /products`: só `BUYER`. Recebe `{ name, recicling_code, price }`, cria o produto com `ownerId = user.buyerId` e a oferta correspondente, numa transação.
- `PUT /products/:id` e `DELETE /products/:id`: dono ou admin. O PUT atualiza nome, tipo e/ou preço.
- Middleware `requireProductOwnerOrAdmin`: compara `ownerId` com o `buyerId` do usuário.

### Compradores

- `PUT /buyers/:id` cadastra o `Address` do CEP novo (mesmo `fetch` da awesomeapi usado no cadastro). Sem isso, o comprador que preenche o CEP não aparece na busca.
- `POST /buyers` continua só para admin no back; o front não usa mais essa rota.

### Dados de teste (`npm run testData`)

- Cada oferta vira um produto próprio do comprador (`ownerId` + preço).
- Admin: `admin@recicla.com` / `admin123`, nome "Administrador".
- 21 compradores com `name = buyer.name`, senha `comprador123` e `mustChangePassword: false`.

## O que foi feito no frontend

### Auth

- Tipo `AuthUser` com `name` e `mustChangePassword`.
- Tela `/trocar-senha` (senha atual, nova e confirmação). Depois de salvar, atualiza a sessão e vai para `/gestao`.
- `RequireAuth` redireciona para `/trocar-senha` se `mustChangePassword` for verdadeiro.
- O cabeçalho mostra o nome do usuário.

### Admin

- **Usuários:** botão "Novo usuário" abre modal com nome, e-mail, senha e tipo de conta (Administrador ou Comprador). Aviso de que no primeiro acesso a pessoa define a senha própria. Ações: tornar admin, tornar comprador (com confirmação) e excluir. Saiu "Redefinir senha".
- **Compradores:** só leitura (nome, e-mail, telefone, CEP, quantidade de produtos e link para a página pública). Saiu "Novo comprador".
- **Produtos:** lista com produto, tipo, comprador e preço. Editar em modal; excluir com confirmação. O admin não cria produto.

### Comprador (`/gestao/minha-area`)

- **Meus dados:** resumo na página; "Editar dados" abre modal (nome, telefone, CEP, endereço e número). Sem CEP completo, aparece o aviso para completar os dados e aparecer na busca.
- **Meus produtos:** tabela com editar (modal) e excluir. "Novo produto" abre modal com nome, tipo de reciclável e preço em R$.

### Rotas

- Entram `/trocar-senha` e `/gestao/minha-area`.
- O índice da gestão manda o comprador para `minha-area`.
- Saíram as telas antigas de novo comprador, editar comprador, ofertas, minhas ofertas e meu perfil.

## Como testar

### Subir o ambiente e popular o banco

Na raiz do repositório:

```sh
docker compose up --build
docker compose exec backend npm run testData
```

Abra http://localhost:5173.

Credenciais do seed:

- Admin: `admin@recicla.com` / `admin123`
- Comprador (exemplo): `ana.silva@email.com` / `comprador123`
- CEP com compradores de exemplo: `05424-020`

### Testes automatizados do frontend

```sh
cd frontend
npm run typecheck
npm test
npm run build
```

Os testes cobrem CEP, formatação, cliente HTTP, lista de resultados, validação de Meus dados, modal de novo usuário, redirecionamento sem sessão e redirecionamento para `/trocar-senha` quando `mustChangePassword` é verdadeiro.

### Fluxo manual completo

1. Entre como admin e abra **Usuários**.
2. Crie um comprador (nome, e-mail, senha temporária, tipo Comprador). Confira se o comprador aparece na lista de Compradores com o mesmo nome.
3. Saia e entre com a conta criada. A tela deve pedir a troca de senha.
4. Depois da troca, abra **Minha área**, edite os dados (telefone, CEP `05424-020`, endereço e número) e cadastre um produto com preço.
5. Na busca pública pelo CEP `05424-020`, o comprador novo deve aparecer.
6. Entre de novo como admin, abra **Produtos** e edite o produto criado.
7. Em **Usuários**, use "Tornar admin" e "Tornar comprador" (com confirmação). Não deve mais aparecer caixa para escolher um comprador, nem "Redefinir senha".

Contas do seed (`comprador123`) entram direto na gestão, sem passar por `/trocar-senha`.
