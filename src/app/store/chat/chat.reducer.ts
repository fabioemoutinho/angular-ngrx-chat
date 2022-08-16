import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import * as ChatActions from './chat.actions';
import { Message, MessageStatus, User, UserStatus } from './chat.model';

export interface ChatState {
  messages: { loading: boolean } & EntityState<Message>;
  users: { loading: boolean } & EntityState<User>;
}

function sortByTime(a: Message, b: Message): 1 | -1 {
  return a.time < b.time ? -1 : 1;
}

function sortByName(a: User, b: User): number {
  return a.name.localeCompare(b.name);
}

const messageAdapter: EntityAdapter<Message> = createEntityAdapter<Message>({
  sortComparer: sortByTime,
});

const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  sortComparer: sortByName,
});

const initialState: ChatState = {
  messages: messageAdapter.getInitialState({
    loading: false,
  }),
  users: userAdapter.getInitialState({
    loading: false,
  }),
};

export const messageSelectors = messageAdapter.getSelectors();
export const userSelectors = userAdapter.getSelectors();

export const chatFeature = createFeature({
  name: 'chat',
  reducer: createReducer(
    initialState,
    on(ChatActions.addPendingMessage, (state, { message }) => ({
      ...state,
      messages: messageAdapter.addOne(
        { ...message, status: MessageStatus.PENDING },
        state.messages
      ),
    })),
    on(
      ChatActions.sendMessageSuccess,
      (state, { message, pendingMessageId }) => ({
        ...state,
        messages: messageAdapter.mapOne(
          { id: pendingMessageId, map: () => message },
          state.messages
        ),
      })
    ),
    on(ChatActions.addMessages, (state, { messages }) => ({
      ...state,
      messages: messageAdapter.addMany(messages, state.messages),
    })),
    on(ChatActions.addUser, (state, { user }) => ({
      ...state,
      users: userAdapter.addOne(
        { ...user, status: user.status ?? UserStatus.ONLINE },
        state.users
      ),
    })),
    on(ChatActions.setUserOffline, (state, { userId }) => ({
      ...state,
      users: userAdapter.updateOne(
        {
          id: userId,
          changes: { status: UserStatus.OFFLINE },
        },
        state.users
      ),
    }))
  ),
});
