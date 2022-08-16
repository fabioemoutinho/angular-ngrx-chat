import { createAction, props } from '@ngrx/store';
import { Message, User } from './chat.model';

export const sendMessage = createAction(
  '[Chat Page] Send Message',
  props<{ body: string }>()
);

export const addPendingMessage = createAction(
  '[Chat API] Add Pending Message',
  props<{ message: Message }>()
);

export const sendMessageSuccess = createAction(
  '[Chat API] Send Message Success',
  props<{ message: Message; pendingMessageId: string }>()
);

export const sendMessageFailure = createAction(
  '[Chat API] Send Message Failure',
  props<{ errorMsg: string }>()
);

export const addMessages = createAction(
  '[WebSocket] Messages',
  props<{ messages: Message[] }>()
);

export const addUser = createAction(
  '[WebSocket] User Joined',
  props<{ user: User }>()
);

export const setUserOffline = createAction(
  '[WebSocket] User Left',
  props<{ userId: string }>()
);
