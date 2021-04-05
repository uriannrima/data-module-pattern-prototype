import { addEventListener, appendChildren, clearUp, createState } from "./lib";

function renderOption(option: string) {
  const optEl = document.createElement("option");

  optEl.value = option;
  optEl.innerText = option;

  return optEl;
}

type Props = {
  options?: string[];
};

export default function statusFilter(el: HTMLElement, props: Props) {
  const { options: attrOptions } = props;

  function getDomOptions(): string[] {
    return Array.from(el.querySelectorAll("option")).map(
      (option) => option.value
    );
  }

  const options: string[] = [
    ...getDomOptions(),
    ...(attrOptions ? attrOptions : []),
    "Undone"
  ];

  const { setState, subscribe } = createState({ selected: options[0] });

  const select = el.querySelector("select");
  const addOptions = appendChildren(select);

  function renderOptions() {
    addOptions(...options.map(renderOption));
  }

  function onChange({ target }: Event) {
    if (target instanceof HTMLSelectElement) {
      const { value: selected } = target;
      setState({
        selected
      });
    }
  }

  subscribe(({ selected: detail }) => {
    el.dispatchEvent(new CustomEvent("statusChange", { detail }));
  });

  const cleanChange = addEventListener(select, "change", onChange);

  renderOptions();

  return () => clearUp(cleanChange);
}
