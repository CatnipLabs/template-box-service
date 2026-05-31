import { Box } from '@catniplabs/box';
import type { CreateTodoDto, UpdateTodoDto } from '../../application/dto/todo-dto.ts';
import type { Todo } from '../../domain/entities/todo.ts';
import type { TodoRepository } from '../../application/ports/todo-repository.ts';

const KV_KEY_PREFIX = 'todos';

let kvInstance: Deno.Kv | undefined;

async function getKv(): Promise<Deno.Kv> {
  if (!kvInstance) {
    kvInstance = Deno.env.get('DENO_DEPLOYMENT_ID')
      ? await Deno.openKv()
      : await Deno.openKv('./kv.db');
  }
  return kvInstance;
}

@Box.Repository()
export class DenoKvTodoRepository implements TodoRepository {
  public async findAll(): Promise<Todo[]> {
    const kv = await getKv();
    const entries = kv.list<Todo>({ prefix: [KV_KEY_PREFIX] });
    const todos: Todo[] = [];
    for await (const entry of entries) {
      if (entry.value) todos.push(entry.value);
    }
    return todos;
  }

  public async findById(id: string): Promise<Todo | undefined> {
    const kv = await getKv();
    const result = await kv.get<Todo>([KV_KEY_PREFIX, id]);
    return result.value ?? undefined;
  }

  public async create(input: CreateTodoDto): Promise<Todo> {
    const kv = await getKv();
    const now = new Date().toISOString();
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    await kv.set([KV_KEY_PREFIX, todo.id], todo);
    return todo;
  }

  public async update(id: string, input: UpdateTodoDto): Promise<Todo> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Box.HttpError(
        Box.HttpStatus.NOT_FOUND,
        `Todo with id ${id} not found`,
        'todo_not_found',
      );
    }
    const updated: Todo = {
      ...existing,
      title: input.title ?? existing.title,
      description: input.description ?? existing.description,
      completed: input.completed ?? existing.completed,
      updatedAt: new Date().toISOString(),
    };
    const kv = await getKv();
    await kv.set([KV_KEY_PREFIX, id], updated);
    return updated;
  }

  public async delete(id: string): Promise<void> {
    const kv = await getKv();
    await kv.delete([KV_KEY_PREFIX, id]);
  }
}
