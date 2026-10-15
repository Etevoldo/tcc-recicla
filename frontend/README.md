# Frontend Recicla

React + TypeScript + Vite + Tailwind CSS. O frontend consome a API via proxy `/api`: busca pública de compradores por CEP, detalhes com materiais e preços, e área de gestão autenticada (admin e comprador).

## Docker (desenvolvimento)

Na raiz do repositório, com backend e banco:

```sh
docker compose up --build
```

Abra http://localhost:5173. O Vite encaminha `/api` para `http://backend:3000`.

Para dados de teste no backend:

```sh
docker compose exec backend npm run testData
```

Credenciais de teste:

- Admin: `admin@recicla.com` / `admin123`
- Comprador (exemplo): `ana.silva@email.com` / `comprador123` — a mesma senha vale para os outros e-mails de comprador.

Um CEP com compradores de exemplo é `05424-020`.

Usuários criados pelo admin precisam trocar a senha no primeiro acesso (`/trocar-senha`). Os usuários do `testData` já entram direto na gestão.

## Sem Docker

Use Node 22.12+ (ou Node 20.19+). O proxy aponta para `http://localhost:3002` por padrão.

```sh
cd frontend
npm ci
npm run dev
```

## Verificações

```sh
npm run typecheck
npm test
npm run build
```
