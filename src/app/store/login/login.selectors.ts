import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from './login.model';

export const selectloginState = createFeatureSelector<LoginState>('login');
export const selectUserData = createSelector(selectloginState, state => ({
  userId: state.userId,
  username: state.username,
}));
export const selectUserId = createSelector(
  selectloginState,
  state => state.userId
);
export const selectUsername = createSelector(
  selectloginState,
  state => state.username
);
export const selectToken = createSelector(
  selectloginState,
  state => state.token
);
