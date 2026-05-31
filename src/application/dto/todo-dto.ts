export interface CreateTodoDto {
  title: string;
  description?: string | undefined;
}

export interface UpdateTodoDto {
  title?: string | undefined;
  description?: string | undefined;
  completed?: boolean | undefined;
}

export type { Todo as TodoResponse } from '../../domain/entities/todo.ts';
