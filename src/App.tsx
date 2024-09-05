import React, { useState, ErrorInfo, ReactNode } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import * as DS from "@nlmk/ds-2.0";
import * as Babel from "@babel/standalone";

// Компонент ErrorBoundary для отлова ошибок рендеринга
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", marginTop: "10px" }}>
          <h3>Ошибка рендеринга:</h3>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  const [code, setCode] = useState("");
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    setError(null);
  };

  const handleRender = () => {
    try {
      let processedCode = code.replace(
        /export\s+default\s+(\w+)\s*=\s*(\(\s*\)\s*=>\s*\(?\s*<)/,
        (match, name) => `const ${name} = () => (\n<`
      );
      const componentName =
        processedCode.match(/const\s+(\w+)\s*=/)?.[1] || "App";
      processedCode += `\nexport default ${componentName};`;

      const codeWithReactImport = `import React from "react";\n${processedCode}`;

      const transformedCode = Babel.transform(codeWithReactImport, {
        presets: [["env", { modules: "commonjs" }], "react"],
        plugins: ["proposal-class-properties", "proposal-object-rest-spread"],
      }).code;

      const module = { exports: { default: null } };
      const require = (name: string) => {
        if (name === "react") return React;
        if (name === "@nlmk/ds-2.0") return DS;
        throw new Error(`Module not found: ${name}`);
      };

      eval(`
        (function(require, module, exports) {
          ${transformedCode}
        })(require, module, module.exports);
      `);

      setComponent(() => module.exports.default);
      setError(null);
    } catch (error) {
      console.error("Invalid code:", error);
      setComponent(null);
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="App">
      <div className="input-container">
        <textarea
          value={code}
          onChange={handleChange}
          placeholder="Введите JSX код здесь"
        />
        <button onClick={handleRender}>Render</button>
      </div>
      <div className="generated-ui">
        {error ? (
          <div
            className="error-message"
            style={{ color: "red", marginTop: "10px" }}
          >
            Ошибка компиляции: {error}
          </div>
        ) : Component ? (
          <ErrorBoundary>
            <Component />
          </ErrorBoundary>
        ) : (
          <p>Введите корректный JSX код и нажмите "Render"</p>
        )}
      </div>
    </div>
  );
};

export default App;
