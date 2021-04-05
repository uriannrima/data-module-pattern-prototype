export type Todo = {
  id: number;
  done: boolean;
  text: string;
};

export type Todos = Todo[];

export type Predicate<T> = (t: T) => boolean;
export type Filter<T> = (ts: T[]) => T[];
