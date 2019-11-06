import {
    applyMiddleware, combineReducers,
    compose, createStore
} from 'redux';
import { reducer } from 'reapop';
import thunk from 'redux-thunk';
import appReducer from './app';

const makeRootReducer = () => {
    return combineReducers({
        notifications: reducer(),
        app: appReducer
    });
};

export default (initialState = {}) => {
    const middleware = [thunk];
    const store = createStore(
        makeRootReducer(),
        initialState,
        compose(applyMiddleware(...middleware))
    );
    return store;
};
