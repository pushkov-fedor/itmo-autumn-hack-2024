declare module "@babel/standalone" {
  import { types as t } from "@babel/core";

  export interface TransformOptions {
    presets?: (string | [string, object])[];
    plugins?: (string | [string, object] | PluginObj)[];
    filename?: string;
    sourceFileName?: string;
    sourceMaps?: boolean | "inline" | "both";
    inputSourceMap?: object;
    envName?: string;
    caller?: object;
    retainLines?: boolean;
    compact?: boolean | "auto";
    minified?: boolean;
    comments?: boolean;
    shouldPrintComment?: (comment: string) => boolean;
    auxiliaryCommentBefore?: string;
    auxiliaryCommentAfter?: string;
    sourceType?: "script" | "module" | "unambiguous";
    wrapPluginVisitorMethod?: (
      pluginAlias: string,
      visitorType: string,
      callback: Function
    ) => Function;
    highlightCode?: boolean;
    jsescOption?: object;
    moduleId?: string;
    moduleIds?: boolean;
    getModuleId?: (moduleName: string) => string;
    moduleRoot?: string;
    babelrc?: boolean;
    configFile?: string | boolean;
    babelrcRoots?: boolean | MatchPattern | MatchPattern[];
    rootMode?: "root" | "upward" | "upward-optional";
    code?: boolean;
    ast?: boolean;
    cloneInputAst?: boolean;
    env?: { [envName: string]: TransformOptions };
    extends?: string;
    ignore?: MatchPattern[];
    only?: MatchPattern[];
    overrides?: TransformOptions[];
    parserOpts?: object;
    generatorOpts?: object;
    resolveModuleSource?: (source: string, filename: string) => string;
    root?: string;
    sourceRoot?: string;
    test?: MatchPattern;
    include?: MatchPattern;
    exclude?: MatchPattern;
    targets?: string | { [key: string]: string };
    assumptions?: { [assumptionName: string]: boolean };
  }

  export interface TransformResult {
    code: string;
    map?: object;
    ast?: object;
  }

  export function transform(
    code: string,
    options?: TransformOptions
  ): TransformResult;

  export const types: typeof t;
}
