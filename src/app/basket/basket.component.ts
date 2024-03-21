import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IBasketItem, IBasketTotals } from '../shared/models/basket';
import { BasketService } from './basket.service';
import { ICart } from '../shared/models/cart';
import { CartBasket } from '../shared/models/cartBasket';
import { IProduct } from '../shared/models/product';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
  basket$: Observable<CartBasket>;
  basketTotals$: Observable<IBasketTotals>;
  @Input() product: IProduct;

  constructor(private basketService: BasketService) { }

  ngOnInit(): void {
    this.basketService.basketSource.subscribe(response => {
      this.basketService.getBasket().subscribe(
        (basket: CartBasket) => {
          console.log("check:", basket);
          // Assign the fetched basket to your observable
          this.basket$ = of(basket);
        },
        (error) => {
          console.error("Error fetching basket:", error);
        }
      );
      this.basketTotals$ = this.basketService.basketTotal$;
    })
    this.basketService.getBasket().subscribe(
      (basket: CartBasket) => {
        console.log("check:", basket);
        // Assign the fetched basket to your observable
        this.basket$ = of(basket);
      },
      (error) => {
        console.error("Error fetching basket:", error);
      }
    );
    this.basketTotals$ = this.basketService.basketTotal$;
  }

  removeBasketItem(item: any) {
    this.basketService.removeItemFromBasket(item.catalogItemId).subscribe(response => {
      this.basketService.basketSource.next(null);
    });
    console.log("clicked")
  }

  incrementItemQuantity(item: ICart) {
    const updatedCartItem = {
      catalogItemId: item.catalogItemId,
      quantity: 1
    }
    this.basketService.incrementItemQuantity(updatedCartItem);
    this.basketService.basketSource.next(null)

  }

  decrementItemQuantity(item: IBasketItem) {
    if (item.quantity <= 0) {
      return; // Do nothing if the quantity is already 0
    }

    const updatedCartItem = {
      catalogItemId: item.catalogItemId,
      quantity: -1
    }
    this.basketService.decrementItemQuantity(updatedCartItem);
    this.basketService.basketSource.next(null);
  }

  placeOrder(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior
  
    this.basketService.placeOrder().subscribe(
      (response) => {
        console.log('Order placed successfully:', response);
        // Reload the basket data
        this.loadBasketData();
      },
      (error) => {
        console.error('Error placing order:', error);
        // Handle error
      }
    );
  }
  
  private loadBasketData() {
    this.basketService.getBasket().subscribe(
      (basket) => {
        console.log('Basket reloaded successfully:', basket);
        // Update the observable with the new basket data
        this.basket$ = of(basket);
      },
      (error) => {
        console.error('Error loading basket:', error);
        // Handle error
      }
    );
  }


}
