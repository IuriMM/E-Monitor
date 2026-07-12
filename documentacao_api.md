# Documentação da API - eMonitor

Esta documentação fornece uma visão geral técnica sobre como a API FastAPI foi construída, detalhando a conexão com o banco de dados MongoDB, os modelos Pydantic e como as rotas interagem para fornecer as operações de CRUD.

---

## 1. Conexão com o MongoDB

A API utiliza a biblioteca assíncrona **Motor** para se comunicar com o MongoDB. Isso garante que a aplicação FastAPI (que é construída com suporte assíncrono por padrão) não fique bloqueada enquanto aguarda respostas do banco de dados.

**Como funciona (no arquivo `database.py`):**
- É definida a URL de conexão (por padrão: `mongodb://localhost:27017`) e o nome do banco de dados `eMonitorDB`.
- Uma função `connect_to_mongo()` inicializa o `AsyncIOMotorClient`.
- Uma função `close_mongo_connection()` garante o encerramento do pool de conexões.
- Essas duas funções estão amarradas ao ciclo de vida (Lifespan) da aplicação principal (`main.py`), garantindo que o banco de dados esteja disponível assim que o Uvicorn subir o servidor.
- A função `get_db()` é usada nos endpoints para acessar as coleções.

---

## 2. Modelagem de Dados (Pydantic)

Para garantir que os dados recebidos pelo usuário e enviados de volta pelo banco tenham o formato correto, utilizamos o **Pydantic**. 

O MongoDB gera um campo único `_id` do tipo `ObjectId` para cada documento inserido. Para compatibilizar o Pydantic com esse formato (para que ele consiga validar e serializar para JSON sem erros), criamos uma classe base no arquivo `models/base.py`:

* **`PyObjectId`**: Uma classe customizada que ensina o Pydantic a tratar strings que na verdade representam `ObjectId` do BSON.
* **`BaseDBModel`**: Todo modelo principal estende essa classe base, que mapeia o campo `_id` interno do MongoDB para um campo acessível como `id` no front-end.

A API possui as seguintes **6 coleções** de modelos, e todas elas seguem um padrão com o sufixo `Create` para inserção e `Update` para atualização parcial (campos opcionais):

1. **Materia**:
   - Campos: `codigo`, `nome`, `monitores` (lista), `cronograma` (lista de horários e salas).
2. **Prova**:
   - Campos: `nome`, `dia`, `horario`, `materia`.
3. **Usuario**:
   - Campos: `nome`, `sobrenome`, `fotoPerfil`, `curso`, `matricula`, `materias` (lista de matérias em que está inscrito).
4. **Duvida**:
   - Campos: `materia`, `horario`, `duvida`, `status`, `comentarios` (lista contendo o autor, classe e texto).
5. **Mensagem**:
   - Campos: `destinatario`, `remetente`, `texto`, `horario`.
6. **MaterialEstudo**:
   - Campos: `materia`, `autor`, `titulo`, `comentario`, `link`, `data`.

---

## 3. Rotas e Endpoints (CRUD)

Para manter o código limpo, cada coleção possui seu próprio arquivo de rotas (Roteador FastAPI) na pasta `routes/`. 

Todos seguem o mesmo padrão de CRUD (Create, Read, Update, Delete). Tomando como exemplo a rota `/materias`:

### `POST /api/materias/` (Create)
- **Função**: Adiciona uma nova matéria.
- **Entrada**: Recebe um JSON seguindo o formato do modelo `MateriaCreate`.
- **Fluxo**: Ele converte o JSON em um dicionário, insere no MongoDB usando `await db.materias.insert_one()`, busca e retorna o registro recém-criado com o ID embutido.
- **Status de Sucesso**: `201 Created`.

### `GET /api/materias/` (Read - List)
- **Função**: Lista todas as matérias cadastradas.
- **Fluxo**: Usa `await db.materias.find().to_list(1000)` para buscar documentos e os devolve no formato de lista validado pelo Pydantic.

### `GET /api/materias/{id}` (Read - Single)
- **Função**: Retorna os detalhes de uma matéria específica.
- **Entrada**: O `id` do documento fornecido na URL.
- **Fluxo**: Verifica se o `id` é um ObjectId válido e em seguida executa um `find_one()`. Se não achar nada, devolve erro HTTP 404 (Not Found).

### `PUT /api/materias/{id}` (Update)
- **Função**: Atualiza dados de uma matéria existente.
- **Entrada**: JSON com formato `MateriaUpdate` (onde os campos são opcionais).
- **Fluxo**: Mapeia o JSON ignorando campos nulos. Realiza a atualização com o `$set` do MongoDB através do `update_one()`.
  
### `DELETE /api/materias/{id}` (Delete)
- **Função**: Remove uma matéria do banco de dados.
- **Entrada**: `id` na URL.
- **Fluxo**: Executa `delete_one()`. Se for concluído sem alterar nenhuma linha, ele levanta erro 404.
- **Status de Sucesso**: `204 No Content` (ação executada com sucesso, mas sem dados pra retornar no corpo).

---

## 4. Como tudo interage?

1. O **FastAPI** (`main.py`) atua como o maestro, reunindo todas as 6 sub-rotas usando a função `app.include_router()`. Ele adiciona o prefixo comum `/api` em todas elas.
2. Quando a API é iniciada (`uvicorn`), o evento de `lifespan` executa a função de conectar com o **MongoDB**.
3. Quando você faz uma requisição no **Swagger** (`http://localhost:8000/docs`), por exemplo testando o POST de um `Usuario`:
   - O Pydantic valida os dados que você digitou.
   - O FastAPI redireciona pro router de `/usuarios/`.
   - A função da rota extrai a conexão do MongoDB.
   - O Motor faz a persistência assíncrona da informação no banco de dados.
   - A função formata e retorna um JSON com o campo `_id` bonitinho convertido para string.

> [!TIP]
> A documentação técnica detalhada fornecida pelo próprio Swagger captura automaticamente as informações dos modelos Pydantic e as exibe na interface interativa. Sempre utilize o `/docs` se quiser visualizar rapidamente quais campos cada endpoint espera.
