import React from "react";
import Navigation from "./components/Navigation";
import Field from "./components/Field";
import Button from "./components/Button";
import ManipulationPanel from "./components/ManipulationPanel";
import useSnakeGame from "./hooks/useSnakeGame";

function App() {
  const { state, difficulty, start, stop, reload, status, updateDirection, updateDifficulty } = useSnakeGame();

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="title">Snake Game</h1>
        </div>
        <Navigation key="navigation" length={state.body.length} difficulty={difficulty} onChangeDifficulty={updateDifficulty} />
      </header>
      <main className="main">
        <Field fields={state.fields} />
      </main>
      <footer className="footer">
        <Button status={status} onStart={start} onRestart={reload} onStop={stop} />
        <ManipulationPanel onChange={updateDirection} />
      </footer>
    </div>
  );
}

export default App;
