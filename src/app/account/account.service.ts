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
    this.isAuthenticated$= this.oidcSecurityService.isAuthenticated$;
  }

  login() {
    this.oidcSecurityService.authorize();
    // this.getAccessToken().subscribe((token) => {
    //   localStorage.setItem('token', token);
    // });
    
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.oidcSecurityService.logoffAndRevokeTokens()
    .subscribe((result) => console.log(result));
    this.router.navigateByUrl('/');
  }

  get userName() {
    // const userData = this.oidcSecurityService.userData$.subscribe;
    return 'ss';
  }


  getAccessToken() {
    return this.oidcSecurityService.getAccessToken();
  }

  register() {
    window.location.href = `${this.baseUrl}Account/Register`;
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
        //console.log('Access Token:', accessToken);
        //this.currentUser$.subscribe();
        
        if (accessToken == null) {
          this.currentUserSource.next(null);
          return of(null);
        }
        return this.oidcSecurityService.userData$.pipe(
          map((data) => {
            const user = data.userData;
            this.currentUserSource.next(user);
            return user;
          }),
          catchError((error) => {
            console.error('Error fetching user data:', error);
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
