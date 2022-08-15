import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { usernameChange } from 'src/app/store/login/login.actions';
import { selectUsername } from 'src/app/store/login/login.selectors';

@Component({
  selector: 'app-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ChatHeaderComponent implements OnInit, OnDestroy {
  protected readonly form = this.fb.nonNullable.group({
    username: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(20)],
    ],
  });

  editUsername = false;

  protected readonly username$: Observable<string | null> =
    this.store.select(selectUsername);

  private onDestroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.username$.pipe(takeUntil(this.onDestroy$)).subscribe(username => {
      this.form.controls.username.patchValue(username ?? '');
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
  }

  onEditUsername(): void {
    this.editUsername = !this.editUsername;
  }

  submitEditedUsername(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.onEditUsername();
    const username = this.form.controls.username.value;
    this.store.dispatch(usernameChange({ username }));
  }
}
