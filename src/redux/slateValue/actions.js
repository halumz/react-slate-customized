const actions = {
  CHANGE_VALUE: 'CHANGE_VALUE',
  changeValue: value => ({
    type: actions.CHANGE_VALUE,
    payload: { value }
  })
};
export default actions;
