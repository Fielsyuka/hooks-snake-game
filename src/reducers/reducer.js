import { defaultFieldSize, initialBody, initialFood } from "../constants";
import { initFields } from "../utils";

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

export default reducer;
