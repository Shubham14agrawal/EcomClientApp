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
import { AccountService } from '../../account/account.service';

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
  // token = ""
  // generateRandomValue(): string {
  //   return uuid.v4();
  // }

  constructor(private http: HttpClient,private basketService: BasketService, private oidcSecurityService: OidcSecurityService,private accountService: AccountService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$; 
  }
  redirectToIdentityServerLogin() {
    this.accountService.login();
  }

  loadCurrentUser() {
    this.accountService.loadCurrentUser();
  }
  logout() {
    this.accountService.logout();
  }

}