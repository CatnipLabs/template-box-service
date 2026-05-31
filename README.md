# Template Box Service

Template de microserviço backend serverless com **Deno** e **Box** (CatnipLabs) — seguindo padrão **DDD** com suporte a **Deno KV** e **JWT Auth**.

---

## Instalação

Use este template no GitHub ou clone diretamente:

```bash
git clone https://github.com/CatnipLabs/template-box-service.git
cd template-box-service
deno install
```

Instale o framework Box:

```bash
deno add jsr:@catniplabs/box
```

---

## Estrutura DDD

```
src/
├── domain/          # Regras de negócio puras
│   ├── entities/      # Entidades (Todo)
│   └── errors/        # Erros de domínio
├── application/     # Casos de uso e portas
│   ├── dto/           # Data Transfer Objects
│   ├── use-cases/     # Lógica de aplicação
│   └── ports/         # Interfaces dos repositórios
├── infra/           # Adaptadores externos
│   ├── db/            # Implementação Deno KV
│   └── config/        # Configurações
└── presentation/    # Interface com o mundo externo
    ├── controllers/   # Controllers Box
    ├── middlewares/   # JWT Auth
    └── routes/        # Agrupamento de rotas
```

---

## Scripts Disponíveis

| Comando                | Descrição                     |
| ---------------------- | ----------------------------- |
| `deno task dev`        | Inicia servidor em modo watch |
| `deno task start`      | Inicia servidor (produção)    |
| `deno task test`       | Executa testes                |
| `deno task test:watch` | Executa testes em watch mode  |
| `deno task fmt`        | Formata código                |
| `deno task fmt:check`  | Verifica formatação           |
| `deno task lint`       | Executa linter                |
| `deno task check`      | Type checking                 |
| `deno task coverage`   | Relatório de cobertura        |

---

## Exemplo de Uso

### Health Check (público)

```bash
curl http://localhost:8000/health
```

### Criar Todo (autenticado)

```bash
curl -X POST http://localhost:8000/todos \\
  -H "Authorization: Bearer valid-jwt" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Buy milk","description":"From the store"}'
```

### Listar Todos (público)

```bash
curl http://localhost:8000/todos
```

### Atualizar Todo (autenticado)

```bash
curl -X PUT http://localhost:8000/todos/:id \\
  -H "Authorization: Bearer valid-jwt" \\
  -H "Content-Type: application/json" \\
  -d '{"completed":true}'
```

### Deletar Todo (autenticado)

```bash
curl -X DELETE http://localhost:8000/todos/:id \\
  -H "Authorization: Bearer valid-jwt"
```

---

## Autenticação JWT

O template inclui uma estratégia de autenticação JWT simplificada. Para produção:

1. Configure `TokenService` para verificar assinatura JWT real
2. Use variáveis de ambiente para segredos
3. Ajuste o tempo de expiração dos tokens

Endpoints que requerem autenticação usam o decorator `@Box.Auth("jwt")`.

---

## Persistência com Deno KV

O repositório `DenoKvTodoRepository` utiliza **Deno KV**:

- **Local**: Armazena em `./kv.db`
- **Deno Deploy**: Usa KV global automaticamente

Para resetar dados locais, delete o arquivo `./kv.db`.

---

## Deploy

### Deno Deploy

1. Conecte o repositório no [Deno Deploy Dashboard](https://dash.deno.com)
2. Configure variáveis de ambiente se necessário
3. Deploy automático no push para `main`

---

## Testes

Testes unitários para domínio e integração para controllers:

```bash
deno task test
```

---

## CI/CD

O GitHub Actions executa automaticamente:

- Type checking
- Formatação
- Lint
- Testes

---

## Licença

MIT © CatnipLabs
