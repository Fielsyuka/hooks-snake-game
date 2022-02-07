import { initFields, getFoodPosition } from "../utils";

export const defaultFieldSize = 35;
export const initialBody = { x: 17, y: 17 };
export const initialFood = getFoodPosition(defaultFieldSize, [initialBody]);
export const initialFields = initFields(defaultFieldSize, initialBody, initialFood);
export const defaultInterval = 100;
export const defaultDifficulty = 3;
export const Difficulty = [100, 80, 50, 30, 10];
export const initialState = {
  body: [initialBody],
  food: initialFood,
  fields: initialFields,
};

export const GameStatus = Object.freeze({
  init: "init",
  playing: "playing",
  suspended: "suspended",
  gameover: "gameover",
});

export const Direction = Object.freeze({
  up: "up",
  right: "right",
  left: "left",
  down: "down",
});

export const DirectionKeyCodeMap = Object.freeze({
  ArrowLeft: Direction.left,
  ArrowUp: Direction.up,
  ArrowRight: Direction.right,
  ArrowDown: Direction.down,
});

export const OppositeDirection = Object.freeze({
  up: "down",
  right: "left",
  left: "right",
  down: "up",
});

export const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
});
