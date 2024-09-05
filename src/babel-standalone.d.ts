declare module "@babel/standalone" {
  export function transform(
    code: string,
    options: { presets?: any[]; plugins?: string[] }
  ): { code: string };
}
