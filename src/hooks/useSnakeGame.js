import { useCallback, useEffect, useState } from "react";

import {
  defaultFieldSize,
  defaultDifficulty,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  GameStatus,
  OppositeDirection,
  initialBody,
  initialFood,
  initialState,
} from "../constants";

import { initFields, isCollision, isEatingMyself, getFoodPosition } from "../utils";

// import reducer from "../reducers/reducer";

// タイマー
let timer;
const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
};

const useSnakeGame = () => {
  const [state, setState] = useState(initialState);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);

  const start = () => setStatus(GameStatus.playing);
  const stop = () => setStatus(GameStatus.suspended);
  const reload = () => {
    setStatus(GameStatus.init);
    setDirection(Direction.up);
    setState({
      body: [initialBody],
      food: initialFood,
      fields: initFields(defaultFieldSize, initialBody, initialFood),
    });
  };

  const updateDirection = useCallback(
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

  const updateDifficulty = useCallback(
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.key];
      if (!newDirection) {
        return;
      }
      updateDirection(newDirection);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [updateDirection]);

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
        setStatus(GameStatus.gameover);
      }

      const newBody = [newPosition, ...state.body];
      const newFields = [...state.fields];
      if (state.fields[newPosition.y][newPosition.x] === "food") {
        const newFoodPos = getFoodPosition(defaultFieldSize, [...state.body, newPosition]);
        newFields[newPosition.y][newPosition.x] = "snake";
        newFields[newFoodPos.y][newFoodPos.x] = "food";
        setState({
          body: newBody,
          food: newFoodPos,
          fields: newFields,
        });
      } else {
        const remove = newBody.pop();
        newFields[remove.y][remove.x] = "";
        newFields[newPosition.y][newPosition.x] = "snake";
        setState((prev) => {
          return {
            ...prev,
            body: newBody,
            fields: newFields,
          };
        });
      }
    }, interval);
    return unsubscribe;
  }, [state, status, direction, difficulty]);

  return {
    state,
    difficulty,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;
