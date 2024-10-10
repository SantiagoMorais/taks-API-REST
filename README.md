# API Rest de criação de tarefas - Desafio 1 trilha Node.JS da Rocketseat

![]()

# Sumário

- [Objetivos do projeto](#objetivos-do-projeto)
- [Rotas e regras de negócio](#rotas-e-regras-de-negócio)
    - [Estrutura(propriedades) de uma task](#estrutura-propriedades-de-uma-task)
    - [Rotas](#rotas)

# Objetivos do projeto

1. Criação de uma task
2. Listagem de todas as tasks
3. Atualização de uma task pelo `id`
4. Remover uma task pelo `id`
5. Marcar pelo `id` uma task como completa
6. Importação de tasks em massa por um arquivo CSV


## CSV

Um arquivo CSV (Comma-Separated Values/Valores separados por vírgula) é um formato de arquivo de texto simples onde os dados são armazenados em linhas, e cada valor dentro de uma linha é separado por uma vírgula. Esse formato é amplamente utilizado para armazenar e compartilhar dados tabulares, como planilhas e bancos de dados.

Cada linha do arquivo representa um registro, e as colunas são separadas por vírgulas. Por exemplo, um arquivo CSV que lista tarefas poderia ser assim:

```csv
title,description
Task 01,Descrição da Task 01
Task 02,Descrição da Task 02
```

O objetivo é adicionarmos um arquivo em formato CSV para cadastro de múltiplos dados simultaneamente.

Esse processo de importação em massa é útil quando você tem muitas tarefas para cadastrar e não quer fazer isso manualmente uma a uma.

# Rotas e regras de negócio

## Estrutura (propriedades) de uma task

- `id` - Identificador único de cada task
- `title` - Título da task
- `description` - Descrição detalhada da task
- `completed_at` - Data de quando a task foi concluída. O valor inicial deve ser `null`
- `created_at` - Data de quando a task foi criada.
- `updated_at` - Deve ser sempre alterado para a data de quando a task foi atualizada.

## Rotas

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

## Implementações extras

- Validação das propriedades `title` e `description` nas rotas `POST` e `PUT`, para checar se são válidas e não nulas, no `body` da requisição.
- Nas rotas que recebem o `/:id`, realizado validação do `id`, para chegar se ele existe no banco de dados e é retornado à requisição com uma mensagem informando que o registro não existe.

# Desenvolvimento do projeto

