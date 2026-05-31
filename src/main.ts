import { Box } from '@catniplabs/box';
import { HealthController } from './presentation/controllers/health-controller.ts';
import { TodoController } from './presentation/controllers/todo-controller.ts';
import { JwtAuthStrategy, TokenService } from './presentation/middlewares/jwt-auth.ts';
import { DenoKvTodoRepository } from './infra/db/deno-kv-todo-repository.ts';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodosUseCase,
  GetTodoByIdUseCase,
  UpdateTodoUseCase,
} from './application/use-cases/todo-use-cases.ts';

const logger = new Box.Log.Logger({ name: 'template-box-service' });

const app = Box.createApp({
  authStrategies: [JwtAuthStrategy],
  controllers: [HealthController, TodoController],
  docs: {
    enabled: true,
    title: 'Template Box Service API',
    version: '1.0.0',
    description: 'Example REST API with DDD, Deno KV, and JWT Auth — built with Box.',
  },
  repositories: [DenoKvTodoRepository],
  services: [
    TokenService,
    CreateTodoUseCase,
    GetAllTodosUseCase,
    GetTodoByIdUseCase,
    UpdateTodoUseCase,
    DeleteTodoUseCase,
  ],
});

app.use(Box.secureHeaders());
app.use(Box.cors({ origin: ['*'] }));
app.use(Box.payloadLimit({
  jsonMaxBytes: Box.RequestSizeLimit.MB1,
  defaultMaxBytes: Box.RequestSizeLimit.MB1,
}));
app.use(Box.requestTime());
app.use(Box.requestLogger({ logger }));

export default {
  fetch: (request: Request) => app.fetch(request),
};
