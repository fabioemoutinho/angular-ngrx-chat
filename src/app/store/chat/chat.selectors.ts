import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Message } from './chat.model';
import { ChatState, chatFeature, messageSelectors } from './chat.reducer';

export const selectChatState = createFeatureSelector<ChatState>('chat');
export const selectAllMessages = createSelector(
  chatFeature.selectMessages,
  messageSelectors.selectAll
);
export const selectMessagesSlice = (index: number, count: number) =>
  createSelector(selectAllMessages, (messages: Message[]) => {
    messages.sort((a, b) => (a.$index as number) - (b.$index as number));
    return messages.slice(index - 1, index + count - 1);
  });
export const selectUserById = (userId: string) =>
  createSelector(chatFeature.selectUsers, users => users.entities[userId]);
