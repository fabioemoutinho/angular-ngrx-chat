import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatHeaderComponent } from './chat-header.component';

@NgModule({
  declarations: [ChatHeaderComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ChatHeaderComponent],
})
export class ChatHeaderModule {}
