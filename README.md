# Teste Tenico Vylex

## Descrição

Esta é uma aplicação para teste tecnico da empresa Vylex.
Seu objetivo é um CRUD simples de produtos.

## Organização de Pastas e Arquivos

```bash
src
├── application
│   ├── protocol
│   │   ├── reposirory
│   │   │   ├── create_product.interface.repository.ts
│   │   │   ├── delete_product.interface.repository.ts
│   │   │   ├── list_products.interface.repository.ts
│   │   │   ├── show_product.interface.repository.ts
│   │   │   └── update_product.interface.repository.ts
│   │   └── usecase
│   │       ├── create_product.interface.usecase.ts
│   │       ├── delete_product.interface.usecase.ts
│   │       ├── list_products.interface.usecase.ts
│   │       ├── show_product.interface.usecase.ts
│   │       └── update_product.interface.usecase.ts
│   └── usecase
│       ├── create
│       │   ├── create_product.usecase.spec.ts
│       │   └── index.ts
│       ├── delete
│       │   ├── delete_product.usecase.spec.ts
│       │   └── index.ts
│       ├── list
│       │   ├── index.ts
│       │   └── list_products.usecase.spec.ts
│       ├── show
│       │   ├── index.ts
│       │   └── show_product.usecase.spec.ts
│       └── update
│           ├── index.ts
│           └── update_product.usecase.spec.ts
├── app.module.ts
├── data
│   ├── repository
│   │   ├── create
│   │   │   ├── create_product.repository.spec.ts
│   │   │   └── index.ts
│   │   ├── delete
│   │   │   ├── delete_product.repository.spec.ts
│   │   │   └── index.ts
│   │   ├── list
│   │   │   ├── index.ts
│   │   │   └── list_products.repository.spec.ts
│   │   ├── show
│   │   │   ├── index.ts
│   │   │   └── show_product.repository.spec.ts
│   │   └── update
│   │       ├── index.ts
│   │       └── update_product.repository.spec.ts
│   └── source
│       ├── create_product_client.interface..source.ts
│       ├── delete_product_client.interface.ts
│       ├── list_products_client.interface.ts
│       ├── show_product_client.interface.ts
│       └── uptade_product_client.interface.ts
├── infra
│   └── db_client
│       └── prisma
│           ├── db_prisma.client.spec.ts
│           └── index.ts
├── main.ts
├── presentation
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── product
│       ├── product.controller.spec.ts
│       ├── product.controller.ts
│       ├── product.module.ts
│       ├── product.service.spec.ts
│       └── product.service.ts
└── shared
    ├── dto
    │   └── index.ts
    └── errors
        └── index.ts
```

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/cledson-leite/vylex-backend.git
cd vylex-backend
npm install || yarn
```

## Configuração

Configure as variáveis de ambiente no arquivo `.env`:

```env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

## Uso

Inicie o microserviço:

```bash
npm start || yarn start
```

Testes unitários com cobertura

```bash
npm test:cov || yarn test:cov
```

### Exemplo de Uso da API

#### Listar Produtos com paginação e limite de itens

```http
GET http://localhost:3000/product?page=1&limit=5
```

Resposta:

```json
{
 "item": [
  {
   "name": "Awesome Rubber Car",
   "price": 49,
   "quantity": 30
  },
  {
   "name": "computer",
   "price": 2500,
   "quantity": 10
  },
  {
   "name": "keyboard",
   "price": 200,
   "quantity": 20
  },
  {
   "name": "Sleek Frozen Table",
   "price": 778,
   "quantity": 95
  },
  {
   "name": "Electronic Metal Mouse",
   "price": 425,
   "quantity": 43
  }
 ],
 "meta": {
  "totalItems": 45,
  "itemCount": 5,
  "itemsPerPage": 5,
  "totalPages": 9,
  "currentPage": 1
 }
}
```

#### Listar Produtos sem paginação e limite de itens

```http
GET http://localhost:3000/product
```

Resposta:

