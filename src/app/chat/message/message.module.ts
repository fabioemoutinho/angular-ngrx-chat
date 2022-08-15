import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from './message.component';

@NgModule({
  declarations: [MessageComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [MessageComponent],
})
export class MessageModule {}
