export interface Todo {
  id: string;
  title: string;
  description?: string | undefined;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}
