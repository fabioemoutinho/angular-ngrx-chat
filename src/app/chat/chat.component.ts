import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { sendMessage } from '../store/chat/chat.actions';
import { Message } from '../store/chat/chat.model';
import { selectAllMessages } from '../store/chat/chat.selectors';
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

  constructor(private fb: FormBuilder, private store: Store) {}

  sendMessage(): void {
    this.store.dispatch(
      sendMessage({ body: this.form.controls.message.value })
    );
    this.form.controls.message.patchValue('');
  }
}
