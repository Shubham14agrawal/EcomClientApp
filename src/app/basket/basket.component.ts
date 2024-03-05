import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { ICart } from '../shared/models/cart';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<ICart>;
  basketTotals$: Observable<IBasketTotals>;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  // removeBasketItem(item: ICart) {
  //   this.basketService.removeItemFromBasket(item);
  // }

  incrementItemQuantity(item: ICart) {
    this.basketService.incrementItemQuantity(item);
  }

  // decrementItemQuantity(item: IBasketItem) {
  //   this.basketService.decrementItemQuantity(item);
  // }

}
