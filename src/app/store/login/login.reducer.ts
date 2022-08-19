import { Action, createReducer, on } from '@ngrx/store';
import * as LoginActions from './login.actions';
import { initialState, LoginState } from './login.model';

export const loginReducer = createReducer(
  initialState,
  // login reducer
  on(LoginActions.loginSuccess, (state, { userId, username, token }) => ({
    ...state,
    userId,
    username,
    token,
  })),
  on(LoginActions.logout, () => initialState),

  // username change reducer
  on(LoginActions.usernameChange, (state, { username }) => ({
    ...state,
    oldUsername: state.username,
    username,
  })),
  on(LoginActions.usernameChangeSuccess, state => ({
    ...state,
    oldUsername: null,
  })),
  on(LoginActions.usernameChangeFailure, state => ({
    ...state,
    username: state.oldUsername,
    oldUsername: null,
  }))
);

export function reducer(state: LoginState | undefined, action: Action) {
  return loginReducer(state, action);
}
