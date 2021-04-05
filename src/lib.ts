export type CleanUp = () => void;
export type CleanUps = CleanUp[];
export type CleanUpsMap = { [key: string]: CleanUp };
export type Module = (el: HTMLElement, props: any) => CleanUp;
export type ModuleMap = { [key: string]: Module };

export function clearUp(...cs: CleanUps) {
  cs.forEach((c) => c());
}

export function clearUpMap(cm: CleanUpsMap) {
  Object.values(cm).forEach((c) => c());
}

export function appendChildren(el: Element | null) {
  return function (...children: Element[]) {
    if (el && children.length >= 1) {
      el.innerHTML = "";
      children.forEach((child) => el.appendChild(child));
    }
  };
}

export function setText(el: HTMLElement | null) {
  return function (value: { toString: () => string }) {
    if (el) {
      el.innerText = value.toString();
    }
  };
}

export function setValue(el: Element | null) {
  return function (value: { toString: () => string }) {
    if (el && el instanceof HTMLInputElement) {
      el.value = value.toString();
    }
  };
}

export function addEventListener(
  el: Element | null,
  event: string,
  listener: (e: Event) => void
): CleanUp {
  if (el) {
    el.addEventListener(event, listener);
    return () => el.removeEventListener(event, listener);
  }

  return () => {};
}

type UpdateState<S> = (s: S) => Partial<S>;

export function createState<S extends object>(initialState: S) {
  let currentState = initialState;
  let subscriptions: ((state: S) => void)[] = [];

  const getState = () => currentState;

  const notify = (s: S) => {
    subscriptions.forEach((sub) => sub(s));
  };

  const setState = (newStateOrUpdate: Partial<S> | UpdateState<S>) => {
    let newState = {
      ...currentState
    };

    if (newStateOrUpdate instanceof Function) {
      newState = currentState = {
        ...newState,
        ...newStateOrUpdate(currentState)
      };
    } else {
      newState = currentState = {
        ...currentState,
        ...newStateOrUpdate
      };
    }

    notify(newState);

    return newState;
  };

  const subscribe = (subscription: (state: S) => void): CleanUp => {
    subscriptions = [...subscriptions, subscription];
    return () => {
      subscriptions = subscriptions.filter((sub) => sub !== subscription);
    };
  };

  return {
    subscribe,
    notify,
    setState,
    getState
  };
}

export function createProps(stringProps: {
  [name: string]: string | undefined;
}) {
  return Object.entries(stringProps).reduce(
    (props, [currentKey, value]) =>
      value
        ? {
            ...props,
            [currentKey]: JSON.parse(value)
          }
        : props,
    {}
  );
}

export default function bootstrap(moduleMap: ModuleMap) {
  return Array.from(document.querySelectorAll("[data-module]"))
    .filter((el): el is HTMLElement => el instanceof HTMLElement)
    .map((el) => {
      const { module: moduleName, ...stringProps } = el.dataset;
      if (moduleName && moduleMap[moduleName]) {
        const module = moduleMap[moduleName];
        const props = createProps(stringProps);
        return module(el, props);
      }

      return () => {};
    });
}
