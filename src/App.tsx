import React, { useState } from "react";
import "./App.css";
import { Button, Input } from "@nlmk/ds-2.0";

function App() {
  const [query, setQuery] = useState("");
  const [generatedUI, setGeneratedUI] = useState<React.ReactNode | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = () => {
    // Here you would typically send the query to your backend
    // For now, we'll just create a simple UI based on the query
    setGeneratedUI(
      <div>
        <h2>{query}</h2>
        <Button>Generated Button</Button>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="input-container">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your UI request"
        />
        <Button onClick={handleSubmit}>Generate UI</Button>
      </div>
      <div className="generated-ui">{generatedUI}</div>
      <Button onClick={() => setShowCode(!showCode)}>
        {showCode ? "Hide Code" : "Show Code"}
      </Button>
      {showCode && (
        <div className="code-container">
          <Input
            multiline
            value={`
// Generated React Code
function GeneratedUI() {
  return (
    <div>
      <h2>${query}</h2>
      <Button>Generated Button</Button>
    </div>
  );
}
          `}
            readOnly
          />
        </div>
      )}
    </div>
  );
}

export default App;
