import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EntityState } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Datasource, IDatasource } from 'ngx-ui-scroll';
import { Observable, take, tap } from 'rxjs';
import { sendMessage } from '../store/chat/chat.actions';
import { Message } from '../store/chat/chat.model';
import {
  selectAllMessages,
  selectMessagesSlice,
} from '../store/chat/chat.selectors';
import { selectUserData } from '../store/login/login.selectors';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  protected readonly form = this.fb.nonNullable.group({
    message: ['', Validators.required],
  });
  protected readonly messages$: Observable<Message[]> =
    this.store.select(selectAllMessages);
  protected readonly userData$: Observable<{
    userId: string | null;
    username: string | null;
  }> = this.store.select(selectUserData);
  protected readonly datasource: IDatasource<Message> = this.getDatasource();

  constructor(
    private fb: FormBuilder,
    private store: Store<EntityState<Message>>
  ) {
    this.messages$
      .pipe(
        tap(messages =>
          this.datasource.adapter?.reset(this.getDatasource(messages.length))
        )
      )
      .subscribe();
  }

  getDatasource<T>(maxIndex?: number): IDatasource<T> {
    return new Datasource<T>({
      get: (index: number, count: number) => {
        // why is index always 1?
        // why does index start at 1?
        console.log(index, count);
        return this.store
          .select(selectMessagesSlice(index, count))
          .pipe(take(1), tap(console.log));
      },
      settings: {
        maxIndex: maxIndex ?? Infinity,
      },
    });
  }

  sendMessage(): void {
    this.store.dispatch(
      sendMessage({ body: this.form.controls.message.value })
    );
    this.form.controls.message.patchValue('');
  }
}
