import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EntityState } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Datasource } from 'ngx-ui-scroll';
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

  protected readonly datasource = new Datasource<Message>({
    get: (index: number, count: number) => {
      console.log(index, count);
      return this.store
        .select(selectMessagesSlice(index, count))
        .pipe(take(1), tap(console.log));
    },
    devSettings: { debug: true },
  });

  constructor(
    private fb: FormBuilder,
    private store: Store<EntityState<Message>>
  ) {
    let prev: Message[] = [];
    this.messages$
      .pipe(
        tap(async curr => {
          const newItem = curr.find(c => !prev.find(p => c.id == p.id));
          if (newItem) {
            prev = curr;
            this.appendMessage(newItem);
            return;
          }
          const oldItem = curr.find(c =>
            prev.find(p => c.id == p.id && c.time !== p.time)
          );
          if (oldItem) {
            prev = curr;
            this.replaceMessage(oldItem);
            return;
          }
        })
      )
      .subscribe();

    // mock message pull
    setTimeout(async () => {
      for (let i = 0; i < 1000; i++) {
        await new Promise(r => setTimeout(r, 50));
        this.store.dispatch(sendMessage({ body: 'hello-' + i }));
      }
    }, 1000);
  }

  async appendMessage(message: Message) {
    await this.datasource.adapter.relax();
    await this.datasource.adapter.append({
      items: [message],
      eof: true,
    });
    await this.datasource.adapter.clip();
  }

  async replaceMessage(message: Message) {
    await this.datasource.adapter.relax();
    await this.datasource.adapter.replace({
      predicate: ({ data }) => data.id === message.id,
      items: [message],
    });
  }

  sendMessage(): void {
    this.store.dispatch(
      sendMessage({ body: this.form.controls.message.value })
    );
    this.form.controls.message.patchValue('');
  }
}
