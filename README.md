# API Rest de criação de tarefas - Desafio 1 trilha Node.JS da Rocketseat

![]()

# Sumário

- [Objetivos do projeto](#objetivos-do-projeto) -[CSV](#csv)
- [Rotas e regras de negócio](#rotas-e-regras-de-negócio)
  - [Estrutura(propriedades) de uma task](#estrutura-propriedades-de-uma-task)
  - [Rotas](#rotas)
  - [Implementações extras](#implementações-extras)
- [Desenvolvimento do projeto](#desenvolvimento-do-projeto)
  - [Criação de uma nova meta](#criação-de-uma-nova-meta)
  - [Banco de dados](#banco-de-dados)
    - [Persistência de dados no banco](#persistência-de-dados-no-banco)
    - [Recuperar dados da tabela](#recuperar-dados-da-tabela)
  - [Separar rotas do servidor](#separar-rotas-do-servidor)
  - [Definindo middlewares](#definindo-middlewares)

## Objetivos do projeto

1. Criação de uma task
2. Listagem de todas as tasks
3. Atualização de uma task pelo `id`
4. Remover uma task pelo `id`
5. Marcar pelo `id` uma task como completa
6. Importação de tasks em massa por um arquivo CSV

### CSV

Um arquivo CSV (Comma-Separated Values/Valores separados por vírgula) é um formato de arquivo de texto simples onde os dados são armazenados em linhas, e cada valor dentro de uma linha é separado por uma vírgula. Esse formato é amplamente utilizado para armazenar e compartilhar dados tabulares, como planilhas e bancos de dados.

Cada linha do arquivo representa um registro, e as colunas são separadas por vírgulas. Por exemplo, um arquivo CSV que lista tarefas poderia ser assim:

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

O objetivo é adicionarmos um arquivo em formato CSV para cadastro de múltiplos dados simultaneamente.

Esse processo de importação em massa é útil quando você tem muitas tarefas para cadastrar e não quer fazer isso manualmente uma a uma.

## Rotas e regras de negócio

### Estrutura (propriedades) de uma task

- `id` - Identificador único de cada task
- `title` - Título da task
- `description` - Descrição detalhada da task
- `completed_at` - Data de quando a task foi concluída. O valor inicial deve ser `null`
- `created_at` - Data de quando a task foi criada.
- `updated_at` - Deve ser sempre alterado para a data de quando a task foi atualizada.

### Rotas

- `POST - /tasks`
  - Criar uma task no banco de dados, enviando os campos `title` e `description` por meio do `body` da requisição.
  - Ao criar uma task, os campos: `id`, `created_at`, `updated_at` e `completed_at` devem ser preenchidos automaticamente.
- `GET - /tasks`
  - Listar todas as tasks salvas no banco de dados.
  - Realização de buscas, filtrando as tasks pelo `title` e `description`
- `PUT - /tasks/:id`
  - Atualizar uma task pelo `id`.
  - No `body` da requisição, será recebido somente o `title` e/ou `description` para serem atualizados.
  - Envio de um único dado o outro não pode ser atualizado e vice-versa.
  - Antes da atualização, é realizado uma validação se o `id` pertence a uma task salva no banco de dados.
- `DELETE - /tasks/:id`
  - Remoção de uma task pelo `id`.
  - Antes da remoção, o `id` é validado ao chegar se ele pertence a uma task salva no banco de dados.
- `PATCH - /tasks/:id/complete`
  - Marcação de conclusão de uma task. Quando uma task é concluida retorna ao seu estado “normal”.
  - Antes da alteração o `id` é validado ao checar se ele pertence a uma task salva no banco de dados.

### Implementações extras

- Validação das propriedades `title` e `description` nas rotas `POST` e `PUT`, para checar se são válidas e não nulas, no `body` da requisição.
- Nas rotas que recebem o `/:id`, realizado validação do `id`, para chegar se ele existe no banco de dados e é retornado à requisição com uma mensagem informando que o registro não existe.

## Desenvolvimento do projeto

Criação inicial do servidor:

```js
import http from "node:http";

const port = 3333;
const server = http.createServer((req, res) => {
  return res.end("Hello World");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

Criação básica de rotas utilizando os métodos `method` e `url` para conferir o método a e a rota utilizada. Caso atentam aos critérios do `if` haverá um retorno.

```js
const { method, url } = req;

if (method === "POST" && url === "/tasks") {
  return res.end("Tasks creation route");
}

if (method === "GET" && url === "/tasks") {
  return res.end("Tasks list route");
}
```

### Criação de uma nova meta

Para criarmos uma nova task precisamos coletar as informações de `title`e `description` do corpo da requisição em formato JSON. Exemplo:

`http://localhost:3333/tasks` - `POST`

```json
{
  "title": "título task 1",
  "description": "descrição task 1"
}
```

Utilizando a criação de um servidor http com `node:http` os dados que chegam na requisição não vêm de uma vez só. Eles vem em "pedacinhos" chamados `chunks`(pedaços). Esses chunks de dados são recebidos de forma assíncrona e em formato binário, não em strings ou outras formas que conseguimos entender. Assim, para o node, dizemos que este formato de leitura é chamado `buffer`, que são uma esturutra de dados usada para armazenas de maneira temporária uma sequência de bytes.

O Buffer é necessário porque, quando so dados chegam em partes/chunks, eles não estão diretamente em uma forma que o node.js pode interpretar como JSON, texto, etc. Assim o Buffer permite que coletemos os chunks para só assim processá-los.

Dessa forma, lidamos com esses chunks dessa forma:

```js
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }
```

Dentro do servidor criamos um array vazio, que serão os nossos buffers com todos os nossos chunks.
Criamos um laço de repetição que vai coletar TODOS os pedaços/chunks que vem da requisição e juntá-los todos no nosso array. Agora, utilizando o método `await` só vamos prosseguir com nossa aplicação quando todos os chunks estiverem juntos no nosso `buffers`.

```js
import { Buffer } from "node:buffer";
// ... resto do código
try {
  req.body = JSON.parse(Buffer.concat(buffers).toString());
} catch {
  req.body = null;
}
```

Agora precisamos interpretar esse código binário transformando o nosso `body` da nossa requisição:

1. `Buffer.concat(buffers)`: Concatenar/juntar vários buffers em um único buffer, pois os chunks precisam estar juntos antes de processá-los
2. `toString()`: Conversão do conteúdo do buffer (que é uma sequência de bytes) em uma string legível.
3. `JSON.parse(): Usado para converter uma string JSON em um objeto JavaScript.

Após ser transformado em um objeto JavaScript podemos desestruturá-lo para utilizá-lo dentro da nossa rota de criação de tasks:

```js
const tasks = [];
// resto do código
if (method === "POST" && url === "/tasks") {
  const { title, description } = req.body;

  tasks.push({
    id: randomUUID(),
    title,
    description,
  });
  return res.writeHead(201).end();
}
```

E para listar nossos tasks, retornamos o nosos array de tasks criadas:

```js
if (method === "GET" && url === "/tasks") {
  return res
    .setHeader("Content-type", "application/json; charset=utf-8")
    .writeHead(200)
    .end(JSON.stringify(tasks));
}
```

### Banco de dados

O banco de dados foi criado utilizando uma `class` javascript:

```js
export class Database {
  #database = {};
}
```

A princípio ele somente possui uma propriedade que é um objeto.
Ao utilizarmos o `#` definimos que é uma propriedade privada e não pode ser acessada fora da classe. Por exemplo:

```js
const db = new Database();
console.log(db.database);
```

Ao ser privada, o usuário precisa utilizar uma das nossas funções para listagem de dados do banco. Esta primeira propriedade é chamada `#database`, onde serão armazenados os dados do banco e, a princípio, teremos duas funções:

```js
  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }
```

Seleciona os dados da tabela e confere se ela já possui dados. Caso não, é retornado um array vazio.

```js
  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    return data;
  }
```

Insere novos dados na tabela `table` os novos dados `data`. Se a tabela já existir e for um array, é adicionado o novo dado à tabela. Caso não, a tabela é criada com o novo dado.

**Exemplo de uso:**

```js
const db = new Database();

db.insert("tasks", { title: "task 1", description: "description 1" });
db.insert("tasks", { title: "task 2", description: "description 2" });

const tasks = db.select("tasks");
console.log(tasks);
// Retorno: [
//    {title: "task 1", description: "description 1" },
//    {title: "task 2", description: "description 2" }
// ]
```

Agora só precisamos aplicar nosso banco de dados no servidor ao invés de usar um array comum, como estávamos fazendo.

**Inserir novos dados**

```js
import { Database } from "./database.js";
const db = new Database();
// ...
const task = {
  id: randomUUID(),
  title,
  description,
};

db.insert("tasks", task);
```

**Coletar dados da tabela**

```js
const tasks = db.select("tasks");
return res
  .setHeader("Content-type", "application/json; charset=utf-8")
  .writeHead(200)
  .end(JSON.stringify(tasks));
```

#### Persistência de dados no banco

A princípio estamos conseguindo salvar dados no banco e selecioná-los, mas quando o servidor para, os dados são perdidos, pois nossa aplicação é `stateless`.

É necessário outra função para persistir os dados no banco:

```js
import fs from "node:fs/promises";

export class Database {
  #database = {};

  #persist() {
    fs.writeFile("db.json", JSON.stringify(this.#database));
  }
  //...
}
```

A propriedade `#persist` é exclusiva da classe e é uma função que utiliza o módulo fs, que é uma API do node capaz de interagir com o sistema de arquivos do computador, como ler, escrever e manipular arquivos e diretórios.
Assim, ao utilizá-lo, transformamos os dados do objeto `#database` em uma string JSON e gravamos esse conteúdo no arquivo `db.json`.

```js
  insert(table, data) {
    //...

    this.#persist();
    return data;
  }
```

Agora sempre que adicionarmos um novo dado na tabela, a função `#persist` deve ser chamada para persistir os dados na tabela. Caso este arquivo não exista, ele será criado, senão os novos dados só serão adicionados a ele.

#### Recuperar dados da tabela

O problema é que quando a aplicação reinicia, ela perde a conexão com o arquivo `db.json` que criamos e, apesar de os dados estarem salvos, a listagem irá reiniciar.

`src/database.js`

```js
import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);
```

- `databasePath`: Usa o constructor `new URL()` para criar o caminho completo (path) do arquivo `db.json`a partir do local atual do arquivo no código.
- `import.meta.url`: Retorna o caminho do módulo atual (arquivo JS). Isso permite que `../db.json` seja resolvido corretamente, independente de onde o código esteja sendo executado.
  - Ou seja, primeiro parâmetro define onde o arquivo `db.json` está, e o segundo parâmetro define onde está o arquivo database.js, para não haver conflitos ou erros de caminho entre eles.

```js
  constructor() {
    fs.readFile(databasePath, "utf-8").then(data => {
        this.#database = JSON.parse(data)
    }).catch(() => {
        this.#persist();
    })
  }
```

- `constructor()`: é executado automaticamente quando a clase Database é instanciada.
- `fs.readFile()`: tenta ler o arquivo `db.json`no caminho definido por `databasePath`.
  - Se a leitura for bem-sucedida, o conteúdo do arquivo é convertido de string JSON para objeto e atribuído à variável privada `#database`.
  - Se ocorrer algum erro, exemplo o arquivo não existir, o `catch` é executado e o método `#persist()` é chamado para criar um novo arquivo `db.json` vazio.

### Separar rotas do servidor

criamos um novo arquivo para guardar todas as rotas e deixá-los separados do servidor. As rotas são um array de objetos que possuem as chaves:

- method: o método da requisição
- path: o caminho/url
- handler: a função realizada na rota.
  Exemplo:

```js
export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const tasks = db.select("tasks");
      return //...
    },
  },
```

Assim, no servidor, só precisamos encontrar a rota de acordo com os dados provindos da requisição:

```js
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const route = routes.find((route) => {
    return route.method === method && route.path === url;
  });

  if (route) {
    return route.handler(req, res);
  }
});
```

Comparamos o `method` e a `url` provinda da requisição do servidor, e se tanto o método quando a url forem iguais aos da rota de alguma das rotas do arquivo `./routes.js`, o `handler`/função da rota é executada, recebendo o `req` e `res` como parâmetro.

### Definindo middlewares

Middlewares são percursos que precisamos seguir na requisição HTTP antes de dar seguimento aos próximos passos no servidor. Assim, podemos considerar nosso tratamento ao `buffer` aos `chunks` do servidor como um `middleware`. Dessa forma, podemos criar um arquivo novo separado do servidor com essa manipulação.

`src/middlewares/json.js`

```js
import { Buffer } from "node:buffer";

export const json = async (req) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }
};
```

`src/server.js`

```js
import { json } from "./middlewares/json.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req);
  //...
}
```

Assim, a aplicação só dará continuidade quando todos os buffers forem unidos em um único buffer e adicionado ao `req.body` para só depois realizar a verificação das rotas.
