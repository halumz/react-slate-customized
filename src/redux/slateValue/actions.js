import { Value } from 'slate';
import initValue from './initialValue';
import { DEFAULT_STORAGE_KEY } from '../../config';

let initialValue = localStorage.getItem(DEFAULT_STORAGE_KEY);

if (!initialValue) {
  initialValue = initValue;
} else {
  initialValue = JSON.parse(initialValue);
}

const actions = {
  CHANGE_VALUE: 'CHANGE_VALUE',
  ON_SAVE: 'ON_SAVE',
  ON_CANCEL: 'ON_CANCEL',
  initialLoading: () => ({
    type: actions.CHANGE_VALUE,
    payload: { value: Value.fromJS(initialValue) }
  }),
  changeValue: value => ({
    type: actions.CHANGE_VALUE,
    payload: { value }
  }),
  onSave: () => ({ type: actions.ON_SAVE }),
  onCancel: () => ({
    type: actions.ON_CANCEL,
    payload: { value: Value.fromJS(initialValue) }
  })
};
export default actions;
