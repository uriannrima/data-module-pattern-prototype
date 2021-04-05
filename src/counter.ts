import { clearUp, setText, addEventListener } from "./lib";

export default function counterModule(el: HTMLElement) {
  let state = 0;
  const setCounter = setText(el.querySelector("[data-target]"));

  function inc() {
    state += 1;
    setCounter(state);
  }

  function dec() {
    state -= 1;
    setCounter(state);
  }

  const cleanIncrement = addEventListener(
    el.querySelector("[data-trigger='increment']"),
    "click",
    inc
  );

  const cleanDecrement = addEventListener(
    el.querySelector("[data-trigger='decrement']"),
    "click",
    dec
  );

  return () => clearUp(cleanIncrement, cleanDecrement);
}
