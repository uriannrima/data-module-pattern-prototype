import bootstrap, { ModuleMap } from "./lib";

import counter from "./counter";
import todos from "./todos";
import todo from "./todo";
import statusFilter from "./statusFilter";

const moduleMap: ModuleMap = {
  counter,
  todos,
  todo,
  statusFilter
};

bootstrap(moduleMap);
