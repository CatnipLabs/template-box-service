import type { CreateTodoDto, UpdateTodoDto } from "../dto/todo-dto.ts";
import type { Todo } from "../../domain/entities/todo.ts";

export abstract class TodoRepository {
  abstract findAll(): Promise<Todo[]>;
  abstract findById(id: string): Promise<Todo | undefined>;
  abstract create(input: CreateTodoDto): Promise<Todo>;
  abstract update(id: string, input: UpdateTodoDto): Promise<Todo>;
  abstract delete(id: string): Promise<void>;
}
