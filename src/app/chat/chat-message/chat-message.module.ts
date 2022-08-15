import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent } from './chat-message.component';

@NgModule({
  declarations: [ChatMessageComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ChatMessageComponent],
})
export class ChatMessageModule {}
