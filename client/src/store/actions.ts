import User from "../model/User";

export interface IAction<T = any> {
    type: keyof ActionType;
    payload: T;
}

export enum ActionType {
    SetUser = 'SetUser',
}

export function setUser(user: User) {
    if (!user) {
        return {
            type: ActionType.SetUser,
            payload: null
        };
    }
    return dispatch => {
        dispatch({
            type: ActionType.SetUser,
            payload: user
        });
    };
}
