import { Value } from 'slate';
import actions from './actions';
import initValue from './initialValue';
import { DEFAULT_STORAGE_KEY } from '../../config';

let initialValue = localStorage.getItem(DEFAULT_STORAGE_KEY);
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
    default:
      return state;
  }
}
