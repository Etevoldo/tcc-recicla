# Frontend Recicla — etapa 1

React + TypeScript + Vite + Tailwind CSS. Esta etapa contém a tela inicial e o formulário de CEP com máscara e validação de formato. Ainda não consulta a API nem valida a existência do CEP.

## Docker (desenvolvimento)

Na raiz do repositório:

```sh
docker compose up --build frontend
```

Abra http://localhost:5173. O frontend inicia sozinho, sem depender do backend ou banco. O código usa bind mount e o Vite usa polling para atualizar no WSL. As dependências ficam em volume próprio; `npm ci` na inicialização mantém esse volume sincronizado com o lockfile e requer acesso ao registro npm.

É necessário Docker com Compose disponível na distribuição WSL. Esta imagem é apenas para desenvolvimento.

## Sem Docker

Use Node 22.12+ (ou Node 20.19+):

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

As pastas ainda vazias estão reservadas para etapas futuras. Próxima etapa: integrar a busca por CEP e apresentar vendedores, após alinhar os endpoints disponíveis com o responsável pela API. Nenhum arquivo do backend foi alterado.
