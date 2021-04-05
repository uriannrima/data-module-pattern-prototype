import { Predicate } from "./types";

export const filter = <T>(predicate: Predicate<T>) => {
  return function (ts: T[]): T[] {
    return ts.filter(predicate);
  };
};
