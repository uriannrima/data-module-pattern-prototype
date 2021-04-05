import { appendChildren } from "./lib";

type Props = {
  id?: number;
  done?: boolean;
  text?: string;
};

export default function todo(el: HTMLElement, props: Props) {
  const addToBody = appendChildren(el);

  function render() {
    const done = document.createElement("input");
    done.type = "checkbox";
    done.checked = props.done || false;

    function handleClick() {
      el.dispatchEvent(new CustomEvent("toggle", { detail: props.id }));
    }

    done.addEventListener("click", handleClick);

    const text = document.createElement(props.done ? "del" : "span");
    text.innerText = props.text || "";

    addToBody(done, text);
  }

  render();

  return () => {};
}
