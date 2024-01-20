import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';
import * as uuid from 'uuid'
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  baseUrl = environment.IdentityServerUrl;
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();
  // currentUser$: Observable<IUser>;

  isLoggedIn: boolean = false;
  token = ""
  generateRandomValue(): string {
    return uuid.v4();
  }

  constructor(private http: HttpClient,private basketService: BasketService, private oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$; 
  }
  redirectToIdentityServerLogin() {
    this.oidcSecurityService.authorize();

    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const {
          isAuthenticated,
          userData,
          accessToken,
          idToken,
          configId,
        } = loginResponse;
        localStorage.setItem("response", JSON.stringify(loginResponse));
        console.log(isAuthenticated);
        this.isLoggedIn = isAuthenticated;
        console.log(loginResponse);
        console.log(accessToken);
        this.loadCurrentUser();
      });

    this.oidcSecurityService.getAccessToken().subscribe((response) => {
      localStorage.setItem("token", response);
    });
  }

  loadCurrentUser() {
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token) => {
        if (!token) {
          this.currentUserSource.next(null);
          return of(null);
        }

        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${token}`
        );
        return this.http
          .get<IUser>(this.baseUrl + 'account', { headers })
          .pipe(
            map((user: IUser) => {
              if (user) {
                localStorage.setItem('user-token', user.token);
                this.currentUserSource.next(user);
              }
            })
          );
      })
    );
  }

  // loadCurrentUser() {
  //    this.accountService.loadCurrentUser().subscribe((response) => {
  //      console.log('loaded user');
  //      localStorage.setItem("user", JSON.stringify(response))
  //    }, error => {
  //      console.log(error);
  //    })
  //  }
  logout() {
    this.oidcSecurityService
      .logoff()
      .subscribe((result) => console.log(result));
  }

}