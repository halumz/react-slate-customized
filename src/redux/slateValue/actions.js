const actions = {
  CHANGE_VALUE: 'CHANGE_VALUE',
  ON_SAVE: 'ON_SAVE',
  ON_CANCEL: 'ON_CANCEL',

  changeValue: value => ({
    type: actions.CHANGE_VALUE,
    payload: { value }
  }),
  onSave: () => ({ type: actions.ON_SAVE }),
  onCancel: () => ({ type: actions.ON_CANCEL })
};
export default actions;
