import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { IPagination } from './shared/models/pagination';
import { IProduct } from './shared/models/product';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'SkiNet';

  constructor(public oidcSecurityService: OidcSecurityService, private basketService: BasketService, private accountService: AccountService) { }

  ngOnInit() {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((loginResponse: LoginResponse) => {
        const { isAuthenticated, userData, accessToken, idToken, configId } =
          loginResponse;

        this.loadCurrentUser();
        //console.log("Authentication status:", isAuthenticated);
        this.loadBasket();
      });
      
  }
  
  loadCurrentUser() {
    this.accountService.loadCurrentUser().subscribe(() => {
      //console.log('loaded user');
    }, error => {
      console.log(error);
    })
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(() => {
        //console.log('initialised basket');
      }, error => {
        console.log(error);
      })
    }
  }
}
