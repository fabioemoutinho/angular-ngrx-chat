import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ChatEffects } from '../store/chat/chat.effects';
import { chatFeature } from '../store/chat/chat.reducer';
import { ChatHeaderModule } from './chat-header/chat-header.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ChatComponent } from './chat.component';
import { UserByIdPipe } from './user-by-id.pipe';
import { UiScrollModule } from 'ngx-ui-scroll';

const routes: Routes = [{ path: '', component: ChatComponent }];

@NgModule({
  declarations: [ChatComponent, UserByIdPipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature(chatFeature),
    EffectsModule.forFeature([ChatEffects]),
    ChatHeaderModule,
    ChatMessageModule,
    UiScrollModule,
  ],
  exports: [UserByIdPipe],
})
export class ChatModule {}
