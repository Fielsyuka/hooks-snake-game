import React, { useCallback, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields, getFoodPosition } from './utils';

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

const defaultInterval = 100;
const defaultFieldSize = 35;
const initialBody = { x: 17, y: 17 };
const initialFood = getFoodPosition(defaultFieldSize, [initialBody]);
const initialValues = initFields(defaultFieldSize, initialBody, initialFood);

let timer;

const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
}

function App() {
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([initialBody]);
  // const [food, setFood] = useState(initialFood);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);

  const onStart = () => setStatus(GameStatus.playing);

  const onRestart = () => {
    setStatus(GameStatus.init);
    setBody([initialBody]);
    setDirection(Direction.up);
    setFields(initFields(defaultFieldSize, initialBody, initialFood));
  }

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

  const onChangeDirection = useCallback((newDirection) => {
    if (status !== GameStatus.playing) {
      return direction;
    }
    if (OppositeDirection[direction] === newDirection) {
      return;
    }
    setDirection(newDirection);
  }, [direction, status]);

  // field body/food に変化があったら更新 ***これは途中で消えちゃってだめ
  // useEffect(() => {
  //   if (status !== GameStatus.playing) {
  //     return;
  //   }
  //   setFields((prevFields) => {
  //     prevFields[body[0].y][body[0].x] = 'snake';
  //     prevFields[food.y][food.x] = 'food';
  //     return prevFields;
  //   });
  // }, [body, food]);

  // メイン処理
  useEffect(() => {
    if (status !== GameStatus.playing) {
      return;
    }
    timer = setInterval(() => {
      const delta = Delta[direction];
      const newPosition = {
        x: body[0].x + delta.x,
        y: body[0].y + delta.y,
      };

      if (isCollision(newPosition) || isEatingMyself(fields, newPosition)) {
        setStatus(GameStatus.gamever);
      } else {
        const newBody = [newPosition, ...body];
        if (fields[newPosition.y][newPosition.x] !== 'food') {
          const removingTrack = newBody.pop();
          fields[removingTrack.y][removingTrack.x] = '';
        } else {
          const food = getFoodPosition(defaultFieldSize, [newPosition, ...newBody]);
          fields[food.y][food.x] = 'food';
        }
        fields[newPosition.y][newPosition.x] = 'snake';
        setBody(newBody);
        setFields(fields);
      }
    }, defaultInterval);
    return unsubscribe;
  }, [status, body]);

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
