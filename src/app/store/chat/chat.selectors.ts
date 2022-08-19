import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState, chatFeature, messageSelectors } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');
export const selectAllMessages = createSelector(
  chatFeature.selectMessages,
  messageSelectors.selectAll
);
export const selectUserById = (userId: string) =>
  createSelector(chatFeature.selectUsers, users => users.entities[userId]);
