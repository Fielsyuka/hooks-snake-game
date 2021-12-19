import React, { useCallback, useEffect, useState, useReducer } from "react";
import Navigation from "./components/Navigation";
import Field from "./components/Field";
import Button from "./components/Button";
import ManipulationPanel from "./components/ManipulationPanel";
import { initFields, getFoodPosition } from "./utils";

// 定数
const GameStatus = Object.freeze({
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gamever: "gameover",
});

const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

const OppositeDirection = Object.freeze({
  up: "down",
  right: "left",
  left: "right",
  down: "up",
});

const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
});

const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});

// タイマー
let timer;
const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
};

// 関数
const isCollision = (position) => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }
  if (position.y > defaultFieldSize - 1 || position.x > defaultFieldSize - 1) {
    return true;
  }
  return false;
};

const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === "snake";
};

// initial/default
const defaultFieldSize = 35;
const initialBody = { x: 17, y: 17 };
const initialFood = getFoodPosition(defaultFieldSize, [initialBody]);
const initialFields = initFields(defaultFieldSize, initialBody, initialFood);
const defaultDifficulty = 3;
const Difficulty = [1000, 500, 100, 50, 10];

// reducer
const initialState = {
  body: [initialBody],
  food: initialFood,
  fields: initialFields,
};

const reducer = (state, action) => {
  const newBody = [action.nextPos, ...state.body];
  const newFields = [...state.fields];
  switch (action.type) {
    case "reset":
      return {
        body: [initialBody],
        food: initialFood,
        fields: initFields(defaultFieldSize, initialBody, initialFood),
      };
    case "continue":
      const remove = newBody.pop();
      newFields[remove.y][remove.x] = "";
      newFields[newBody[0].y][newBody[0].x] = "snake";
      return {
        ...state,
        body: newBody,
        fields: newFields,
      };
    case "newFood":
      newFields[action.nextPos.y][action.nextPos.x] = "snake";
      newFields[action.nextFood.y][action.nextFood.x] = "food";
      return {
        body: newBody,
        food: action.nextFood,
        fields: newFields,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);

  const onStart = () => setStatus(GameStatus.playing);
  const onStop = () => setStatus(GameStatus.suspended);

  const onRestart = () => {
    setStatus(GameStatus.init);
    setDirection(Direction.up);
    dispatch({ type: "reset" });
  };

  const onChangeDirection = useCallback(
    (newDirection) => {
      if (status !== GameStatus.playing) {
        return direction;
      }
      if (OppositeDirection[direction] === newDirection) {
        return;
      }
      setDirection(newDirection);
    },
    [direction, status]
  );

  const onChangeDifficulty = useCallback(
    (difficulty) => {
      if (status !== GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    },
    [status]
  );

  // メイン処理
  useEffect(() => {
    if (status !== GameStatus.playing) {
      return;
    }

    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      const newPosition = {
        x: state.body[0].x + Delta[direction].x,
        y: state.body[0].y + Delta[direction].y,
      };

      if (isCollision(newPosition) || isEatingMyself(state.fields, newPosition)) {
        setStatus(GameStatus.gamever);
      } else {
        if (state.fields[newPosition.y][newPosition.x] === "food") {
          const newFoodPos = getFoodPosition(defaultFieldSize, [...state.body, newPosition]);
          dispatch({
            type: "newFood",
            nextPos: newPosition,
            nextFood: newFoodPos,
          });
        } else {
          dispatch({
            type: "continue",
            nextPos: newPosition,
          });
        }
      }
    }, interval);
    return unsubscribe;
  }, [state, status, direction, difficulty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onChangeDirection]);

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="nav-title">Snake Game</h1>
        </div>
        <Navigation key="navigation" length={state.body.length} difficulty={difficulty} onChangeDifficulty={onChangeDifficulty} />
      </header>
      <main className="main">
        <Field fields={state.fields} />
      </main>
      <footer className="footer">
        <Button status={status} onStart={onStart} onRestart={onRestart} onStop={onStop} />
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
