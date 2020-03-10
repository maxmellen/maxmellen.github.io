export let Elm: { Main: Main };

export interface Main {
  init(options: { node: HTMLElement; flags: Flags }): App;
}

export interface Flags {
  styles: { [className: string]: string };
}

export interface App {}
