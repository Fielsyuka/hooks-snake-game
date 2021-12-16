import React, { useCallback, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils';

const defaultInterval = 100;
const defaultFieldSize = 35;
const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(defaultFieldSize, initialPosition);

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

let timer;

const unsubscribe = () => {
  if (!timer) {
    return;
  }
  clearInterval(timer);
}

function App() {
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([initialPosition]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);

  const onStart = () => setStatus(GameStatus.playing);

  const onRestart = () => {
    setStatus(GameStatus.init);
    setBody(initialPosition);
    setDirection(Direction.up)
    setFields(initFields(defaultFieldSize, initialPosition));
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

  const onChangeDirection = useCallback((newDirection) => {
    if (status !== GameStatus.playing) {
      return direction;
    }
    if (OppositeDirection[direction] === newDirection) {
      return;
    }
    setDirection(newDirection);
  }, [direction, status]);

  useEffect(() => {
    timer = setInterval(() => {
      if (status !== GameStatus.playing) {
        return;
      }
      const delta = Delta[direction];
      setBody((prevPosition) => {
        const newBody = [...prevPosition];
        const newPosition = {
          x: prevPosition[0].x + delta.x,
          y: prevPosition[0].y + delta.y,
        };
        if (!isCollision(newPosition)) {
          if (fields[newPosition.y][newPosition.x] !== 'food') {
            const removingTrack = newBody.pop();
            fields[removingTrack.y][removingTrack.x] = '';
          }
          fields[newPosition.y][newPosition.x] = 'snake';
          newBody.unshift(newPosition);
          setFields(fields);
        } else {
          setStatus(GameStatus.gamever);
        }
        console.log(newBody);
        return newBody;
      });
    }, defaultInterval);
    return unsubscribe;
  },[status, body]);

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
