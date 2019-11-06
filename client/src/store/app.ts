import { ActionType, IAction } from './actions';
import { User } from '../model';

function createState(): IAppState {
    const state: IAppState = {
        user: null,
    };
    return state;
}

const handlers: { [id in ActionType]?: (state: IAppState, action: IAction) => IAppState } = {
    [ActionType.SetUser]: (state: IAppState, action: IAction) => {
        return Object.assign({}, state, { user: action.payload });
    }
};

export interface IAppState {
    user: User;
}

export default function reducer(state: IAppState = createState(), action: IAction): IAppState {
    const handler = handlers[action.type];
    return handler
        ? handler(state, action)
        : state;
}
