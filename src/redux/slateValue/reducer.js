import { Value } from 'slate';
import actions from './actions';
import initValue from './initialValue';
import { DEFAULT_STORAGE_KEY } from '../../config';

let initialValue = localStorage.getItem(DEFAULT_STORAGE_KEY);
console.log(initialValue);
if (!initialValue) {
  initialValue = initValue;
} else {
  initialValue = JSON.parse(initialValue);
}

const initState = {
  value: Value.fromJS(initialValue)
};

export default function todoReducer(state = initState, { type, payload }) {
  switch (type) {
    case actions.CHANGE_VALUE:
      return { ...state, value: payload.value };
    case actions.ON_SAVE:
      localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(state.value));
      return state;
    case actions.ON_CANCEL:
      localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(initialValue));
      return { ...state, value: Value.fromJSON(initialValue) };
    default:
      return state;
  }
}
