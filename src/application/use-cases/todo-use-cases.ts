import type { CreateTodoDto, TodoResponse, UpdateTodoDto } from '../dto/todo-dto.ts';
import type { Todo } from '../../domain/entities/todo.ts';
import type { TodoRepository } from '../ports/todo-repository.ts';
import { NotFoundError } from '../../domain/errors/domain-error.ts';

export class CreateTodoUseCase {
  public constructor(private readonly todoRepository: TodoRepository) {}

  public async execute(input: CreateTodoDto): Promise<TodoResponse> {
    const todo = await this.todoRepository.create(input);
    return todo;
  }
}

export class GetAllTodosUseCase {
  public constructor(private readonly todoRepository: TodoRepository) {}

  public async execute(): Promise<TodoResponse[]> {
    return await this.todoRepository.findAll();
  }
}

export class GetTodoByIdUseCase {
  public constructor(private readonly todoRepository: TodoRepository) {}

  public async execute(id: string): Promise<TodoResponse> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo', id);
    }
    return todo;
  }
}

export class UpdateTodoUseCase {
  public constructor(private readonly todoRepository: TodoRepository) {}

  public async execute(id: string, input: UpdateTodoDto): Promise<TodoResponse> {
    return await this.todoRepository.update(id, input);
  }
}

export class DeleteTodoUseCase {
  public constructor(private readonly todoRepository: TodoRepository) {}

  public async execute(id: string): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo', id);
    }
    await this.todoRepository.delete(id);
  }
}
