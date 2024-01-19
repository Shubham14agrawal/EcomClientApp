import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';

// @Injectable({
//   providedIn: 'root'
// })
// export class AccountService {
//   baseUrl = environment.apiUrl;
//   private currentUserSource = new ReplaySubject<IUser>(1);
//   currentUser$ = this.currentUserSource.asObservable();

//   constructor(private http: HttpClient, private router: Router) { }

//   loadCurrentUser(token: string) {
//     if (token == null) {
//       this.currentUserSource.next(null);
//       return of(null);
//     }

//     let headers = new HttpHeaders();
//     headers = headers.set('Authorization', `Bearer ${token}`);

//     return this.http.get(this.baseUrl + 'account', {headers}).pipe(
//       map((user: IUser) => {
//         if (user) {
//           localStorage.setItem('token', user.token);
//           this.currentUserSource.next(user);
//         }
//       })
//     )
//   }

//   login(values: any) {
//     return this.http.post(this.baseUrl + 'account/login', values).pipe(
//       map((user: IUser) => {
//         if (user) {
//           localStorage.setItem('token', user.token);
//           this.currentUserSource.next(user);
//         }
//       })
//     )
//   }

//   register(values: any) {
//     return this.http.post(this.baseUrl + 'account/register', values).pipe(
//       map((user: IUser) => {
//         if (user) {
//           localStorage.setItem('token', user.token);
//           this.currentUserSource.next(user);
//         }
//       })
//     )
//   }

//   logout() {
//     localStorage.removeItem('token');
//     this.currentUserSource.next(null);
//     this.router.navigateByUrl('/');
//   }

//   checkEmailExists(email: string) {
//     return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
//   }

//   getUserAddress() {
//     return this.http.get<IAddress>(this.baseUrl + 'account/address');
//   }

//   updateUserAddress(address: IAddress) {
//     return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
//   }
// }
import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth-config';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  baseUrl = environment.IdentityServerUrl;
  apiUrl=environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
constructor(private http: HttpClient, private router: Router,private oauthService: OAuthService) {
    this.configure();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.oauthService.logOut();
    
    this.router.navigateByUrl('/');
  }

  get userName() {
    const claims = this.oauthService.getIdentityClaims();
    return claims ? claims['preferred_username'] : null;
  }

  get isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }

    register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }
    checkEmailExists(email: string) {
    return this.http.get(this.apiUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.apiUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.apiUrl + 'account/address', address);
  }
    loadCurrentUser(token: string) {
    if (token == null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    )
  }
}
