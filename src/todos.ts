import {
  addEventListener,
  clearUp,
  createState,
  setValue,
  appendChildren,
  createProps
} from "./lib";
import * as Types from "./types";
import { filter } from "./utils";

import Todo from "./todo";

function renderTodo({
  todo,
  onToggle
}: {
  todo: Types.Todo;
  onToggle: (id: number) => void;
}) {
  const li = document.createElement("li");

  Todo(li, todo);

  li.addEventListener("toggle", (e: Event) => {
    if (e instanceof CustomEvent) {
      onToggle(e.detail);
    }
  });

  return li;
}

const getAll = filter<Types.Todo>(() => true);
const getDone = filter((t: Types.Todo) => t.done);
const getUndone = filter((t: Types.Todo) => !t.done);

const filterMap: { [key: string]: Types.Filter<Types.Todo> } = {
  All: getAll,
  Done: getDone,
  Undone: getUndone
};

export default function todoListModule(
  el: HTMLElement,
  {
    text: initialText,
    todos: attributeTodos
  }: {
    text?: string;
    todos?: Types.Todos;
  }
) {
  function getTodosFromDom(): Types.Todos {
    const todos = Array.from(el.querySelectorAll('[data-module="todo"]'));
    return todos
      .filter((todo): todo is HTMLElement => todo instanceof HTMLElement)
      .map((todo) => {
        const { module, ...stringProps } = todo.dataset;
        const props = createProps(stringProps);
        return { ...props } as Types.Todo;
      });
  }

  const domTodos = getTodosFromDom();

  const initialTodos = [...domTodos, ...(attributeTodos ? attributeTodos : [])];

  const { getState, setState, subscribe } = createState({
    text: initialText || "",
    todos: initialTodos,
    filter: getAll
  });

  const form = el.querySelector("[data-form]");
  const todos = el.querySelector("[data-todos]");
  const statusFilter = el.querySelector('[data-module="statusFilter"]');
  const appendTodos = appendChildren(todos);

  const updateInput = setValue(
    form?.querySelector("input") as HTMLInputElement
  );

  function onToggle(todoId: number) {
    setState(({ todos }) => {
      return {
        todos: todos?.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo
        )
      };
    });
  }

  function onAdd(e: Event) {
    e.preventDefault();

    setState(({ text, todos }) => ({
      text: "",
      todos: [
        {
          id: todos.length + 1,
          done: false,
          text
        },
        ...todos
      ]
    }));
  }

  function onChange(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      setState({
        text: e.target.value
      });
    }
  }

  function onStatusChange(event: Event) {
    if (event instanceof CustomEvent) {
      const { detail: filterName } = event;

      setState({
        filter: filterMap[filterName]
      });
    }
  }

  const clearSubmit = addEventListener(form, "submit", onAdd);
  const clearChange = addEventListener(form, "change", onChange);
  const cleanStatusChange = addEventListener(
    statusFilter,
    "statusChange",
    onStatusChange
  );

  function renderTodos(todos: Types.Todos) {
    appendTodos(...todos.map((todo) => renderTodo({ todo, onToggle })));
  }

  function updateDom({ text, todos }: { text: string; todos: Types.Todos }) {
    updateInput(text);
    renderTodos(todos);
  }

  const unsubscribe = subscribe(({ todos, text, filter }) => {
    updateDom({
      text,
      todos: filter(todos)
    });
  });

  updateDom(getState());

  return () =>
    clearUp(clearSubmit, clearChange, cleanStatusChange, unsubscribe);
}
