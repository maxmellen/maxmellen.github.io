declare module "*.elm" {
  export interface InitTypes<F = undefined, P extends PortNames = PortNames> {
    flags: F;
    ports: P;
  }

  export interface PortNames<
    I extends string = string,
    O extends string = string
  > {
    incoming: I;
    outgoing: O;
  }

  export interface Module {
    init<T extends InitTypes<any>>(options: {
      node: HTMLElement;
      flags: T extends InitTypes<infer F, infer _> ? F : never;
    }): T extends InitTypes<infer _, infer K> ? App<K> : never;
  }

  export interface App<K extends PortNames> {
    ports: Ports<K>;
  }

  export type Ports<K> = K extends PortNames<infer I, infer O>
    ? IncomingPorts<I> & OutgoingPorts<O>
    : never;

  export type IncomingPorts<K extends string> = { [name in K]: IncomingPort };
  export type OutgoingPorts<K extends string> = { [name in K]: OutgoingPort };

  export interface IncomingPort {
    send(message: any): void;
  }

  export interface OutgoingPort {
    subscribe(handler: Handler): void;
    unsubscribe(handler: Handler): void;
  }

  export interface Handler {
    (...args: any[]): void;
  }

  export let Elm: {
    [name: string]: Module | undefined;
  };
}
