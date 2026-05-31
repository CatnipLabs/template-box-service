import { assertEquals, assertRejects } from 'jsr:@std/assert@^1.0.0';
import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetAllTodosUseCase,
  GetTodoByIdUseCase,
  UpdateTodoUseCase,
} from '../../src/application/use-cases/todo-use-cases.ts';
import type { TodoRepository } from '../../src/application/ports/todo-repository.ts';
import type { Todo } from '../../src/domain/entities/todo.ts';
import { NotFoundError } from '../../src/domain/errors/domain-error.ts';

class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, Todo> = new Map();

  async findAll(): Promise<Todo[]> {
    return Array.from(this.todos.values());
  }

  async findById(id: string): Promise<Todo | undefined> {
    return this.todos.get(id);
  }

  async create(input: { title: string; description?: string | undefined }): Promise<Todo> {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  async update(
    id: string,
    input: {
      title?: string | undefined;
      description?: string | undefined;
      completed?: boolean | undefined;
    },
  ): Promise<Todo> {
    const existing = this.todos.get(id);
    if (!existing) throw new Error('Todo not found');
    const updated: Todo = {
      ...existing,
      title: input.title ?? existing.title,
      description: input.description ?? existing.description,
      completed: input.completed ?? existing.completed,
      updatedAt: new Date().toISOString(),
    };
    this.todos.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    this.todos.delete(id);
  }
}

Deno.test('CreateTodoUseCase - creates a todo', async () => {
  const repo = new InMemoryTodoRepository();
  const useCase = new CreateTodoUseCase(repo);
  const result = await useCase.execute({ title: 'Test Todo' });
  assertEquals(result.title, 'Test Todo');
  assertEquals(result.completed, false);
});

Deno.test('GetAllTodosUseCase - returns empty array when no todos', async () => {
  const repo = new InMemoryTodoRepository();
  const useCase = new GetAllTodosUseCase(repo);
  const result = await useCase.execute();
  assertEquals(result.length, 0);
});

Deno.test('GetTodoByIdUseCase - returns todo when found', async () => {
  const repo = new InMemoryTodoRepository();
  const created = await repo.create({ title: 'Test Todo' });
  const useCase = new GetTodoByIdUseCase(repo);
  const result = await useCase.execute(created.id);
  assertEquals(result.id, created.id);
});

Deno.test('GetTodoByIdUseCase - throws NotFoundError when not found', async () => {
  const repo = new InMemoryTodoRepository();
  const useCase = new GetTodoByIdUseCase(repo);
  await assertRejects(() => useCase.execute('non-existent-id'), NotFoundError);
});

Deno.test('UpdateTodoUseCase - updates a todo', async () => {
  const repo = new InMemoryTodoRepository();
  const created = await repo.create({ title: 'Original' });
  const useCase = new UpdateTodoUseCase(repo);
  const result = await useCase.execute(created.id, { title: 'Updated' });
  assertEquals(result.title, 'Updated');
});

Deno.test('DeleteTodoUseCase - deletes a todo', async () => {
  const repo = new InMemoryTodoRepository();
  const created = await repo.create({ title: 'To Delete' });
  const useCase = new DeleteTodoUseCase(repo);
  await useCase.execute(created.id);
  const found = await repo.findById(created.id);
  assertEquals(found, undefined);
});

Deno.test('DeleteTodoUseCase - throws NotFoundError when todo does not exist', async () => {
  const repo = new InMemoryTodoRepository();
  const useCase = new DeleteTodoUseCase(repo);
  await assertRejects(() => useCase.execute('non-existent-id'), NotFoundError);
});
