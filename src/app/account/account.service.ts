import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address';
import { IUser } from '../shared/models/user';
import { AuthenticatedResult, OidcSecurityService } from 'angular-auth-oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.IdentityServerUrl;
  apiUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  isAuthenticated$: any; 
  constructor(
    private http: HttpClient,
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.isAuthenticated$= this.oidcSecurityService.isAuthenticated$
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.oidcSecurityService.logoff();
    this.router.navigateByUrl('/');
  }

  get userName() {
    // const userData = this.oidcSecurityService.userData$.subscribe;
    return 'ss';
  }


  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }

  register(values: any) {
    return this.http.post(`${this.baseUrl}account/register`, values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      }),
      catchError((error) => {
        // Handle registration error
        console.error(error);
        throw error;
      })
    );
  }

  checkEmailExists(email: string) {
    return this.http.get(`${this.apiUrl}account/emailexists?email=${email}`);
  }

  getUserAddress() {
    return this.http.get<IAddress>(`${this.apiUrl}account/address`);
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(`${this.apiUrl}account/address`, address);
  }

  loadCurrentUser() {
    return this.getAccessToken().pipe(
      mergeMap((accessToken: string) => {
        console.log('Access Token:', accessToken);
        localStorage.setItem('token', accessToken);
        if (accessToken == null) {
          this.currentUserSource.next(null);
          return of(null);
        }
  
        let headers = new HttpHeaders();
        headers = headers.set('Authorization', `Bearer ${accessToken}`);
  
        return this.http.get(`${this.apiUrl}account`, { headers }).pipe(
          map((user: IUser) => {
            if (user) {
              localStorage.setItem('token',accessToken);
              this.currentUserSource.next(user);
            }
            return user; // Return the user object
          }),
          catchError((error) => {
            // Handle loading current user error
            console.error(error);
            throw error;
          })
        );
      }),
      catchError((error) => {
        console.error('Error fetching access token:', error);
        // Handle error
        throw error;
      })
    );
  }
  
}
