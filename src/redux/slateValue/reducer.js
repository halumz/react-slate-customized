import { Value } from 'slate';
import clone from 'clone';
import actions from './actions';
import { DEFAULT_STORAGE_KEY, MAX_LENGTH } from '../../config';
const initState = {
  value: Value.fromJS({}),
  maxLimitKeys: []
};
const getMaxLimitKeys = value => {
  const maxLimitKeys = [];
  const nodes = value.get('document').get('nodes');
  for (let i = MAX_LENGTH; i < nodes.size; i++) {
    maxLimitKeys.push(nodes.get(i).key);
  }
  return maxLimitKeys;
};
export default function todoReducer(state = initState, { type, payload }) {
  switch (type) {
    case actions.CHANGE_VALUE:
      return {
        ...state,
        value: payload.value,
        maxLimitKeys: getMaxLimitKeys(payload.value)
      };
    case actions.ON_SAVE:
      if (state.maxLimitKeys.length > 0) {
        alert('Node limit exceeds');
      } else {
        localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(state.value));
      }
      return {
        ...state,
        maxLimitKeys: clone(state.maxLimitKeys)
      };
    case actions.ON_CANCEL:
      localStorage.setItem(DEFAULT_STORAGE_KEY, JSON.stringify(payload.value));
      return {
        ...state,
        value: payload.value,
        maxLimitKeys: getMaxLimitKeys(payload.value)
      };
    default:
      return state;
  }
}
