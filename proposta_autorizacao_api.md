## Problema

A API tem **autenticação** (JWT) mas não tem **autorização por papel**. Qualquer usuário autenticado — inclusive uma conta recém-autocadastrada, já que `POST /usuarios/` é público e sem verificação — pode criar, editar e **apagar** dados que deveriam ser restritos a monitores/administradores ou ao próprio autor.

## Prova (testado ao vivo em produção, dados já revertidos)

```
1. POST /api/usuarios/         (conta nova, sem vínculo com nada)     -> 201
2. POST /api/usuarios/login                                          -> 200 (token válido)
3. POST /api/materias/         (com o token dessa conta nova)        -> 201  ❌ criou matéria
4. DELETE /api/provas/{id}     (prova pertencente a outro usuário)   -> 204  ❌ apagou registro alheio
```

Só a rota `/usuarios/{id}` (PUT/DELETE) tem checagem de dono hoje. Todas as outras 5 coleções (`materias`, `provas`, `duvidas`, `mensagens`, `materiais_estudo`) aceitam qualquer usuário autenticado em toda operação de escrita.

## Mudança proposta

### 1. Adicionar papel ao usuário

No modelo `Usuario`, novo campo:

```python
class Papel(str, Enum):
    ALUNO = "aluno"
    MONITOR = "monitor"
    ADMIN = "admin"

# UsuarioCreate / Usuario: papel: Papel = Papel.ALUNO
```

- Default `aluno` para todo cadastro novo e para usuários já existentes (migração/backfill).
- `admin` não é atribuível via `POST /usuarios/` público — só via seed manual no banco ou uma rota futura restrita a admin.

### 2. Dependency de autorização no FastAPI

```python
def require_role(*allowed: Papel):
    def checker(current_user: Usuario = Depends(get_current_user)):
        if current_user.papel not in allowed:
            raise HTTPException(403, "Ação não permitida para seu papel.")
        return current_user
    return checker
```

### 3. Aplicar por rota

| Rota | Método | Regra hoje | Regra proposta |
|---|---|---|---|
| `/usuarios/` | POST | público | manter público (cadastro) — *ou* ver item 5 abaixo |
| `/usuarios/{id}` | PUT/DELETE | só o dono | manter (já correto) |
| `/materias/` | POST | qualquer autenticado | `monitor` ou `admin` |
| `/materias/{id}` | PUT/DELETE | qualquer autenticado | `monitor` da matéria (`matricula in materia.monitores`) ou `admin` |
| `/provas/` | POST | qualquer autenticado | `monitor` ou `admin` |
| `/provas/{id}` | PUT/DELETE | qualquer autenticado | `monitor` da matéria da prova ou `admin` |
| `/duvidas/` | POST | qualquer autenticado | **manter aberto** (é o uso normal: aluno pergunta) |
| `/duvidas/{id}` | PUT | qualquer autenticado | manter aberto pra comentar; **mudar `status`** (ex: marcar "Respondida") deveria exigir monitor/admin |
| `/duvidas/{id}` | DELETE | qualquer autenticado | autor da dúvida (`duvida.usuario == current_user.id`) ou monitor/admin |
| `/materiais_estudo/` | POST | qualquer autenticado | **manter aberto** (é conteúdo compartilhado entre colegas) |
| `/materiais_estudo/{id}` | PUT/DELETE | qualquer autenticado | autor (ver item 4) ou monitor/admin |
| `/mensagens/{id}` | DELETE | qualquer autenticado | remetente ou destinatário da mensagem |

### 4. Efeito colateral a corrigir junto

`materiais_estudo.autor` hoje é uma string de texto livre digitada no formulário (não o id do usuário autenticado), então não dá pra checar posse com segurança. Alinhar com o padrão que `duvidas.usuario` já usa (Fase 1): setar a partir do JWT no `POST`, ignorando o que o cliente mandar.

### 5. Considerar fechar o cadastro público

Decisão de produto, não só técnica: se este sistema é fechado pra uma turma/curso específico, `POST /usuarios/` sem nenhuma verificação permite qualquer pessoa da internet virar "aluno" do sistema. Alternativas:
- Convite/código de matrícula validado contra uma lista pré-cadastrada.
- Aprovação manual por um admin.
- Validação de domínio de e-mail institucional.

### 6. Confirmar `JWT_SECRET_KEY`

Já reportado antes: o fallback de dev não pode estar ativo em produção. Vale confirmar que a variável de ambiente real está setada no Render.

## Compatibilidade com o frontend

Nenhuma mudança é necessária no repositório do frontend por causa disso — o client HTTP centralizado (`src/api/client.js`) já propaga qualquer erro da API (incluindo um futuro `403`) como mensagem visível pro usuário, então basta a API retornar 403 nos casos acima que a UI já lida com isso graciosamente.
