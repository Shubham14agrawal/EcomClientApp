import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';
import * as uuid from 'uuid'
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  currentUser$: Observable<IUser>;

  generateRandomValue(): string {
    return uuid.v4();
  }

  constructor(private basketService: BasketService, private accountService: AccountService, private oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;

    
  }
  redirectToIdentityServerLogin() {
    this.oidcSecurityService.authorize();
  }
  

  logout() {
    this.accountService.logout();
  }

}