import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { concatLatestFrom } from '@ngrx/effects';
import {
  createEntityAdapter,
  EntityAdapter,
  EntityState,
  Update,
} from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, mergeMap, pairwise, tap } from 'rxjs/operators';
import { selectUserId } from 'src/app/store/login/login.selectors';
import { environment } from 'src/environments/environment';
import { Message, MessageStatus, User, UserStatus } from './chat.model';
import { ChatService } from './chat.service';

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

const { selectAll: selectAllMessages } = messageAdapter.getSelectors();
const { selectAll: selectAllUsers } = userAdapter.getSelectors();

@Injectable()
export class ChatStore extends ComponentStore<ChatState> {
  private readonly logging$ = this.select(state => state).pipe(
    pairwise(),
    tap(([prev, curr]) => console.table({ prev, curr }))
  );
  readonly userId$ = this.store.select(selectUserId);
  readonly messages$ = this.select(state => state.messages);
  readonly allMessages$ = this.select(this.messages$, selectAllMessages);
  readonly loadingMessages$ = this.select(state => state.messages.loading);
  readonly users$ = this.select(state => state.users);
  readonly allUsers$ = this.select(this.users$, selectAllUsers);
  readonly loadingUsers$ = this.select(state => state.users.loading);

  constructor(private chatService: ChatService, private store: Store) {
    super(initialState);

    if (!environment.production) {
      this.logging$.subscribe();
    }

    // start listening to websocket events
    this.messageEvents(this.chatService.messageEvents$);
    this.userJoinedEvents(this.chatService.userJoinedEvents$);
    this.userLeftEvents(this.chatService.userLeftEvents$);
  }

  readonly messageEvents = this.effect(
    (messageEvents$: Observable<Message[]>) =>
      messageEvents$.pipe(map(messages => this.addMessages(messages)))
  );

  readonly userJoinedEvents = this.effect(
    (userJoinedEvents$: Observable<User>) =>
      userJoinedEvents$.pipe(map(user => this.addUser(user)))
  );

  readonly userLeftEvents = this.effect((userLeftEvents$: Observable<string>) =>
    userLeftEvents$.pipe(map(userId => this.setUserOffline(userId)))
  );

  readonly sendMessage = this.effect(
    (sendMessage$: Observable<{ body: string }>) => {
      return sendMessage$.pipe(
        concatLatestFrom(() => [
          // creates a random ID and a time to show message as soon as user sends it, even though it is pending
          of({ id: crypto.randomUUID(), time: new Date().getTime() }),
          this.userId$,
        ]),
        // add message to chat store so it is visible while processed by the backend
        tap(([{ body }, { id, time }, userId]) => {
          this.setState(state => ({
            ...state,
            messages: messageAdapter.addOne(
              {
                id,
                userId: userId as string,
                body,
                time,
                status: MessageStatus.PENDING,
              },
              state.messages
            ),
          }));
        }),
        // send message to backend and then update chat store
        mergeMap(([{ body }, { id: previousId }, userId]) =>
          this.chatService.sendMessage({ body, userId: userId as string }).pipe(
            // updating previously inserted message before api call
            tap(message =>
              this.setState(state => ({
                ...state,
                messages: messageAdapter.mapOne(
                  { id: previousId, map: () => message },
                  state.messages
                ),
              }))
            )
          )
        )
      );
    }
  );

  readonly addMessages = this.effect((addMessages$: Observable<Message[]>) => {
    return addMessages$.pipe(
      tap(messages =>
        this.setState(state => ({
          ...state,
          messages: messageAdapter.addMany(messages, state.messages),
        }))
      )
    );
  });

  // user joined
  readonly addUser = this.effect((addUser$: Observable<User>) => {
    return addUser$.pipe(
      tap(user =>
        this.setState(state => ({
          ...state,
          users: userAdapter.addOne(
            { ...user, status: user.status ?? UserStatus.ONLINE },
            state.users
          ),
        }))
      )
    );
  });

  readonly updateUser = this.effect((updateUser$: Observable<Update<User>>) => {
    return updateUser$.pipe(
      tap(userChanges =>
        this.setState(state => ({
          ...state,
          users: userAdapter.updateOne(userChanges, state.users),
        }))
      )
    );
  });

  readonly setUserOffline = this.effect(
    (setUserOffline$: Observable<string>) => {
      return setUserOffline$.pipe(
        map(userId =>
          this.updateUser({
            id: userId,
            changes: { status: UserStatus.OFFLINE },
          })
        )
      );
    }
  );

  readonly getUserById = (userId: string) => {
    return this.select(state => state.users.entities[userId]);
  };
}
