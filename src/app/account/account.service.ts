import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.IdentityServerUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router, private oidcSecurityService: OidcSecurityService) { }

  private getAccessToken(): Observable<string> {
    return this.oidcSecurityService.getAccessToken()
    ;
  }

  loadCurrentUser() {
    return this.getAccessToken().pipe(
      switchMap(token => {
        if (!token) {
          this.currentUserSource.next(null);
          return of(null);
        }

        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<IUser>(this.baseUrl + 'account', { headers }).pipe(
          map((user: IUser) => {
            if (user) {
              localStorage.setItem('token', user.token);
              this.currentUserSource.next(user);
            }
          })
        );
      })
    );
  }

  login(values: any) {
    return this.http.post(`${this.baseUrl}connect/token`, values).pipe(
      switchMap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          return this.loadCurrentUser(); // Call loadCurrentUser after successful login
        }
        return of(null);
      }),
      catchError((error: any) => {
        console.error('Error during login:', error);
        throw error;
      })
    );
  }
  

  register(values: any) {
    return this.http.post(this.baseUrl + 'Account/Register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
}
