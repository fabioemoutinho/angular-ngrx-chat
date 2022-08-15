import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { LoginModule } from './login/login.module';
import { LoginEffects } from './store/login/login.effects';
import * as LoginReducer from './store/login/login.reducer';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ login: LoginReducer.reducer }),
    EffectsModule.forRoot([LoginEffects]),
    StoreDevtoolsModule.instrument(),
    LoginModule,
    ChatModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
