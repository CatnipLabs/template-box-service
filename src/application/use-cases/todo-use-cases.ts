import { Box } from '@catniplabs/box';
import type { CreateTodoDto, UpdateTodoDto } from '../../application/dto/todo-dto.ts';
import type { Todo } from '../../domain/entities/todo.ts';
import { NotFoundError } from '../../domain/errors/domain-error.ts';
import { DenoKvTodoRepository } from '../../infra/db/deno-kv-todo-repository.ts';

@Box.Service({ deps: [DenoKvTodoRepository] })
export class CreateTodoUseCase {
  public constructor(private readonly todoRepository: DenoKvTodoRepository) {}

  public async execute(input: CreateTodoDto): Promise<Todo> {
    return await this.todoRepository.create(input);
  }
}

@Box.Service({ deps: [DenoKvTodoRepository] })
export class GetAllTodosUseCase {
  public constructor(private readonly todoRepository: DenoKvTodoRepository) {}

  public async execute(): Promise<Todo[]> {
    return await this.todoRepository.findAll();
  }
}

@Box.Service({ deps: [DenoKvTodoRepository] })
export class GetTodoByIdUseCase {
  public constructor(private readonly todoRepository: DenoKvTodoRepository) {}

  public async execute(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo', id);
    }
    return todo;
  }
}

@Box.Service({ deps: [DenoKvTodoRepository] })
export class UpdateTodoUseCase {
  public constructor(private readonly todoRepository: DenoKvTodoRepository) {}

  public async execute(id: string, input: UpdateTodoDto): Promise<Todo> {
    return await this.todoRepository.update(id, input);
  }
}

@Box.Service({ deps: [DenoKvTodoRepository] })
export class DeleteTodoUseCase {
  public constructor(private readonly todoRepository: DenoKvTodoRepository) {}

  public async execute(id: string): Promise<void> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError('Todo', id);
    }
    await this.todoRepository.delete(id);
  }
}
