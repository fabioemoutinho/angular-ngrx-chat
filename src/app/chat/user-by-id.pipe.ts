import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../store/chat/chat.model';
import { selectUserById } from '../store/chat/chat.selectors';

@Pipe({
  name: 'userById',
})
export class UserByIdPipe implements PipeTransform {
  constructor(private readonly store: Store) {}

  public transform(userId: string): Observable<User | undefined> {
    return this.store.select(selectUserById(userId));
  }
}
