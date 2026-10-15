# Frontend Recicla

React + TypeScript + Vite + Tailwind CSS. O frontend consome a API existente via proxy `/api` (sem alterar o backend): busca de compradores por CEP, detalhes com materiais e preços, e área de gestão.

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

Um CEP com compradores de exemplo é `05424-020`.

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
