import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Message, MessageStatus, UserStatus } from '../chat-store/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MessageComponent {
  @Input() message!: Message;
  @Input() connectedUserIsSender!: boolean;
  @Input() userStatus!: UserStatus | null | undefined;
  @Input() userName!: string | null | undefined;

  protected PENDING = MessageStatus.PENDING;
  protected ONLINE = UserStatus.ONLINE;
}
