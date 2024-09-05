import React, { useState, ErrorInfo, ReactNode } from "react";
import "./App.css";
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

const customExportDefaultPlugin = ({
  types: t,
}: {
  types: typeof Babel.types;
}) => ({
  visitor: {
    ExportDefaultDeclaration(path: any) {
      const declaration = path.get("declaration");
      if (declaration.isAssignmentExpression()) {
        const left = declaration.get("left");
        const right = declaration.get("right");
        if (
          left.isIdentifier() &&
          (right.isArrowFunctionExpression() || right.isFunctionExpression())
        ) {
          // Transform `export default App = () => (...)` to `const App = () => (...); export default App;`
          const variableDeclaration = t.variableDeclaration("const", [
            t.variableDeclarator(left.node, right.node),
          ]);
          const exportDefault = t.exportDefaultDeclaration(left.node);
          path.replaceWithMultiple([variableDeclaration, exportDefault]);
        }
      }
    },
  },
});

const Main = () => {
  const [code, setCode] = useState("");
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCode(event.target.value);
    setError(null);
  };

  const handleRender = () => {
    try {
      const codeWithReactImport = `import React from "react";\n${code}`;

      const transformedCode = Babel.transform(codeWithReactImport, {
        presets: ["env", "react"],
        plugins: [
          "proposal-class-properties",
          "proposal-object-rest-spread",
          customExportDefaultPlugin,
        ],
      }).code;

      // Explicitly type module.exports to include the default property
      const module: { exports: { default: React.FC | null } } = {
        exports: { default: null },
      };
      const require = (name: string) => {
        if (name === "react") return React;
        if (name === "@nlmk/ds-2.0") return DS;
        throw new Error(`Module not found: ${name}`);
      };

      console.log(transformedCode);

      eval(
        `(function(require, module, exports) { ${transformedCode} })(require, module, module.exports);`
      );

      const ExportedComponent = module.exports.default;
      if (typeof ExportedComponent !== "function") {
        throw new Error("Exported component is not a valid React component");
      }

      setComponent(() => ExportedComponent);
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
        <DS.Input
          multiline
          resize
          label="Введите код компонента / Write code component"
          value={code}
          onChange={handleChange}
          placeholder="Введите JSX код здесь"
        />
        <DS.Button onClick={handleRender}>Render</DS.Button>
      </div>
      <div className="generated-ui">
        {error ? (
          <DS.Typography color="error">
            Ошибка компиляции: {error}
          </DS.Typography>
        ) : Component ? (
          <ErrorBoundary>
            <Component />
          </ErrorBoundary>
        ) : (
          <DS.Typography>
            Введите корректный JSX код и нажмите "Render"
          </DS.Typography>
        )}
      </div>
    </div>
  );
};

export default Main;
