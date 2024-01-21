import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.accountService.isAuthenticated$.pipe(
        map(auth => {
          if (auth) {
            return true;
          }
        this.accountService.login();
      })
    )
  }
}
