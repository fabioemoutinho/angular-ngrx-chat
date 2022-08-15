import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Login API] Login Success',
  props<{ userId: string; username: string; token: string }>()
);

export const loginFailure = createAction(
  '[Login API] Login Failure',
  props<{ errorMsg: string }>()
);

export const logout = createAction('[Login] Logout');

export const usernameChange = createAction(
  '[Chat Page] Username Change',
  props<{ username: string }>()
);

export const usernameChangeSuccess = createAction(
  '[Login API] Username Change Success'
);

export const usernameChangeFailure = createAction(
  '[Login API] Username Change Failure',
  props<{ errorMsg: string }>()
);