```json
{
 "item": [
  {
   "name": "Awesome Rubber Car",
   "price": 49,
   "quantity": 30
  },
  {
   "name": "computer",
   "price": 2500,
   "quantity": 10
  },
  {
   "name": "keyboard",
   "price": 200,
   "quantity": 10
  },
  {
   "name": "Sleek Frozen Table",
   "price": 778,
   "quantity": 95
  },
  {
   "name": "Electronic Metal Mouse",
   "price": 425,
   "quantity": 43
  },
  {
   "name": "Ergonomic Steel Bacon",
   "price": 614,
   "quantity": 22
  },
  {
   "name": "Recycled Soft Shoes",
   "price": 850,
   "quantity": 61
  },
  {
   "name": "Practical Steel Towels",
   "price": 279,
   "quantity": 22
  },
  {
   "name": "Small Granite Shirt",
   "price": 401,
   "quantity": 18
  },
  {
   "name": "Generic Cotton Cheese",
   "price": 176,
   "quantity": 25
  },
  {
   "name": "Luxurious Frozen Table",
   "price": 939,
   "quantity": 27
  },
  {
   "name": "Handcrafted Granite Chicken",
   "price": 779,
   "quantity": 35
  },
  {
   "name": "Gorgeous Granite Pants",
   "price": 620,
   "quantity": 66
  },
  {
   "name": "Rustic Rubber Chicken",
   "price": 419,
   "quantity": 10
  },
  {
   "name": "Modern Soft Shirt",
   "price": 788,
   "quantity": 49
  },
  {
   "name": "Rustic Granite Towels",
   "price": 256,
   "quantity": 51
  },
  {
   "name": "Oriental Fresh Bacon",
   "price": 289,
   "quantity": 95
  },
  {
   "name": "Unbranded Cotton Bacon",
   "price": 371,
   "quantity": 56
  },
  {
   "name": "Recycled Steel Keyboard",
   "price": 754,
   "quantity": 80
  },
  {
   "name": "Practical Rubber Chair",
   "price": 965,
   "quantity": 39
  },
  {
   "name": "Tasty Soft Table",
   "price": 582,
   "quantity": 94
  },
  {
   "name": "Gorgeous Bronze Pants",
   "price": 289,
   "quantity": 98
  },
  {
   "name": "Handcrafted Granite Chips",
   "price": 518,
   "quantity": 50
  },
  {
   "name": "Electronic Metal Towels",
   "price": 446,
   "quantity": 10
  },
  {
   "name": "Small Granite Pizza",
   "price": 242,
   "quantity": 20
  },
  {
   "name": "Luxurious Granite Tuna",
   "price": 878,
   "quantity": 99
  },
  {
   "name": "Licensed Plastic Pants",
   "price": 555,
   "quantity": 80
  },
  {
   "name": "Licensed Fresh Bacon",
   "price": 179,
   "quantity": 95
  },
  {
   "name": "Oriental Plastic Towels",
   "price": 594,
   "quantity": 36
  },
  {
   "name": "Sleek Cotton Soap",
   "price": 593,
   "quantity": 36
  },
  {
   "name": "Awesome Frozen Bike",
   "price": 835,
   "quantity": 82
  }
 ]
}
```

#### Mostrar Produto específico

```http
GET http://localhost:3000/product/Awesome Rubber Car
```

Resposta:

```json
{
 "item": [
  {
   "name": "Awesome Rubber Car",
   "price": 49,
   "quantity": 30
  }
 ]
}
```

#### Criar Produto

```http
POST http://localhost:3000/product
```

Corpo:

```json
{
 "name": "keyboard",
 "quantity": 10,
 "price": 200.00
}
```

#### Atualizar Produto

```http
PUT http://localhost:3000/product/keyboard
```

Corpo:

```json
{
 "name": "keyboard",
 "proprity": "quantity",
 "value": 20
}
```

#### Apagar Produto

```http
Delete http://localhost:3000/product/keyboard
```

## Autor e Contato

Cledson Leite
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Cledson%20Leite-blue)](https://www.linkedin.com/in/cledson-leite/)
[![Gmail](https://img.shields.io/badge/Gmail-csbetsonline%40gmail.com-red)](mailto:csbetsonline@gmail.com)
