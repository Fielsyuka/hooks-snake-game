import React, { useCallback, useEffect, useState, useReducer } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields, getFoodPosition } from './utils';

// 定数
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gamever: 'gameover'
})

const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
})

const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

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
}

// 関数
const isCollision = (position) => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }
  if (position.y > defaultFieldSize - 1 || position.x > defaultFieldSize - 1) {
    return true;
  }
  return false;
}

const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake';
}

// initial/default
const defaultInterval = 100;
const defaultFieldSize = 35;
const initialBody = { x: 17, y: 17 };
const initialFood = getFoodPosition(defaultFieldSize, [initialBody]);
const initialFields = initFields(defaultFieldSize, initialBody, initialFood);

// reducer
const initialState = {
  body: [initialBody],
  food: initialFood,
  removePos: undefined
};

const reducer = (state, action) => {
  const nextPos = {
    x: state.body[0].x + Delta[action.direction].x,
    y: state.body[0].y + Delta[action.direction].y,
  }
  const newBody = [nextPos, ...state.body];

  switch (action.type) {
    case "restart":
      return {
        body: [initialBody],
        food: initialFood,
        removePos: undefined
      };
    case "continue":
      const remove = newBody.pop();

      return {
        body: newBody,
        food: state.food,
        removePos: remove
      };
    case "newFood":
      const newFoodPos = getFoodPosition(defaultFieldSize, newBody);
      return {
        body: newBody,
        food: newFoodPos,
        removePos: undefined
      };
    default:
      return state
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [fields, setFields] = useState(initialFields);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);

  const onStart = () => setStatus(GameStatus.playing);

  const onRestart = () => {
    setStatus(GameStatus.init);
    setDirection(Direction.up);
    dispatch({ type: 'restart', direction: direction });
    setFields(initFields(defaultFieldSize, initialBody, initialFood));
  }

  const onChangeDirection = useCallback((newDirection) => {
    if (status !== GameStatus.playing) {
      return direction;
    }
    if (OppositeDirection[direction] === newDirection) {
      return;
    }
    setDirection(newDirection);
  }, [direction, status]);

  // メイン処理
  useEffect(() => {
    if (status !== GameStatus.playing) {
      return;
    }

    timer = setInterval(() => {
    const newPosition = {
      x: state.body[0].x + Delta[direction].x,
      y: state.body[0].y + Delta[direction].y,
    };

    if (isCollision(newPosition) || isEatingMyself(fields, newPosition)) {
      setStatus(GameStatus.gamever);
    } else {
      if (fields[newPosition.y][newPosition.x] === 'food') {
        dispatch({
          type: "newFood",
          direction: direction
        });
      } else {
        dispatch({
          type: "continue",
          direction: direction
        });
      }
    }
    }, defaultInterval);
    return unsubscribe;
  },[state, status, direction]);

  // stateに変更があったらfield更新
  useEffect(() => {
    if (status !== GameStatus.playing) {
      return;
    }
    setFields((prevFields) => {
      const newFields = [...prevFields];
      if (state.removePos !== undefined) {
        newFields[state.removePos.y][state.removePos.x] = '';
      }
      newFields[state.body[0].y][state.body[0].x] = 'snake';
      newFields[state.food.y][state.food.x] = 'food';
      return newFields;
    });
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }
      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onChangeDirection]);

  return (
    <div className="App">
      <header className="header">
        <div className="title-container">
          <h1 className="nav-title">Snake Game</h1>
        </div>
        <Navigation key="navigation" />
      </header>
      <main className="main">
        <Field fields={fields} />
      </main>
      <footer className="footer">
        <Button status={status} onStart={onStart} onRestart={onRestart}/>
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
