import { Component, Input } from '@angular/core';
import {
  Message,
  MessageStatus,
  UserStatus,
} from 'src/app/store/chat/chat.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input() message!: Message;
  @Input() connectedUserIsSender!: boolean;
  @Input() userStatus!: UserStatus | null | undefined;
  @Input() userName!: string | null | undefined;

  protected PENDING = MessageStatus.PENDING;
  protected ONLINE = UserStatus.ONLINE;
}
