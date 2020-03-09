declare module "*.elm" {
  export interface Module {
    init<T>(options: { node: HTMLElement } & Flags<T>): App<T>;
  }

  export type Flags<T> = T extends { flags: infer F } ? { flags: F } : {};

  export type App<T> = T extends { ports: PortNames<infer I, infer O> }
    ? { ports: IncomingPorts<I> & OutgoingPorts<O> }
    : {};

  export interface PortNames<I extends string, O extends string> {
    incoming?: I;
    outgoing?: O;
  }

  export type IncomingPorts<K extends string> = {
    [name in K]: IncomingPort
  }

  export type OutgoingPorts<K extends string> = {
    [name in K]: OutgoingPort
  }

  export interface IncomingPort {
    send(message: any): void;
  }

  export interface OutgoingPort {
    subscribe(handler: (...args: any[]) => void): void;
    unsubscribe(handler: (...args: any[]) => void): void;
  }

  export let Elm: {
    [name: string]: Module | undefined;
  };
}
