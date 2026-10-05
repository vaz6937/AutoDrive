# 🚗 Sistema de Venda de Veículos - AutoDrive

Aplicação Full Stack desenvolvida para gerenciamento e exibição de anúncios de veículos.

## Tecnologias utilizadas

- **Front-end:** HTML5, JavaScript ES6+, Skeleton CSS
- **Back-end:** Node.js, Express.js, CORS, Dotenv
- **Banco de Dados:** MongoDB, Mongoose
- **Testes:** Cypress
- **Documentação:** Markdown

## Requisitos

- Node.js 18 ou superior
- npm
- MongoDB local ou MongoDB Atlas

## Estrutura do projeto

```text
auto-drive-venda-veiculos/
├── controllers/
│   └── vehicleController.js
├── models/
│   └── Veiculo.js
├── routes/
│   └── vehicleRoutes.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── cypress/
│   └── e2e/
│       └── veiculos.cy.js
├── .env.example
├── .gitignore
├── cypress.config.js
├── package.json
├── README.md
└── server.js
```

## Banco de dados

O projeto utiliza o banco:

```text
veiculos_db
```

A coleção é criada pelo MongoDB/Mongoose quando o primeiro veículo é cadastrado.

## Como executar

### 1. Instalar as dependências

Na pasta do projeto:

```bash
npm install
```

### 2. Configurar o ambiente

Crie um arquivo `.env` na raiz do projeto.

Para MongoDB local:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/veiculos_db
```

Se utilizar MongoDB Atlas, substitua `MONGO_URI` pela sua string de conexão.

### 3. Iniciar o servidor

```bash
npm start
```

Ou, durante o desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## API REST

### Listar veículos

```http
GET /api/veiculos
```

Retorna HTTP 200 e um array.

### Buscar veículo por ID

```http
GET /api/veiculos/:id
```

Retorna HTTP 200 quando encontrado ou HTTP 404 quando não encontrado.

### Cadastrar veículo

```http
POST /api/veiculos
Content-Type: application/json
```

Exemplo:

```json
{
  "marca": "Toyota",
  "modelo": "Corolla",
  "ano": 2022,
  "preco": 120000,
  "cor": "Prata",
  "descricao": "Sedã completo.",
  "imagemUrl": "https://placehold.co/800x450?text=Toyota+Corolla"
}
```

Retorna HTTP 201 quando o cadastro é realizado.

### Atualizar veículo

```http
PUT /api/veiculos/:id
Content-Type: application/json
```

Exemplo:

```json
{
  "preco": 115000,
  "cor": "Branco"
}
```

Retorna HTTP 200 quando atualizado.

### Excluir veículo

```http
DELETE /api/veiculos/:id
```

Retorna HTTP 200 quando removido.

## Schema do veículo

| Campo | Tipo | Regra |
|---|---|---|
| marca | String | Obrigatório |
| modelo | String | Obrigatório |
| ano | Number | Obrigatório, mínimo 1900 e máximo ano atual |
| preco | Number | Obrigatório e maior que 0 |
| cor | String | Obrigatório |
| descricao | String | Opcional |
| imagemUrl | String | Obrigatório e URL HTTP/HTTPS válida |

## Testes automatizados com Cypress

Com o servidor rodando em `http://localhost:3000`, execute:

```bash
npx cypress open
```

Ou execute os testes diretamente no terminal:

```bash
npx cypress run
```

Os testes cobrem:

### API

- **CT-API-01:** criação de veículo válido, esperando status 201.
- **CT-API-02:** tentativa de cadastro sem campos obrigatórios, esperando status 400.
- **CT-API-03:** consulta da lista de veículos, esperando status 200 e array.
- **CT-API-04:** atualização, consulta por ID e exclusão.

### Front-end

- **CT-E2E-01:** carregamento da página inicial.
- **CT-E2E-02:** cadastro de veículo e confirmação na lista.
- **CT-E2E-03:** edição e exclusão de veículo.

## Casos de teste

| ID | Descrição | Tipo | Resultado esperado |
|---|---|---|---|
| CT-API-01 | Cadastro de veículo válido | API | HTTP 201 e veículo criado |
| CT-API-02 | Cadastro sem campos obrigatórios | API | HTTP 400 e mensagens de validação |
| CT-API-03 | Listagem de veículos | API | HTTP 200 e array |
| CT-API-04 | Atualização, consulta e exclusão | API | HTTP 200 nas operações válidas |
| CT-E2E-01 | Carregar página inicial | E2E | Interface exibida corretamente |
| CT-E2E-02 | Cadastrar veículo | E2E | Veículo aparece na lista |
| CT-E2E-03 | Editar e excluir veículo | E2E | Alteração e remoção confirmadas |

## Validações implementadas

- Campos obrigatórios no Mongoose.
- Ano mínimo de 1900.
- Ano máximo correspondente ao ano atual.
- Ano inteiro.
- Preço maior que zero.
- URL de imagem obrigatória e válida.
- Validação de ObjectId.
- Tratamento de veículo inexistente.
- Tratamento de JSON inválido.
- Tratamento de erros de validação.
- Respostas HTTP adequadas para as operações REST.

## Observação

O arquivo `.env` não deve ser enviado ao GitHub, pois pode conter credenciais. Por isso, o projeto inclui `.env.example` para orientar a configuração.
