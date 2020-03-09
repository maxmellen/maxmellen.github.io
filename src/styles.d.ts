declare module "*.scss" {
  interface Styles {
    [k: string]: string;
  }
  let styles: Styles;
  export = styles;
}
