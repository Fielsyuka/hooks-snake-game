export const getFoodPosition = (fieldSize, exclude) => {
  while (true) {
    const x = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    const conflict = exclude.some(item => item.x === x && item.y === y);

    if (!conflict) {
      return { y, x };
    }
   }
 }

export const initFields = (fieldSize, snake, food) => {
  const fields = [];
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill('');
    fields.push(cols);
  }
  fields[snake.y][snake.x] = 'snake'
  fields[food.y][food.x] = 'food'
  return fields;
}