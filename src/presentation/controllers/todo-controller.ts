import { Box, z } from '@catniplabs/box';
import type { CreateTodoDto, TodoResponse, UpdateTodoDto } from '../../application/dto/todo-dto.ts';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodosUseCase,
  GetTodoByIdUseCase,
  UpdateTodoUseCase,
} from '../../application/use-cases/todo-use-cases.ts';

const CreateTodoSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

const UpdateTodoSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  completed: z.boolean().optional(),
});

const TodoIdParamsSchema = z.object({
  id: z.string().uuid(),
});

const TodoResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

type CreateTodoSchemaType = z.infer<typeof CreateTodoSchema>;
type UpdateTodoSchemaType = z.infer<typeof UpdateTodoSchema>;
type TodoIdParams = z.infer<typeof TodoIdParamsSchema>;

@Box.Controller('/todos', {
  deps: [
    CreateTodoUseCase,
    GetAllTodosUseCase,
    GetTodoByIdUseCase,
    UpdateTodoUseCase,
    DeleteTodoUseCase,
  ],
})
export class TodoController {
  public constructor(
    private readonly createTodo: CreateTodoUseCase,
    private readonly getAllTodos: GetAllTodosUseCase,
    private readonly getTodoById: GetTodoByIdUseCase,
    private readonly updateTodo: UpdateTodoUseCase,
    private readonly deleteTodo: DeleteTodoUseCase,
  ) {}

  @Box.Get('/', {
    summary: 'List all todos',
    responses: {
      [Box.HttpStatus.OK]: {
        description: 'List of todos',
        body: z.array(TodoResponseSchema),
      },
    },
  })
  public async list(): Promise<TodoResponse[]> {
    return await this.getAllTodos.execute();
  }

  @Box.Get(':id', {
    summary: 'Find todo by id',
    request: { params: TodoIdParamsSchema },
    responses: {
      [Box.HttpStatus.OK]: {
        description: 'Todo found',
        body: TodoResponseSchema,
      },
      [Box.HttpStatus.NOT_FOUND]: { description: 'Todo not found' },
    },
  })
  public async findById(input: { params: TodoIdParams }): Promise<TodoResponse> {
    return await this.getTodoById.execute(input.params.id);
  }

  @Box.Post('/', {
    auth: 'jwt',
    status: Box.HttpStatus.CREATED,
    summary: 'Create a new todo',
    request: {
      body: CreateTodoSchema,
      bodyMaxBytes: Box.RequestSizeLimit.KB16,
    },
    responses: {
      [Box.HttpStatus.CREATED]: {
        description: 'Todo created',
        body: TodoResponseSchema,
      },
      [Box.HttpStatus.UNAUTHORIZED]: {
        description: 'Missing or invalid bearer token',
      },
      [Box.HttpStatus.BAD_REQUEST]: { description: 'Invalid input' },
    },
  })
  public async create(
    input: { body: CreateTodoSchemaType },
  ): Promise<TodoResponse> {
    const dto: CreateTodoDto = {
      title: input.body.title,
      description: input.body.description,
    };
    return await this.createTodo.execute(dto);
  }

  @Box.Put(':id', {
    auth: 'jwt',
    summary: 'Update a todo',
    request: {
      params: TodoIdParamsSchema,
      body: UpdateTodoSchema,
      bodyMaxBytes: Box.RequestSizeLimit.KB16,
    },
    responses: {
      [Box.HttpStatus.OK]: {
        description: 'Todo updated',
        body: TodoResponseSchema,
      },
      [Box.HttpStatus.NOT_FOUND]: { description: 'Todo not found' },
      [Box.HttpStatus.UNAUTHORIZED]: {
        description: 'Missing or invalid bearer token',
      },
    },
  })
  public async update(
    input: { params: TodoIdParams; body: UpdateTodoSchemaType },
  ): Promise<TodoResponse> {
    const dto: UpdateTodoDto = {
      title: input.body.title,
      description: input.body.description,
      completed: input.body.completed,
    };
    return await this.updateTodo.execute(input.params.id, dto);
  }

  @Box.Delete(':id', {
    auth: 'jwt',
    status: Box.HttpStatus.NO_CONTENT,
    summary: 'Delete a todo',
    request: { params: TodoIdParamsSchema },
    responses: {
      [Box.HttpStatus.NO_CONTENT]: { description: 'Todo deleted' },
      [Box.HttpStatus.NOT_FOUND]: { description: 'Todo not found' },
      [Box.HttpStatus.UNAUTHORIZED]: {
        description: 'Missing or invalid bearer token',
      },
    },
  })
  public async delete(input: { params: TodoIdParams }): Promise<void> {
    await this.deleteTodo.execute(input.params.id);
  }
}
