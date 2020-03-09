declare module "*.elm" {
  export let Elm: {
    [name: string]: Module | undefined;
  };

  export interface Module {
    init(options: { node: HTMLElement; flags?: any }): App;
  }

  export interface App {
    ports?: { [name: string]: Port | undefined };
  }

  export interface Port {
    subscribe?(handler: (message: any) => void): void;
    unsubscribe?(handler: (message: any) => void): void;
    send?(message: any): void;
  }
}
