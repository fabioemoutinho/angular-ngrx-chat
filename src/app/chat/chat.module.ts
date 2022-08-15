import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatHeaderModule } from './chat-header/chat-header.module';
import { ChatComponent } from './chat.component';
import { MessageModule } from './message/message.module';
import { UserByIdPipe } from './user-by-id.pipe';

@NgModule({
  declarations: [ChatComponent, UserByIdPipe],
  imports: [CommonModule, ReactiveFormsModule, ChatHeaderModule, MessageModule],
  exports: [UserByIdPipe],
})
export class ChatModule {}
