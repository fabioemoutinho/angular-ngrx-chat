import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginStore } from '../store/login/login.store';
import { ChatHeaderComponent } from './chat-header/chat-header.component';
import { Message } from './chat-store/chat.model';
import { ChatStore } from './chat-store/chat.store';
import { MessageComponent } from './message/message.component';
import { UserById } from './message/user-by-id.pipe';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  providers: [ChatStore],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MessageComponent,
    ChatHeaderComponent,
    UserById,
  ],
})
export class ChatComponent {
  protected readonly form = this.fb.nonNullable.group({
    message: ['', Validators.required],
  });
  protected readonly messages$: Observable<Message[]> = this.store.allMessages$;
  protected readonly userData$: Observable<{
    userId: string | null;
    username: string | null;
  }> = this.loginStore.userData$;

  constructor(
    private fb: FormBuilder,
    private readonly store: ChatStore,
    private loginStore: LoginStore
  ) {}

  sendMessage(): void {
    this.store.sendMessage({ body: this.form.controls.message.value });
    this.form.controls.message.patchValue('');
  }
}
