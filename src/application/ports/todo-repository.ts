import type { CreateTodoDto, UpdateTodoDto } from '../dto/todo-dto.ts';
import type { Todo } from '../../domain/entities/todo.ts';

export interface TodoRepository {
  findAll(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | undefined>;
  create(input: CreateTodoDto): Promise<Todo>;
  update(id: string, input: UpdateTodoDto): Promise<Todo>;
  delete(id: string): Promise<void>;
}
