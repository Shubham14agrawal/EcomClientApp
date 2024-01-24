import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket';
import { IUser } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  basket$: Observable<IBasket>;
  baseUrl = environment.IdentityServerUrl;
  currentUser$: Observable<IUser>;

  isLoggedIn: boolean = false;
  userName: string; 

  constructor(private basketService: BasketService,private accountService: AccountService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$; 
    this.loadCurrentUser();
    this.currentUser$ = this.accountService.currentUser$;
  }
  redirectToIdentityServerLogin() {
    this.accountService.login();
  }
  redirectToIdentityServerRegister() {
    this.accountService.register();
  }

  loadCurrentUser() {
    this.accountService.loadCurrentUser();
  }
  logout() {
    this.accountService.logout();
  }

}