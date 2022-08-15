import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { LoginStore } from '../store/login/login.store';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(private loginStore: LoginStore, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UrlTree | boolean> {
    return this.loginStore.username$.pipe(
      map(username => {
        if (username) {
          return true;
        }
        return this.router.createUrlTree(['']);
      })
    );
  }
}
