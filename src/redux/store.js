import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const middlewares = [thunk];

const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  compose(applyMiddleware(...middlewares))
);
export { store };
